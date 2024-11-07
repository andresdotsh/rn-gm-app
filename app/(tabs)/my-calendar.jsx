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
import { not } from 'ramda'
import { isNonEmptyArray, isNonEmptyString } from 'ramda-adjunct'
import { useQuery } from '@tanstack/react-query'
import { LinearGradient } from 'expo-linear-gradient'

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

  const mainBg1 = useThemeColor('mainBg1')
  const mainBg2 = useThemeColor('mainBg2')
  const color1 = useThemeColor('color1')
  const color2 = useThemeColor('color2')
  const color3 = useThemeColor('color3')
  const color4 = useThemeColor('color4')
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
    queryKey: ['cm_user_events_calendar', loggedUserUid],
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
    <View style={[styles.mainContainer, { backgroundColor: mainBg1 }]}>
      <LinearGradient colors={['transparent', mainBg2]} style={styles.lgBg} />

      <ScrollView
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
        <ThirdButton
          style={styles.createEventBtn}
          onPress={() => {
            router.push({
              pathname: '/create-event',
            })
          }}
        >{`Crear Evento`}</ThirdButton>

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
              const isPublished = not(userEvent?.isPublished === false)
              const bannerOpacity = isPublished ? 1 : 0.5
              const userEventRoleText =
                userEvent?._role === EVENT_ROLE_OWNER
                  ? 'CREASTE ESTE EVENTO'
                  : userEvent?._role === EVENT_ROLE_JUDGE
                    ? 'ERES JUEZ'
                    : userEvent?._role === EVENT_ROLE_PARTICIPANT
                      ? 'ERES PARTICIPANTE'
                      : 'NO TIENES ROL'

              const goToEventDetail = () => {
                router.push({
                  pathname: '/event/[uid]',
                  params: { uid: userEvent?.uid },
                })
              }

              return (
                <View
                  key={userEvent?.uid}
                  style={[styles.card, { backgroundColor: cardBg2 }]}
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
                                DATEPICKER_DEFAULT_PROPS.dateTimeFormat,
                              )
                            : '---'}
                        </Text>
                      </View>

                      <View style={styles.eventSubtitleContainer}>
                        <Ionicons
                          name='medal-outline'
                          size={16}
                          color={isPublished ? color3 : color3}
                        />
                        <Text
                          style={[
                            styles.eventSubtitle,
                            { color: isPublished ? color3 : color3 },
                          ]}
                        >
                          {userEvent?._eventType?.name || '---'}
                        </Text>
                      </View>
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
                </View>
              )
            })}

            <BlankSpaceView />
          </>
        ) : (
          <View style={styles.noContent}>
            <Text style={[styles.errorText, { color: color2 }]}>
              {`No hay eventos en tu calendario.`}
            </Text>
            <Text style={[styles.errorText, { color: color2 }]}>
              {`Aquí aparecerán los eventos que hayas creado, o en los que tengas un rol como juez o participante.`}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  lgBg: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
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
    marginBottom: 30,
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
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
})
