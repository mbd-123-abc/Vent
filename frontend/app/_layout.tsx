//Mahika Bagri
//26 March 2026

import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import type { AuthState } from '../store/authStore';

const PUBLIC_ROUTES = ['index', 'login', 'register'];

export default function RootLayout() {
  const loadToken = useAuthStore((s: AuthState) => s.loadToken);
  const token = useAuthStore((s: AuthState) => s.token);
  const hydrated = useAuthStore((s: AuthState) => s.hydrated);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    loadToken();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const currentRoute = segments[0] ?? 'index';
    const isPublic = PUBLIC_ROUTES.includes(currentRoute);
    if (!token && !isPublic) {
      router.replace('/login');
    }
  }, [token, hydrated, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
