import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { radius, shadows } from '../../design/tokens';
import { useTheme } from '../../hooks/useTheme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'flat';
}

export const Card: React.FC<CardProps> = ({ children, style, variant = 'default' }) => {
  const theme = useTheme();
  return (
    <View style={[
      styles.card,
      { backgroundColor: theme.surface.card },
      variant === 'elevated' && shadows.md,
      variant === 'default' && shadows.sm,
      style,
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, overflow: 'hidden' },
});
