import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { palette, radius, typography } from '../../design/tokens';
import { getInitials } from '../../utils/formatters';

interface AvatarProps {
  name: string;
  photoURL?: string;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({ name, photoURL, size = 48, color = palette.gold[500], style }) => {
  const fontSize = size * 0.35;
  if (photoURL) {
    return (
      <Image
        source={{ uri: photoURL }}
        style={[{ width: size, height: size, borderRadius: size / 2 }, style]}
        contentFit="cover"
      />
    );
  }
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }, style]}>
      <Text style={[styles.initials, { fontSize }]}>{getInitials(name)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: { justifyContent: 'center', alignItems: 'center' },
  initials: { color: '#fff', fontWeight: typography.weight.bold },
});
