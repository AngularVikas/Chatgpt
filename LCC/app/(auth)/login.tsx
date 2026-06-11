import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { palette, typography, spacing } from '../../src/design/tokens';
import { signIn } from '../../src/services/auth';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email || !/\S+@\S+\.\S+/.test(email)) e.email = 'Valid email required';
    if (!password || password.length < 6) e.password = 'Password must be 6+ characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      // AuthGuard will redirect automatically
    } catch (err: any) {
      Alert.alert('Sign In Failed', err.message || 'Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={[palette.navy[900], palette.navy[700]]} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[styles.container, { paddingTop: insets.top + 40 }]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo / Club Identity */}
          <View style={styles.hero}>
            <Text style={styles.crest}>🏏</Text>
            <Text style={styles.clubName}>Louisville Cricket Club</Text>
            <Text style={styles.tagline}>Your club, your game</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sign In</Text>

            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="you@example.com"
              error={errors.email}
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••"
              error={errors.password}
            />

            <TouchableOpacity
              onPress={() => router.push('/(auth)/forgot-password')}
              style={styles.forgotWrap}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              fullWidth
              style={{ marginTop: 8 }}
            />

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <Button
              title="Create Account"
              onPress={() => router.push('/(auth)/register')}
              variant="secondary"
              fullWidth
            />
          </View>

          <Text style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
            Louisville Cricket Club © 2025
          </Text>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: spacing.md, alignItems: 'center' },
  hero: { alignItems: 'center', marginBottom: spacing.xl },
  crest: { fontSize: 72, marginBottom: spacing.sm },
  clubName: { color: '#fff', fontSize: typography.size.xxl, fontWeight: typography.weight.black, textAlign: 'center' },
  tagline: { color: palette.gold[400], fontSize: typography.size.base, marginTop: 4 },
  card: {
    width: '100%', backgroundColor: '#fff', borderRadius: 24,
    padding: spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2, shadowRadius: 20, elevation: 10,
  },
  cardTitle: { fontSize: typography.size.xl, fontWeight: typography.weight.bold, color: palette.navy[900], marginBottom: spacing.md },
  forgotWrap: { alignSelf: 'flex-end', marginTop: -8, marginBottom: spacing.md },
  forgotText: { color: palette.navy[600], fontSize: typography.size.sm },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: palette.gray[200] },
  dividerText: { color: palette.gray[400], marginHorizontal: spacing.sm, fontSize: typography.size.sm },
  footer: { color: 'rgba(255,255,255,0.4)', fontSize: typography.size.xs, marginTop: spacing.xl },
});
