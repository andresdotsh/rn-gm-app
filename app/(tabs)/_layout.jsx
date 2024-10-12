import { Tabs } from 'expo-router'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import EvilIcons from '@expo/vector-icons/EvilIcons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

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
          tabBarIcon: ({ focused }) => {
            return (
              <MaterialCommunityIcons
                name='approximately-equal'
                size={28}
                color={focused ? activeTabIconColor : tabIconColor}
              />
            )
          },
        }}
      />

      <Tabs.Screen
        name='about'
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <FontAwesome
                name='info'
                size={28}
                color={focused ? activeTabIconColor : tabIconColor}
              />
            )
          },
        }}
      />

      <Tabs.Screen
        name='settings'
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <EvilIcons
                name='gear'
                size={28}
                color={focused ? activeTabIconColor : tabIconColor}
              />
            )
          },
        }}
      />
    </Tabs>
  )
}
