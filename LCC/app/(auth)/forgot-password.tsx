import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { palette, typography, spacing } from '../../src/design/tokens';
import { resetPassword } from '../../src/services/auth';

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={[palette.navy[900], palette.navy[700]]} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + 20 }]} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}><Text style={styles.backText}>← Back</Text></TouchableOpacity>
            <Text style={styles.title}>Reset Password</Text>
          </View>

          {sent ? (
            <View style={styles.card}>
              <Text style={styles.successEmoji}>📧</Text>
              <Text style={styles.successTitle}>Email Sent!</Text>
              <Text style={styles.successText}>Check your inbox for a password reset link.</Text>
              <Button title="Back to Sign In" onPress={() => router.replace('/(auth)/login')} fullWidth style={{ marginTop: 16 }} />
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.description}>Enter your email address and we'll send you a link to reset your password.</Text>
              <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="you@example.com" />
              <Button title="Send Reset Email" onPress={handleReset} loading={loading} fullWidth />
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: spacing.md, alignItems: 'center' },
  header: { width: '100%', marginBottom: spacing.lg },
  backText: { color: palette.gold[400], fontSize: typography.size.base, marginBottom: spacing.sm },
  title: { color: '#fff', fontSize: typography.size.xxxl, fontWeight: typography.weight.black },
  card: { width: '100%', backgroundColor: '#fff', borderRadius: 24, padding: spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 10 },
  description: { color: palette.gray[600], fontSize: typography.size.base, marginBottom: spacing.lg, lineHeight: 22 },
  successEmoji: { fontSize: 56, textAlign: 'center', marginBottom: spacing.md },
  successTitle: { fontSize: typography.size.xl, fontWeight: typography.weight.bold, color: palette.navy[900], textAlign: 'center' },
  successText: { color: palette.gray[600], fontSize: typography.size.base, textAlign: 'center', marginTop: spacing.sm },
});
