import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { ScreenHeader } from '../../../src/components/layout/ScreenHeader';
import { AvailabilityPicker } from '../../../src/components/features/AvailabilityPicker';
import { Card } from '../../../src/components/ui/Card';
import { Badge } from '../../../src/components/ui/Badge';
import { EmptyState } from '../../../src/components/ui/EmptyState';
import { useAuthStore } from '../../../src/store/auth';
import { useAppStore } from '../../../src/store/app';
import { subscribeSchedule } from '../../../src/services/schedule';
import { setAvailability, subscribeMatchAvailability } from '../../../src/services/availability';
import { palette, typography, spacing, radius } from '../../../src/design/tokens';
import { useTheme } from '../../../src/hooks/useTheme';
import { MATCH_STATUS_COLORS } from '../../../src/utils/constants';

function MatchAvailabilityRow({ match, userId, displayName }: { match: any; userId: string; displayName: string }) {
  const theme = useTheme();
  const [status, setStatus] = useState<string | undefined>();
  const date = match.matchDate?.toDate ? match.matchDate.toDate() : new Date(match.matchDate);

  useEffect(() => {
    const unsub = subscribeMatchAvailability(match.id, (items) => {
      const mine = items.find(a => a.playerId === userId);
      setStatus(mine?.status);
    });
    return unsub;
  }, [match.id, userId]);

  const handleChange = async (val: string) => {
    setStatus(val);
    await setAvailability(match.id, userId, displayName, val);
  };

  return (
    <Card style={styles.matchRow}>
      <View style={styles.matchHeader}>
        <View style={styles.matchInfo}>
          <Text style={[styles.matchTitle, { color: theme.text.primary }]} numberOfLines={1}>
            {match.title || `LCC vs ${match.opponent}`}
          </Text>
          <Text style={[styles.matchDate, { color: theme.text.secondary }]}>
            {format(date, 'EEE, MMM d · h:mm a')}
          </Text>
        </View>
        <Badge
          label={match.status}
          backgroundColor={MATCH_STATUS_COLORS[match.status] || palette.gray[400]}
        />
      </View>
      <AvailabilityPicker value={status} onChange={handleChange} />
    </Card>
  );
}

export default function AvailabilityScreen() {
  const theme = useTheme();
  const { user, profile } = useAuthStore();
  const { matches, setMatches } = useAppStore();

  useEffect(() => {
    const unsub = subscribeSchedule(setMatches);
    return unsub;
  }, []);

  const upcoming = matches.filter(m => {
    const d = m.matchDate?.toDate ? m.matchDate.toDate() : new Date(m.matchDate);
    return d >= new Date() && m.status !== 'cancelled';
  });

  return (
    <View style={[styles.screen, { backgroundColor: theme.background.secondary }]}>
      <ScreenHeader title="Availability" subtitle="Mark your availability for upcoming matches" />

      {upcoming.length === 0 ? (
        <EmptyState
          icon="checkmark-circle-outline"
          title="No Upcoming Matches"
          subtitle="Check back when matches are scheduled"
        />
      ) : (
        <FlatList
          data={upcoming}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <MatchAvailabilityRow
              match={item}
              userId={user?.uid || ''}
              displayName={profile?.displayName || ''}
            />
          )}
          contentContainerStyle={{ padding: spacing.md, gap: spacing.sm, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  matchRow: { padding: spacing.md, gap: spacing.sm },
  matchHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  matchInfo: { flex: 1, marginRight: spacing.sm },
  matchTitle: { fontSize: typography.size.md, fontWeight: typography.weight.semibold },
  matchDate: { fontSize: typography.size.sm, marginTop: 2 },
});
