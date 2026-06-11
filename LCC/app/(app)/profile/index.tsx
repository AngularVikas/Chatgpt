import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '../../../src/components/ui/Avatar';
import { Badge } from '../../../src/components/ui/Badge';
import { Card } from '../../../src/components/ui/Card';
import { useAuthStore } from '../../../src/store/auth';
import { signOut } from '../../../src/services/auth';
import { palette, typography, spacing, radius } from '../../../src/design/tokens';
import { useTheme } from '../../../src/hooks/useTheme';
import { MEMBERSHIP_TIERS } from '../../../src/utils/constants';

interface MenuSection {
  title: string;
  items: MenuItemProps[];
}

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route?: string;
  onPress?: () => void;
  badge?: string;
  color?: string;
}

function MenuItem({ icon, label, route, onPress, badge, color }: MenuItemProps) {
  const theme = useTheme();
  const router = useRouter();
  const handlePress = () => {
    if (onPress) onPress();
    else if (route) router.push(route as any);
  };
  return (
    <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.border.light }]} onPress={handlePress} activeOpacity={0.7}>
      <View style={[styles.menuIcon, { backgroundColor: color ? `${color}20` : palette.navy[50] }]}>
        <Ionicons name={icon} size={18} color={color || palette.navy[700]} />
      </View>
      <Text style={[styles.menuLabel, { color: color || theme.text.primary }]}>{label}</Text>
      {badge && <Badge label={badge} backgroundColor={palette.gold[500]} />}
      {!badge && <Ionicons name="chevron-forward" size={16} color={theme.text.tertiary} />}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();
  const { profile, user, isAdmin } = useAuthStore();

  const membershipTier = profile?.membershipStatus !== 'none' ? profile?.membershipStatus : null;
  const tierConfig = membershipTier ? MEMBERSHIP_TIERS[membershipTier as keyof typeof MEMBERSHIP_TIERS] : null;

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => {
        await signOut();
      }},
    ]);
  };

  const MENU_SECTIONS: MenuSection[] = [
    {
      title: 'Account',
      items: [
        { icon: 'person-outline', label: 'Edit Profile', route: '/(app)/profile/edit' },
        { icon: 'card-outline', label: 'Membership', route: '/(app)/membership/index', badge: tierConfig?.name },
        { icon: 'notifications-outline', label: 'Notifications', route: '/(app)/profile/index' },
      ],
    },
    {
      title: 'Club',
      items: [
        { icon: 'shield-outline', label: 'Teams', route: '/(app)/teams/index' },
        { icon: 'checkmark-circle-outline', label: 'Availability', route: '/(app)/availability/index' },
        { icon: 'stats-chart-outline', label: 'My Stats', route: '/(app)/players/index' },
        { icon: 'videocam-outline', label: 'Recording', route: '/(app)/recording/index' },
      ],
    },
    ...(isAdmin ? [{
      title: 'Admin',
      items: [
        { icon: 'people-outline' as const, label: 'Manage Players', route: '/(app)/players/index' },
        { icon: 'calendar-outline' as const, label: 'Manage Schedule', route: '/(app)/schedule/index' },
      ],
    }] : []),
    {
      title: '',
      items: [
        { icon: 'log-out-outline', label: 'Sign Out', onPress: handleSignOut, color: palette.danger },
      ],
    },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: theme.background.secondary }]}>
      {/* Gradient Header */}
      <LinearGradient
        colors={[palette.navy[900], palette.navy[700]]}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <Avatar
          name={profile?.displayName || user?.email || 'U'}
          photoURL={profile?.photoURL}
          size={80}
          color={palette.gold[500]}
        />
        <Text style={styles.name}>{profile?.displayName || 'Member'}</Text>
        <Text style={styles.email}>{profile?.email || user?.email}</Text>
        <View style={styles.badgeRow}>
          {tierConfig && <Badge label={tierConfig.name} backgroundColor={tierConfig.color} />}
          {isAdmin && <Badge label="Admin" backgroundColor={palette.gold[600]} />}
          {profile?.jerseyNumber && <Badge label={`#${profile.jerseyNumber}`} backgroundColor={palette.navy[600]} />}
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {MENU_SECTIONS.map((section, si) => (
          <View key={si} style={styles.section}>
            {section.title ? (
              <Text style={[styles.sectionTitle, { color: theme.text.secondary }]}>{section.title.toUpperCase()}</Text>
            ) : null}
            <Card style={styles.card}>
              {section.items.map((item, ii) => (
                <MenuItem key={ii} {...item} />
              ))}
            </Card>
          </View>
        ))}

        <Text style={[styles.version, { color: theme.text.tertiary }]}>LCC App v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl, alignItems: 'center', gap: spacing.sm },
  name: { color: '#fff', fontSize: typography.size.xl, fontWeight: typography.weight.bold, marginTop: 4 },
  email: { color: 'rgba(255,255,255,0.6)', fontSize: typography.size.sm },
  badgeRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  section: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  sectionTitle: { fontSize: typography.size.xs, fontWeight: typography.weight.bold, letterSpacing: 0.8, marginBottom: spacing.sm },
  card: { overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: 12, borderBottomWidth: 0.5 },
  menuIcon: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  menuLabel: { flex: 1, fontSize: typography.size.base },
  version: { textAlign: 'center', fontSize: typography.size.xs, marginTop: spacing.xl },
});
