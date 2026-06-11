import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { radius, typography } from '../../design/tokens';

interface BadgeProps {
  label: string;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ label, color = '#fff', backgroundColor = '#1a3c5e', style }) => (
  <View style={[styles.badge, { backgroundColor }, style]}>
    <Text style={[styles.text, { color }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.full },
  text: { fontSize: typography.size.xs, fontWeight: typography.weight.semibold },
});
