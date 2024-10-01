import { Text } from 'react-native'

import useThemeColor from '@/hooks/useThemeColor'

export default function ThemedText({
  children,
  style,
  lightColor,
  darkColor,
  ...props
}) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'color')

  return (
    <Text style={[{ color }, style]} {...props}>
      {children}
    </Text>
  )
}
