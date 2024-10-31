import { Tabs } from 'expo-router'
import Feather from '@expo/vector-icons/Feather'

import LoginSignup from '@/components/LoginSignup/LoginSignup'
import useThemeColor from '@/hooks/useThemeColor'
import { useLoggedUserStore } from '@/hooks/useStore'

export default function TabsLayout() {
  const tabsBg = useThemeColor('cardBg2')
  const tabsBorderColor = useThemeColor('cardBg1')
  const tabIconColor = useThemeColor('color3')
  const activeTabIconColor = useThemeColor('color4')

  const isUserLoggedIn = useLoggedUserStore((s) => s.isUserLoggedIn)

  if (!isUserLoggedIn) {
    return <LoginSignup />
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          display: 'flex',
          backgroundColor: tabsBg,
          borderTopColor: tabsBorderColor,
        },
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
                color={focused ? activeTabIconColor : tabIconColor}
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
                color={focused ? activeTabIconColor : tabIconColor}
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
                color={focused ? activeTabIconColor : tabIconColor}
              />
            )
          },
        }}
      />
    </Tabs>
  )
}
