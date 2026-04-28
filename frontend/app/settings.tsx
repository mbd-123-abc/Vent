//Mahika Bagri
//27 April 2026

import React, { useEffect, useState } from 'react';
import {
  Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, ImageBackground, View, Alert, TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { api } from '../api/client';
import { useAuthStore } from '../store/authStore';
import type { AuthState } from '../store/authStore';

export default function SettingsScreen() {
    const router = useRouter();
    const clearToken = useAuthStore((s: AuthState) => s.clearToken);

    const handleLogout = () => {
        Alert.alert('Log out', 'Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log out', style: 'destructive', onPress: () => { clearToken(); router.replace('/login'); } },
        ]);
    };

    return (
        <ImageBackground
          source={require('../assets/images/BackgroundDark.jpg')}
          style={{ flex: 1 }}
          resizeMode="cover"
        >
            <SafeAreaView style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.backBtn}>←</Text>
                </TouchableOpacity>
                <View style={{ width: 20 }} />
            </View>
            <Text style={styles.title}>Settings</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity 
                    style={[styles.btn, { backgroundColor: '#00000099', borderWidth: 1, borderColor: '#ff6b6b' }]} 
                    onPress={handleLogout}
            >
                <Text style={styles.btnText}>Log Out</Text>
            </TouchableOpacity>
            </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 24 },
    topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
    backBtn: { color: '#5dea4a', fontSize: 24, fontWeight: '600' },
    title: { color: '#fff', fontSize: 22, fontWeight: '700',textAlign: 'center', marginBottom: 15, marginTop: -15 },
    btn: {
        backgroundColor: '#3670bb', borderRadius: 12, padding: 16,
        alignItems: 'center', marginTop: 30,
    },
    btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});