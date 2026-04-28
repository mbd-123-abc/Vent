//Mahika Bagri
//27 March 2026

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Prioritize the Environment Variable, fallback to your Local IP for dev
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.XX:8080';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request Interceptor: Attach the Token
api.interceptors.request.use(
  async (config) => {
    try {
      // IMPORTANT: Ensure this key 'access_token' is what you use in your Login screen!
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Failed to fetch token from storage', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Response Interceptor: Handle Token Expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If the backend returns 401 (Unauthorized), the token is likely expired or invalid
    if (error.response?.status === 401) {
      console.warn('Unauthorized request - clearing token');
      await AsyncStorage.removeItem('access_token');
      // Optional: Redirect to login screen here if using a navigation ref
    }
    return Promise.reject(error);
  }
);

export default api;