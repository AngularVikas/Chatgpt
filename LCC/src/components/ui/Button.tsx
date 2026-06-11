import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { palette, radius, shadows, typography } from '../../design/tokens';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title, onPress, variant = 'primary', loading, disabled, style, textStyle, fullWidth,
}) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={handlePress} disabled={disabled || loading}
        activeOpacity={0.8} style={[styles.base, fullWidth && styles.full, style]}
      >
        <LinearGradient
          colors={[palette.navy[700], palette.navy[900]]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={[styles.primaryText, textStyle]}>{title}</Text>
          }
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress} disabled={disabled || loading} activeOpacity={0.75}
      style={[
        styles.base, styles[variant],
        fullWidth && styles.full,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading
        ? <ActivityIndicator color={variant === 'danger' ? '#fff' : palette.navy[800]} />
        : <Text style={[styles[`${variant}Text`] as TextStyle, textStyle]}>{title}</Text>
      }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: { height: 54, borderRadius: radius.md, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', ...shadows.md },
  gradient: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  full: { width: '100%' },
  disabled: { opacity: 0.5 },
  secondary: { borderWidth: 1.5, borderColor: palette.navy[800], backgroundColor: 'transparent' },
  danger: { backgroundColor: palette.danger, ...shadows.sm },
  ghost: { backgroundColor: 'transparent' },
  primaryText: { color: '#fff', fontSize: typography.size.md, fontWeight: typography.weight.semibold },
  secondaryText: { color: palette.navy[800], fontSize: typography.size.md, fontWeight: typography.weight.semibold },
  dangerText: { color: '#fff', fontSize: typography.size.md, fontWeight: typography.weight.semibold },
  ghostText: { color: palette.navy[800], fontSize: typography.size.md, fontWeight: typography.weight.semibold },
});
