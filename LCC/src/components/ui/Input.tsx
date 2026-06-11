import React, { useState, useRef } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, ViewStyle, Animated } from 'react-native';
import { palette, radius, typography, shadows } from '../../design/tokens';
import { useTheme } from '../../hooks/useTheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({ label, error, containerStyle, ...props }) => {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setFocused(true);
    Animated.timing(borderAnim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
    props.onFocus?.({} as any);
  };

  const handleBlur = () => {
    setFocused(false);
    Animated.timing(borderAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
    props.onBlur?.({} as any);
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.border.light, palette.navy[600]],
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, { color: theme.text.secondary }]}>{label}</Text>}
      <Animated.View style={[styles.inputWrapper, { borderColor, backgroundColor: theme.background.secondary }, focused && shadows.sm]}>
        <TextInput
          {...props}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[styles.input, { color: theme.text.primary }]}
          placeholderTextColor={theme.text.tertiary}
        />
      </Animated.View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: typography.size.sm, fontWeight: typography.weight.medium, marginBottom: 6 },
  inputWrapper: { height: 52, borderRadius: radius.md, borderWidth: 1, paddingHorizontal: 16, justifyContent: 'center' },
  input: { fontSize: typography.size.md, flex: 1 },
  error: { color: palette.danger, fontSize: typography.size.sm, marginTop: 4 },
});
