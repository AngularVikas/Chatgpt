import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, typography, spacing } from '../../design/tokens';
import { useTheme } from '../../hooks/useTheme';

export const ScorecardTable: React.FC<{ innings: any }> = ({ innings }) => {
  const theme = useTheme();
  if (!innings) return null;

  return (
    <View style={{ paddingHorizontal: spacing.md }}>
      <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Batting</Text>
      <View style={[styles.table, { backgroundColor: theme.surface.card }]}>
        <View style={[styles.tableHeader, { borderBottomColor: theme.border.light }]}>
          {['Batter', 'R', 'B', '4s', '6s', 'SR'].map(h => (
            <Text key={h} style={[styles.headerCell, { color: theme.text.secondary }, h === 'Batter' && styles.nameCell]}>{h}</Text>
          ))}
        </View>
        {innings.batting?.map((b: any, i: number) => (
          <View key={i} style={[styles.tableRow, { borderBottomColor: theme.border.light }]}>
            <View style={styles.nameCell}>
              <Text style={[styles.batterName, { color: theme.text.primary }]}>{b.name}</Text>
              <Text style={[styles.dismissal, { color: theme.text.tertiary }]}>{b.dismissal}</Text>
            </View>
            {[b.runs, b.balls, b.fours, b.sixes, b.sr].map((v, j) => (
              <Text key={j} style={[styles.cell, { color: j === 0 ? theme.text.primary : theme.text.secondary }, j === 0 && { fontWeight: '600' }]}>{v}</Text>
            ))}
          </View>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text.primary, marginTop: 16 }]}>Bowling</Text>
      <View style={[styles.table, { backgroundColor: theme.surface.card }]}>
        <View style={[styles.tableHeader, { borderBottomColor: theme.border.light }]}>
          {['Bowler', 'O', 'M', 'R', 'W', 'Econ'].map(h => (
            <Text key={h} style={[styles.headerCell, { color: theme.text.secondary }, h === 'Bowler' && styles.nameCell]}>{h}</Text>
          ))}
        </View>
        {innings.bowling?.map((b: any, i: number) => (
          <View key={i} style={[styles.tableRow, { borderBottomColor: theme.border.light }]}>
            <Text style={[styles.batterName, styles.nameCell, { color: theme.text.primary }]}>{b.name}</Text>
            {[b.overs, b.maidens, b.runs, b.wickets, b.economy].map((v, j) => (
              <Text key={j} style={[styles.cell, { color: j === 3 && v > 0 ? palette.success : theme.text.secondary }]}>{v}</Text>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: { fontSize: typography.size.md, fontWeight: typography.weight.semibold, marginBottom: 8 },
  table: { borderRadius: 12, overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', padding: 10, borderBottomWidth: 1 },
  tableRow: { flexDirection: 'row', padding: 10, borderBottomWidth: 0.5, alignItems: 'flex-start' },
  headerCell: { flex: 1, fontSize: 11, fontWeight: '600', textAlign: 'center' },
  cell: { flex: 1, fontSize: 13, textAlign: 'center' },
  nameCell: { flex: 3 },
  batterName: { fontSize: 13, fontWeight: '500' },
  dismissal: { fontSize: 11, marginTop: 1 },
});
