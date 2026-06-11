import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '../../../src/components/layout/ScreenHeader';
import { BallButton } from '../../../src/components/features/BallButton';
import { Card } from '../../../src/components/ui/Card';
import { useAppStore } from '../../../src/store/app';
import { updateLiveScore } from '../../../src/services/scoring';
import { palette, typography, spacing, radius } from '../../../src/design/tokens';
import { useTheme } from '../../../src/hooks/useTheme';
import { formatOvers } from '../../../src/utils/formatters';

const BALL_OPTIONS = ['0', '1', '2', '3', '4', '6', 'W', 'Wd', 'Nb', 'Lb', 'B'];

interface BallEvent { type: string; runs: number; extras: number; wicket: boolean }

export default function LiveScoringScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { matches } = useAppStore();
  const [matchId] = useState(matches[0]?.id || 'demo');
  const [runs, setRuns] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [overs, setOvers] = useState(0);
  const [balls, setBalls] = useState(0);
  const [events, setEvents] = useState<BallEvent[]>([]);
  const [currentOver, setCurrentOver] = useState<string[]>([]);

  const handleBall = (label: string) => {
    let runsScored = 0;
    let extras = 0;
    let wicket = false;
    let legalBall = true;

    switch (label) {
      case 'W': wicket = true; break;
      case 'Wd': extras = 1; runsScored = 1; legalBall = false; break;
      case 'Nb': extras = 1; runsScored = 1; legalBall = false; break;
      case 'Lb': case 'B': legalBall = false; break;
      default: runsScored = parseInt(label) || 0;
    }

    setRuns(r => r + runsScored);
    if (wicket) setWickets(w => w + 1);
    setCurrentOver(over => [...over, label]);

    if (legalBall) {
      const newBalls = (balls + 1) % 6;
      const newOvers = newBalls === 0 ? overs + 1 : overs;
      setBalls(newBalls);
      setOvers(newOvers);
      if (newBalls === 0) setCurrentOver([]);
    }

    const event: BallEvent = { type: label, runs: runsScored, extras, wicket };
    setEvents(ev => [event, ...ev]);

    updateLiveScore(matchId, { runs: runs + runsScored, wickets: wicket ? wickets + 1 : wickets, overs, balls });
  };

  const handleUndo = () => {
    Alert.alert('Undo', 'Undo last ball?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Undo', onPress: () => {
        if (events.length === 0) return;
        const last = events[0];
        setRuns(r => Math.max(0, r - last.runs));
        if (last.wicket) setWickets(w => Math.max(0, w - 1));
        setEvents(ev => ev.slice(1));
        setCurrentOver(over => over.slice(0, -1));
      }},
    ]);
  };

  const ballColor = (b: string) => {
    if (b === 'W') return palette.danger;
    if (['4', '6'].includes(b)) return palette.info;
    if (['Wd', 'Nb'].includes(b)) return palette.warning;
    return palette.gray[400];
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background.secondary }]}>
      <ScreenHeader title="Live Scoring" showBack
        rightAction={{ icon: 'refresh-outline', onPress: handleUndo }} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Scoreboard */}
        <Card style={styles.scoreboard}>
          <Text style={[styles.scoreMain, { color: palette.navy[800] }]}>
            {runs}/{wickets}
          </Text>
          <Text style={[styles.overText, { color: theme.text.secondary }]}>
            Overs: {formatOvers(overs, balls)}
          </Text>
          {/* Current over balls */}
          <View style={styles.overBalls}>
            {currentOver.map((b, i) => (
              <View key={i} style={[styles.overBall, { backgroundColor: ballColor(b) }]}>
                <Text style={styles.overBallText}>{b}</Text>
              </View>
            ))}
            {Array.from({ length: Math.max(0, 6 - currentOver.length) }).map((_, i) => (
              <View key={`empty-${i}`} style={[styles.overBall, { backgroundColor: theme.border.light }]} />
            ))}
          </View>
        </Card>

        {/* Ball Buttons */}
        <View style={styles.ballsSection}>
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Record Ball</Text>
          <View style={styles.ballGrid}>
            {BALL_OPTIONS.map(b => (
              <BallButton key={b} label={b} onPress={handleBall} />
            ))}
          </View>
        </View>

        {/* Recent Events */}
        {events.length > 0 && (
          <View style={styles.eventsSection}>
            <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Recent Balls</Text>
            <Card style={{ padding: spacing.md }}>
              {events.slice(0, 10).map((ev, i) => (
                <View key={i} style={[styles.eventRow, { borderBottomColor: theme.border.light }]}>
                  <View style={[styles.eventBall, { backgroundColor: ballColor(ev.type) }]}>
                    <Text style={styles.eventBallText}>{ev.type}</Text>
                  </View>
                  <Text style={[styles.eventDesc, { color: theme.text.secondary }]}>
                    {ev.wicket ? 'Wicket!' : ev.extras > 0 ? `Extra +${ev.extras}` : `${ev.runs} run${ev.runs !== 1 ? 's' : ''}`}
                  </Text>
                </View>
              ))}
            </Card>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scoreboard: { margin: spacing.md, padding: spacing.lg, alignItems: 'center', gap: spacing.sm },
  scoreMain: { fontSize: 64, fontWeight: '900', letterSpacing: -2 },
  overText: { fontSize: typography.size.lg },
  overBalls: { flexDirection: 'row', gap: 8, marginTop: spacing.sm },
  overBall: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  overBallText: { color: '#fff', fontSize: typography.size.xs, fontWeight: '700' },
  ballsSection: { padding: spacing.md },
  sectionTitle: { fontSize: typography.size.lg, fontWeight: typography.weight.bold, marginBottom: spacing.md },
  ballGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' },
  eventsSection: { padding: spacing.md },
  eventRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 8, borderBottomWidth: 0.5 },
  eventBall: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  eventBallText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  eventDesc: { fontSize: typography.size.base },
});
