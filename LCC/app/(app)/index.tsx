import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { useAuthStore } from '../../src/store/auth';
import { useAppStore } from '../../src/store/app';
import { subscribeSchedule } from '../../src/services/schedule';
import { MatchCard } from '../../src/components/features/MatchCard';
import { palette, typography, spacing, radius, shadows } from '../../src/design/tokens';
import { useTheme } from '../../src/hooks/useTheme';

const QUICK_ACTIONS = [
  { icon: 'calendar-outline' as const, label: 'Schedule', route: '/(app)/schedule/index' },
  { icon: 'people-outline' as const, label: 'Players', route: '/(app)/players/index' },
  { icon: 'shield-outline' as const, label: 'Teams', route: '/(app)/teams/index' },
  { icon: 'stats-chart-outline' as const, label: 'Scores', route: '/(app)/scoring/index' },
  { icon: 'checkmark-circle-outline' as const, label: 'Availability', route: '/(app)/availability/index' },
  { icon: 'card-outline' as const, label: 'Membership', route: '/(app)/membership/index' },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const { profile } = useAuthStore();
  const { matches, setMatches } = useAppStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsub = subscribeSchedule(setMatches);
    return unsub;
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const upcoming = matches
    .filter(m => {
      const d = m.matchDate?.toDate ? m.matchDate.toDate() : new Date(m.matchDate);
      return d >= new Date();
    })
    .slice(0, 3);

  const nextMatch = upcoming[0];

  return (
    <View style={[styles.screen, { backgroundColor: theme.background.secondary }]}>
      {/* Gradient Header */}
      <LinearGradient
        colors={[palette.navy[900], palette.navy[700]]}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.name}>{profile?.displayName || 'Cricketer'} 👋</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(app)/profile/index')} style={styles.avatarBtn}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{(profile?.displayName || 'U')[0].toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Next Match Banner */}
        {nextMatch && (
          <TouchableOpacity
            style={styles.nextMatchBanner}
            onPress={() => router.push(`/(app)/schedule/${nextMatch.id}`)}
            activeOpacity={0.85}
          >
            <View style={styles.nextMatchLeft}>
              <Text style={styles.nextMatchLabel}>NEXT MATCH</Text>
              <Text style={styles.nextMatchTitle} numberOfLines={1}>
                {nextMatch.title || `LCC vs ${nextMatch.opponent}`}
              </Text>
              <Text style={styles.nextMatchMeta}>
                {nextMatch.matchDate?.toDate
                  ? format(nextMatch.matchDate.toDate(), 'EEE, MMM d · h:mm a')
                  : 'Date TBD'
                }
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={palette.gold[400]} />
          </TouchableOpacity>
        )}
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={palette.navy[800]} />}
      >
        {/* Stats Row */}
        <View style={styles.statsRow}>
          {[
            { label: 'Matches', value: matches.length },
            { label: 'Upcoming', value: upcoming.length },
            { label: 'Players', value: '—' },
          ].map((s, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: theme.surface.card }, shadows.sm]}>
              <Text style={[styles.statValue, { color: palette.navy[800] }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: theme.text.secondary }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {QUICK_ACTIONS.map((action, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.actionCard, { backgroundColor: theme.surface.card }, shadows.sm]}
                onPress={() => router.push(action.route as any)}
                activeOpacity={0.75}
              >
                <View style={[styles.actionIcon, { backgroundColor: palette.navy[50] }]}>
                  <Ionicons name={action.icon} size={22} color={palette.navy[800]} />
                </View>
                <Text style={[styles.actionLabel, { color: theme.text.primary }]}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Upcoming Matches */}
        {upcoming.length > 0 && (
          <View style={[styles.section, { paddingHorizontal: 0 }]}>
            <View style={[styles.sectionHeader, { paddingHorizontal: spacing.md }]}>
              <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Upcoming Matches</Text>
              <TouchableOpacity onPress={() => router.push('/(app)/schedule/index')}>
                <Text style={{ color: palette.navy[600], fontSize: typography.size.sm }}>See all</Text>
              </TouchableOpacity>
            </View>
            {upcoming.map(match => (
              <MatchCard
                key={match.id}
                match={match}
                onPress={() => router.push(`/(app)/schedule/${match.id}`)}
              />
            ))}
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: spacing.md, paddingBottom: spacing.lg },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md },
  greeting: { color: 'rgba(255,255,255,0.65)', fontSize: typography.size.base },
  name: { color: '#fff', fontSize: typography.size.xl, fontWeight: typography.weight.bold },
  avatarBtn: {},
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: palette.gold[500], justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: typography.size.lg, fontWeight: typography.weight.bold },
  nextMatchBanner: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  nextMatchLeft: { flex: 1 },
  nextMatchLabel: { color: palette.gold[400], fontSize: typography.size.xs, fontWeight: typography.weight.bold, letterSpacing: 1 },
  nextMatchTitle: { color: '#fff', fontSize: typography.size.md, fontWeight: typography.weight.semibold, marginTop: 2 },
  nextMatchMeta: { color: 'rgba(255,255,255,0.6)', fontSize: typography.size.sm, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: spacing.sm, padding: spacing.md },
  statCard: { flex: 1, borderRadius: radius.lg, padding: spacing.md, alignItems: 'center' },
  statValue: { fontSize: typography.size.xxl, fontWeight: typography.weight.black },
  statLabel: { fontSize: typography.size.xs, fontWeight: typography.weight.medium, marginTop: 2 },
  section: { padding: spacing.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  sectionTitle: { fontSize: typography.size.lg, fontWeight: typography.weight.bold },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  actionCard: { width: '30%', borderRadius: radius.lg, padding: spacing.md, alignItems: 'center', gap: 8, flexGrow: 1 },
  actionIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  actionLabel: { fontSize: typography.size.sm, fontWeight: typography.weight.medium, textAlign: 'center' },
});
