//Mahika Bagri
//26 April 2026

import React, { useEffect, useState, useCallback } from 'react';
import {
  Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator,
  ImageBackground, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { api } from '../api/client';
import { useAuthStore } from '../store/authStore';
import type { AuthState } from '../store/authStore';
import MatchCard from '../components/matchCard'

export default function DashboardScreen() {
    const username = useAuthStore((state: AuthState) => state.username);
    const token = useAuthStore((state: AuthState) => state.token);
    const router = useRouter();

    const mockUser = {
        bio: "Passionate about campus sustainability and finding the best vegetarian pho in Seattle. UW Senior.",
        tags: ['Vegetarian','Senior','Sustainability']
    };

    useEffect(() => {
        if (!token) {
            const timer = setTimeout(() => {
                router.replace('/login');
            }, 1);
            return () => clearTimeout(timer);
        }
    }, [token]);

      return (
        <ImageBackground
          source={require('../assets/images/BackgroundDark.jpg')}
          style={{ flex: 1 }}
          resizeMode="cover"
        >
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'height' : 'padding'} style={{ flex: 1, justifyContent: 'center' }}>
                
                    <Text style={styles.title}>Welcome, {username}!</Text>

                    <Text style={styles.subtitle}>Top Matches</Text>
                    <View style={styles.ghostCard}></View>
                    <MatchCard user={mockUser} />

                    {/* <Text style={styles.subtitle}>Top Posts</Text> */}

                </KeyboardAvoidingView>
            </SafeAreaView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title:     { color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 50, marginBottom: 30, textAlign: 'center' },
  subtitle:     { color: '#fff', fontSize: 15, fontWeight: '500'},
  btn: {
    backgroundColor: '#3d71b4', borderRadius: 10, padding: 16,
    alignItems: 'center', marginBottom: 16,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  ghostCard: {
    width: '70%',
    height: 400,
    borderRadius: 20,

    backgroundColor: 'rgba(255, 255, 255, 0.85)',    

    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
    marginLeft: 50,
    position:'absolute',

  },
});
