import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../../src/components/layout/ScreenHeader';
import { TeamCard } from '../../../src/components/features/TeamCard';
import { EmptyState } from '../../../src/components/ui/EmptyState';
import { useAuthStore } from '../../../src/store/auth';
import { useAppStore } from '../../../src/store/app';
import { subscribeTeams, deleteTeam } from '../../../src/services/teams';
import { palette, spacing } from '../../../src/design/tokens';
import { useTheme } from '../../../src/hooks/useTheme';

export default function TeamsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { isAdmin } = useAuthStore();
  const { teams, setTeams } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeTeams((data) => { setTeams(data); setLoading(false); });
    return unsub;
  }, []);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background.secondary }]}>
      <ScreenHeader
        title="Teams"
        subtitle={`${teams.length} teams`}
        rightAction={isAdmin ? { icon: 'add', onPress: () => router.push('/(app)/teams/create') } : undefined}
      />

      {teams.length === 0 && !loading ? (
        <EmptyState icon="shield-outline" title="No Teams Yet" subtitle="Create your first team"
          actionLabel={isAdmin ? 'Create Team' : undefined} onAction={isAdmin ? () => router.push('/(app)/teams/create') : undefined} />
      ) : (
        <FlatList
          data={teams}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TeamCard team={item} onPress={() => router.push(`/(app)/teams/${item.id}`)} />
          )}
          contentContainerStyle={{ paddingVertical: spacing.sm, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {isAdmin && (
        <TouchableOpacity style={[styles.fab, { backgroundColor: palette.navy[800] }]}
          onPress={() => router.push('/(app)/teams/create')} activeOpacity={0.85}>
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
