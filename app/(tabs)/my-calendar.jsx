import { useCallback, useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
  RefreshControl,
  ActivityIndicator,
} from 'react-native'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { signOut } from 'firebase/auth'
import { useNavigation } from '@react-navigation/native'
import { useRouter } from 'expo-router'
import { isNonEmptyString } from 'ramda-adjunct'
import { useQuery } from '@tanstack/react-query'

import useThemeColor from '@/hooks/useThemeColor'
import { useLoggedUserStore } from '@/hooks/useStore'
import BlankSpaceView from '@/ui/BlankSpaceView'
import MainButton from '@/ui/MainButton'
import SecondButton from '@/ui/SecondButton'
import ThirdButton from '@/ui/ThirdButton'
import MainModal from '@/ui/MainModal'
import cmGetUserEventsCalendar from '@/data/cmGetUserEventsCalendar'
import { CC_WIDTH_STYLES } from '@/constants/constants'

export default function MyCalendar() {
  const [refreshing, setRefreshing] = useState(false)

  const mainBg2 = useThemeColor('mainBg2')
  const color1 = useThemeColor('color1')
  const color2 = useThemeColor('color2')
  const color3 = useThemeColor('color3')
  const color4 = useThemeColor('color4')

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

  console.log(
    `🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢 cmUserEventsIsFetching >`,
    cmUserEventsIsFetching,
  )

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
      ) : (
        <View>
          <Text style={{ color: color1 }}>{`hello world`}</Text>
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
})
