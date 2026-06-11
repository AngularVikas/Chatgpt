import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../../src/components/layout/ScreenHeader';
import { AvailabilityPicker } from '../../../src/components/features/AvailabilityPicker';
import { Badge } from '../../../src/components/ui/Badge';
import { Card } from '../../../src/components/ui/Card';
import { useAuthStore } from '../../../src/store/auth';
import { useAppStore } from '../../../src/store/app';
import { setAvailability, subscribeMatchAvailability } from '../../../src/services/availability';
import { palette, typography, spacing, radius } from '../../../src/design/tokens';
import { useTheme } from '../../../src/hooks/useTheme';
import { MATCH_STATUS_COLORS } from '../../../src/utils/constants';

export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { user, profile, isAdmin } = useAuthStore();
  const { matches } = useAppStore();
  const match = matches.find(m => m.id === id);
  const [availability, setAvailabilityState] = useState<any[]>([]);
  const [myStatus, setMyStatus] = useState<string | undefined>();

  useEffect(() => {
    if (!id) return;
    const unsub = subscribeMatchAvailability(id, (items) => {
      setAvailabilityState(items);
      const mine = items.find(a => a.playerId === user?.uid);
      setMyStatus(mine?.status);
    });
    return unsub;
  }, [id]);

  const handleAvailability = async (status: string) => {
    if (!user || !profile) return;
    setMyStatus(status);
    await setAvailability(id!, user.uid, profile.displayName, status);
  };

  if (!match) return null;

  const date = match.matchDate?.toDate ? match.matchDate.toDate() : new Date(match.matchDate);
  const available = availability.filter(a => a.status === 'available').length;
  const maybe = availability.filter(a => a.status === 'maybe').length;
  const unavailable = availability.filter(a => a.status === 'unavailable').length;

  return (
    <View style={[styles.screen, { backgroundColor: theme.background.secondary }]}>
      <ScreenHeader title={match.title || `vs ${match.opponent}`} showBack />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Card style={styles.infoCard}>
          <View style={styles.badgeRow}>
            <Badge label={match.matchType || 'T20'} backgroundColor={palette.navy[800]} />
            <Badge label={match.status} backgroundColor={MATCH_STATUS_COLORS[match.status] || palette.gray[400]} />
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={18} color={palette.navy[600]} />
            <Text style={[styles.infoText, { color: theme.text.primary }]}>{format(date, 'EEEE, MMMM d, yyyy')}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={18} color={palette.navy[600]} />
            <Text style={[styles.infoText, { color: theme.text.primary }]}>{format(date, 'h:mm a')}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color={palette.navy[600]} />
            <Text style={[styles.infoText, { color: theme.text.primary }]}>{match.venue}</Text>
          </View>
          {match.notes && (
            <View style={styles.infoRow}>
              <Ionicons name="document-text-outline" size={18} color={palette.navy[600]} />
              <Text style={[styles.infoText, { color: theme.text.secondary }]}>{match.notes}</Text>
            </View>
          )}
        </Card>

        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Your Availability</Text>
        <AvailabilityPicker value={myStatus} onChange={handleAvailability} />

        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Team Response</Text>
        <Card style={styles.availCard}>
          <View style={styles.availRow}>
            <View style={styles.availItem}>
              <Text style={[styles.availNum, { color: palette.success }]}>{available}</Text>
              <Text style={[styles.availLabel, { color: theme.text.secondary }]}>Available</Text>
            </View>
            <View style={styles.availItem}>
              <Text style={[styles.availNum, { color: palette.warning }]}>{maybe}</Text>
              <Text style={[styles.availLabel, { color: theme.text.secondary }]}>Maybe</Text>
            </View>
            <View style={styles.availItem}>
              <Text style={[styles.availNum, { color: palette.danger }]}>{unavailable}</Text>
              <Text style={[styles.availLabel, { color: theme.text.secondary }]}>Unavailable</Text>
            </View>
          </View>
        </Card>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  infoCard: { margin: spacing.md, padding: spacing.md, gap: 12 },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  infoText: { flex: 1, fontSize: typography.size.base, lineHeight: 22 },
  sectionTitle: { fontSize: typography.size.lg, fontWeight: typography.weight.bold, paddingHorizontal: spacing.md, marginTop: spacing.md, marginBottom: 4 },
  availCard: { margin: spacing.md, padding: spacing.md },
  availRow: { flexDirection: 'row', justifyContent: 'space-around' },
  availItem: { alignItems: 'center', gap: 4 },
  availNum: { fontSize: 32, fontWeight: '800' },
  availLabel: { fontSize: typography.size.sm },
});
