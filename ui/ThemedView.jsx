import { View } from 'react-native'

import useThemeColor from '@/hooks/useThemeColor'

export default function ThemedView({
  children,
  style,
  lightColor,
  darkColor,
  ...props
}) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'backgroundColor',
  )

  return (
    <View style={[{ backgroundColor }, style]} {...props}>
      {children}
    </View>
  )
}
