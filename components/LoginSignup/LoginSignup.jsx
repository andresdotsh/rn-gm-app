import { useRef, useCallback, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { SwiperFlatList } from 'react-native-swiper-flatlist'

import colors from '@/constants/colors'
import LoginScreen from '@/components/LoginSignup/LoginScreen'
import SignupScreen from '@/components/LoginSignup/SignupScreen'

export default function LoginSignup() {
  const swiperRef = useRef(null)

  const [isAuthenticating, setIsAuthenticating] = useState(false) // TODO: -> change default to true

  const scrollToIndex = useCallback((index) => {
    swiperRef.current.scrollToIndex({ animated: true, index })
  }, [])

  return (
    <View style={styles.container}>
      <SwiperFlatList ref={swiperRef} disableGesture={isAuthenticating}>
        <LoginScreen
          scrollToIndex={scrollToIndex}
          isAuthenticating={isAuthenticating}
          setIsAuthenticating={setIsAuthenticating}
        />

        <SignupScreen
          scrollToIndex={scrollToIndex}
          isAuthenticating={isAuthenticating}
          setIsAuthenticating={setIsAuthenticating}
        />
      </SwiperFlatList>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.backgroundColor },
})
