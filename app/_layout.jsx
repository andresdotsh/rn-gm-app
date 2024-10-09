import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState, useRef } from 'react'
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

import useTheme from '@/hooks/useTheme'
import colors from '@/constants/colors'
import firebaseConfig from '@/constants/firebaseConfig'
import { useCurrentUserStore } from '@/hooks/useStore'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const authRef = useRef(null)

  const [appIsReady, setAppIsReady] = useState(false)
  const [userStatusChanged, setUserStatusChanged] = useState(false)
  const [userHasEmailVerified, setUserHasEmailVerified] = useState(false)

  const theme = useTheme()
  const isDark = theme === 'dark'

  const userIsLoggedIn = useCurrentUserStore((state) => state.isLoggedIn)
  const setUserIsLoggedIn = useCurrentUserStore((state) => state.setIsLoggedIn)

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

    authRef.current.useDeviceLanguage()

    const unsubscribe = onAuthStateChanged(authRef.current, (user) => {
      setUserStatusChanged(true)

      if (user) {
        setUserHasEmailVerified(user.emailVerified)
      } else {
        setUserIsLoggedIn(false)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [setUserIsLoggedIn])

  useEffect(() => {
    // this only must run once at the beginning
    if (!appIsReady && userStatusChanged && (fontsLoaded || fontsLoadError)) {
      if (userHasEmailVerified) {
        setUserIsLoggedIn(true)
      }

      setAppIsReady(true)
    }
  }, [
    appIsReady,
    fontsLoadError,
    fontsLoaded,
    setUserIsLoggedIn,
    userHasEmailVerified,
    userStatusChanged,
  ])

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
          headerShown: userIsLoggedIn,
          headerShadowVisible: false,
          headerTransparent: false,
          headerStyle: {
            backgroundColor: isDark
              ? colors.dark.mainBackgroundColor
              : colors.light.mainBackgroundColor,
          },
          headerTitleStyle: {
            color: isDark ? colors.dark.color : colors.light.color,
            fontFamily: 'Ubuntu700',
          },
          headerTintColor: isDark ? colors.dark.color : colors.light.color,
          headerTitle: '',
        }}
      />
    </ThemeProvider>
  )
}
