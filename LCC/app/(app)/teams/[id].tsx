import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ScreenHeader } from '../../../src/components/layout/ScreenHeader';
import { Badge } from '../../../src/components/ui/Badge';
import { Card } from '../../../src/components/ui/Card';
import { StatsGrid } from '../../../src/components/features/StatsGrid';
import { useAppStore } from '../../../src/store/app';
import { palette, typography, spacing } from '../../../src/design/tokens';
import { useTheme } from '../../../src/hooks/useTheme';

export default function TeamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { teams } = useAppStore();
  const team = teams.find(t => t.id === id);

  if (!team) return null;

  const stats = [
    { label: 'Played', value: team.matchesPlayed || 0 },
    { label: 'Won', value: team.wins || 0, color: palette.success },
    { label: 'Lost', value: team.losses || 0, color: palette.danger },
    { label: 'Draw', value: team.draws || 0 },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: theme.background.secondary }]}>
      <ScreenHeader title={team.name} showBack />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card style={styles.card}>
          <Text style={styles.emoji}>🏏</Text>
          <Text style={[styles.name, { color: theme.text.primary }]}>{team.name}</Text>
          <View style={styles.badgeRow}>
            <Badge label={team.format || 'T20'} backgroundColor={palette.navy[800]} />
            <Badge label={`${team.playerIds?.length || 0} players`} backgroundColor={palette.gold[500]} />
          </View>
          {team.description && <Text style={[styles.desc, { color: theme.text.secondary }]}>{team.description}</Text>}
        </Card>

        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Season Record</Text>
        <StatsGrid stats={stats} columns={4} />
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  card: { margin: spacing.md, padding: spacing.lg, alignItems: 'center', gap: spacing.sm },
  emoji: { fontSize: 56 },
  name: { fontSize: typography.size.xxl, fontWeight: typography.weight.bold },
  badgeRow: { flexDirection: 'row', gap: 8 },
  desc: { fontSize: typography.size.base, textAlign: 'center' },
  sectionTitle: { fontSize: typography.size.lg, fontWeight: typography.weight.bold, paddingHorizontal: spacing.md, marginTop: spacing.md },
});
