import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';
import { palette, typography, spacing } from '../../design/tokens';
import { useTheme } from '../../hooks/useTheme';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, subtitle, actionLabel, onAction }) => {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={72} color={palette.gray[300]} />
      <Text style={[styles.title, { color: theme.text.primary }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: theme.text.secondary }]}>{subtitle}</Text>
      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} style={styles.button} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xxl },
  title: { fontSize: typography.size.xl, fontWeight: typography.weight.bold, marginTop: spacing.md, textAlign: 'center' },
  subtitle: { fontSize: typography.size.base, marginTop: spacing.sm, textAlign: 'center', lineHeight: 22 },
  button: { marginTop: spacing.lg, paddingHorizontal: spacing.xl },
});
