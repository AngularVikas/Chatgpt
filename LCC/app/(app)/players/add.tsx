import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '../../../src/components/layout/ScreenHeader';
import { Input } from '../../../src/components/ui/Input';
import { Button } from '../../../src/components/ui/Button';
import { addPlayer } from '../../../src/services/players';
import { palette, spacing, typography, radius } from '../../../src/design/tokens';
import { useTheme } from '../../../src/hooks/useTheme';

const ROLES = ['Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper', 'Wicket-Keeper Batsman'];
const BATTING_STYLES = ['Right-hand', 'Left-hand'];

export default function AddPlayerScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [form, setForm] = useState({ displayName: '', email: '', phone: '', bio: '' });
  const [jerseyNumber, setJerseyNumber] = useState('');
  const [role, setRole] = useState('');
  const [battingStyle, setBattingStyle] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.displayName.trim()) e.displayName = 'Name required';
    if (!role) e.role = 'Role required';
    if (!battingStyle) e.battingStyle = 'Batting style required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await addPlayer({ ...form, role, battingStyle, jerseyNumber: jerseyNumber ? parseInt(jerseyNumber) : undefined });
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
        <ScreenHeader title="Add Player" showBack />
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Input label="Full Name *" value={form.displayName} onChangeText={set('displayName')} placeholder="Player name" error={errors.displayName} />
          <Input label="Email" value={form.email} onChangeText={set('email')} keyboardType="email-address" autoCapitalize="none" placeholder="Optional" />
          <Input label="Phone" value={form.phone} onChangeText={set('phone')} keyboardType="phone-pad" placeholder="Optional" />
          <Input label="Jersey Number" value={jerseyNumber} onChangeText={setJerseyNumber} keyboardType="number-pad" placeholder="1–99" />

          <Text style={[styles.label, { color: theme.text.secondary }]}>Role *</Text>
          <View style={styles.chipRow}>
            {ROLES.map(r => (
              <TouchableOpacity key={r} onPress={() => setRole(r)}
                style={[styles.chip, { backgroundColor: role === r ? palette.navy[800] : theme.surface.card }]}>
                <Text style={[styles.chipText, { color: role === r ? '#fff' : theme.text.secondary }]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.role && <Text style={styles.errorText}>{errors.role}</Text>}

          <Text style={[styles.label, { color: theme.text.secondary }]}>Batting Style *</Text>
          <View style={styles.chipRow}>
            {BATTING_STYLES.map(s => (
              <TouchableOpacity key={s} onPress={() => setBattingStyle(s)}
                style={[styles.chip, { backgroundColor: battingStyle === s ? palette.navy[800] : theme.surface.card }]}>
                <Text style={[styles.chipText, { color: battingStyle === s ? '#fff' : theme.text.secondary }]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.battingStyle && <Text style={styles.errorText}>{errors.battingStyle}</Text>}

          <Input label="Bio" value={form.bio} onChangeText={set('bio')} placeholder="Brief description..." multiline numberOfLines={3} />

          <Button title="Add Player" onPress={handleAdd} loading={loading} fullWidth style={{ marginTop: spacing.md }} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: 40 },
  label: { fontSize: typography.size.sm, fontWeight: '500', marginBottom: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.md },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.full },
  chipText: { fontSize: typography.size.sm, fontWeight: '500' },
  errorText: { color: palette.danger, fontSize: typography.size.sm, marginTop: -8, marginBottom: 8 },
});
