import { useCallback, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
} from 'react-native'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { signOut } from 'firebase/auth'
import { useRouter, useNavigation } from 'expo-router'
import { isNonEmptyString } from 'ramda-adjunct'

import { auth } from '@/data/firebase'
import postLogoutAllSessions from '@/rest/postLogoutAllSessions'
import { useLoggedUserStore } from '@/hooks/useStore'
import useThemeColor from '@/hooks/useThemeColor'
import BlankSpaceView from '@/ui/BlankSpaceView'
import MainButton from '@/ui/MainButton'
import ThirdButton from '@/ui/ThirdButton'
import MainModal from '@/ui/MainModal'
import { CC_WIDTH_STYLES } from '@/constants/constants'

export default function Settings() {
  const [logoutModal, setLogoutModal] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const mainBg2 = useThemeColor('mainBg2')
  const textColor1 = useThemeColor('color1')
  const textColor2 = useThemeColor('color2')
  const textColor4 = useThemeColor('color4')
  const settingsItemBorderColor = useThemeColor('btn5')
  const cardBg1 = useThemeColor('cardBg1')
  const cardBg2 = useThemeColor('cardBg2')
  const color1 = useThemeColor('color1')
  const modalColor = useThemeColor('color2')

  const router = useRouter()
  const navigation = useNavigation()

  const actionLogout = useLoggedUserStore((s) => s.actionLogout)
  const loggedUserUid = useLoggedUserStore((s) => s.loggedUserUid)
  const loggedUserData = useLoggedUserStore((s) => s.loggedUserData)

  const logOut = useCallback(
    async (closeAllSessions) => {
      try {
        setLoggingOut(true)

        if (closeAllSessions) {
          let idToken = ''
          if (auth?.currentUser) {
            idToken = await auth?.currentUser?.getIdToken(true)
          }
          await postLogoutAllSessions(idToken)
        }

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
    },
    [actionLogout, navigation],
  )

  return (
    <ScrollView
      style={{ backgroundColor: mainBg2 }}
      contentContainerStyle={styles.svContentContainer}
    >
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
              pathname: '/detail-profile/[uid]',
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
            <Text style={[styles.profileLinkTitle, { color: textColor1 }]}>
              {`Ver mi perfil`}
            </Text>

            {isNonEmptyString(loggedUserData?.username) && (
              <Text style={[styles.profileLinkUsername, { color: textColor4 }]}>
                {'@' + loggedUserData?.username}
              </Text>
            )}

            {isNonEmptyString(loggedUserData?.displayName) && (
              <Text style={[styles.profileLinkName, { color: textColor2 }]}>
                {loggedUserData?.displayName}
              </Text>
            )}
          </View>
        </Pressable>

        <Pressable
          style={({ pressed }) => {
            return [
              styles.settingsPressable,
              {
                backgroundColor: pressed ? cardBg2 : cardBg1,
                borderColor: settingsItemBorderColor,
              },
            ]
          }}
          onPress={() => {
            router.push({ pathname: '/past-events' })
          }}
        >
          <View style={styles.settingsItemIconContainer}>
            <MaterialIcons name='history' size={24} color={color1} />
          </View>
          <Text style={[styles.settingsItemText, { color: textColor1 }]}>
            {`Eventos Pasados`}
          </Text>
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
          <View style={styles.settingsItemIconContainer}>
            <FontAwesome6 name='power-off' size={20} color={color1} />
          </View>
          <Text style={[styles.settingsItemText, { color: textColor1 }]}>
            {`Cerrar Sesión`}
          </Text>
        </Pressable>
      </View>

      <BlankSpaceView />

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
            {`¿Deseas cerrar sesión unicamente en este dispositivo?`}
          </Text>

          <Text style={[styles.logoutModalText, { color: modalColor }]}>
            {`¿O deseas cerrar todas las sesiones activas?`}
          </Text>

          <MainButton
            disabled={loggingOut}
            loading={loggingOut}
            onPress={() => {
              logOut(false)
            }}
          >
            {`Cerrar Esta Sesión`}
          </MainButton>

          <MainButton
            disabled={loggingOut}
            loading={loggingOut}
            onPress={() => {
              logOut(true)
            }}
          >
            {`Cerrar Todas Las Sesiones`}
          </MainButton>

          <ThirdButton
            onPress={() => {
              setLogoutModal(false)
            }}
            disabled={loggingOut}
          >{`Cancelar`}</ThirdButton>
        </View>
      </MainModal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  svContentContainer: {
    flexGrow: 1,
    padding: 20,
    ...CC_WIDTH_STYLES,
  },
  settingsPressable: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
    borderTopWidth: 1,
  },
  settingsItemText: {
    fontSize: 18,
    fontFamily: 'Ubuntu400',
    flexShrink: 1,
  },
  settingsItemIconContainer: {
    flexShrink: 0,
    flexGrow: 0,
    flexBasis: 30,
  },
  profilePressable: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderTopWidth: 0,
    gap: 20,
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
    marginVertical: 2,
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
    gap: 25,
  },
  logoutModalText: {
    fontSize: 18,
    fontFamily: 'Ubuntu400',
    textAlign: 'center',
  },
})
