import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState, useRef } from 'react'
import { pick } from 'ramda'
import { useFonts } from 'expo-font'
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import * as SplashScreen from 'expo-splash-screen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import {
  initializeAuth,
  getReactNativePersistence,
  onAuthStateChanged,
} from 'firebase/auth'
import { useNavigationState } from '@react-navigation/native'

import firebaseConfig from '@/constants/firebaseConfig'
import colors from '@/constants/colors'
import { EVENT_REFRESH_AVATAR_DATA } from '@/constants/constants'
import eventEmitter from '@/events/eventEmitter'
import useTheme from '@/hooks/useTheme'
import { useCurrentUserStore } from '@/hooks/useStore'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const authRef = useRef(null)
  const dbRef = useRef(null)
  const userEmailVerifiedRef = useRef(false)

  const [appIsReady, setAppIsReady] = useState(false)
  const [userStatusChanged, setUserStatusChanged] = useState(false)
  const [authUid, setAuthUid] = useState(null)

  const theme = useTheme()
  const isDark = theme === 'dark'

  const userIsLoggedIn = useCurrentUserStore((state) => state.isLoggedIn)
  const setUserIsLoggedIn = useCurrentUserStore((state) => state.setIsLoggedIn)
  const setUserUid = useCurrentUserStore((state) => state.setUid)
  const setUserAvatarData = useCurrentUserStore((state) => state.setAvatarData)
  const actionLogOut = useCurrentUserStore((state) => state.actionLogOut)

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
    const app = initializeApp(firebaseConfig)
    authRef.current = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    })
    dbRef.current = getFirestore(app)
    authRef.current.useDeviceLanguage()

    const unsubscribe = onAuthStateChanged(authRef.current, (user) => {
      setUserStatusChanged(true)

      if (user) {
        userEmailVerifiedRef.current = user.emailVerified

        if (user.emailVerified) {
          setAuthUid(user.uid)
        }
      } else {
        actionLogOut()
      }
    })

    return () => {
      unsubscribe()
    }
  }, [actionLogOut])

  useEffect(() => {
    function refreshAvatarData(uidParam) {
      if (uidParam) {
        setUserUid(uidParam)
        const userDocRef = doc(dbRef.current, 'users', uidParam)
        getDoc(userDocRef)
          .then((userDocSnap) => {
            const userData = userDocSnap.data()

            if (userData) {
              const newAvatarData = pick(
                ['displayName', 'email', 'phoneNumber', 'photoURL', 'username'],
                userData,
              )
              newAvatarData.uid = uidParam
              setUserAvatarData(newAvatarData)
            }
          })
          .catch((error) => {
            console.error(error)
          })
      }
    }

    eventEmitter.on(EVENT_REFRESH_AVATAR_DATA, refreshAvatarData)

    if (authUid) {
      refreshAvatarData(authUid)
    }

    return () => {
      eventEmitter.off(EVENT_REFRESH_AVATAR_DATA, refreshAvatarData)
    }
  }, [authUid, setUserAvatarData, setUserUid])

  useEffect(() => {
    // this only must run once at the beginning
    if (!appIsReady && userStatusChanged && (fontsLoaded || fontsLoadError)) {
      if (userEmailVerifiedRef.current) {
        setUserIsLoggedIn(true)
      }

      setAppIsReady(true)
    }
  }, [
    appIsReady,
    fontsLoadError,
    fontsLoaded,
    setUserIsLoggedIn,
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

  const activeRouteState = navState.routes?.[navState.index]?.state
  const activeTabName =
    activeRouteState?.routes?.[activeRouteState?.index]?.name

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <StatusBar style='light' />
      <Stack
        screenOptions={({ route }) => {
          const options = {
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
            headerShown: userIsLoggedIn,
            headerTitle: '',
          }

          if (route.name === '(tabs)') {
            if (activeTabName === 'index') {
              options.headerTitle = ''
            }
            if (activeTabName === 'about') {
              options.headerTitle = 'About'
            }
          }

          return options
        }}
      />
    </ThemeProvider>
  )
}
