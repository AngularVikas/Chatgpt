import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { palette, radius, spacing, typography } from '../../design/tokens';

const OPTIONS = [
  { value: 'available', label: 'Available', emoji: '✅', color: palette.success },
  { value: 'maybe', label: 'Maybe', emoji: '❓', color: palette.warning },
  { value: 'unavailable', label: 'Unavailable', emoji: '❌', color: palette.danger },
];

export const AvailabilityPicker: React.FC<{ value?: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  return (
    <View style={styles.row}>
      {OPTIONS.map(opt => (
        <OptionCard key={opt.value} opt={opt} selected={value === opt.value} onSelect={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onChange(opt.value); }} />
      ))}
    </View>
  );
};

const OptionCard: React.FC<{ opt: any; selected: boolean; onSelect: () => void }> = ({ opt, selected, onSelect }) => {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <TouchableOpacity onPress={() => { scale.value = withSpring(0.92, {}, () => { scale.value = withSpring(1); }); onSelect(); }} style={{ flex: 1 }}>
      <Animated.View style={[styles.card, { borderColor: selected ? opt.color : 'transparent', borderWidth: 2 }, style]}>
        <Text style={{ fontSize: 24 }}>{opt.emoji}</Text>
        <Text style={[styles.label, { color: selected ? opt.color : '#666' }]}>{opt.label}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm, padding: spacing.md },
  card: { borderRadius: radius.lg, padding: spacing.md, alignItems: 'center', gap: 8, backgroundColor: '#F2F2F7' },
  label: { fontSize: typography.size.sm, fontWeight: typography.weight.semibold },
});
