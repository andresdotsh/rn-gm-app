import { useCallback, useState } from 'react'
import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { signOut } from 'firebase/auth'
import { useNavigation } from '@react-navigation/native'
import { useRouter } from 'expo-router'
import { isNonEmptyString } from 'ramda-adjunct'

import { auth } from '@/data/firebase'
import { useLoggedUserStore } from '@/hooks/useStore'
import useThemeColor from '@/hooks/useThemeColor'
import MainButton from '@/ui/MainButton'
import ThirdButton from '@/ui/ThirdButton'
import MainModal from '@/ui/MainModal'

export default function Settings() {
  const [logoutModal, setLogoutModal] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const mainBgColor = useThemeColor('mainBackgroundColor')
  const textColor = useThemeColor('color')
  const textColor2 = useThemeColor('color2')
  const textColor4 = useThemeColor('color4')
  const cardBg1 = useThemeColor('cardBg')
  const btnColor = useThemeColor('btnColor')
  const modalColor = useThemeColor('color2')

  const router = useRouter()
  const navigation = useNavigation()

  const actionLogout = useLoggedUserStore((s) => s.actionLogout)
  const loggedUserUid = useLoggedUserStore((s) => s.loggedUserUid)
  const loggedUserData = useLoggedUserStore((s) => s.loggedUserData)

  const logOut = useCallback(async () => {
    try {
      setLoggingOut(true)
      await signOut(auth)
      setLogoutModal(false)
      setLoggingOut(false)
      actionLogout()

      navigation.reset({
        index: 0,
        routes: [{ name: '(tabs)' }],
      })
    } catch (error) {
      console.error(error)
      setLoggingOut(false)
    }
  }, [navigation, actionLogout])

  return (
    <View style={[styles.container, { backgroundColor: mainBgColor }]}>
      <View style={[styles.card, { backgroundColor: cardBg1 }]}>
        <Pressable
          style={({ pressed }) => {
            return { opacity: pressed ? 0.8 : 1 }
          }}
          onPress={() => {
            router.push({
              pathname: '/user/[uid]',
              params: { uid: loggedUserUid },
            })
          }}
        >
          <View style={styles.profileLink}>
            <View>
              {isNonEmptyString(loggedUserData?.photoURL) ? (
                <Image
                  source={{ uri: loggedUserData?.photoURL }}
                  style={styles.profileImage}
                />
              ) : (
                <MaterialIcons
                  name='add-a-photo'
                  size={40}
                  color={textColor2}
                />
              )}
            </View>

            <View style={styles.profileTextContainer}>
              <Text style={[styles.profileLinkTitle, { color: textColor }]}>
                {`Ver mi perfil`}
              </Text>

              {isNonEmptyString(loggedUserData?.username) && (
                <Text
                  style={[styles.profileLinkUsername, { color: textColor4 }]}
                >
                  {'@' + loggedUserData?.username}
                </Text>
              )}

              {isNonEmptyString(loggedUserData?.displayName) && (
                <Text style={[styles.profileLinkName, { color: textColor }]}>
                  {loggedUserData?.displayName}
                </Text>
              )}
            </View>
          </View>
        </Pressable>
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
  profileLink: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileTextContainer: { flexShrink: 1 },
  profileLinkTitle: {
    fontSize: 16,
    fontFamily: 'Ubuntu600',
  },
  profileLinkName: {
    fontSize: 18,
    fontFamily: 'Ubuntu400',
  },
  profileLinkUsername: {
    fontSize: 16,
    fontFamily: 'Ubuntu400',
    marginTop: 5,
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
