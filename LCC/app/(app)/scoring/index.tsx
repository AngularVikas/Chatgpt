import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '../../../src/components/layout/ScreenHeader';
import { ScorecardTable } from '../../../src/components/features/ScorecardTable';
import { Card } from '../../../src/components/ui/Card';
import { getScorecard, getStandings } from '../../../src/services/cricclub';
import { palette, typography, spacing, radius } from '../../../src/design/tokens';
import { useTheme } from '../../../src/hooks/useTheme';

const TABS = ['Scorecard', 'Standings', 'Live'];

export default function ScoringScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [scorecard, setScorecard] = useState<any>(null);
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [sc, st] = await Promise.all([getScorecard(), getStandings()]);
        setScorecard(sc);
        setStandings(st);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background.secondary }]}>
      <ScreenHeader title="Scores" subtitle="CricClub powered" />

      {/* Tabs */}
      <View style={[styles.tabRow, { backgroundColor: theme.surface.card }]}>
        {TABS.map((tab, i) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === i && styles.activeTab]}
            onPress={() => setActiveTab(i)}
          >
            <Text style={[styles.tabText, { color: activeTab === i ? palette.navy[800] : theme.text.secondary }]}>
              {tab}
            </Text>
            {tab === 'Live' && (
              <View style={styles.liveDot} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={palette.navy[800]} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {activeTab === 0 && scorecard && (
            <>
              <Card style={styles.matchBanner}>
                <Text style={[styles.matchTitle, { color: theme.text.primary }]}>{scorecard.matchTitle}</Text>
                <Text style={[styles.matchResult, { color: palette.success }]}>{scorecard.result}</Text>
                <Text style={[styles.matchMeta, { color: theme.text.secondary }]}>
                  {scorecard.date} · {scorecard.venue}
                </Text>
              </Card>
              {scorecard.innings?.map((inning: any, i: number) => (
                <View key={i}>
                  <View style={styles.inningHeader}>
                    <Text style={[styles.inningTeam, { color: theme.text.primary }]}>{inning.team}</Text>
                    <Text style={[styles.inningScore, { color: palette.navy[800] }]}>
                      {inning.total}/{inning.wickets} ({inning.overs} ov)
                    </Text>
                  </View>
                  <ScorecardTable innings={inning} />
                </View>
              ))}
            </>
          )}

          {activeTab === 1 && (
            <View style={{ padding: spacing.md }}>
              <Card>
                <View style={[styles.standingsHeader, { borderBottomColor: theme.border.light }]}>
                  {['#', 'Team', 'P', 'W', 'L', 'Pts', 'NRR'].map(h => (
                    <Text key={h} style={[styles.standingHeaderCell, { color: theme.text.secondary }, h === 'Team' && { flex: 3 }]}>{h}</Text>
                  ))}
                </View>
                {standings.map((row: any) => (
                  <View key={row.position} style={[styles.standingsRow, { borderBottomColor: theme.border.light }, row.team === 'LCC' && { backgroundColor: palette.navy[50] }]}>
                    <Text style={[styles.standingCell, { color: theme.text.primary, fontWeight: row.position === 1 ? '700' : '400' }]}>{row.position}</Text>
                    <Text style={[styles.standingCell, { color: theme.text.primary, flex: 3, fontWeight: row.team === 'LCC' ? '700' : '400' }]}>{row.team}</Text>
                    <Text style={[styles.standingCell, { color: theme.text.secondary }]}>{row.played}</Text>
                    <Text style={[styles.standingCell, { color: palette.success }]}>{row.won}</Text>
                    <Text style={[styles.standingCell, { color: palette.danger }]}>{row.lost}</Text>
                    <Text style={[styles.standingCell, { color: palette.navy[800], fontWeight: '600' }]}>{row.points}</Text>
                    <Text style={[styles.standingCell, { color: parseFloat(row.nrr) >= 0 ? palette.success : palette.danger }]}>{row.nrr}</Text>
                  </View>
                ))}
              </Card>
            </View>
          )}

          {activeTab === 2 && (
            <View style={styles.liveContainer}>
              <Text style={styles.liveEmoji}>🏏</Text>
              <Text style={[styles.liveTitle, { color: theme.text.primary }]}>No Live Matches</Text>
              <Text style={[styles.liveSubtitle, { color: theme.text.secondary }]}>
                Live scoring will appear here during matches
              </Text>
              <TouchableOpacity
                style={[styles.liveBtn, { backgroundColor: palette.navy[800] }]}
                onPress={() => router.push('/(app)/scoring/live')}
              >
                <Text style={styles.liveBtnText}>Start Live Scoring</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  tabRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.08)' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 4 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: palette.navy[800] },
  tabText: { fontSize: typography.size.base, fontWeight: '500' },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: palette.danger },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  matchBanner: { margin: spacing.md, padding: spacing.md, gap: 4 },
  matchTitle: { fontSize: typography.size.lg, fontWeight: typography.weight.bold },
  matchResult: { fontSize: typography.size.base, fontWeight: '600' },
  matchMeta: { fontSize: typography.size.sm },
  inningHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: 8 },
  inningTeam: { fontSize: typography.size.md, fontWeight: '600' },
  inningScore: { fontSize: typography.size.lg, fontWeight: '800' },
  standingsHeader: { flexDirection: 'row', padding: 10, borderBottomWidth: 1 },
  standingHeaderCell: { flex: 1, fontSize: 11, fontWeight: '600', textAlign: 'center' },
  standingsRow: { flexDirection: 'row', padding: 10, borderBottomWidth: 0.5 },
  standingCell: { flex: 1, fontSize: 13, textAlign: 'center' },
  liveContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl, marginTop: 60 },
  liveEmoji: { fontSize: 64, marginBottom: spacing.md },
  liveTitle: { fontSize: typography.size.xl, fontWeight: typography.weight.bold },
  liveSubtitle: { fontSize: typography.size.base, textAlign: 'center', marginTop: spacing.sm, lineHeight: 22 },
  liveBtn: { marginTop: spacing.lg, paddingHorizontal: spacing.xl, paddingVertical: 14, borderRadius: radius.md },
  liveBtnText: { color: '#fff', fontSize: typography.size.base, fontWeight: '600' },
});
