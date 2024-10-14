import { Stack } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import useThemeColor from '@/hooks/useThemeColor'
import MainButton from '@/ui/MainButton'

export default function NotFoundScreen() {
  const mainBg = useThemeColor('mainBg1')
  const textColor = useThemeColor('color1')

  const navigation = useNavigation()

  return (
    <View style={[styles.container, { backgroundColor: mainBg }]}>
      <Stack.Screen options={{ headerTitle: '404 Not Found' }} />
      <Text
        style={[styles.text, { color: textColor }]}
      >{`El recurso que buscas ya no existe o nunca existió.`}</Text>

      <MainButton
        style={styles.link}
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack()
          } else {
            navigation.navigate('(tabs)')
          }
        }}
      >{`Volver`}</MainButton>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    fontFamily: 'Ubuntu400',
    fontSize: 20,
    marginBottom: 30,
  },
  link: {
    width: '100%',
  },
})
