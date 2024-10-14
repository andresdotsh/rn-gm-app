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

  const mainBg = useThemeColor('mainBg1')
  const textColor = useThemeColor('color1')
  const textColor2 = useThemeColor('color2')
  const settingsItemBorderColor = useThemeColor('btn5')
  const textColor4 = useThemeColor('color4')
  const cardBg1 = useThemeColor('cardBg1')
  const cardBg2 = useThemeColor('cardBg2')
  const color1 = useThemeColor('color1')
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
    <View style={[styles.container, { backgroundColor: mainBg }]}>
      <View style={styles.settingItemsContainer}>
        <Pressable
          style={({ pressed }) => {
            return [
              styles.settingsPressable,
              styles.profilePressable,
              { backgroundColor: pressed ? cardBg2 : cardBg1 },
            ]
          }}
          onPress={() => {
            router.push({
              pathname: '/user/[uid]',
              params: { uid: loggedUserUid },
            })
          }}
        >
          <View>
            {isNonEmptyString(loggedUserData?.photoURL) ? (
              <Image
                source={{ uri: loggedUserData?.photoURL }}
                style={styles.profileLinkImage}
              />
            ) : (
              <MaterialIcons name='add-a-photo' size={40} color={textColor2} />
            )}
          </View>

          <View style={styles.profileTextContainer}>
            <Text style={[styles.profileLinkTitle, { color: textColor }]}>
              {`Ver mi perfil`}
            </Text>

            {isNonEmptyString(loggedUserData?.username) && (
              <Text style={[styles.profileLinkUsername, { color: textColor4 }]}>
                {'@' + loggedUserData?.username}
              </Text>
            )}

            {isNonEmptyString(loggedUserData?.displayName) && (
              <Text style={[styles.profileLinkName, { color: textColor }]}>
                {loggedUserData?.displayName}
              </Text>
            )}
          </View>
        </Pressable>

        <Pressable
          style={({ pressed }) => {
            return [
              styles.settingsPressable,
              styles.logoutPressable,
              {
                backgroundColor: pressed ? cardBg2 : cardBg1,
                borderColor: settingsItemBorderColor,
              },
            ]
          }}
          onPress={() => {
            setLogoutModal(true)
          }}
        >
          <FontAwesome6 name='power-off' size={18} color={color1} />
          <Text style={[styles.settingsItemText, { color: textColor }]}>
            {`Cerrar Sesión`}
          </Text>
        </Pressable>
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
  settingsPressable: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    padding: 10,
    borderTopWidth: 1,
  },
  settingsItemText: {
    fontSize: 18,
    fontFamily: 'Ubuntu400',
  },
  profilePressable: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderTopWidth: 0,
  },
  profileLinkImage: {
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
  settingItemsContainer: {
    marginBottom: 20,
  },
  logoutPressable: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
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
