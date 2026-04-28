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
        bio: "Dealing with stuff.",
        tags: ['Converse','Poet','Funny','Identity','Relationship']
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

                  <View style={styles.topBar}>
                    <TouchableOpacity onPress={() => router.push('/profile')} accessibilityRole="button">
                      <Text style={styles.profileBtn}>Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/settings')} accessibilityRole="button">
                      <Text style={styles.profileBtn}>Settings</Text>
                    </TouchableOpacity>
                </View>

                <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'height' : 'padding'} style={{ flex: 1, justifyContent: 'center' }}>
                  
                    <Text style={styles.title}>Welcome, {username}!</Text>
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
  title:     { color: '#fff', fontSize: 22, fontWeight: '700', marginTop: 40, marginBottom: 5, textAlign: 'center' },
  subtitle:     { color: '#ffffff', fontSize: 15, fontWeight: '300', textAlign: 'center'},
  ghostCard: {
    width: '90%',
    height: 500,
    borderRadius: 20,

    backgroundColor: 'rgba(255, 255, 255, 0.85)',    

    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
    marginLeft: 15,    
    marginTop: -10,
    position:'absolute',

  },
  topBar:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 0, paddingVertical: 0 },
  profileBtn: { color: '#5dea4a', fontSize: 15, fontWeight: '600' },
});
