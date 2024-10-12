import { Link, Stack } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'

import useThemeColor from '@/hooks/useThemeColor'
import MainButton from '@/ui/MainButton'

export default function NotFoundScreen() {
  const mainBgColor = useThemeColor('mainBackgroundColor')
  const textColor = useThemeColor('color')

  return (
    <>
      <Stack.Screen options={{ headerTitle: '404 Not Found' }} />
      <View style={[styles.container, { backgroundColor: mainBgColor }]}>
        <Text
          style={[styles.text, { color: textColor }]}
        >{`El recurso que buscas ya no existe o nunca existió.`}</Text>

        <Link asChild href='/' style={styles.link}>
          <MainButton>{`Volver`}</MainButton>
        </Link>
      </View>
    </>
  )
}

// TODO: -> verify if href='/' goes to index

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    fontFamily: 'Ubuntu400',
    fontSize: 20,
  },
  link: {
    marginTop: 30,
  },
})
