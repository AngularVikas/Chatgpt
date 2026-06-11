import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { palette, typography, spacing, shadows, radius } from '../../design/tokens';
import { useTheme } from '../../hooks/useTheme';
import { ROLE_COLORS } from '../../utils/constants';
import * as Haptics from 'expo-haptics';

interface PlayerCardProps {
  player: any;
  onPress?: () => void;
  onDelete?: () => void;
  isAdmin?: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, onPress, onDelete, isAdmin }) => {
  const theme = useTheme();
  const roleColor = ROLE_COLORS[player.role] || palette.navy[800];

  return (
    <TouchableOpacity
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress?.(); }}
      style={[styles.card, { backgroundColor: theme.surface.card }, shadows.sm]}
      activeOpacity={0.75}
    >
      <View style={styles.avatarWrap}>
        <Avatar name={player.displayName} photoURL={player.photoURL} size={52} color={roleColor} />
        {player.jerseyNumber && (
          <View style={styles.jerseyBadge}>
            <Text style={styles.jerseyNum}>#{player.jerseyNumber}</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.text.primary }]}>{player.displayName}</Text>
        <Badge label={player.role} backgroundColor={roleColor} style={styles.roleBadge} />
        <Text style={[styles.style, { color: theme.text.secondary }]}>{player.battingStyle} bat</Text>
        <View style={styles.stats}>
          <Ionicons name="baseball-outline" size={12} color={theme.text.tertiary} />
          <Text style={[styles.stat, { color: theme.text.secondary }]}>{player.runs || 0} runs</Text>
          <Text style={[styles.stat, { color: theme.text.tertiary }]}>·</Text>
          <Text style={[styles.stat, { color: theme.text.secondary }]}>{player.wickets || 0} wkts</Text>
          <Text style={[styles.stat, { color: theme.text.tertiary }]}>·</Text>
          <Text style={[styles.stat, { color: theme.text.secondary }]}>{player.matchesPlayed || 0} matches</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={16} color={palette.gray[300]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.lg, marginHorizontal: spacing.md, marginVertical: 6, padding: 12, gap: 12 },
  avatarWrap: { position: 'relative' },
  jerseyBadge: { position: 'absolute', bottom: -2, right: -4, backgroundColor: palette.gold[500], borderRadius: radius.full, paddingHorizontal: 4, paddingVertical: 1 },
  jerseyNum: { color: '#fff', fontSize: 9, fontWeight: '700' },
  info: { flex: 1, gap: 3 },
  name: { fontSize: typography.size.md, fontWeight: typography.weight.semibold },
  roleBadge: { alignSelf: 'flex-start' },
  style: { fontSize: typography.size.sm },
  stats: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stat: { fontSize: 12 },
});
