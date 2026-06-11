import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { palette, radius, typography } from '../../design/tokens';

const BALL_COLORS: Record<string, string> = {
  '0': palette.navy[700], '1': palette.navy[500], '2': palette.navy[400],
  '3': palette.navy[300], '4': palette.info, '6': '#7C3AED',
  'W': palette.danger, 'Wd': palette.warning, 'Nb': '#FF9500',
  'Lb': palette.gray[500], 'B': palette.gray[400], 'P': '#8B5CF6',
};

export const BallButton: React.FC<{ label: string; onPress: (label: string) => void }> = ({ label, onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.88, duration: 80, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
    ]).start();
    onPress(label);
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View style={[styles.btn, { backgroundColor: BALL_COLORS[label] || palette.navy[500], transform: [{ scale }] }]}>
        <Text style={styles.label}>{label}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  label: { color: '#fff', fontSize: typography.size.sm, fontWeight: typography.weight.bold },
});
