import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '../ui/Badge';
import { palette, typography, spacing, shadows, radius } from '../../design/tokens';
import { useTheme } from '../../hooks/useTheme';
import * as Haptics from 'expo-haptics';

export const TeamCard: React.FC<{ team: any; onPress?: () => void }> = ({ team, onPress }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress?.(); }}
      style={[styles.card, { backgroundColor: theme.surface.card }, shadows.sm]}
      activeOpacity={0.75}
    >
      <Text style={styles.emoji}>🏏</Text>
      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.text.primary }]}>{team.name}</Text>
        <View style={styles.row}>
          <Badge label={team.format || 'T20'} backgroundColor={palette.navy[800]} />
          <Text style={[styles.players, { color: theme.text.secondary }]}>{team.playerIds?.length || 0} players</Text>
        </View>
        <View style={styles.record}>
          <Badge label={`W ${team.wins || 0}`} backgroundColor={palette.success} />
          <Badge label={`L ${team.losses || 0}`} backgroundColor={palette.danger} />
          <Badge label={`D ${team.draws || 0}`} backgroundColor={palette.gray[400]} />
        </View>
      </View>
      <Ionicons name="chevron-forward" size={16} color={palette.gray[300]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.lg, marginHorizontal: spacing.md, marginVertical: 6, padding: 14, gap: 12 },
  emoji: { fontSize: 36 },
  info: { flex: 1, gap: 6 },
  name: { fontSize: typography.size.lg, fontWeight: typography.weight.bold },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  players: { fontSize: typography.size.sm },
  record: { flexDirection: 'row', gap: 6 },
});
