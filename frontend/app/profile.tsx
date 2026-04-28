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

const CHAT_OPTIONS = ['Vent', 'Listen', 'Converse'];
const ROLE_OPTIONS = ['Hype Man', 'Advisor', 'Realist', 'Poet', 'Sound Board', 'Witness'];
const MOOD_OPTIONS = ['Funny', 'Gentle', 'Angry', 'Sad', 'Scared', 'Overwhelmed', 'Lonely'];
const TOPIC_OPTIONS = ['Academics', 'Career', 'Family', 'Health', 'Identity', 'Relationship', 'Screaming into the Void'];
const GENDER_OPTIONS = ['Female', 'Male', 'Transgender', 'Genderfluid', 'Genderqueer', 'Non-Binary', 'Prefer Not to Say'];
const COLOR_OPTIONS = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple'];

function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

function Chip({ label, selected, onPress }: { label: string, selected: boolean, onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();

  const [bio, setBio] = useState<string>('');
  const [chatType, setChatType] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]); 
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]); 
  const [gender, setGender] = useState<string>('');
  const [favColor, setFavColor] = useState<string>('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('users/me/profile')
      .then(({ data }) => {
        setBio(data.bio || '');
        setChatType(data.chat_type || '');
        setRole(data.role_preference || '');
        setSelectedMoods(data.moods || []);
        setSelectedTopics(data.topics || []);
        setGender(data.gender || '');
        setFavColor(data.color || '');
      })
      .catch(() => console.log("New profile or fetch error"))
      .finally(() => setIsLoading(false));
  }, []);

  const handleProfileUpdate = async () => {
    setIsSaving(true);
    try {
      await api.put('/users/me/profile', {
        bio,
        chat_type: chatType,
        role_preference: role,
        moods: selectedMoods,
        topics: selectedTopics,
        gender: gender,
        color: favColor,
      });
      Alert.alert('Success', 'Profile updated!');
    } catch (e) {
      Alert.alert('Error', 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <ActivityIndicator style={{ flex: 1 }} color="#5dea4a" />;

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
        
        <Text style={styles.title}>Your Vibe</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.subtitle}>About You</Text>
          <TextInput
            style={styles.bioInput}
            placeholder="Tell us a bit about yourself..."
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            multiline
            numberOfLines={4}
            value={bio}
            onChangeText={setBio}
          />

          <Text style={styles.subtitle}>Preferred Interaction</Text>
          <View style={styles.chipRow}>
            {CHAT_OPTIONS.map(opt => (
              <Chip key={opt} label={opt} selected={chatType === opt} onPress={() => setChatType(chatType === opt ? '' : opt)} />
            ))}
          </View>

          <Text style={styles.subtitle}>Topics of Interest</Text>
          <View style={styles.chipRow}>
            {TOPIC_OPTIONS.map(opt => (
              <Chip key={opt} label={opt} selected={selectedTopics.includes(opt)} onPress={() => setSelectedTopics(toggle(selectedTopics, opt))} />
            ))}
          </View>
          
          <Text style={styles.subtitle}>Current Moods</Text>
          <View style={styles.chipRow}>
            {MOOD_OPTIONS.map(opt => (
              <Chip key={opt} label={opt} selected={selectedMoods.includes(opt)} onPress={() => setSelectedMoods(toggle(selectedMoods, opt))} />
            ))}
          </View>

          <Text style={styles.subtitle}>Companion Role</Text>
          <View style={styles.chipRow}>
            {ROLE_OPTIONS.map(opt => (
              <Chip key={opt} label={opt} selected={role === opt} onPress={() => setRole(role === opt ? '' : opt)} />
            ))}
          </View>

          <Text style={styles.subtitle}>Gender Identity</Text>
          <View style={styles.chipRow}>
            {GENDER_OPTIONS.map(opt => (
              <Chip key={opt} label={opt} selected={gender === opt} onPress={() => setGender(gender === opt ? '' : opt)} />
            ))}
          </View>

          <Text style={styles.subtitle}>Aura Color</Text>
          <View style={styles.chipRow}>
            {COLOR_OPTIONS.map(opt => (
              <Chip key={opt} label={opt} selected={favColor === opt} onPress={() => setFavColor(favColor === opt ? '' : opt)} />
            ))}
          </View>

          <TouchableOpacity style={styles.btn} onPress={handleProfileUpdate} disabled={isSaving}>
            {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Save Changes</Text>}
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
  subtitle: { color: '#ffffff', fontSize: 14, fontWeight: '600', marginTop: 20, marginBottom: 10, paddingHorizontal: 4, backgroundColor: '#00000099' },
  bioInput: {
    backgroundColor: '#00000099',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.42)',
    color: '#fff',
    padding: 12,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.42)', backgroundColor: '#00000099',},
  chipSelected: { backgroundColor: '#5dea4a', borderColor: '#5dea4a' },
  chipText: { color: '#fff', fontSize: 13 },
  chipTextSelected: { color: '#1a1a1a', fontWeight: '700' },
  btn: {
    backgroundColor: '#3670bb', borderRadius: 12, padding: 16,
    alignItems: 'center', marginTop: 30,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});