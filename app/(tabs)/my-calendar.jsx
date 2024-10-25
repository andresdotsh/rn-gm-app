import { useCallback, useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native'
import Feather from '@expo/vector-icons/Feather'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import { isNonEmptyArray, isNonEmptyString } from 'ramda-adjunct'
import { useQuery } from '@tanstack/react-query'

import useThemeColor from '@/hooks/useThemeColor'
import { useLoggedUserStore } from '@/hooks/useStore'
import BlankSpaceView from '@/ui/BlankSpaceView'
import MainButton from '@/ui/MainButton'
import ThirdButton from '@/ui/ThirdButton'
import cmGetUserEventsCalendar from '@/data/cmGetUserEventsCalendar'
import dateFnsFormat from '@/utils/dateFnsFormat'
import {
  CC_WIDTH_STYLES,
  DATEPICKER_DEFAULT_PROPS,
  EVENT_ROLE_OWNER,
  EVENT_ROLE_JUDGE,
  EVENT_ROLE_PARTICIPANT,
} from '@/constants/constants'

export default function MyCalendar() {
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
    isLoading: cmUserEventsIsLoading,
    isFetching: cmUserEventsIsFetching,
    data: cmUserEventsData,
    error: cmUserEventsError,
    refetch: cmUserEventsRefetch,
  } = useQuery({
    queryKey: ['cm_user_events', loggedUserUid],
    queryFn: () => cmGetUserEventsCalendar(loggedUserUid),
    enabled: Boolean(loggedUserUid),
  })

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    cmUserEventsRefetch()
  }, [cmUserEventsRefetch])

  useEffect(() => {
    if (!cmUserEventsIsFetching) {
      setRefreshing(false)
    }
  }, [cmUserEventsIsFetching])

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
      <ThirdButton style={styles.createEventBtn}>{`Crear Evento`}</ThirdButton>

      {cmUserEventsIsLoading ? (
        <View style={styles.noContent}>
          <ActivityIndicator size='large' color={color1} />
        </View>
      ) : !cmUserEventsData || cmUserEventsError ? (
        <View style={styles.noContent}>
          <Text style={[styles.errorText, { color: color1 }]}>
            {`Ha ocurrido un error al obtener los datos. Puede ser que no tengas conexión a internet.`}
          </Text>

          <ThirdButton
            loading={cmUserEventsIsFetching}
            disabled={cmUserEventsIsFetching}
            onPress={() => {
              cmUserEventsRefetch()
            }}
          >{`Reintentar`}</ThirdButton>
        </View>
      ) : isNonEmptyArray(cmUserEventsData) ? (
        <>
          {cmUserEventsData.map((userEvent) => {
            const isPublished = userEvent?.isPublished
            const bannerOpacity = isPublished ? 1 : 0.5
            const userEventRoleText =
              userEvent?._role === EVENT_ROLE_OWNER
                ? 'CREASTE ESTE EVENTO'
                : userEvent?._role === EVENT_ROLE_JUDGE
                  ? 'ERES JUEZ'
                  : userEvent?._role === EVENT_ROLE_PARTICIPANT
                    ? 'ERES PARTICIPANTE'
                    : '---'

            const goToEventDetail = () => {
              router.push({
                pathname: '/event/[uid]',
                params: { uid: userEvent?.uid },
              })
            }

            return (
              <View
                key={userEvent?.uid}
                style={[
                  styles.card,
                  { backgroundColor: isPublished ? cardBg2 : cardBg1 },
                ]}
              >
                {!isPublished && (
                  <Text style={[styles.pausedEventTitle, { color: color3 }]}>
                    {`EVENTO PAUSADO`}
                  </Text>
                )}

                {isNonEmptyString(userEvent?.bannerUrl) && (
                  <View style={styles.eventBannerContainer}>
                    <Image
                      source={{ uri: userEvent?.bannerUrl }}
                      style={[styles.eventBanner, { opacity: bannerOpacity }]}
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
                    {userEvent?.name}
                  </Text>

                  <View style={styles.eventSubtitleContainer}>
                    <Feather
                      name='user'
                      size={16}
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
                      size={16}
                      color={isPublished ? color4 : color3}
                    />
                    <Text
                      style={[
                        styles.eventSubtitle,
                        styles.eventDate,
                        { color: isPublished ? color4 : color3 },
                      ]}
                    >
                      {isNonEmptyString(userEvent?.startDateIsoString)
                        ? dateFnsFormat(
                            new Date(userEvent?.startDateIsoString),
                            DATEPICKER_DEFAULT_PROPS.dateFormat,
                          )
                        : '---'}
                    </Text>
                  </View>

                  <View style={styles.eventSubtitleContainer}>
                    <Ionicons name='medal-outline' size={16} color={color3} />
                    <Text style={[styles.eventSubtitle, { color: color3 }]}>
                      {userEvent?._eventType?.name || '---'}
                    </Text>
                  </View>

                  {isNonEmptyString(userEvent?.description) && (
                    <Text
                      style={[
                        styles.eventDescription,
                        { color: isPublished ? color2 : color3 },
                      ]}
                    >
                      {userEvent?.description}
                    </Text>
                  )}
                </View>

                <View style={styles.buttonContainer}>
                  {isPublished ? (
                    <MainButton
                      onPress={goToEventDetail}
                    >{`Detalle`}</MainButton>
                  ) : (
                    <ThirdButton
                      onPress={goToEventDetail}
                    >{`Detalle`}</ThirdButton>
                  )}
                </View>
              </View>
            )
          })}

          <BlankSpaceView />
        </>
      ) : (
        <View style={styles.noContent}>
          <Text style={[styles.errorText, { color: color1 }]}>
            {`No tienes eventos en tu calendario.`}
          </Text>
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
  createEventBtn: {
    marginBottom: 25,
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
    fontSize: 22,
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
    fontSize: 16,
    fontFamily: 'Ubuntu400',
  },
  eventRoleSubtitle: {
    fontSize: 16,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
})
