import { useState, useCallback, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  RefreshControl,
  ActivityIndicator,
} from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams, Stack } from 'expo-router'

import useThemeColor from '@/hooks/useThemeColor'
import getUserByUid from '@/data/getUserByUid'
import { useLoggedUserStore } from '@/hooks/useStore'
import ThirdButton from '@/ui/ThirdButton'

export default function UserDetail() {
  const [refreshing, setRefreshing] = useState(false)

  const mainBgColor = useThemeColor('backgroundColor')
  const textColor = useThemeColor('color')

  const { uid } = useLocalSearchParams()

  const loggedUserUid = useLoggedUserStore((s) => s.loggedUserUid)
  const setLoggedUserData = useLoggedUserStore((s) => s.setLoggedUserData)

  const { isFetching, isLoading, error, data, refetch } = useQuery({
    queryKey: ['users', uid],
    queryFn: () => getUserByUid(uid),
    enabled: Boolean(uid),
  })

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    refetch()
  }, [refetch])

  useEffect(() => {
    if (!isFetching) {
      setRefreshing(false)
    }
  }, [isFetching])

  useEffect(() => {
    if (loggedUserUid && loggedUserUid === uid && data) {
      setLoggedUserData(data)
    }
  }, [data, loggedUserUid, setLoggedUserData, uid])

  console.log(`-----------------------------------------`)
  console.log(`🚀🚀🚀 >>>`, data)

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: mainBgColor }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          progressBackgroundColor={mainBgColor}
          colors={[textColor]}
          tintColor={textColor}
        />
      }
    >
      <Stack.Screen
        options={{
          headerTitle: 'Perfil',
          headerLeft: null,
          headerRight: null,
          headerStyle: {
            backgroundColor: mainBgColor,
          },
        }}
      />
      {isLoading ? (
        <View style={styles.noContent}>
          <ActivityIndicator size='large' color={textColor} />
        </View>
      ) : !data || error ? (
        <View style={styles.noContent}>
          <Text
            style={[styles.errorText, { color: textColor }]}
          >{`Ha ocurrido un error al obtener los datos, o puede ser que no tengas conexión a internet.`}</Text>
          <ThirdButton
            loading={isFetching}
            disabled={isFetching}
            onPress={refetch}
          >{`Reintentar`}</ThirdButton>
        </View>
      ) : (
        <View style={{}}>
          <Text
            style={[styles.text, { color: textColor }]}
          >{`User detail: ${uid}`}</Text>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  noContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontFamily: 'Ubuntu400',
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Ubuntu400',
    textAlign: 'center',
    marginBottom: 20,
  },
})
