import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/providers/AuthProvider';

export interface SavedScreen {
    id: string;
    name: string;
    config: {
        filter: string;
        typeFilter: 'all' | 'stock' | 'crypto';
        sortField: string;
        sortOrder: 'asc' | 'desc';
    };
    created_at: string;
}

export function useSavedScreens() {
    const { user } = useAuth();
    const [screens, setScreens] = useState<SavedScreen[]>([]);
    const [loading, setLoading] = useState(false);

    // Load screens on mount or user change
    useEffect(() => {
        let mounted = true;

        if (!user || !supabase) {
            // Avoid synchronous state update warning
            Promise.resolve().then(() => {
                if (mounted) setScreens([]);
            });
            return;
        }

        const loadScreens = async () => {
            if (!supabase) return; // Guard clause
            setLoading(true);
            const { data, error } = await supabase
                .from('saved_screens')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data && mounted) {
                setScreens(data as SavedScreen[]);
            }
            if (mounted) setLoading(false);
        };

        loadScreens();

        return () => { mounted = false; };
    }, [user]);

    const saveScreen = async (name: string, config: SavedScreen['config']) => {
        if (!user || !supabase) return null;

        const newScreen = {
            user_id: user.id,
            name,
            config
        };

        const { data, error } = await supabase
            .from('saved_screens')
            .insert([newScreen])
            .select()
            .single();

        if (!error && data) {
            setScreens(prev => [data as SavedScreen, ...prev]);
            return data;
        }
        return null;
    };

    const deleteScreen = async (id: string) => {
        if (!user || !supabase) return;

        const { error } = await supabase
            .from('saved_screens')
            .delete()
            .eq('id', id);

        if (!error) {
            setScreens(prev => prev.filter(s => s.id !== id));
        }
    };

    return {
        screens,
        loading,
        saveScreen,
        deleteScreen
    };
}
