import { useState, useCallback, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  RefreshControl,
  ActivityIndicator,
  Image,
  Pressable,
  Linking,
} from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams, Stack, Link } from 'expo-router'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import ProgressBar from 'react-native-progress/Bar'
import { isNonEmptyString, isNonEmptyArray } from 'ramda-adjunct'

import {
  CC_WIDTH_STYLES,
  SN_TIKTOK_USER_LINK,
  SN_INSTAGRAM_USER_LINK,
  SN_X_USER_LINK,
  SN_SNAPCHAT_USER_LINK,
  SN_YOUTUBE_USER_LINK,
  SN_FACEBOOK_USER_LINK,
} from '@/constants/constants'
import useThemeColor from '@/hooks/useThemeColor'
import getUserByUid from '@/data/getUserByUid'
import getAllSkills from '@/data/getAllSkills'
import { useLoggedUserStore } from '@/hooks/useStore'
import MainButton from '@/ui/MainButton'
import ThirdButton from '@/ui/ThirdButton'
import BlankSpaceView from '@/ui/BlankSpaceView'
import isValidSkill from '@/utils/isValidSkill'

export default function UserDetail() {
  const [refreshing, setRefreshing] = useState(false)

  const mainBg2 = useThemeColor('mainBg2')
  const color1 = useThemeColor('color1')
  const color2 = useThemeColor('color2')
  const color4 = useThemeColor('color4')
  const cardBg1 = useThemeColor('cardBg1')
  const pgColor = useThemeColor('btn1')
  const pgBgColor = useThemeColor('cardBg2')

  const { uid } = useLocalSearchParams()

  const loggedUserUid = useLoggedUserStore((s) => s.loggedUserUid)
  const setLoggedUserData = useLoggedUserStore((s) => s.setLoggedUserData)

  const isTheLoggedUserProfile = uid === loggedUserUid

  const {
    isFetching: userIsFetching,
    isLoading: userIsLoading,
    error: userError,
    data: userData,
    refetch: userRefetch,
  } = useQuery({
    queryKey: ['users', uid],
    queryFn: () => getUserByUid(uid),
    enabled: Boolean(uid),
  })
  const {
    isLoading: skillsIsLoading,
    data: skillsData,
    error: skillsError,
    refetch: skillsRefetch,
  } = useQuery({
    queryKey: ['skills'],
    queryFn: () => getAllSkills(),
  })

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    userRefetch()
    skillsRefetch()
  }, [userRefetch, skillsRefetch])

  useEffect(() => {
    if (!userIsFetching) {
      setRefreshing(false)
    }
  }, [userIsFetching])

  useEffect(() => {
    if (isTheLoggedUserProfile && userData) {
      setLoggedUserData(userData)
    }
  }, [isTheLoggedUserProfile, setLoggedUserData, userData])

  const isThereAnySnLink =
    isNonEmptyString(userData?.snUserTiktok) ||
    isNonEmptyString(userData?.snUserInstagram) ||
    isNonEmptyString(userData?.snUserXcom) ||
    isNonEmptyString(userData?.snUserSnapchat) ||
    isNonEmptyString(userData?.snUserYoutube) ||
    isNonEmptyString(userData?.snUserFacebook)

  return (
    <ScrollView
      style={{ backgroundColor: mainBg2 }}
      contentContainerStyle={styles.svContentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          progressBackgroundColor={mainBg2}
          colors={[color1]}
          tintColor={color1}
        />
      }
    >
      <Stack.Screen
        options={{
          headerTitle: 'Perfil',
          headerLeft: null,
          headerRight: null,
          headerStyle: {
            backgroundColor: mainBg2,
          },
        }}
      />

      {userIsLoading || skillsIsLoading ? (
        <View style={styles.noContent}>
          <ActivityIndicator size='large' color={color1} />
        </View>
      ) : !userData || !skillsData || userError || skillsError ? (
        <View style={styles.noContent}>
          <Text style={[styles.errorText, { color: color1 }]}>
            {`Ha ocurrido un error al obtener los datos. Puede ser que no tengas conexión a internet, o que el usuario no exista.`}
          </Text>

          <ThirdButton
            loading={userIsFetching}
            disabled={userIsFetching}
            onPress={() => {
              userRefetch()
              skillsRefetch()
            }}
          >{`Reintentar`}</ThirdButton>
        </View>
      ) : (
        <View>
          <View style={[styles.card, { backgroundColor: cardBg1 }]}>
            <View style={styles.profilePhotoContainer}>
              {isNonEmptyString(userData?.photoURL) ? (
                <Image
                  source={{ uri: userData?.photoURL }}
                  style={styles.profilePhoto}
                />
              ) : (
                <SimpleLineIcons name='user' size={96} color={color2} />
              )}
            </View>

            <View>
              <Text style={[styles.cardText2, { color: color4 }]}>
                {'@' + userData?.username}
              </Text>
              <Text style={[styles.cardText1, { color: color1 }]}>
                {userData?.displayName}
              </Text>
            </View>

            {isTheLoggedUserProfile && (
              <Link asChild href={'/edit-profile'}>
                <MainButton>{`Editar Perfil`}</MainButton>
              </Link>
            )}

            {isNonEmptyArray(skillsData) && (
              <View>
                {skillsData.map((skill) => {
                  const rawValue = userData?.[skill?.key]
                  const skillValue = isValidSkill(rawValue) ? rawValue : 0
                  const progressValue = skillValue / 100

                  return (
                    <View key={skill?.uid} style={styles.skillItemContainer}>
                      <Text style={[styles.skillLabelText, { color: color2 }]}>
                        {skill?.name + ': '}
                        <Text
                          style={[styles.skillValueText, { color: color1 }]}
                        >
                          {skillValue}
                        </Text>
                      </Text>
                      <ProgressBar
                        width={null}
                        borderWidth={0}
                        unfilledColor={pgBgColor}
                        color={pgColor}
                        progress={progressValue}
                      />
                    </View>
                  )
                })}
              </View>
            )}
          </View>

          {isThereAnySnLink && (
            <View
              style={[
                styles.card,
                styles.mediaCard,
                { backgroundColor: cardBg1 },
              ]}
            >
              {isNonEmptyString(userData?.snUserTiktok) && (
                <Pressable style={styles.mediaLinkPressable}>
                  <View style={styles.mediaLinkIconContainer}>
                    <FontAwesome6 name='tiktok' size={20} color={color4} />
                  </View>
                  <Text
                    style={[styles.mediaLinkText, { color: color4 }]}
                    onPress={() => {
                      const url = SN_TIKTOK_USER_LINK + userData?.snUserTiktok
                      Linking.openURL(url)
                        .then(() => true)
                        .catch(console.error)
                    }}
                  >
                    {'@' + userData?.snUserTiktok}
                  </Text>
                </Pressable>
              )}

              {isNonEmptyString(userData?.snUserInstagram) && (
                <Pressable style={styles.mediaLinkPressable}>
                  <View style={styles.mediaLinkIconContainer}>
                    <FontAwesome6 name='instagram' size={20} color={color4} />
                  </View>
                  <Text
                    style={[styles.mediaLinkText, { color: color4 }]}
                    onPress={() => {
                      const url =
                        SN_INSTAGRAM_USER_LINK + userData?.snUserInstagram
                      Linking.openURL(url)
                        .then(() => true)
                        .catch(console.error)
                    }}
                  >
                    {'@' + userData?.snUserInstagram}
                  </Text>
                </Pressable>
              )}

              {isNonEmptyString(userData?.snUserXcom) && (
                <Pressable style={styles.mediaLinkPressable}>
                  <View style={styles.mediaLinkIconContainer}>
                    <FontAwesome6 name='x-twitter' size={20} color={color4} />
                  </View>
                  <Text
                    style={[styles.mediaLinkText, { color: color4 }]}
                    onPress={() => {
                      const url = SN_X_USER_LINK + userData?.snUserXcom
                      Linking.openURL(url)
                        .then(() => true)
                        .catch(console.error)
                    }}
                  >
                    {'@' + userData?.snUserXcom}
                  </Text>
                </Pressable>
              )}

              {isNonEmptyString(userData?.snUserSnapchat) && (
                <Pressable style={styles.mediaLinkPressable}>
                  <View style={styles.mediaLinkIconContainer}>
                    <FontAwesome6 name='snapchat' size={20} color={color4} />
                  </View>
                  <Text
                    style={[styles.mediaLinkText, { color: color4 }]}
                    onPress={() => {
                      const url =
                        SN_SNAPCHAT_USER_LINK + userData?.snUserSnapchat
                      Linking.openURL(url)
                        .then(() => true)
                        .catch(console.error)
                    }}
                  >
                    {'@' + userData?.snUserSnapchat}
                  </Text>
                </Pressable>
              )}

              {isNonEmptyString(userData?.snUserYoutube) && (
                <Pressable style={styles.mediaLinkPressable}>
                  <View style={styles.mediaLinkIconContainer}>
                    <FontAwesome6 name='youtube' size={20} color={color4} />
                  </View>
                  <Text
                    style={[styles.mediaLinkText, { color: color4 }]}
                    onPress={() => {
                      const url = SN_YOUTUBE_USER_LINK + userData?.snUserYoutube
                      Linking.openURL(url)
                        .then(() => true)
                        .catch(console.error)
                    }}
                  >
                    {'@' + userData?.snUserYoutube}
                  </Text>
                </Pressable>
              )}

              {isNonEmptyString(userData?.snUserFacebook) && (
                <Pressable style={styles.mediaLinkPressable}>
                  <View style={styles.mediaLinkIconContainer}>
                    <FontAwesome6 name='facebook-f' size={20} color={color4} />
                  </View>
                  <Text
                    style={[styles.mediaLinkText, { color: color4 }]}
                    onPress={() => {
                      const url =
                        SN_FACEBOOK_USER_LINK + userData?.snUserFacebook
                      Linking.openURL(url)
                        .then(() => true)
                        .catch(console.error)
                    }}
                  >
                    {'@' + userData?.snUserFacebook}
                  </Text>
                </Pressable>
              )}
            </View>
          )}

          <BlankSpaceView />
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  svContentContainer: {
    flexGrow: 1,
    padding: 20,
    ...CC_WIDTH_STYLES,
  },
  noContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 25,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Ubuntu400',
    textAlign: 'center',
  },
  card: {
    padding: 20,
    borderRadius: 10,
    gap: 25,
    marginBottom: 20,
  },
  mediaCard: {
    gap: 10,
  },
  cardText1: {
    fontSize: 20,
    fontFamily: 'Ubuntu500',
  },
  cardText2: {
    fontSize: 18,
    fontFamily: 'Ubuntu400',
  },
  mediaLinkPressable: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mediaLinkIconContainer: {
    flexBasis: 24,
    flexGrow: 0,
    flexShrink: 0,
    alignItems: 'center',
  },
  mediaLinkText: {
    fontSize: 18,
    fontFamily: 'Ubuntu400',
  },
  profilePhotoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  profilePhoto: {
    borderRadius: 10,
    aspectRatio: 1,
    width: '100%',
    maxWidth: 400,
  },
  skillItemContainer: { paddingVertical: 4 },
  skillLabelText: {
    fontSize: 18,
    fontFamily: 'Ubuntu400',
  },
  skillValueText: {
    fontSize: 18,
    fontFamily: 'Ubuntu600',
  },
})
