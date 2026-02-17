'use client';

import { useEffect, useRef } from 'react';

interface FluidBackgroundProps {
    className?: string;
}

/* ──────────────────────────────────────────────────────
   QT Capital "Liquid Silk" Shader
   Uses Domain Warping FBM to create a rich, flowing
   fabric-like texture in deep blue.
   ────────────────────────────────────────────────────── */

const VERT = `
  precision highp float;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAG = `
  precision highp float;
  uniform float iTime;
  uniform vec2 iResolution;
  varying vec2 vUv;

  // ── FBM & Noise ───────────────────────────────────
  float random(in vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  float noise(in vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  #define NUM_OCTAVES 5

  float fbm(in vec2 st) {
      float v = 0.0;
      float a = 0.5;
      vec2 shift = vec2(100.0);
      mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
      for (int i = 0; i < NUM_OCTAVES; ++i) {
          v += a * noise(st);
          st = rot * st * 2.0 + shift;
          a *= 0.5;
      }
      return v;
  }

  void main() {
      vec2 st = gl_FragCoord.xy / iResolution.xy;
      st.x *= iResolution.x / iResolution.y;

      // ── Domain Warping ────────────────────────────
      vec2 q = vec2(0.);
      q.x = fbm( st + 0.00 * iTime);
      q.y = fbm( st + vec2(1.0));

      vec2 r = vec2(0.);
      r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*iTime );
      r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*iTime);

      float f = fbm(st+r);

      // ── Color Mapping (Deep Blue Palette) ─────────
      vec3 color = mix(
        vec3(0.0, 0.05, 0.15), // Darkest Blue
        vec3(0.0, 0.1, 0.3),   // Mid Blue
        clamp((f*f)*4.0,0.0,1.0)
      );

      color = mix(
        color,
        vec3(0.0, 0.3, 0.8),   // Highlight Blue (QT Accent)
        clamp(length(q),0.0,1.0)
      );

      color = mix(
        color,
        vec3(0.0, 0.0, 0.1),   // Shadow
        clamp(length(r.x),0.0,1.0)
      );

      // Vignette / Soft edges if needed, but we fill screen
      // gl_FragColor = vec4((f*f*f+.6*f*f+.5*f)*color,1.);
      
      // Softer, silkier output
      gl_FragColor = vec4(color * (f * 1.5 + 0.2), 1.0);
  }
`;

export default function FluidBackground({ className = '' }: FluidBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;

        // Create Canvas
        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.display = 'block';
        container.appendChild(canvas);
        canvasRef.current = canvas;

        const gl = canvas.getContext('webgl');
        if (!gl) return;

        // Init Shaders
        const createShader = (type: number, src: string) => {
            const shader = gl.createShader(type)!;
            gl.shaderSource(shader, src);
            gl.compileShader(shader);
            return shader;
        };
        const program = gl.createProgram()!;
        gl.attachShader(program, createShader(gl.VERTEX_SHADER, VERT));
        gl.attachShader(program, createShader(gl.FRAGMENT_SHADER, FRAG));
        gl.linkProgram(program);
        gl.useProgram(program);

        // Buffer Setup
        const posBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1, 1, -1, -1, 1,
            -1, 1, 1, -1, 1, 1,
        ]), gl.STATIC_DRAW);

        const posLoc = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

        // Uniforms
        const uTime = gl.getUniformLocation(program, 'iTime');
        const uResolution = gl.getUniformLocation(program, 'iResolution');

        // Resize
        const resize = () => {
            const { width, height } = container.getBoundingClientRect();
            canvas.width = width;
            canvas.height = height;
            gl.viewport(0, 0, width, height);
            gl.uniform2f(uResolution, width, height);
        };
        window.addEventListener('resize', resize);
        resize();

        // Loop
        let frameId: number;
        const startTime = performance.now();
        const loop = () => {
            const time = (performance.now() - startTime) * 0.001;
            gl.uniform1f(uTime, time);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            frameId = requestAnimationFrame(loop);
        };
        loop();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(frameId);
            container.removeChild(canvas);
        };
    }, []);

    return (
        <div ref={containerRef} className={`w-full h-full ${className}`} />
    );
}
