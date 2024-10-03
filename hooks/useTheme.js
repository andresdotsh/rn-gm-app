import { useColorScheme } from 'react-native'

export default function useTheme() {
  const theme = useColorScheme() || 'light'

  return theme
}
