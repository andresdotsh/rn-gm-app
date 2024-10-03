import { useRef, useCallback } from 'react'
import { View, StyleSheet } from 'react-native'
import { SwiperFlatList } from 'react-native-swiper-flatlist'

import colors from '@/constants/colors'
import LoginScreen from '@/components/LoginSignup/LoginScreen'
import SignupScreen from '@/components/LoginSignup/SignupScreen'

export default function LoginSignup() {
  const swiperRef = useRef(null)

  const scrollToIndex = useCallback((index) => {
    swiperRef.current.scrollToIndex({ animated: true, index })
  }, [])

  return (
    <View style={styles.container}>
      <SwiperFlatList ref={swiperRef} index={1}>
        <LoginScreen scrollToIndex={scrollToIndex} />
        <SignupScreen scrollToIndex={scrollToIndex} />
      </SwiperFlatList>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.backgroundColor },
})
