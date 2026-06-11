import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { palette, typography, spacing } from '../../src/design/tokens';
import { signUp } from '../../src/services/auth';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [form, setForm] = useState({ displayName: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.displayName || form.displayName.length < 2) e.displayName = 'Name required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.password || form.password.length < 6) e.password = 'Password must be 6+ characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await signUp(form.email.trim(), form.password, form.displayName.trim());
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={[palette.navy[900], palette.navy[700]]} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[styles.container, { paddingTop: insets.top + 20 }]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Louisville Cricket Club</Text>
          </View>

          <View style={styles.card}>
            <Input label="Full Name" value={form.displayName} onChangeText={set('displayName')} placeholder="Your full name" error={errors.displayName} />
            <Input label="Email" value={form.email} onChangeText={set('email')} keyboardType="email-address" autoCapitalize="none" placeholder="you@example.com" error={errors.email} />
            <Input label="Password" value={form.password} onChangeText={set('password')} secureTextEntry placeholder="6+ characters" error={errors.password} />
            <Input label="Confirm Password" value={form.confirmPassword} onChangeText={set('confirmPassword')} secureTextEntry placeholder="Repeat password" error={errors.confirmPassword} />

            <Button title="Create Account" onPress={handleRegister} loading={loading} fullWidth style={{ marginTop: 8 }} />
          </View>

          <Text style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
            By registering you agree to our Terms of Service
          </Text>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: spacing.md, alignItems: 'center' },
  header: { width: '100%', marginBottom: spacing.lg },
  backBtn: { marginBottom: spacing.sm },
  backText: { color: palette.gold[400], fontSize: typography.size.base },
  title: { color: '#fff', fontSize: typography.size.xxxl, fontWeight: typography.weight.black },
  subtitle: { color: 'rgba(255,255,255,0.6)', fontSize: typography.size.base, marginTop: 4 },
  card: { width: '100%', backgroundColor: '#fff', borderRadius: 24, padding: spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 10 },
  footer: { color: 'rgba(255,255,255,0.4)', fontSize: typography.size.xs, marginTop: spacing.xl, textAlign: 'center' },
});
