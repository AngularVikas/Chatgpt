import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../../src/components/layout/ScreenHeader';
import { PlayerCard } from '../../../src/components/features/PlayerCard';
import { EmptyState } from '../../../src/components/ui/EmptyState';
import { PlayerCardSkeleton } from '../../../src/components/ui/Skeleton';
import { useAuthStore } from '../../../src/store/auth';
import { usePlayersStore } from '../../../src/store/players';
import { subscribePlayers, deletePlayer } from '../../../src/services/players';
import { palette, spacing, typography, radius } from '../../../src/design/tokens';
import { useTheme } from '../../../src/hooks/useTheme';

const ROLES = ['All', 'Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper'];

export default function PlayersScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { isAdmin } = useAuthStore();
  const { players, setPlayers, loading, setLoading } = usePlayersStore();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  useEffect(() => {
    setLoading(true);
    const unsub = subscribePlayers((data) => {
      setPlayers(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const filtered = players.filter(p => {
    const matchSearch = p.displayName?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'All' || p.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleDelete = (id: string, name: string) => {
    Alert.alert(`Remove ${name}`, 'Remove this player from the roster?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => deletePlayer(id) },
    ]);
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background.secondary }]}>
      <ScreenHeader
        title="Players"
        subtitle={`${players.length} members`}
        rightAction={isAdmin ? { icon: 'person-add-outline', onPress: () => router.push('/(app)/players/add') } : undefined}
      />

      {/* Search */}
      <View style={[styles.searchBar, { backgroundColor: theme.surface.card }]}>
        <Ionicons name="search" size={18} color={theme.text.tertiary} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search players..."
          placeholderTextColor={theme.text.tertiary}
          style={[styles.searchInput, { color: theme.text.primary }]}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={theme.text.tertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Role Filter */}
      <FlatList
        data={ROLES}
        horizontal
        keyExtractor={item => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipList}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setRoleFilter(item)}
            style={[styles.chip, { backgroundColor: roleFilter === item ? palette.navy[800] : theme.surface.card }]}
          >
            <Text style={[styles.chipText, { color: roleFilter === item ? '#fff' : theme.text.secondary }]}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {loading ? (
        <View>{[1, 2, 3].map(i => <PlayerCardSkeleton key={i} />)}</View>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="people-outline"
          title="No Players Found"
          subtitle={search ? 'Try a different search' : 'Add players to your roster'}
          actionLabel={isAdmin ? 'Add Player' : undefined}
          onAction={isAdmin ? () => router.push('/(app)/players/add') : undefined}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <PlayerCard
              player={item}
              onPress={() => router.push(`/(app)/players/${item.id}`)}
              onDelete={isAdmin ? () => handleDelete(item.id, item.displayName) : undefined}
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
          onPress={() => router.push('/(app)/players/add')}
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
  searchBar: { flexDirection: 'row', alignItems: 'center', marginHorizontal: spacing.md, marginTop: spacing.md, borderRadius: radius.md, paddingHorizontal: spacing.md, height: 44, gap: 8 },
  searchInput: { flex: 1, fontSize: typography.size.base },
  chipList: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: radius.full },
  chipText: { fontSize: typography.size.sm, fontWeight: '500' },
  fab: { position: 'absolute', bottom: 100, right: spacing.lg, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
});
