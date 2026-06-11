import React from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette, radius, spacing } from '../../design/tokens';
import { useTheme } from '../../hooks/useTheme';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ visible, onClose, title, children, height = '70%' }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
        <View style={[styles.sheet, { backgroundColor: theme.surface.card, height: height as any, paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.handle} />
          {title && (
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.text.primary }]}>{title}</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={{ color: palette.navy[600], fontSize: 15 }}>Done</Text>
              </TouchableOpacity>
            </View>
          )}
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: radius.xxl, borderTopRightRadius: radius.xxl, paddingHorizontal: spacing.md },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: palette.gray[300], alignSelf: 'center', marginTop: 12, marginBottom: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  title: { fontSize: 18, fontWeight: '600' },
});
