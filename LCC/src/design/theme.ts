import { palette } from './tokens';

export const lightTheme = {
  background: { primary: '#FFFFFF', secondary: '#F2F2F7', tertiary: '#E5E5EA', brand: palette.navy[800] },
  surface: { card: '#FFFFFF', elevated: '#FFFFFF', overlay: 'rgba(0,0,0,0.45)' },
  text: {
    primary: '#000000', secondary: '#3C3C43CC', tertiary: '#3C3C4399',
    disabled: '#3C3C4342', inverse: '#FFFFFF', brand: palette.navy[800], gold: palette.gold[500],
  },
  border: { light: 'rgba(0,0,0,0.08)', medium: 'rgba(0,0,0,0.16)', strong: 'rgba(0,0,0,0.24)', brand: palette.navy[800] },
  tint: { primary: palette.navy[800], secondary: palette.gold[500], success: palette.success, danger: palette.danger, warning: palette.warning, info: palette.info },
};

export type Theme = typeof lightTheme;

export const darkTheme: Theme = {
  background: { primary: '#000000', secondary: '#1C1C1E', tertiary: '#2C2C2E', brand: palette.navy[900] },
  surface: { card: '#1C1C1E', elevated: '#2C2C2E', overlay: 'rgba(0,0,0,0.7)' },
  text: {
    primary: '#FFFFFF', secondary: 'rgba(235,235,245,0.6)', tertiary: 'rgba(235,235,245,0.3)',
    disabled: 'rgba(235,235,245,0.18)', inverse: '#000000', brand: palette.navy[200], gold: palette.gold[400],
  },
  border: { light: 'rgba(255,255,255,0.08)', medium: 'rgba(255,255,255,0.16)', strong: 'rgba(255,255,255,0.24)', brand: palette.navy[400] },
  tint: { primary: palette.navy[400], secondary: palette.gold[400], success: '#30D158', danger: '#FF453A', warning: '#FF9F0A', info: '#0A84FF' },
};
