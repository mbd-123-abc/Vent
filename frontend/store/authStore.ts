//Mahika Bagri
//26 April 2026

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthToken } from '../types';

export interface AuthState {
  token: string | null;
  username: string | null;
  email: string | null;
  hydrated: boolean;
  error: string | null;
  setUsername: (username: string) => void;
  setToken: (token: AuthToken) => Promise<void>;
  clearToken: () => Promise<void>;
  loadToken: () => Promise<void>;
  clearError: () => void;
  setError: (msg: string) => void;
  setEmail: (email: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  username: null,
  email:null,
  hydrated: false,
  error: null,

  setToken: async (auth: AuthToken) => {
    //await AsyncStorage.multiRemove(['access_token', 'saved_username']);
    const tokenToSave = auth.access_token;
    if (!tokenToSave) {
      console.error("Auth Error: No access_token found in the object provided to setToken");
      return;
    }
    await AsyncStorage.setItem('access_token', tokenToSave);
    set({ token: tokenToSave, hydrated: true, email: null }); 
  },

  clearToken: async () => {
    await AsyncStorage.removeItem('access_token');
    set({ token: null, username: null });
  },

  loadToken: async () => {
    const token = await AsyncStorage.getItem('access_token');
    const savedUsername = await AsyncStorage.getItem('saved_username');
    set({ token, username: savedUsername, hydrated: true});
  },

  clearError: () => set({ error: null }),

  setError: (msg: string) => set({ error: msg }),

  setUsername: (username: string) => {
    AsyncStorage.setItem('saved_username', username);
    set({ username: username });
  },

  setEmail: (email: string) => set({ email: email })
}));
