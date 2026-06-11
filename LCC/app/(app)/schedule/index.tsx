import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../../src/components/layout/ScreenHeader';
import { MatchCard } from '../../../src/components/features/MatchCard';
import { EmptyState } from '../../../src/components/ui/EmptyState';
import { MatchCardSkeleton } from '../../../src/components/ui/Skeleton';
import { useAuthStore } from '../../../src/store/auth';
import { useAppStore } from '../../../src/store/app';
import { subscribeSchedule, deleteMatch } from '../../../src/services/schedule';
import { palette, spacing } from '../../../src/design/tokens';
import { useTheme } from '../../../src/hooks/useTheme';

export default function ScheduleScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { isAdmin, user } = useAuthStore();
  const { matches, setMatches } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeSchedule((data) => {
      setMatches(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleDelete = (id: string) => {
    Alert.alert('Delete Match', 'Are you sure you want to delete this match?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteMatch(id) },
    ]);
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background.secondary }]}>
      <ScreenHeader
        title="Schedule"
        subtitle={`${matches.length} matches`}
        rightAction={isAdmin ? { icon: 'add', onPress: () => router.push('/(app)/schedule/add') } : undefined}
      />

      {loading ? (
        <View style={{ paddingTop: spacing.md }}>
          {[1, 2, 3].map(i => <MatchCardSkeleton key={i} />)}
        </View>
      ) : matches.length === 0 ? (
        <EmptyState
          icon="calendar-outline"
          title="No Matches Scheduled"
          subtitle="Check back soon for upcoming matches"
          actionLabel={isAdmin ? 'Add Match' : undefined}
          onAction={isAdmin ? () => router.push('/(app)/schedule/add') : undefined}
        />
      ) : (
        <FlatList
          data={matches}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <MatchCard
              match={item}
              onPress={() => router.push(`/(app)/schedule/${item.id}`)}
              onDelete={isAdmin ? () => handleDelete(item.id) : undefined}
              isAdmin={isAdmin}
            />
          )}
          contentContainerStyle={{ paddingVertical: spacing.sm, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {isAdmin && (
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: palette.navy[800] }]}
          onPress={() => router.push('/(app)/schedule/add')}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  fab: { position: 'absolute', bottom: 100, right: spacing.lg, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
});
