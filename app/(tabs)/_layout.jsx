import { Tabs } from 'expo-router'
import FontAwesome from '@expo/vector-icons/FontAwesome'

import LoginSignup from '@/components/LoginSignup/LoginSignup'
import useThemeColor from '@/hooks/useThemeColor'
import { useCurrentUserStore } from '@/hooks/useStore'

export default function TabsLayout() {
  const tabsBg = useThemeColor('cardBg2')
  const tabsBorderColor = useThemeColor('cardBg')
  const tabIconColor = useThemeColor('color3')
  const activeTabIconColor = useThemeColor('color4')

  const userIsLoggedIn = useCurrentUserStore((state) => state.isLoggedIn)

  if (!userIsLoggedIn) {
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
          tabBarIcon: ({ size, focused }) => {
            return (
              <FontAwesome
                name='home'
                size={size}
                color={focused ? activeTabIconColor : tabIconColor}
              />
            )
          },
        }}
      />

      <Tabs.Screen
        name='about'
        options={{
          tabBarIcon: ({ size, focused }) => {
            return (
              <FontAwesome
                name='info'
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
