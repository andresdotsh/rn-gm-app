import { Stack, useNavigation } from 'expo-router'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import useThemeColor from '@/hooks/useThemeColor'
import MainButton from '@/ui/MainButton'
import { CC_WIDTH_STYLES } from '@/constants/constants'

export default function NotFoundScreen() {
  const mainBg = useThemeColor('mainBg1')
  const textColor = useThemeColor('color1')

  const navigation = useNavigation()

  return (
    <ScrollView
      style={{ backgroundColor: mainBg }}
      contentContainerStyle={styles.svContentContainer}
    >
      <View style={styles.container}>
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
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  svContentContainer: {
    flexGrow: 1,
    padding: 40,
    ...CC_WIDTH_STYLES,
  },
  container: {
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
