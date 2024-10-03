import { StyleSheet, Text, View } from 'react-native'

import useThemeColor from '@/hooks/useThemeColor'

export default function App() {
  const mainBgColor = useThemeColor('mainBackgroundColor')
  const textColor = useThemeColor('color')

  return (
    <View style={[styles.container, { backgroundColor: mainBgColor }]}>
      <Text
        style={{ fontSize: 20, fontFamily: 'Ubuntu400', color: textColor }}
      >{`Hello World!`}</Text>
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
})
