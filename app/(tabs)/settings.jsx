import { useCallback, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { signOut } from 'firebase/auth'
import { useNavigation } from '@react-navigation/native'
import { Link } from 'expo-router'

import { auth } from '@/data/firebase'
import { useCurrentUserStore } from '@/hooks/useStore'
import useThemeColor from '@/hooks/useThemeColor'
import MainButton from '@/ui/MainButton'
import ThirdButton from '@/ui/ThirdButton'
import MainModal from '@/ui/MainModal'

export default function Settings() {
  const [logoutModal, setLogoutModal] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const mainBgColor = useThemeColor('mainBackgroundColor')
  const textColor = useThemeColor('color')
  const cardBg1 = useThemeColor('cardBg')
  const btnColor = useThemeColor('btnColor')
  const modalColor = useThemeColor('color2')

  const navigation = useNavigation()

  const actionLogOut = useCurrentUserStore((state) => state.actionLogOut)
  const userUid = useCurrentUserStore((state) => state.uid)

  const logOut = useCallback(async () => {
    try {
      setLoggingOut(true)
      await signOut(auth)
      setLogoutModal(false)
      setLoggingOut(false)
      actionLogOut()

      navigation.reset({
        index: 0,
        routes: [{ name: '(tabs)' }],
      })
    } catch (error) {
      console.error(error)
      setLoggingOut(false)
    }
  }, [navigation, actionLogOut])

  return (
    <View style={[styles.container, { backgroundColor: mainBgColor }]}>
      <View style={[styles.card, { backgroundColor: cardBg1 }]}>
        <Text style={[styles.text, { color: textColor }]}>{`Hello`}</Text>

        <Link
          asChild
          href={{
            pathname: '/user/[uid]',
            params: { uid: userUid },
          }}
        >
          <MainButton>{`User profile`}</MainButton>
        </Link>
      </View>

      <View
        style={[styles.card, styles.logoutCard, { backgroundColor: cardBg1 }]}
      >
        <MainButton
          leftIcon={
            <FontAwesome6 name='power-off' size={18} color={btnColor} />
          }
          onPress={() => {
            setLogoutModal(true)
          }}
        >
          {`Cerrar Sesión`}
        </MainButton>
      </View>

      <MainModal
        title={`Confirmar`}
        visible={logoutModal}
        disabled={loggingOut}
        onPressClose={() => {
          setLogoutModal(false)
        }}
      >
        <View style={styles.logoutModalContainer}>
          <Text style={[styles.logoutModalText, { color: modalColor }]}>
            {`¿Deseas cerrar sesión?`}
          </Text>

          <View style={styles.pt2}>
            <MainButton
              onPress={logOut}
              disabled={loggingOut}
              loading={loggingOut}
            >
              {`Cerrar Sesión`}
            </MainButton>
          </View>

          <View style={styles.pt2}>
            <ThirdButton
              onPress={() => {
                setLogoutModal(false)
              }}
              disabled={loggingOut}
            >{`Cancelar`}</ThirdButton>
          </View>
        </View>
      </MainModal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  text: {
    fontSize: 20,
    fontFamily: 'Ubuntu400',
  },
  card: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  logoutCard: {
    marginTop: 20,
  },
  logoutModalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoutModalText: {
    fontSize: 18,
    fontFamily: 'Ubuntu400',
    textAlign: 'center',
  },
  pt2: {
    paddingTop: 20,
  },
})
