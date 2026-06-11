export const palette = {
  navy: {
    50: '#E8EDF5', 100: '#C5D0E6', 200: '#9FB1D6', 300: '#7892C6',
    400: '#5C7ABB', 500: '#3F63B0', 600: '#2D5099', 700: '#1E3D80',
    800: '#1a3c5e', 900: '#0D1F35', 950: '#060E1A',
  },
  gold: {
    50: '#FDF8EC', 100: '#F9EDCA', 200: '#F4DFA3', 300: '#EDD075',
    400: '#E5BE4C', 500: '#c8a84b', 600: '#A88933', 700: '#856A1E',
    800: '#634E10', 900: '#423407',
  },
  success: '#00C853', successLight: '#E8F5E9',
  danger: '#FF3B30', dangerLight: '#FFEBEE',
  warning: '#FF9500', warningLight: '#FFF3E0',
  info: '#007AFF', infoLight: '#E3F2FD',
  gray: {
    50: '#F9FAFB', 100: '#F3F4F6', 200: '#E5E7EB', 300: '#D1D5DB',
    400: '#9CA3AF', 500: '#6B7280', 600: '#4B5563', 700: '#374151',
    800: '#1F2937', 900: '#111827',
  },
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48, xxxl: 64 };

export const radius = { sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, full: 999 };

export const typography = {
  family: { regular: 'System', medium: 'System', semibold: 'System', bold: 'System' },
  size: { xs: 11, sm: 13, base: 15, md: 17, lg: 20, xl: 24, xxl: 28, xxxl: 34, hero: 44 },
  weight: {
    regular: '400' as const, medium: '500' as const, semibold: '600' as const,
    bold: '700' as const, heavy: '800' as const, black: '900' as const,
  },
  lineHeight: { tight: 1.2, normal: 1.5, loose: 1.8 },
};

export const shadows = {
  none: {},
  sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 },
  md: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 4 },
  lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.14, shadowRadius: 16, elevation: 8 },
  xl: { shadowColor: '#1a3c5e', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.22, shadowRadius: 24, elevation: 12 },
};
