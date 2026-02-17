'use client';

import { useEffect, useRef } from 'react';

interface WaterBallProps {
  size?: number;
  color?: string;
  intensity?: number;
  className?: string;
}
const VERT = `
  precision highp float;
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAG = `
  precision highp float;

  uniform float iTime;
  uniform vec3 iResolution;
  uniform float hover;
  uniform vec2 mousePos;
  varying vec2 vUv;

  // ── Simplex 3D Noise ──────────────────────────────
  vec3 hash33(vec3 p3) {
    p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
    p3 += dot(p3, p3.yxz + 19.19);
    return -1.0 + 2.0 * fract(vec3(
      p3.x + p3.y,
      p3.x + p3.z,
      p3.y + p3.z
    ) * p3.zyx);
  }

  float snoise3(vec3 p) {
    const float K1 = 0.333333333;
    const float K2 = 0.166666667;
    vec3 i = floor(p + (p.x + p.y + p.z) * K1);
    vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
    vec3 e = step(vec3(0.0), d0 - d0.yzx);
    vec3 i1 = e * (1.0 - e.zxy);
    vec3 i2 = 1.0 - e.zxy * (1.0 - e);
    vec3 d1 = d0 - (i1 - K2);
    vec3 d2 = d0 - (i2 - K1);
    vec3 d3 = d0 - 0.5;
    vec4 h = max(0.6 - vec4(
      dot(d0, d0),
      dot(d1, d1),
      dot(d2, d2),
      dot(d3, d3)
    ), 0.0);
    vec4 n = h * h * h * h * vec4(
      dot(d0, hash33(i)),
      dot(d1, hash33(i + i1)),
      dot(d2, hash33(i + i2)),
      dot(d3, hash33(i + 1.0))
    );
    return dot(vec4(31.316), n);
  }

  vec4 extractAlpha(vec3 colorIn) {
    float a = max(max(colorIn.r, colorIn.g), colorIn.b);
    return vec4(colorIn.rgb / (a + 1e-5), a);
  }

  // ── Exact QT Capital color palette ────────────────
  const vec3 baseColor1 = vec3(0.0, 0.15, 0.4);
  const vec3 baseColor2 = vec3(0.0, 0.02, 0.1);
  const vec3 baseColor3 = vec3(0.0, 0.0, 0.0);
  const float innerRadius = 0.6;
  const float noiseScale = 0.65;

  // ── Lighting ──────────────────────────────────────
  float light1(float intensity, float attenuation, float dist) {
    return intensity / (1.0 + dist * attenuation);
  }
  float light2(float intensity, float attenuation, float dist) {
    return intensity / (1.0 + dist * dist * attenuation);
  }

  // ── Circle SDF (replaces the logo-based SDF) ─────
  float sampleSDF(vec2 p) {
    return length(p) - innerRadius;
  }

  vec4 draw(vec2 uv) {
    vec3 color1 = baseColor1;
    vec3 color2 = baseColor2;
    vec3 color3 = baseColor3;

    float ang = atan(uv.y, uv.x);

    // Noise distortion for gaseous/fluid effect
    float n0 = snoise3(vec3(uv * noiseScale, iTime * 0.35)) * 0.5 + 0.5;
    vec2 distortedUV = uv + vec2(
      snoise3(vec3(uv * 1.5, iTime * 0.3)) * 0.02,
      snoise3(vec3(uv * 1.5 + 100.0, iTime * 0.3)) * 0.02
    );

    // SDF distance
    float d0 = sampleSDF(distortedUV);

    // Light based on distance to edge
    float v0 = light1(1.0, 8.0, abs(d0));
    v0 *= smoothstep(0.15, 0.0, d0);

    float innerFade = smoothstep(-0.1, 0.0, d0);
    v0 *= innerFade;
    float cl = cos(ang + iTime * 0.8) * 0.5 + 0.5;

    // Orbiting light point
    float a = iTime * -0.4;
    vec2 pos = vec2(cos(a), sin(a)) * 0.6;
    float d = distance(uv, pos);
    float v1 = light2(1.5, 5.0, d);
    v1 *= light1(1.0, 30.0, abs(d0));

    // Visibility masks
    float v2 = smoothstep(0.3, 0.0, d0);
    float v3 = smoothstep(-0.2, 0.05, d0);

    vec3 colBase = mix(color1, color2, cl);

    vec3 darkCol = mix(color3, colBase, v0);
    darkCol = (darkCol + v1) * v2 * v3;
    darkCol = clamp(darkCol, 0.0, 1.0);

    return extractAlpha(darkCol);
  }

  vec4 mainImage(vec2 fragCoord) {
    vec2 center = iResolution.xy * 0.5;
    float size = min(iResolution.x, iResolution.y);
    vec2 uv = (fragCoord - center) / size * 2.0;

    // Mouse-based fluid repulsion
    vec2 fromMouse = uv - mousePos;
    float dist = length(fromMouse);
    float cursorRadius = 0.5;
    float falloff = 0.6;

    float repulsion = (1.0 - smoothstep(0.0, cursorRadius + falloff, dist)) * hover;
    if (dist > 0.001) {
      vec2 pushDir = fromMouse / dist;
      uv -= pushDir * repulsion * 0.5;
    }

    return draw(uv);
  }

  void main() {
    vec2 fragCoord = vUv * iResolution.xy;
    vec4 col = mainImage(fragCoord);
    gl_FragColor = vec4(col.rgb * col.a, col.a);
  }
`;

export default function WaterBall({
  size = 500,
  className = '',
}: WaterBallProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // ── Create Canvas ──────────────────────────────
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    canvas.style.backgroundColor = 'transparent';
    canvas.style.display = 'block';
    container.appendChild(canvas);
    canvasRef.current = canvas;

    const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: false })
      || canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });

    if (!gl) {
      console.warn('[WaterBall] WebGL not available');
      // Show static fallback
      container.innerHTML = '<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(circle,rgba(0,85,255,0.2),transparent 70%)"></div>';
      return;
    }

    // Handle context loss gracefully
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.warn('[WaterBall] WebGL context lost');
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);

    // ── Compile Shaders ─────────────────────────────
    function createShader(type: number, source: string) {
      const shader = gl!.createShader(type)!;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error('Shader error:', gl!.getShaderInfoLog(shader));
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertShader = createShader(gl.VERTEX_SHADER, VERT);
    const fragShader = createShader(gl.FRAGMENT_SHADER, FRAG);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // ── Fullscreen Quad ─────────────────────────────
    const positions = new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1,
    ]);
    const uvs = new Float32Array([
      0, 0, 1, 0, 0, 1,
      0, 1, 1, 0, 1, 1,
    ]);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
    const uvLoc = gl.getAttribLocation(program, 'uv');
    gl.enableVertexAttribArray(uvLoc);
    gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);

    // ── Uniform Locations ───────────────────────────
    const uTime = gl.getUniformLocation(program, 'iTime');
    const uResolution = gl.getUniformLocation(program, 'iResolution');
    const uHover = gl.getUniformLocation(program, 'hover');
    const uMousePos = gl.getUniformLocation(program, 'mousePos');

    gl.uniform3f(uResolution, size, size, 1.0);

    // ── State ───────────────────────────────────────
    const startTime = performance.now();
    let rafId: number;
    let isHovered = false;
    let hoverValue = 0;
    const mouseTarget = { x: 0, y: 0 };
    const mouseCurrent = { x: 0, y: 0 };

    // ── Render Loop ─────────────────────────────────
    const render = () => {
      rafId = requestAnimationFrame(render);

      const elapsed = (performance.now() - startTime) / 1000;

      // Smooth hover
      const ht = isHovered ? 1.0 : 0.0;
      hoverValue += (ht - hoverValue) * 0.05;

      // Smooth mouse
      mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * 0.06;
      mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * 0.06;

      gl!.viewport(0, 0, size, size);
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.enable(gl!.BLEND);
      gl!.blendFunc(gl!.SRC_ALPHA, gl!.ONE_MINUS_SRC_ALPHA);

      gl!.useProgram(program);
      gl!.uniform1f(uTime, elapsed);
      gl!.uniform1f(uHover, hoverValue);
      gl!.uniform2f(uMousePos, mouseCurrent.x, mouseCurrent.y);

      gl!.drawArrays(gl!.TRIANGLES, 0, 6);
    };

    render();

    // ── Mouse Interaction ───────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      // Convert to [-1, 1] UV space
      mouseTarget.x = ((e.clientX - rect.left) / rect.width) * 2.0 - 1.0;
      mouseTarget.y = -(((e.clientY - rect.top) / rect.height) * 2.0 - 1.0);
    };

    const onMouseEnter = () => { isHovered = true; };
    const onMouseLeave = () => {
      isHovered = false;
      mouseTarget.x = 0;
      mouseTarget.y = 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const t = e.touches[0];
      if (t) {
        isHovered = true;
        mouseTarget.x = ((t.clientX - rect.left) / rect.width) * 2.0 - 1.0;
        mouseTarget.y = -(((t.clientY - rect.top) / rect.height) * 2.0 - 1.0);
      }
    };

    const onTouchEnd = () => { isHovered = false; };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseenter', onMouseEnter);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('touchmove', onTouchMove);
    canvas.addEventListener('touchend', onTouchEnd);

    // ── Cleanup ─────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseenter', onMouseEnter);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      if (container.contains(canvas)) {
        container.removeChild(canvas);
      }
      // Only cleanup GL resources if context is not lost
      try {
        if (!gl!.isContextLost()) {
          gl!.deleteProgram(program);
          gl!.deleteShader(vertShader);
          gl!.deleteShader(fragShader);
          gl!.deleteBuffer(posBuffer);
          gl!.deleteBuffer(uvBuffer);
        }
      } catch { /* silently ignore cleanup errors */ }
    };
  }, [size]);

  return (
    <div
      ref={containerRef}
      className={`orb-container ${className}`}
      style={{
        width: '100%',
        maxWidth: size,
        aspectRatio: '1 / 1',
        position: 'relative',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    />
  );
}
