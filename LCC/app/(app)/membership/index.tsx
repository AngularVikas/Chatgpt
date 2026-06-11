import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { ScreenHeader } from '../../../src/components/layout/ScreenHeader';
import { MembershipTierCard } from '../../../src/components/features/MembershipTierCard';
import { Card } from '../../../src/components/ui/Card';
import { Badge } from '../../../src/components/ui/Badge';
import { useAuthStore } from '../../../src/store/auth';
import { getUserMembership, createMembership, cancelMembership } from '../../../src/services/membership';
import { palette, typography, spacing } from '../../../src/design/tokens';
import { useTheme } from '../../../src/hooks/useTheme';
import { format } from 'date-fns';

export default function MembershipScreen() {
  const theme = useTheme();
  const { user, profile } = useAuthStore();
  const [membership, setMembership] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getUserMembership(user.uid).then(snap => {
      const active = snap.docs.find(d => d.data().status === 'active');
      if (active) setMembership({ id: active.id, ...active.data() });
      setLoading(false);
    });
  }, [user]);

  const handleSubscribe = (tier: string) => {
    Alert.alert(
      'Subscribe',
      `Subscribe to the ${tier} plan? This would initiate a payment flow.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Subscribe', onPress: async () => {
          try {
            await createMembership(user!.uid, tier);
            Alert.alert('Success', 'Membership activated!');
          } catch (err: any) {
            Alert.alert('Error', err.message);
          }
        }},
      ]
    );
  };

  const handleCancel = () => {
    if (!membership) return;
    Alert.alert('Cancel Membership', 'Are you sure you want to cancel?', [
      { text: 'Keep Plan', style: 'cancel' },
      { text: 'Cancel', style: 'destructive', onPress: async () => {
        await cancelMembership(membership.id);
        setMembership(null);
        Alert.alert('Cancelled', 'Your membership has been cancelled.');
      }},
    ]);
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background.secondary }]}>
      <ScreenHeader title="Membership" subtitle="Choose your plan" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {membership && (
          <Card style={styles.currentCard}>
            <View style={styles.currentRow}>
              <View>
                <Text style={[styles.currentLabel, { color: theme.text.secondary }]}>Current Plan</Text>
                <Text style={[styles.currentTier, { color: theme.text.primary }]}>
                  {membership.tier.charAt(0).toUpperCase() + membership.tier.slice(1)}
                </Text>
              </View>
              <Badge label="Active" backgroundColor={palette.success} />
            </View>
            {membership.expiresAt && (
              <Text style={[styles.expiry, { color: theme.text.secondary }]}>
                Renews {format(membership.expiresAt.toDate(), 'MMM d, yyyy')}
              </Text>
            )}
          </Card>
        )}

        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Available Plans</Text>

        {(['basic', 'player', 'premium'] as const).map(tier => (
          <MembershipTierCard
            key={tier}
            tier={tier}
            current={membership?.tier === tier}
            onSubscribe={() => handleSubscribe(tier)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  currentCard: { margin: spacing.md, padding: spacing.md },
  currentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  currentLabel: { fontSize: typography.size.sm },
  currentTier: { fontSize: typography.size.xl, fontWeight: typography.weight.bold, marginTop: 2 },
  expiry: { fontSize: typography.size.sm, marginTop: spacing.xs },
  sectionTitle: { fontSize: typography.size.lg, fontWeight: typography.weight.bold, paddingHorizontal: spacing.md, marginVertical: spacing.sm },
});
