import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, typography, spacing, shadows, radius } from '../../design/tokens';
import { useTheme } from '../../hooks/useTheme';

interface Stat { label: string; value: string | number; color?: string }
interface StatsGridProps { stats: Stat[]; columns?: number }

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, columns = 4 }) => {
  const theme = useTheme();
  return (
    <View style={styles.grid}>
      {stats.map((stat, i) => (
        <View key={i} style={[styles.cell, { backgroundColor: theme.surface.card, width: `${100 / columns - 2}%` }, shadows.sm]}>
          <Text style={[styles.value, { color: stat.color || palette.navy[800] }]}>{stat.value}</Text>
          <Text style={[styles.label, { color: theme.text.secondary }]}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: spacing.md },
  cell: { borderRadius: radius.md, padding: 12, alignItems: 'center', gap: 4, flex: 1, minWidth: 70 },
  value: { fontSize: typography.size.xl, fontWeight: typography.weight.bold },
  label: { fontSize: typography.size.xs, fontWeight: typography.weight.medium, textAlign: 'center' },
});
