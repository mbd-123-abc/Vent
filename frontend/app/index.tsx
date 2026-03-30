//Mahika Bagri
//26 March 2026

import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../store/authStore';
import type { AuthState } from '../store/authStore';

export default function Index() {
  const token = useAuthStore((s: AuthState) => s.token);
  const hydrated = useAuthStore((s: AuthState) => s.hydrated);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f0f1a', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#a0c4ff" />
      </View>
    );
  }

  return <Redirect href={token ? '/dashboard' : '/login'} />;
}
