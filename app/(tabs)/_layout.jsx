import { Tabs } from 'expo-router'
import Feather from '@expo/vector-icons/Feather'
import { useNavigationState } from '@react-navigation/native'

import LoginSignup from '@/components/LoginSignup/LoginSignup'
import useThemeColor from '@/hooks/useThemeColor'
import { useLoggedUserStore } from '@/hooks/useStore'

export default function TabsLayout() {
  const modalBg1 = useThemeColor('modalBg1')
  const mainBg2 = useThemeColor('mainBg2')
  const cardBg1 = useThemeColor('cardBg1')
  const color3 = useThemeColor('color3')
  const color4 = useThemeColor('color4')

  const isUserLoggedIn = useLoggedUserStore((s) => s.isUserLoggedIn)

  const navState = useNavigationState((state) => state)

  if (!isUserLoggedIn) {
    return <LoginSignup />
  }

  const activeRouteState = navState.routes?.[navState.index]?.state
  const activeTabName =
    activeRouteState?.routes?.[activeRouteState?.index]?.name

  return (
    <Tabs
      screenOptions={({ route }) => {
        const options = {
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            borderTopColor: cardBg1,
            backgroundColor: modalBg1,
          },
        }

        if (route.name === 'settings' && activeTabName === 'settings') {
          options.tabBarStyle = {
            backgroundColor: mainBg2,
          }
        }

        return options
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          tabBarIcon: ({ focused, size }) => {
            return (
              <Feather
                name='home'
                size={size}
                color={focused ? color4 : color3}
              />
            )
          },
        }}
      />

      <Tabs.Screen
        name='my-calendar'
        options={{
          tabBarIcon: ({ focused, size }) => {
            return (
              <Feather
                name='calendar'
                size={size}
                color={focused ? color4 : color3}
              />
            )
          },
        }}
      />

      <Tabs.Screen
        name='settings'
        options={{
          tabBarIcon: ({ focused, size }) => {
            return (
              <Feather
                name='settings'
                size={size}
                color={focused ? color4 : color3}
              />
            )
          },
        }}
      />
    </Tabs>
  )
}
