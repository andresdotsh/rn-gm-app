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
import { useRouter, Stack } from 'expo-router'
import { isNonEmptyArray, isNonEmptyString } from 'ramda-adjunct'
import { useQuery } from '@tanstack/react-query'

import useThemeColor from '@/hooks/useThemeColor'
import BlankSpaceView from '@/ui/BlankSpaceView'
import MainButton from '@/ui/MainButton'
import ThirdButton from '@/ui/ThirdButton'
import cmGetPastEvents from '@/data/cmGetPastEvents'
import dateFnsFormat from '@/utils/dateFnsFormat'
import {
  CC_WIDTH_STYLES,
  DATEPICKER_DEFAULT_PROPS,
} from '@/constants/constants'

export default function EventsHistory() {
  const [refreshing, setRefreshing] = useState(false)

  const mainBg2 = useThemeColor('mainBg2')
  const color1 = useThemeColor('color1')
  const color2 = useThemeColor('color2')
  const color3 = useThemeColor('color3')
  const color4 = useThemeColor('color4')
  const cardBg2 = useThemeColor('cardBg2')

  const router = useRouter()

  const {
    isLoading: cmHomeEventsIsLoading,
    isFetching: cmHomeEventsIsFetching,
    data: cmHomeEventsData,
    error: cmHomeEventsError,
    refetch: cmHomeEventsRefetch,
  } = useQuery({
    queryKey: ['cm_past_events'],
    queryFn: () => cmGetPastEvents(),
  })

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    cmHomeEventsRefetch()
  }, [cmHomeEventsRefetch])

  useEffect(() => {
    if (!cmHomeEventsIsFetching) {
      setRefreshing(false)
    }
  }, [cmHomeEventsIsFetching])

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
          headerTitle: 'Eventos Pasados',
          headerLeft: null,
          headerRight: null,
          headerStyle: {
            backgroundColor: mainBg2,
          },
        }}
      />

      {cmHomeEventsIsLoading ? (
        <View style={styles.noContent}>
          <ActivityIndicator size='large' color={color1} />
        </View>
      ) : !cmHomeEventsData || cmHomeEventsError ? (
        <View style={styles.noContent}>
          <Text style={[styles.errorText, { color: color1 }]}>
            {`Ha ocurrido un error al obtener los datos. Puede ser que no tengas conexión a internet.`}
          </Text>

          <ThirdButton
            loading={cmHomeEventsIsFetching}
            disabled={cmHomeEventsIsFetching}
            onPress={() => {
              cmHomeEventsRefetch()
            }}
          >{`Reintentar`}</ThirdButton>
        </View>
      ) : isNonEmptyArray(cmHomeEventsData) ? (
        <>
          {cmHomeEventsData.map((userEvent) => {
            const goToEventDetail = () => {
              router.push({
                pathname: '/past-event/[uid]',
                params: { uid: userEvent?.uid },
              })
            }

            return (
              <View
                key={userEvent?.uid}
                style={[styles.card, { backgroundColor: cardBg2 }]}
              >
                {isNonEmptyString(userEvent?.bannerUrl) && (
                  <View style={styles.eventBannerContainer}>
                    <Image
                      source={{ uri: userEvent?.bannerUrl }}
                      style={styles.eventBanner}
                      resizeMode='contain'
                    />
                  </View>
                )}

                <View>
                  <Text style={[styles.eventTitle, { color: color1 }]}>
                    {userEvent?.name}
                  </Text>

                  <View style={styles.eventSubtitleContainer}>
                    <Feather name='calendar' size={16} color={color4} />
                    <Text
                      style={[
                        styles.eventSubtitle,
                        styles.eventDate,
                        { color: color4 },
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
                    <Ionicons name='medal-outline' size={16} color={color3} />
                    <Text style={[styles.eventSubtitle, { color: color3 }]}>
                      {userEvent?._eventType?.name || '---'}
                    </Text>
                  </View>
                </View>

                {isNonEmptyString(userEvent?.description) && (
                  <Text style={[styles.eventDescription, { color: color2 }]}>
                    {userEvent?.description}
                  </Text>
                )}

                <View style={styles.buttonContainer}>
                  <MainButton onPress={goToEventDetail}>{`Detalle`}</MainButton>
                </View>
              </View>
            )
          })}

          <BlankSpaceView />
        </>
      ) : (
        <View style={styles.noContent}>
          <Text style={[styles.errorText, { color: color1 }]}>
            {`No hay eventos pasados para mostrar.`}
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
