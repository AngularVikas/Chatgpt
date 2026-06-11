import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '../../../src/components/layout/ScreenHeader';
import { Input } from '../../../src/components/ui/Input';
import { Button } from '../../../src/components/ui/Button';
import { addTeam } from '../../../src/services/teams';
import { palette, spacing, typography, radius } from '../../../src/design/tokens';
import { useTheme } from '../../../src/hooks/useTheme';

const FORMATS = ['T20', 'ODI', 'T10', 'Test'];

export default function CreateTeamScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [form, setForm] = useState({ name: '', description: '' });
  const [format, setFormat] = useState('T20');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleCreate = async () => {
    if (!form.name.trim()) { setErrors({ name: 'Team name required' }); return; }
    setLoading(true);
    try {
      await addTeam({ ...form, format, playerIds: [] });
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
        <ScreenHeader title="Create Team" showBack />
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Input label="Team Name *" value={form.name} onChangeText={set('name')} placeholder="Team name" error={errors.name} />

          <Text style={[styles.label, { color: theme.text.secondary }]}>Format</Text>
          <View style={styles.chipRow}>
            {FORMATS.map(f => (
              <TouchableOpacity key={f} onPress={() => setFormat(f)}
                style={[styles.chip, { backgroundColor: format === f ? palette.navy[800] : theme.surface.card }]}>
                <Text style={[styles.chipText, { color: format === f ? '#fff' : theme.text.secondary }]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input label="Description" value={form.description} onChangeText={set('description')} placeholder="Team description..." multiline numberOfLines={3} />

          <Button title="Create Team" onPress={handleCreate} loading={loading} fullWidth style={{ marginTop: spacing.md }} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: 40 },
  label: { fontSize: typography.size.sm, fontWeight: '500', marginBottom: 8 },
  chipRow: { flexDirection: 'row', gap: 8, marginBottom: spacing.md },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: radius.full },
  chipText: { fontSize: typography.size.sm, fontWeight: '500' },
});
