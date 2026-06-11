import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { radius } from '../../design/tokens';
import { useTheme } from '../../hooks/useTheme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({ width = '100%', height = 20, borderRadius = radius.sm, style }) => {
  const theme = useTheme();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.9] });

  return (
    <Animated.View style={[
      { width: width as any, height, borderRadius, backgroundColor: theme.background.tertiary, opacity },
      style,
    ]} />
  );
};

export const PlayerCardSkeleton = () => (
  <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
    <Skeleton width={52} height={52} borderRadius={26} />
    <View style={{ flex: 1, gap: 8 }}>
      <Skeleton width="60%" height={16} />
      <Skeleton width="40%" height={12} />
    </View>
  </View>
);

export const MatchCardSkeleton = () => (
  <View style={{ padding: 16, gap: 8 }}>
    <Skeleton width="70%" height={18} />
    <Skeleton width="50%" height={14} />
    <Skeleton width="40%" height={14} />
  </View>
);
