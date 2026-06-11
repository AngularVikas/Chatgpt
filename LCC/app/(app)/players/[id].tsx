import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ScreenHeader } from '../../../src/components/layout/ScreenHeader';
import { Avatar } from '../../../src/components/ui/Avatar';
import { Badge } from '../../../src/components/ui/Badge';
import { StatsGrid } from '../../../src/components/features/StatsGrid';
import { Card } from '../../../src/components/ui/Card';
import { usePlayersStore } from '../../../src/store/players';
import { getPlayer } from '../../../src/services/players';
import { palette, typography, spacing } from '../../../src/design/tokens';
import { useTheme } from '../../../src/hooks/useTheme';
import { ROLE_COLORS } from '../../../src/utils/constants';
import { formatAverage, formatSR } from '../../../src/utils/formatters';

export default function PlayerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { players } = usePlayersStore();
  const [player, setPlayer] = useState<any>(players.find(p => p.id === id));

  useEffect(() => {
    if (!player && id) {
      getPlayer(id).then(snap => {
        if (snap.exists()) setPlayer({ id: snap.id, ...snap.data() });
      });
    }
  }, [id]);

  if (!player) return null;

  const roleColor = ROLE_COLORS[player.role] || palette.navy[800];

  const battingStats = [
    { label: 'Matches', value: player.matchesPlayed || 0 },
    { label: 'Runs', value: player.runs || 0 },
    { label: 'High Score', value: player.highScore || 0 },
    { label: 'Average', value: formatAverage(player.runs || 0, player.matchesPlayed || 0) },
  ];

  const bowlingStats = [
    { label: 'Wickets', value: player.wickets || 0 },
    { label: 'Economy', value: player.economy?.toFixed(2) || '0.00' },
    { label: 'Avg', value: formatAverage(player.wickets || 0, player.matchesPlayed || 0) },
    { label: 'Catches', value: player.catches || 0 },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: theme.background.secondary }]}>
      <ScreenHeader title={player.displayName} showBack />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Card style={styles.profileCard}>
          <Avatar name={player.displayName} photoURL={player.photoURL} size={80} color={roleColor} />
          <Text style={[styles.name, { color: theme.text.primary }]}>{player.displayName}</Text>
          <View style={styles.badgeRow}>
            <Badge label={player.role} backgroundColor={roleColor} />
            {player.jerseyNumber && <Badge label={`#${player.jerseyNumber}`} backgroundColor={palette.gold[500]} />}
          </View>
          <Text style={[styles.style, { color: theme.text.secondary }]}>
            {player.battingStyle} bat{player.bowlingStyle ? ` · ${player.bowlingStyle}` : ''}
          </Text>
          {player.bio && <Text style={[styles.bio, { color: theme.text.secondary }]}>{player.bio}</Text>}
        </Card>

        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Batting</Text>
        <StatsGrid stats={battingStats} columns={4} />

        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Bowling & Fielding</Text>
        <StatsGrid stats={bowlingStats} columns={4} />

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  profileCard: { margin: spacing.md, padding: spacing.lg, alignItems: 'center', gap: spacing.sm },
  name: { fontSize: typography.size.xxl, fontWeight: typography.weight.bold, marginTop: 4 },
  badgeRow: { flexDirection: 'row', gap: 8 },
  style: { fontSize: typography.size.base },
  bio: { fontSize: typography.size.sm, textAlign: 'center', lineHeight: 20 },
  sectionTitle: { fontSize: typography.size.lg, fontWeight: typography.weight.bold, paddingHorizontal: spacing.md, marginTop: spacing.md },
});
