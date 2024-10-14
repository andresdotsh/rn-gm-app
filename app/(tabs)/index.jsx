import { StyleSheet, Text, View } from 'react-native'

import useThemeColor from '@/hooks/useThemeColor'

export default function Index() {
  const mainBg = useThemeColor('mainBg1')
  const textColor = useThemeColor('color1')

  return (
    <View style={[styles.container, { backgroundColor: mainBg }]}>
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
