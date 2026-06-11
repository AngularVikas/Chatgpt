import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../../src/components/layout/ScreenHeader';
import { Card } from '../../../src/components/ui/Card';
import { Button } from '../../../src/components/ui/Button';
import { useAuthStore } from '../../../src/store/auth';
import { palette, typography, spacing, radius, shadows } from '../../../src/design/tokens';
import { useTheme } from '../../../src/hooks/useTheme';

const RECENT_RECORDINGS = [
  { id: '1', title: 'LCC vs Thunder CC', date: 'Jun 8, 2025', duration: '3h 24m', size: '2.1 GB' },
  { id: '2', title: 'LCC vs Royals CC', date: 'May 25, 2025', duration: '2h 58m', size: '1.8 GB' },
];

export default function RecordingScreen() {
  const theme = useTheme();
  const { profile } = useAuthStore();
  const [isRecording, setIsRecording] = useState(false);

  const isPremium = profile?.membershipStatus === 'premium';

  const handleToggleRecording = () => {
    if (!isPremium) {
      Alert.alert('Premium Feature', 'Match recording requires a Premium membership.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Upgrade', onPress: () => {} },
      ]);
      return;
    }
    setIsRecording(r => !r);
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background.secondary }]}>
      <ScreenHeader title="Recording" subtitle="Match video recording" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Record Button */}
        <Card style={styles.recordCard}>
          <TouchableOpacity
            style={[styles.recordBtn, { backgroundColor: isRecording ? palette.danger : palette.navy[800] }]}
            onPress={handleToggleRecording}
            activeOpacity={0.85}
          >
            <Ionicons name={isRecording ? 'stop' : 'videocam'} size={36} color="#fff" />
          </TouchableOpacity>
          <Text style={[styles.recordStatus, { color: theme.text.primary }]}>
            {isRecording ? 'Recording in progress...' : 'Tap to start recording'}
          </Text>
          {isRecording && (
            <View style={styles.recordingIndicator}>
              <View style={styles.redDot} />
              <Text style={[styles.recordingText, { color: palette.danger }]}>LIVE</Text>
            </View>
          )}
          {!isPremium && (
            <View style={[styles.lockedBadge, { backgroundColor: palette.gold[500] }]}>
              <Ionicons name="lock-closed" size={12} color="#fff" />
              <Text style={styles.lockedText}>Premium</Text>
            </View>
          )}
        </Card>

        {/* Features */}
        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Features</Text>
        <Card style={styles.featuresCard}>
          {[
            { icon: 'videocam-outline' as const, label: 'Full match HD recording' },
            { icon: 'cloud-upload-outline' as const, label: 'Auto cloud backup' },
            { icon: 'cut-outline' as const, label: 'Highlight clips' },
            { icon: 'share-outline' as const, label: 'Share with team' },
          ].map((f, i) => (
            <View key={i} style={[styles.featureRow, { borderBottomColor: theme.border.light }]}>
              <Ionicons name={f.icon} size={20} color={palette.navy[600]} />
              <Text style={[styles.featureText, { color: theme.text.primary }]}>{f.label}</Text>
              {!isPremium && <Ionicons name="lock-closed-outline" size={14} color={palette.gray[400]} />}
            </View>
          ))}
        </Card>

        {/* Recent Recordings */}
        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Recent Recordings</Text>
        {RECENT_RECORDINGS.map(rec => (
          <Card key={rec.id} style={styles.recCard}>
            <View style={styles.recRow}>
              <Ionicons name="film-outline" size={24} color={palette.navy[600]} />
              <View style={styles.recInfo}>
                <Text style={[styles.recTitle, { color: theme.text.primary }]}>{rec.title}</Text>
                <Text style={[styles.recMeta, { color: theme.text.secondary }]}>
                  {rec.date} · {rec.duration} · {rec.size}
                </Text>
              </View>
              <TouchableOpacity>
                <Ionicons name="play-circle-outline" size={28} color={palette.navy[800]} />
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  recordCard: { margin: spacing.md, padding: spacing.xl, alignItems: 'center', gap: spacing.md },
  recordBtn: { width: 88, height: 88, borderRadius: 44, justifyContent: 'center', alignItems: 'center', ...shadows.lg },
  recordStatus: { fontSize: typography.size.md, fontWeight: '500' },
  recordingIndicator: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  redDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: palette.danger },
  recordingText: { fontSize: typography.size.sm, fontWeight: '700' },
  lockedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full },
  lockedText: { color: '#fff', fontSize: typography.size.xs, fontWeight: '600' },
  sectionTitle: { fontSize: typography.size.lg, fontWeight: typography.weight.bold, paddingHorizontal: spacing.md, marginTop: spacing.md, marginBottom: spacing.sm },
  featuresCard: { marginHorizontal: spacing.md, padding: spacing.md, gap: 2 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: 10, borderBottomWidth: 0.5 },
  featureText: { flex: 1, fontSize: typography.size.base },
  recCard: { marginHorizontal: spacing.md, marginBottom: spacing.sm, padding: spacing.md },
  recRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  recInfo: { flex: 1 },
  recTitle: { fontSize: typography.size.base, fontWeight: '500' },
  recMeta: { fontSize: typography.size.sm, marginTop: 2 },
});
