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
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigationState } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { auth } from '@/data/firebase'
import colors from '@/constants/colors'
import { EVENT_REFRESH_USER_DATA } from '@/constants/constants'
import eventEmitter from '@/events/eventEmitter'
import useTheme from '@/hooks/useTheme'
import { useLoggedUserStore } from '@/hooks/useStore'
import getUserByUid from '@/data/getUserByUid'

SplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient()

export default function RootLayout() {
  const userEmailVerifiedRef = useRef(false)

  const [appIsReady, setAppIsReady] = useState(false)
  const [userStatusChanged, setUserStatusChanged] = useState(false)
  const [authUid, setAuthUid] = useState(null)

  const theme = useTheme()
  const isDark = theme === 'dark'

  const isUserLoggedIn = useLoggedUserStore((s) => s.isUserLoggedIn)
  const setIsUserLoggedIn = useLoggedUserStore((s) => s.setIsUserLoggedIn)
  const setLoggedUserUid = useLoggedUserStore((s) => s.setLoggedUserUid)
  const setLoggedUserData = useLoggedUserStore((s) => s.setLoggedUserData)
  const actionLogout = useLoggedUserStore((s) => s.actionLogout)

  const navState = useNavigationState((state) => state)

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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserStatusChanged(true)

      if (user) {
        userEmailVerifiedRef.current = user.emailVerified

        if (user.emailVerified) {
          setAuthUid(user.uid)
        }
      } else {
        actionLogout()
      }
    })

    return () => {
      unsubscribe()
    }
  }, [actionLogout])

  useEffect(() => {
    function refreshUserData(uidParam) {
      if (uidParam) {
        console.info(`🦋🦋🦋🦋🦋🦋🦋🦋🦋🦋`)

        setLoggedUserUid(uidParam)

        getUserByUid(uidParam)
          .then((newData) => {
            if (newData) {
              setLoggedUserData(newData)
            }
          })
          .catch((error) => {
            console.error(error)
          })
      }
    }

    eventEmitter.on(EVENT_REFRESH_USER_DATA, refreshUserData)

    if (authUid) {
      refreshUserData(authUid)
    }

    return () => {
      eventEmitter.off(EVENT_REFRESH_USER_DATA, refreshUserData)
    }
  }, [authUid, setLoggedUserData, setLoggedUserUid])

  useEffect(() => {
    // this only must run once at the beginning
    if (!appIsReady && userStatusChanged && (fontsLoaded || fontsLoadError)) {
      if (userEmailVerifiedRef.current) {
        setIsUserLoggedIn(true)
      }

      setAppIsReady(true)
    }
  }, [
    appIsReady,
    fontsLoadError,
    fontsLoaded,
    setIsUserLoggedIn,
    userStatusChanged,
  ])

  useEffect(() => {
    if (appIsReady) {
      const splashTime = __DEV__ ? 0 : 1000

      setTimeout(() => {
        SplashScreen.hideAsync()
      }, splashTime)
    }
  }, [appIsReady])

  if (!appIsReady) {
    return null
  }

  const activeRouteState = navState.routes?.[navState.index]?.state
  const activeTabName =
    activeRouteState?.routes?.[activeRouteState?.index]?.name

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style='light' />
        <Stack
          screenOptions={({ route }) => {
            const options = {
              headerShadowVisible: false,
              headerTransparent: false,
              headerStyle: {
                backgroundColor: isDark
                  ? colors.dark.mainBg1
                  : colors.light.mainBg1,
              },
              headerTitleStyle: {
                color: isDark ? colors.dark.color1 : colors.light.color1,
                fontFamily: 'Ubuntu700',
              },
              headerTintColor: isDark
                ? colors.dark.color1
                : colors.light.color1,
              headerShown: isUserLoggedIn,
              headerTitle: '',
            }

            if (route.name === '(tabs)') {
              if (activeTabName === 'index') {
                options.headerTitle = ''
              }
              if (activeTabName === 'about') {
                options.headerTitle = 'About'
              }
              if (activeTabName === 'settings') {
                options.headerTitle = 'Ajustes'
                options.headerStyle.backgroundColor = isDark
                  ? colors.dark.mainBg2
                  : colors.light.mainBg2
              }
            }

            return options
          }}
        />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
