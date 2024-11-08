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
import { LinearGradient } from 'expo-linear-gradient'

import useThemeColor from '@/hooks/useThemeColor'
import BlankSpaceView from '@/ui/BlankSpaceView'
import MainButton from '@/ui/MainButton'
import ThirdButton from '@/ui/ThirdButton'
import cmGetHomeEvents from '@/data/cmGetHomeEvents'
import dateFnsFormat from '@/utils/dateFnsFormat'
import {
  CC_WIDTH_STYLES,
  DATEPICKER_DEFAULT_PROPS,
} from '@/constants/constants'

export default function Index() {
  const [refreshing, setRefreshing] = useState(false)

  const mainBg1 = useThemeColor('mainBg1')
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
    queryKey: ['cm_home_events'],
    queryFn: () => cmGetHomeEvents(),
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
    <View style={[styles.mainContainer, { backgroundColor: mainBg1 }]}>
      <LinearGradient
        colors={['transparent', mainBg2, mainBg2]}
        style={styles.lgBg}
      />

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
                  pathname: '/event/[uid]',
                  params: { uid: userEvent?.uid },
                })
              }

              return (
                <View
                  key={userEvent?.uid}
                  style={[
                    styles.card,
                    {
                      backgroundColor: cardBg2,
                      borderColor: color3,
                    },
                  ]}
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

                  <View style={styles.cardContent}>
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
                        <Ionicons
                          name='medal-outline'
                          size={16}
                          color={color3}
                        />
                        <Text style={[styles.eventSubtitle, { color: color3 }]}>
                          {userEvent?._eventType?.name || '---'}
                        </Text>
                      </View>
                    </View>

                    {isNonEmptyString(userEvent?.description) && (
                      <Text
                        style={[styles.eventDescription, { color: color2 }]}
                      >
                        {userEvent?.description}
                      </Text>
                    )}

                    <View style={styles.buttonContainer}>
                      <MainButton
                        onPress={goToEventDetail}
                      >{`Detalle`}</MainButton>
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
              {`No hay eventos para mostrar.`}
            </Text>
            <Text style={[styles.errorText, { color: color2 }]}>
              {`Aquí aparecerán todos los eventos activos publicados.`}
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
    marginBottom: 30,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
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
