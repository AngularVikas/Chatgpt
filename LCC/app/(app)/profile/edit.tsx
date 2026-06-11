import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { ScreenHeader } from '../../../src/components/layout/ScreenHeader';
import { Input } from '../../../src/components/ui/Input';
import { Button } from '../../../src/components/ui/Button';
import { Avatar } from '../../../src/components/ui/Avatar';
import { useAuthStore } from '../../../src/store/auth';
import { auth, db } from '../../../src/services/firebase';
import { COLLECTIONS } from '../../../src/utils/constants';
import { palette, spacing, typography } from '../../../src/design/tokens';
import { useTheme } from '../../../src/hooks/useTheme';

export default function EditProfileScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { user, profile, setProfile } = useAuthStore();

  const [form, setForm] = useState({
    displayName: profile?.displayName || '',
    jerseyNumber: profile?.jerseyNumber?.toString() || '',
  });
  const [loading, setLoading] = useState(false);

  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    if (!user || !form.displayName.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }
    setLoading(true);
    try {
      await updateProfile(auth.currentUser!, { displayName: form.displayName.trim() });
      const updates: any = {
        displayName: form.displayName.trim(),
        updatedAt: serverTimestamp(),
      };
      if (form.jerseyNumber) updates.jerseyNumber = parseInt(form.jerseyNumber);
      await updateDoc(doc(db, COLLECTIONS.USERS, user.uid), updates);
      setProfile({ ...profile!, ...updates });
      Alert.alert('Saved', 'Profile updated successfully');
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.screen, { backgroundColor: theme.background.secondary }]}>
        <ScreenHeader title="Edit Profile" showBack />
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.avatarSection}>
            <Avatar
              name={form.displayName || 'U'}
              photoURL={profile?.photoURL}
              size={80}
              color={palette.gold[500]}
            />
            <Text style={[styles.changePhoto, { color: palette.navy[600] }]}>Change Photo</Text>
          </View>

          <Input
            label="Display Name *"
            value={form.displayName}
            onChangeText={set('displayName')}
            placeholder="Your name"
          />
          <Input
            label="Jersey Number"
            value={form.jerseyNumber}
            onChangeText={set('jerseyNumber')}
            keyboardType="number-pad"
            placeholder="1–99"
          />

          <View style={styles.readonlySection}>
            <Text style={[styles.readonlyLabel, { color: theme.text.secondary }]}>Email</Text>
            <Text style={[styles.readonlyValue, { color: theme.text.primary }]}>{profile?.email}</Text>
          </View>
          <View style={styles.readonlySection}>
            <Text style={[styles.readonlyLabel, { color: theme.text.secondary }]}>Role</Text>
            <Text style={[styles.readonlyValue, { color: theme.text.primary }]}>
              {profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : 'Member'}
            </Text>
          </View>

          <Button title="Save Changes" onPress={handleSave} loading={loading} fullWidth style={{ marginTop: spacing.lg }} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginBottom: spacing.lg, gap: spacing.sm },
  changePhoto: { fontSize: typography.size.sm, fontWeight: '500' },
  readonlySection: { marginBottom: spacing.md },
  readonlyLabel: { fontSize: typography.size.sm, fontWeight: '500', marginBottom: 4 },
  readonlyValue: { fontSize: typography.size.base },
});
