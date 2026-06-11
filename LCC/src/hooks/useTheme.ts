import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '../design/theme';

export const useTheme = () => {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkTheme : lightTheme;
};
