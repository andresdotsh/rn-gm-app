import { useState, useCallback, useEffect } from 'react'
import { StyleSheet, Text, ScrollView, RefreshControl } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams, Stack } from 'expo-router'

import useThemeColor from '@/hooks/useThemeColor'
import getUserByUid from '@/data/getUserByUid'

export default function UserDetail() {
  const [refreshing, setRefreshing] = useState(false)

  const mainBgColor = useThemeColor('backgroundColor')
  const textColor = useThemeColor('color')

  const { uid } = useLocalSearchParams()

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

  console.log(`-----------------------------------------`)
  console.log(`🚀🚀🚀 >>>`, {
    isLoading,
    isFetching,
    error,
    data,
  })

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
      <Text
        style={[styles.text, { color: textColor }]}
      >{`User detail: ${uid}`}</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontFamily: 'Ubuntu400',
  },
})
