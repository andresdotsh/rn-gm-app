import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState, useRef } from 'react'
import { useColorScheme } from 'react-native'
import { useFonts } from 'expo-font'
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import * as SplashScreen from 'expo-splash-screen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { initializeApp } from 'firebase/app'
import {
  initializeAuth,
  getReactNativePersistence,
  onAuthStateChanged,
} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

import colors from '@/constants/colors'
import firebaseConfig from '@/constants/firebaseConfig'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const authRef = useRef(null)
  const dbRef = useRef(null)

  const [appIsReady, setAppIsReady] = useState(false)

  const colorScheme = useColorScheme() || 'light'

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
    const app = initializeApp(firebaseConfig)
    authRef.current = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    })
    dbRef.current = getFirestore(app)

    authRef.current.useDeviceLanguage()

    const unsubscribe = onAuthStateChanged(authRef.current, (user) => {
      console.log(`🚀🚀🚀 -> user:`, user) // TODO: -> ltd
    })

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (fontsLoaded || fontsLoadError) {
      setAppIsReady(true)
    }
  }, [fontsLoaded, fontsLoadError])

  useEffect(() => {
    if (appIsReady) {
      setTimeout(() => {
        SplashScreen.hideAsync()
      }, 1000)
    }
  }, [appIsReady])

  if (!appIsReady) {
    return null
  }

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <StatusBar style='auto' />
      <Stack
        screenOptions={{
          headerShown: true,
          headerShadowVisible: false,
          headerTransparent: true,
          headerStyle: {
            backgroundColor: isDark
              ? colors.dark.backgroundColor
              : colors.light.backgroundColor,
          },
          headerTitleStyle: {
            color: isDark ? '#fff' : '#000', // TODO: -> change this
          },
          headerTitle: '',
        }}
      />
    </ThemeProvider>
  )
}
