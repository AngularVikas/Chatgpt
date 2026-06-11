import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette, typography, spacing, shadows, radius } from '../../design/tokens';
import { useTheme } from '../../hooks/useTheme';
import { formatCurrency } from '../../utils/formatters';
import * as Haptics from 'expo-haptics';

const TIER_CONFIG = {
  basic: { name: 'Basic', price: 50, color: palette.gray[600], icon: 'person-outline' as const, features: ['Access to app', 'View schedule', 'View scores'] },
  player: { name: 'Playing Member', price: 150, color: palette.navy[800], icon: 'baseball-outline' as const, features: ['All Basic features', 'Mark availability', 'Team selection', 'CricClub integration'], popular: true },
  premium: { name: 'Premium', price: 300, color: palette.gold[600], icon: 'star-outline' as const, features: ['All Player features', 'Match recording', 'Priority notifications', 'Advanced stats', 'Admin tools'] },
};

export const MembershipTierCard: React.FC<{ tier: keyof typeof TIER_CONFIG; onSubscribe: () => void; current?: boolean }> = ({ tier, onSubscribe, current }) => {
  const theme = useTheme();
  const config = TIER_CONFIG[tier];

  return (
    <View style={[styles.card, { backgroundColor: theme.surface.card }, config.popular && styles.featured, shadows.md]}>
      {config.popular && <View style={styles.popularBadge}><Text style={styles.popularText}>MOST POPULAR</Text></View>}
      <Ionicons name={config.icon} size={32} color={config.color} />
      <Text style={[styles.tierName, { color: theme.text.primary }]}>{config.name}</Text>
      <Text style={[styles.price, { color: config.color }]}>{formatCurrency(config.price)}<Text style={styles.period}>/yr</Text></Text>
      <View style={styles.features}>
        {config.features.map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={16} color={palette.success} />
            <Text style={[styles.feature, { color: theme.text.secondary }]}>{f}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity
        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onSubscribe(); }}
        style={[styles.btn, { backgroundColor: config.color }]}
        activeOpacity={0.8}
      >
        <Text style={styles.btnText}>{current ? 'Current Plan' : 'Subscribe'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: radius.xl, padding: spacing.lg, margin: spacing.sm, alignItems: 'center', gap: spacing.sm },
  featured: { borderWidth: 2, borderColor: palette.navy[800] },
  popularBadge: { backgroundColor: palette.gold[500], paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.full },
  popularText: { color: '#fff', fontSize: typography.size.xs, fontWeight: typography.weight.bold },
  tierName: { fontSize: typography.size.lg, fontWeight: typography.weight.bold },
  price: { fontSize: 32, fontWeight: typography.weight.black },
  period: { fontSize: typography.size.sm, fontWeight: typography.weight.regular, color: palette.gray[500] },
  features: { width: '100%', gap: 6 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  feature: { fontSize: typography.size.sm },
  btn: { width: '100%', height: 46, borderRadius: radius.md, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: typography.size.base, fontWeight: typography.weight.semibold },
});
