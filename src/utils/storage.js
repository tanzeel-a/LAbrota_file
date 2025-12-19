import { supabase, isSupabaseConfigured } from './supabaseClient';

const LOCAL_STORAGE_KEYS = {
    STATE: 'labTaskState',
    HISTORY: 'labTaskHistory',
    CUSTOM_ROSTER: 'labTaskCustomRoster',
    ROSTER_HISTORY: 'labTaskRosterHistory'
};

export const StorageService = {
    async getState() {
        if (isSupabaseConfigured()) {
            const { data, error } = await supabase.from('task_states').select('*');
            if (error) {
                console.error('Error fetching state from Supabase:', error);
                return null;
            }
            // Convert array to object keyed by ID
            const state = {};
            data.forEach(item => {
                state[item.id] = {
                    currentIndex: item.current_index,
                    skips: item.skips,
                    extras: item.extras
                };
            });
            return Object.keys(state).length > 0 ? state : null;
        } else {
            return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.STATE));
        }
    },

    async saveState(state) {
        if (isSupabaseConfigured()) {
            const updates = Object.keys(state).map(id => ({
                id: parseInt(id),
                current_index: state[id].currentIndex,
                skips: state[id].skips,
                extras: state[id].extras,
                updated_at: new Date().toISOString()
            }));

            const { error } = await supabase.from('task_states').upsert(updates);
            if (error) console.error('Error saving state to Supabase:', error);
        } else {
            localStorage.setItem(LOCAL_STORAGE_KEYS.STATE, JSON.stringify(state));
        }
    },

    async getHistory() {
        if (isSupabaseConfigured()) {
            const { data, error } = await supabase
                .from('task_history')
                .select('*')
                .order('timestamp', { ascending: false });

            if (error) {
                console.error('Error fetching history:', error);
                return [];
            }
            return data.map(item => ({
                taskName: item.task_name,
                people: item.people,
                timestamp: item.timestamp
            }));
        } else {
            return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.HISTORY)) || [];
        }
    },

    async addHistoryEntry(entry) {
        if (isSupabaseConfigured()) {
            const { error } = await supabase.from('task_history').insert({
                task_name: entry.taskName,
                people: entry.people,
                timestamp: entry.timestamp
            });
            if (error) console.error('Error adding history:', error);
        } else {
            const history = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.HISTORY)) || [];
            history.push(entry);
            localStorage.setItem(LOCAL_STORAGE_KEYS.HISTORY, JSON.stringify(history));
        }
    },

    async getCustomRoster() {
        if (isSupabaseConfigured()) {
            const { data, error } = await supabase
                .from('roster_settings')
                .select('value')
                .eq('key', 'custom_roster')
                .single();

            if (error && error.code !== 'PGRST116') { // Ignore not found error
                console.error('Error fetching roster:', error);
            }
            return data ? data.value : null;
        } else {
            return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.CUSTOM_ROSTER));
        }
    },

    async saveCustomRoster(roster) {
        if (isSupabaseConfigured()) {
            const { error } = await supabase.from('roster_settings').upsert({
                key: 'custom_roster',
                value: roster,
                updated_at: new Date().toISOString()
            });
            if (error) console.error('Error saving roster:', error);
        } else {
            localStorage.setItem(LOCAL_STORAGE_KEYS.CUSTOM_ROSTER, JSON.stringify(roster));
        }
    },

    async getRosterHistory() {
        if (isSupabaseConfigured()) {
            const { data, error } = await supabase
                .from('roster_history')
                .select('*')
                .order('timestamp', { ascending: false });

            if (error) {
                console.error('Error fetching roster history:', error);
                return [];
            }
            return data;
        } else {
            return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.ROSTER_HISTORY)) || [];
        }
    },

    async addRosterHistoryEntry(entry) {
        if (isSupabaseConfigured()) {
            const { error } = await supabase.from('roster_history').insert({
                details: entry.details,
                timestamp: entry.timestamp
            });
            if (error) console.error('Error adding roster history:', error);
        } else {
            const history = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.ROSTER_HISTORY)) || [];
            history.push(entry);
            localStorage.setItem(LOCAL_STORAGE_KEYS.ROSTER_HISTORY, JSON.stringify(history));
        }
    }
};
