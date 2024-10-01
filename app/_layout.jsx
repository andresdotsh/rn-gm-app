import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { useFonts } from 'expo-font'
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import * as SplashScreen from 'expo-splash-screen'

import useColorScheme from '@/hooks/useColorScheme'
import colors from '@/constants/colors'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  const [fontsLoaded, fontsLoadError] = useFonts({
    Ubuntu400: require('../assets/fonts/UbuntuSansMono/Regular.ttf'),
    Ubuntu400Italic: require('../assets/fonts/UbuntuSansMono/RegularItalic.ttf'),
    Ubuntu500: require('../assets/fonts/UbuntuSansMono/Medium.ttf'),
    Ubuntu500Italic: require('../assets/fonts/UbuntuSansMono/MediumItalic.ttf'),
    Ubuntu600: require('../assets/fonts/UbuntuSansMono/SemiBold.ttf'),
    Ubuntu600Italic: require('../assets/fonts/UbuntuSansMono/SemiBoldItalic.ttf'),
    Ubuntu700: require('../assets/fonts/UbuntuSansMono/Bold.ttf'),
    Ubuntu700Italic: require('../assets/fonts/UbuntuSansMono/BoldItalic.ttf'),
  })

  useEffect(() => {
    if (fontsLoaded || fontsLoadError) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, fontsLoadError])

  if (!fontsLoaded && !fontsLoadError) {
    return null
  }

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <StatusBar style='auto' />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: isDark
              ? colors.dark.backgroundColor
              : colors.light.backgroundColor,
          },
          headerTitleStyle: {
            color: '#000',
          },
          headerTitle: '',
        }}
      />
    </ThemeProvider>
  )
}
