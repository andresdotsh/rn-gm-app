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
import getEventByUid from '@/data/getEventByUid'
import { useLoggedUserStore } from '@/hooks/useStore'
import MainButton from '@/ui/MainButton'
import ThirdButton from '@/ui/ThirdButton'
import BlankSpaceView from '@/ui/BlankSpaceView'
import isValidSkill from '@/utils/isValidSkill'

export default function EventDetail() {
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

  const {
    isFetching: eventIsFetching,
    isLoading: eventIsLoading,
    error: eventError,
    data: eventData,
    refetch: eventRefetch,
  } = useQuery({
    queryKey: ['events', uid],
    queryFn: () => getEventByUid(uid),
    enabled: Boolean(uid),
  })

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    eventRefetch()
  }, [eventRefetch])

  useEffect(() => {
    if (!eventIsFetching) {
      setRefreshing(false)
    }
  }, [eventIsFetching])

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
          headerTitle: 'Evento',
          headerLeft: null,
          headerRight: null,
          headerStyle: {
            backgroundColor: mainBg2,
          },
        }}
      />

      {eventIsLoading ? (
        <View style={styles.noContent}>
          <ActivityIndicator size='large' color={color1} />
        </View>
      ) : !eventData || eventError ? (
        <View style={styles.noContent}>
          <Text style={[styles.errorText, { color: color1 }]}>
            {`Ha ocurrido un error al obtener los datos. Puede ser que no tengas conexión a internet, o que el evento no exista.`}
          </Text>

          <ThirdButton
            loading={eventIsFetching}
            disabled={eventIsFetching}
            onPress={() => {
              eventRefetch()
            }}
          >{`Reintentar`}</ThirdButton>
        </View>
      ) : (
        <View>
          <View style={[styles.card, { backgroundColor: cardBg1 }]}>
            <Text style={[styles.errorText, { color: color1 }]}>
              {`Hello world ` + uid}
            </Text>
          </View>
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
})
