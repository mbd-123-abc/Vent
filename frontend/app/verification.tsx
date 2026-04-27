//Mahika Bagri
//25 April 2026

import React, { useState, useEffect } from 'react';
import {
  Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { api } from '../api/client';
import { useAuthStore } from '../store/authStore';
import type { AuthState } from '../store/authStore';

export default function VerificationScreen(){
        const email = useAuthStore((state) => state.email);
        const router = useRouter();
        useEffect(() => {
            if (!email) {
                const timer = setTimeout(() => {
                    router.replace('/register');
                }, 1);
                return () => clearTimeout(timer);
            }
        }, [email]);

        const error      = useAuthStore((s: AuthState) => s.error);
        const clearError = useAuthStore((s: AuthState) => s.clearError);
        const setError   = useAuthStore((s: AuthState) => s.setError);
        const [loading, setLoading] = useState(false);
        const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
        const [timer, setTimer] = useState(0);

    const [code, setCode] = useState('');
        
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const validate = (): boolean => {
        const errs: Record<string, string> = {};
        if (!(/^\d+$/.test(code))||code.length !== 6) errs.code = 'Verification code must be 6 digits.';
        setFieldErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleResend = async () => {
        clearError();
        setLoading(true);
        let success = false;
        try {
            const { data } = await api.post('/auth/resend', {email: email});
            setTimer(900);
            alert("A new code has been sent!");
            success = true;
        } catch (err: any){
            console.error('Raw Verification Error:', err.message);
            console.error('Verification Response:', err.response?.status, JSON.stringify(err.response?.data));
            const rawDetail = err.response?.data?.detail;
            const detail = Array.isArray(rawDetail)
                ? (rawDetail[0]?.msg ?? 'Validation error')
                : (rawDetail ?? '');
            const lower = String(detail).toLowerCase();
            
            setError('Verification failed. Please try again.');
        } finally {
            setLoading(false);
        } 
        if (success) router.push('/login');
    };

    const handleCode = async () => {
        clearError();
        if (!validate()) return;
        setLoading(true);
        let success = false;
        try {
            const { data } = await api.post('/auth/verify', {email: email,verificationCode: code});
            success = true;
        } catch (err: any){
            console.error('Raw Verification Error:', err.message);
            console.error('Verification Response:', err.response?.status, JSON.stringify(err.response?.data));
            const rawDetail = err.response?.data?.detail;
            const detail = Array.isArray(rawDetail)
                ? (rawDetail[0]?.msg ?? 'Validation error')
                : (rawDetail ?? '');
            const lower = String(detail).toLowerCase();
            
            setError('Verification failed. Please try again.');
        } finally {
            setLoading(false);
        } 
        if (success) router.push('/login');
    };
    
    return (
        <ImageBackground
            source={require('../assets/images/BackgroundDark.jpg')}
            style={{ flex: 1 }}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'height' : 'padding'} style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={styles.title}>Verify Account</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Verification Code"
                        placeholderTextColor="#666"
                        value={code}
                        onChangeText={t => { setCode(t); clearError(); setFieldErrors(p => ({ ...p, name: '' })); }}
                        secureTextEntry
                    />
{error &&           <Text style={styles.errorBox}>{error}</Text>}
                    <TouchableOpacity style={styles.btn} onPress={handleCode} disabled={timer > 0} accessibilityRole="button">
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Verify</Text>}
                    </TouchableOpacity>

            <TouchableOpacity onPress={handleResend} accessibilityRole="button">
                <Text style={styles.link}>Resend Verification Code</Text>
            </TouchableOpacity>

            </KeyboardAvoidingView>
            </SafeAreaView>
        </ImageBackground>
                    
    )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title:     { color: '#fff', fontSize: 30, fontWeight: '700', marginBottom: 30, textAlign: 'center' },
  subtitle:     { color: '#fff', fontSize: 15, fontWeight: '500', marginBottom: 10},
  input: {
    backgroundColor: '#ffffff', color: '#000000', borderRadius: 10,
    padding: 14, marginBottom: 12, fontSize: 15,
  },
  fieldError: { color: '#ff6b6b', fontSize: 12, marginBottom: 8, marginLeft: 4 },
  errorBox: {
    backgroundColor: '#2d0a0a', borderWidth: 1, borderColor: '#c0392b',
    borderRadius: 8, padding: 12, marginBottom: 12,
    color: '#ff6b6b', fontSize: 13, textAlign: 'center',
  },
  btn: {
    backgroundColor: '#3d71b4', borderRadius: 10, padding: 16,
    alignItems: 'center', marginBottom: 16,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  link:    { backgroundColor: '#000000', color: '#fff', textAlign: 'center', fontSize: 14, fontWeight: '500' },
});
