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
import Feather from '@expo/vector-icons/Feather'
import Ionicons from '@expo/vector-icons/Ionicons'
import ProgressBar from 'react-native-progress/Bar'
import { not } from 'ramda'
import { isNonEmptyString, isNonEmptyArray } from 'ramda-adjunct'

import {
  CC_WIDTH_STYLES,
  SN_TIKTOK_USER_LINK,
  SN_INSTAGRAM_USER_LINK,
  SN_X_USER_LINK,
  SN_SNAPCHAT_USER_LINK,
  SN_YOUTUBE_USER_LINK,
  SN_FACEBOOK_USER_LINK,
  EVENT_ROLE_JUDGE,
  EVENT_ROLE_PARTICIPANT,
  EVENT_ROLE_OWNER,
  DATEPICKER_DEFAULT_PROPS,
} from '@/constants/constants'
import useThemeColor from '@/hooks/useThemeColor'
import cmGetEventDetails from '@/data/cmGetEventDetails'
import { useLoggedUserStore } from '@/hooks/useStore'
import MainButton from '@/ui/MainButton'
import ThirdButton from '@/ui/ThirdButton'
import BlankSpaceView from '@/ui/BlankSpaceView'
import isValidSkill from '@/utils/isValidSkill'
import dateFnsFormat from '@/utils/dateFnsFormat'

export default function EventDetail() {
  const [refreshing, setRefreshing] = useState(false)

  const mainBg2 = useThemeColor('mainBg2')
  const color1 = useThemeColor('color1')
  const color2 = useThemeColor('color2')
  const color3 = useThemeColor('color3')
  const color4 = useThemeColor('color4')
  const cardBg1 = useThemeColor('cardBg1')
  const cardBg2 = useThemeColor('cardBg2')
  const pgColor = useThemeColor('btn1')
  const pgBgColor = useThemeColor('cardBg2')

  const { eventUid } = useLocalSearchParams()

  const loggedUserUid = useLoggedUserStore((s) => s.loggedUserUid)

  const {
    isFetching: detailsIsFetching,
    isLoading: detailsIsLoading,
    error: detailsError,
    data: detailsData,
    refetch: detailsRefetch,
  } = useQuery({
    queryKey: ['cm_event_details', eventUid],
    queryFn: () => cmGetEventDetails(eventUid),
    enabled: Boolean(eventUid),
  })

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    detailsRefetch()
  }, [detailsRefetch])

  useEffect(() => {
    if (!detailsIsFetching) {
      setRefreshing(false)
    }
  }, [detailsIsFetching])

  const eventData = detailsData?.eventData
  const ownerData = detailsData?.ownerData
  const eventType = detailsData?.eventType
  const judgesUsers = detailsData?.judgesUsers
  const participantsUsers = detailsData?.participantsUsers
  const judgesUids = detailsData?.judgesUids
  const participantsUids = detailsData?.participantsUids

  const loggedUserIsOwner = Boolean(
    loggedUserUid && loggedUserUid === eventData?.ownerUid,
  )
  const loggedUserIsJudge = Boolean(
    loggedUserUid && judgesUids?.includes(loggedUserUid),
  )
  const loggedUserIsParticipant = Boolean(
    loggedUserUid && participantsUids?.includes(loggedUserUid),
  )
  const isPublished = not(eventData?.isPublished === false)
  const bannerOpacity = isPublished ? 1 : 0.5
  const userEventRoleText = loggedUserIsJudge
    ? 'ERES JUEZ'
    : loggedUserIsParticipant
      ? 'ERES PARTICIPANTE'
      : loggedUserIsOwner
        ? 'CREASTE ESTE EVENTO'
        : 'NO TIENES ROL'

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
          headerTitle: isPublished ? 'Evento' : 'Evento Pausado',
          headerLeft: null,
          headerRight: null,
          headerStyle: {
            backgroundColor: mainBg2,
          },
        }}
      />

      {detailsIsLoading ? (
        <View style={styles.noContent}>
          <ActivityIndicator size='large' color={color1} />
        </View>
      ) : !detailsData || detailsError ? (
        <View style={styles.noContent}>
          <Text style={[styles.errorText, { color: color1 }]}>
            {`Ha ocurrido un error al obtener los datos. Puede ser que no tengas conexión a internet, o que el evento no exista.`}
          </Text>

          <ThirdButton
            loading={detailsIsFetching}
            disabled={detailsIsFetching}
            onPress={() => {
              detailsRefetch()
            }}
          >{`Reintentar`}</ThirdButton>
        </View>
      ) : (
        <View>
          <View style={[styles.card, { backgroundColor: cardBg2 }]}>
            {!isPublished && (
              <Text style={[styles.pausedEventTitle, { color: color3 }]}>
                {`EVENTO PAUSADO`}
              </Text>
            )}

            {isNonEmptyString(eventData?.bannerUrl) && (
              <View style={styles.eventBannerContainer}>
                <Image
                  source={{ uri: eventData?.bannerUrl }}
                  style={[styles.eventBanner, { opacity: bannerOpacity }]}
                  resizeMode='contain'
                />
              </View>
            )}

            <View>
              <Text
                style={[
                  styles.eventTitle,
                  { color: isPublished ? color1 : color3 },
                ]}
              >
                {eventData?.name}
              </Text>

              <View style={styles.eventSubtitleContainer}>
                <Feather
                  name='user'
                  size={18}
                  color={isPublished ? color2 : color3}
                />
                <Text
                  style={[
                    styles.eventRoleSubtitle,
                    { color: isPublished ? color2 : color3 },
                  ]}
                >
                  {userEventRoleText}
                </Text>
              </View>

              <View style={styles.eventSubtitleContainer}>
                <Feather
                  name='calendar'
                  size={18}
                  color={isPublished ? color4 : color3}
                />
                <Text
                  style={[
                    styles.eventSubtitle,
                    styles.eventDate,
                    { color: isPublished ? color4 : color3 },
                  ]}
                >
                  {isNonEmptyString(eventData?.startDateIsoString)
                    ? dateFnsFormat(
                        new Date(eventData?.startDateIsoString),
                        DATEPICKER_DEFAULT_PROPS.dateFormat,
                      )
                    : '---'}
                </Text>
              </View>

              <View style={styles.eventSubtitleContainer}>
                <Ionicons
                  name='medal-outline'
                  size={18}
                  color={isPublished ? color3 : color3}
                />
                <Text
                  style={[
                    styles.eventSubtitle,
                    { color: isPublished ? color3 : color3 },
                  ]}
                >
                  {eventType?.name || '---'}
                </Text>
              </View>

              {isNonEmptyString(eventData?.description) && (
                <Text
                  style={[
                    styles.eventDescription,
                    { color: isPublished ? color1 : color3 },
                  ]}
                >
                  {eventData?.description}
                </Text>
              )}
            </View>

            <View>
              <Text
                style={[
                  styles.eventAuhtor,
                  { color: isPublished ? color3 : color3 },
                ]}
              >
                {`Creado por:`}
              </Text>
              <Text
                style={[
                  styles.eventAuhtor,
                  { color: isPublished ? color4 : color3 },
                ]}
              >
                {'@' + ownerData?.username}
              </Text>
              <Text
                style={[
                  styles.eventAuhtor,
                  { color: isPublished ? color4 : color3 },
                ]}
              >
                {ownerData?.displayName}
              </Text>
            </View>

            {loggedUserIsOwner &&
              (isPublished ? (
                <MainButton>{`Editar`}</MainButton>
              ) : (
                <ThirdButton>{`Editar`}</ThirdButton>
              ))}
          </View>

          {loggedUserIsOwner && (
            <View
              style={[
                styles.card,
                styles.userTypeContainerCard,
                { backgroundColor: cardBg2 },
              ]}
            >
              <Text
                style={[
                  styles.userTypeTitle,
                  { color: isPublished ? color1 : color3 },
                ]}
              >
                {`Jueces (${judgesUsers?.length || 0})`}
              </Text>

              {isNonEmptyArray(judgesUsers) ? (
                <View style={styles.userItemsContainer}>
                  {judgesUsers.map((user) => (
                    <View
                      key={user?.uid}
                      style={[
                        styles.userItemCard,
                        {
                          backgroundColor: cardBg1,
                        },
                      ]}
                    >
                      {isNonEmptyString(user?.photoURL) ? (
                        <Image
                          source={{ uri: user?.photoURL }}
                          style={styles.userItemPhoto}
                        />
                      ) : (
                        <SimpleLineIcons name='user' size={30} color={color2} />
                      )}

                      <View style={styles.userItemTextContainer}>
                        <Text
                          style={[
                            styles.userItemNameText,
                            {
                              color: isPublished ? color1 : color3,
                            },
                          ]}
                        >
                          {user?.displayName}
                        </Text>
                        <Text
                          style={[
                            styles.userItemUsernameText,
                            {
                              color: isPublished ? color4 : color3,
                            },
                          ]}
                        >
                          {'@' + user?.username}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View
                  style={[
                    styles.userTypeCard,
                    {
                      backgroundColor: cardBg1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.userTypeDescription,
                      { color: isPublished ? color1 : color3 },
                    ]}
                  >
                    {`Sin jueces`}
                  </Text>
                </View>
              )}
            </View>
          )}

          {(loggedUserIsOwner || loggedUserIsParticipant) && (
            <View
              style={[
                styles.card,
                styles.userTypeContainerCard,
                { backgroundColor: cardBg2 },
              ]}
            >
              <Text
                style={[
                  styles.userTypeTitle,
                  { color: isPublished ? color1 : color3 },
                ]}
              >
                {`Participantes (${participantsUsers?.length || 0})`}
              </Text>

              {isNonEmptyArray(participantsUsers) ? (
                <View style={styles.userItemsContainer}>
                  {participantsUsers.map((user) => (
                    <View
                      key={user?.uid}
                      style={[
                        styles.userItemCard,
                        {
                          backgroundColor: cardBg1,
                        },
                      ]}
                    >
                      {isNonEmptyString(user?.photoURL) ? (
                        <Image
                          source={{ uri: user?.photoURL }}
                          style={styles.userItemPhoto}
                        />
                      ) : (
                        <SimpleLineIcons name='user' size={30} color={color2} />
                      )}

                      <View style={styles.userItemTextContainer}>
                        <Text
                          style={[
                            styles.userItemNameText,
                            {
                              color: isPublished ? color1 : color3,
                            },
                          ]}
                        >
                          {user?.displayName}
                        </Text>
                        <Text
                          style={[
                            styles.userItemUsernameText,
                            {
                              color: isPublished ? color4 : color3,
                            },
                          ]}
                        >
                          {'@' + user?.username}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View
                  style={[
                    styles.userTypeCard,
                    {
                      backgroundColor: cardBg1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.userTypeDescription,
                      { color: isPublished ? color1 : color3 },
                    ]}
                  >
                    {`Sin participantes`}
                  </Text>
                </View>
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
    paddingVertical: 10,
    paddingHorizontal: 20,
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
    marginBottom: 30,
  },
  eventBannerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  eventBanner: {
    aspectRatio: 1,
    width: '100%',
    maxWidth: 400,
  },
  eventTitle: {
    fontSize: 20,
    fontFamily: 'Ubuntu500',
    marginBottom: 8,
  },
  pausedEventTitle: {
    fontSize: 24,
    fontFamily: 'Ubuntu700',
    textAlign: 'center',
  },
  eventSubtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 1,
  },
  eventSubtitle: {
    fontSize: 18,
    fontFamily: 'Ubuntu500',
  },
  eventRoleSubtitle: {
    fontSize: 18,
    fontFamily: 'Ubuntu600',
  },
  eventDate: {
    textTransform: 'uppercase',
  },
  eventDescription: {
    fontSize: 18,
    fontFamily: 'Ubuntu400',
    marginTop: 8,
  },
  eventAuhtor: {
    fontSize: 16,
    fontFamily: 'Ubuntu400',
    textAlign: 'right',
  },
  userTypeContainerCard: {
    padding: 10,
  },
  userTypeTitle: {
    fontSize: 20,
    fontFamily: 'Ubuntu500',
    textAlign: 'center',
  },
  userTypeDescription: {
    fontSize: 16,
    fontFamily: 'Ubuntu400',
    textAlign: 'center',
  },
  userTypeCard: {
    padding: 10,
    borderRadius: 5,
  },
  userItemsContainer: { gap: 10 },
  userItemCard: {
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userItemPhoto: {
    aspectRatio: 1,
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  userItemTextContainer: { flexShrink: 1 },
  userItemNameText: {
    fontSize: 16,
    fontFamily: 'Ubuntu500',
  },
  userItemUsernameText: {
    fontSize: 16,
    fontFamily: 'Ubuntu400',
  },
})
