import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette, typography } from '../../design/tokens';

const TAB_ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  index: { active: 'home', inactive: 'home-outline' },
  schedule: { active: 'calendar', inactive: 'calendar-outline' },
  players: { active: 'people', inactive: 'people-outline' },
  scoring: { active: 'stats-chart', inactive: 'stats-chart-outline' },
  profile: { active: 'person', inactive: 'person-outline' },
};

export const TabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <BlurView intensity={80} tint="light" style={[styles.container, { paddingBottom: insets.bottom }]}>
      {state.routes.map((route, i) => {
        const focused = state.index === i;
        const icons = TAB_ICONS[route.name] || { active: 'ellipse', inactive: 'ellipse-outline' };
        const label = descriptors[route.key].options.tabBarLabel as string || route.name;

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tab}
            onPress={() => {
              Haptics.selectionAsync();
              if (!focused) navigation.navigate(route.name);
            }}
            activeOpacity={0.7}
          >
            <Ionicons
              name={focused ? icons.active : icons.inactive}
              size={24}
              color={focused ? palette.navy[800] : palette.gray[400]}
            />
            <Text style={[styles.label, { color: focused ? palette.navy[800] : palette.gray[400] }]}>
              {String(label).charAt(0).toUpperCase() + String(label).slice(1)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', borderTopWidth: 0.5, borderTopColor: 'rgba(0,0,0,0.1)' },
  tab: { flex: 1, alignItems: 'center', paddingTop: 8, paddingBottom: 4, gap: 3 },
  label: { fontSize: typography.size.xs, fontWeight: typography.weight.medium },
});
