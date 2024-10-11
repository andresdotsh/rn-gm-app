import { useEffect, useRef, useCallback, useState } from 'react'
import { StyleSheet, ScrollView, Text, View } from 'react-native'
import { getApp } from 'firebase/app'
import { getAuth, signOut } from 'firebase/auth'
import { useNavigation } from '@react-navigation/native'

import useThemeColor from '@/hooks/useThemeColor'
import { useCurrentUserStore } from '@/hooks/useStore'
import BlankSpaceView from '@/ui/BlankSpaceView'
import MainButton from '@/ui/MainButton'

export default function About() {
  const authRef = useRef(null)

  const [disabledLogOut, setDisabledLogOut] = useState(false)

  const mainBgColor = useThemeColor('mainBackgroundColor')
  const textColor = useThemeColor('color')

  const navigation = useNavigation()

  const setUserIsLoggedIn = useCurrentUserStore((state) => state.setIsLoggedIn)

  useEffect(() => {
    const app = getApp()
    authRef.current = getAuth(app)
    authRef.current.useDeviceLanguage()
  }, [])

  const logOut = useCallback(async () => {
    try {
      setDisabledLogOut(true)
      await signOut(authRef.current)
      setDisabledLogOut(false)
      setUserIsLoggedIn(false)

      navigation.reset({
        index: 0,
        routes: [{ name: '(tabs)' }],
      })
    } catch (error) {
      console.error(error)
      setDisabledLogOut(false)
    }
  }, [navigation, setUserIsLoggedIn])

  return (
    <ScrollView style={[styles.container, { backgroundColor: mainBgColor }]}>
      <Text style={[styles.title, { color: textColor }]}>
        Sobre este proyecto
      </Text>

      <Text style={[styles.description, { color: textColor }]}>
        The standard chunk of Lorem Ipsum used since the 1500s is reproduced
        below for those interested. Sections 1.10.32 and 1.10.33 from "de
        Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact
        original form, accompanied by English versions from the 1914 translation
        by H. Rackham.
      </Text>

      <Text style={[styles.description, { color: textColor }]}>
        The standard chunk of Lorem Ipsum used since the 1500s is reproduced
        below for those interested. Sections 1.10.32 and 1.10.33 from "de
        Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact
        original form, accompanied by English versions from the 1914 translation
        by H. Rackham.
      </Text>

      <Text style={[styles.description, { color: textColor }]}>
        The standard chunk of Lorem Ipsum used since the 1500s is reproduced
        below for those interested. Sections 1.10.32 and 1.10.33 from "de
        Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact
        original form, accompanied by English versions from the 1914 translation
        by H. Rackham.
      </Text>

      <Text style={[styles.description, { color: textColor }]}>
        The standard chunk of Lorem Ipsum used since the 1500s is reproduced
        below for those interested. Sections 1.10.32 and 1.10.33 from "de
        Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact
        original form, accompanied by English versions from the 1914 translation
        by H. Rackham.
      </Text>

      <Text style={[styles.description, { color: textColor }]}>
        The standard chunk of Lorem Ipsum used since the 1500s is reproduced
        below for those interested. Sections 1.10.32 and 1.10.33 from "de
        Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact
        original form, accompanied by English versions from the 1914 translation
        by H. Rackham.
      </Text>

      <View>
        <MainButton onPress={logOut} disabled={disabledLogOut}>
          {`Log out`}
        </MainButton>
      </View>

      <BlankSpaceView />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontFamily: 'Ubuntu700',
    fontSize: 20,
    marginBottom: 20,
  },
  description: {
    fontFamily: 'Ubuntu400',
    fontSize: 18,
    marginBottom: 20,
  },
})
