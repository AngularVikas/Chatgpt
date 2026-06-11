import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Badge } from '../ui/Badge';
import { palette, typography, spacing, shadows, radius } from '../../design/tokens';
import { useTheme } from '../../hooks/useTheme';
import { MATCH_STATUS_COLORS } from '../../utils/constants';
import * as Haptics from 'expo-haptics';

interface MatchCardProps {
  match: any;
  onPress?: () => void;
  onDelete?: () => void;
  isAdmin?: boolean;
  myAvailability?: string;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onPress, onDelete, isAdmin, myAvailability }) => {
  const theme = useTheme();
  const date = match.matchDate?.toDate ? match.matchDate.toDate() : new Date(match.matchDate);
  const statusColor = MATCH_STATUS_COLORS[match.status] || palette.gray[400];

  return (
    <TouchableOpacity
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress?.(); }}
      style={[styles.card, { backgroundColor: theme.surface.card }, shadows.sm]}
      activeOpacity={0.75}
    >
      <View style={styles.dateCol}>
        <Text style={[styles.dayNum, { color: palette.navy[800] }]}>{format(date, 'd')}</Text>
        <Text style={[styles.month, { color: palette.gold[500] }]}>{format(date, 'MMM').toUpperCase()}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.info}>
        <View style={styles.row}>
          <Badge label={match.matchType || 'T20'} backgroundColor={palette.navy[800]} />
          <Badge label={match.status} backgroundColor={statusColor} style={{ marginLeft: 6 }} />
        </View>
        <Text style={[styles.title, { color: theme.text.primary }]} numberOfLines={1}>{match.title || `LCC vs ${match.opponent}`}</Text>
        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={12} color={theme.text.tertiary} />
          <Text style={[styles.meta, { color: theme.text.secondary }]}>{format(date, 'h:mm a')}</Text>
          <Ionicons name="location-outline" size={12} color={theme.text.tertiary} style={{ marginLeft: 8 }} />
          <Text style={[styles.meta, { color: theme.text.secondary }]} numberOfLines={1}>{match.venue}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        {myAvailability === 'available' && <Ionicons name="checkmark-circle" size={20} color={palette.success} />}
        {!myAvailability && <Ionicons name="checkmark-circle-outline" size={20} color={palette.gray[300]} />}
        {isAdmin && onDelete && (
          <TouchableOpacity onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); onDelete(); }} style={{ marginLeft: 8 }}>
            <Ionicons name="trash-outline" size={18} color={palette.danger} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.lg, marginHorizontal: spacing.md, marginVertical: 6, overflow: 'hidden' },
  dateCol: { width: 56, alignItems: 'center', padding: 12 },
  dayNum: { fontSize: 24, fontWeight: '800' },
  month: { fontSize: typography.size.xs, fontWeight: typography.weight.bold },
  divider: { width: 1, height: '70%', backgroundColor: 'rgba(0,0,0,0.08)' },
  info: { flex: 1, padding: 12, gap: 4 },
  row: { flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: typography.size.md, fontWeight: typography.weight.semibold },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  meta: { fontSize: 12 },
  actions: { flexDirection: 'row', alignItems: 'center', paddingRight: 12 },
});
