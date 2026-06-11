import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
// DateTimePicker used via native Input on web; native module on device
import { ScreenHeader } from '../../../src/components/layout/ScreenHeader';
import { Input } from '../../../src/components/ui/Input';
import { Button } from '../../../src/components/ui/Button';
import { useAuthStore } from '../../../src/store/auth';
import { addMatch } from '../../../src/services/schedule';
import { palette, spacing, typography } from '../../../src/design/tokens';
import { useTheme } from '../../../src/hooks/useTheme';

const MATCH_TYPES = ['T20', 'ODI', 'T10', 'Practice', 'Test'];

export default function AddMatchScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { user } = useAuthStore();
  const [form, setForm] = useState({ title: '', opponent: '', venue: '', notes: '' });
  const [matchDate, setMatchDate] = useState(new Date());
  const [matchType, setMatchType] = useState('T20');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.opponent.trim()) e.opponent = 'Opponent required';
    if (!form.venue.trim()) e.venue = 'Venue required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = async () => {
    if (!validate() || !user) return;
    setLoading(true);
    try {
      await addMatch({ ...form, matchDate, matchType }, user.uid);
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
        <ScreenHeader title="Add Match" showBack />
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Input label="Title (optional)" value={form.title} onChangeText={set('title')} placeholder="LCC vs Thunder CC" />
          <Input label="Opponent *" value={form.opponent} onChangeText={set('opponent')} placeholder="Thunder CC" error={errors.opponent} />
          <Input label="Venue *" value={form.venue} onChangeText={set('venue')} placeholder="Louisville Cricket Ground" error={errors.venue} />

          <Text style={[styles.label, { color: theme.text.secondary }]}>Match Type</Text>
          <View style={styles.chipRow}>
            {MATCH_TYPES.map(t => (
              <Button
                key={t} title={t}
                variant={matchType === t ? 'primary' : 'secondary'}
                onPress={() => setMatchType(t)}
                style={styles.chip}
              />
            ))}
          </View>

          <Text style={[styles.label, { color: theme.text.secondary }]}>Date & Time</Text>
          <Input
            label=""
            value={matchDate.toISOString().slice(0, 16)}
            onChangeText={val => { const d = new Date(val); if (!isNaN(d.getTime())) setMatchDate(d); }}
            placeholder="YYYY-MM-DDTHH:MM"
            containerStyle={{ marginBottom: spacing.md }}
          />

          <Input label="Notes" value={form.notes} onChangeText={set('notes')} placeholder="Any additional info..." multiline numberOfLines={3} />

          <Button title="Add Match" onPress={handleAdd} loading={loading} fullWidth style={{ marginTop: spacing.md }} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: 40 },
  label: { fontSize: typography.size.sm, fontWeight: '500', marginBottom: 8 },
  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: spacing.md },
  chip: { height: 38, paddingHorizontal: 12, flex: 0 },
});
