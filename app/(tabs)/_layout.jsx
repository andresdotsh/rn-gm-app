import { Tabs } from 'expo-router'
import FontAwesome from '@expo/vector-icons/FontAwesome'

import useThemeColor from '@/hooks/useThemeColor'

export default function TabsLayout() {
  const tabsBg = useThemeColor('cardBg2')
  const tabIconColor = useThemeColor('color2')
  const activeTabIconColor = useThemeColor('color4')

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          display: 'flex', // TODO: -> or 'none' if the user is not logged in
          backgroundColor: tabsBg,
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
