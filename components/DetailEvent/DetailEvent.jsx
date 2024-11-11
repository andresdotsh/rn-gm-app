import { useState, useCallback, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  RefreshControl,
  ActivityIndicator,
  Image,
} from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { Stack, useRouter } from 'expo-router'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons'
import Feather from '@expo/vector-icons/Feather'
import Ionicons from '@expo/vector-icons/Ionicons'
import { not } from 'ramda'
import { isNonEmptyString, isNonEmptyArray } from 'ramda-adjunct'

import {
  CC_WIDTH_STYLES,
  DATEPICKER_DEFAULT_PROPS,
} from '@/constants/constants'
import useThemeColor from '@/hooks/useThemeColor'
import cmGetEventDetails from '@/data/cmGetEventDetails'
import { useLoggedUserStore } from '@/hooks/useStore'
import MainButton from '@/ui/MainButton'
import ThirdButton from '@/ui/ThirdButton'
import BlankSpaceView from '@/ui/BlankSpaceView'
import dateFnsFormat from '@/utils/dateFnsFormat'

export default function DetailEvent({ eventUid, isPastEvent }) {
  const [refreshing, setRefreshing] = useState(false)

  const mainBg2 = useThemeColor('mainBg2')
  const color1 = useThemeColor('color1')
  const color2 = useThemeColor('color2')
  const color3 = useThemeColor('color3')
  const color4 = useThemeColor('color4')
  const cardBg1 = useThemeColor('cardBg1')
  const cardBg2 = useThemeColor('cardBg2')

  const router = useRouter()

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

  const goToEditEvent = useCallback(() => {
    router.push({
      pathname: '/edit-event/[eventUid]',
      params: { eventUid },
    })
  }, [eventUid, router])

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
          headerTitle: isPastEvent
            ? 'Evento Pasado'
            : isNonEmptyString(eventData?.name)
              ? eventData?.name
              : 'Evento',
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

            <View style={styles.cardContent}>
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
                          DATEPICKER_DEFAULT_PROPS.dateTimeFormat,
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

              {not(isPastEvent) &&
                loggedUserIsOwner &&
                (isPublished ? (
                  <MainButton onPress={goToEditEvent}>{`Editar`}</MainButton>
                ) : (
                  <ThirdButton onPress={goToEditEvent}>{`Editar`}</ThirdButton>
                ))}
            </View>
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
                        <SimpleLineIcons name='user' size={48} color={color2} />
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
                        <SimpleLineIcons name='user' size={48} color={color2} />
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
    borderRadius: 10,
    marginBottom: 30,
    overflow: 'hidden',
  },
  cardContent: {
    gap: 25,
    padding: 20,
  },
  userTypeContainerCard: {
    padding: 10,
    gap: 25,
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
    padding: 5,
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
  },
  eventAuhtor: {
    fontSize: 16,
    fontFamily: 'Ubuntu400',
    textAlign: 'right',
  },
  userTypeTitle: {
    fontSize: 20,
    fontFamily: 'Ubuntu500',
    textAlign: 'center',
    marginTop: 10,
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
