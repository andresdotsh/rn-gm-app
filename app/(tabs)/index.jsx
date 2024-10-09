import { StyleSheet, Text, View } from 'react-native'

import useThemeColor from '@/hooks/useThemeColor'
import LoginSignup from '@/components/LoginSignup/LoginSignup'
import { useCurrentUserStore } from '@/hooks/useStore'

export default function App() {
  const mainBgColor = useThemeColor('mainBackgroundColor')
  const textColor = useThemeColor('color')

  const userIsLoggedIn = useCurrentUserStore((state) => state.isLoggedIn)

  if (!userIsLoggedIn) {
    return <LoginSignup />
  }

  return (
    <View style={[styles.container, { backgroundColor: mainBgColor }]}>
      <Text style={[styles.text, { color: textColor }]}>{`Hello World!`}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontFamily: 'Ubuntu400',
  },
})
