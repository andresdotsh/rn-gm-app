import { View, Text, StyleSheet, Dimensions } from 'react-native'

import useThemeColor from '@/hooks/useThemeColor'
import MainButton from '@/ui/MainButton'
import SecondButton from '@/ui/SecondButton'
import ThirdButton from '@/ui/ThirdButton'

export default function SignupScreen({ scrollToIndex }) {
  const signupBg = useThemeColor('backgroundColor')
  const signupColor = useThemeColor('color4')

  return (
    <View style={[styles.container, { backgroundColor: signupBg }]}>
      <Text style={[styles.text, { color: signupColor }]}>{`Signup`}</Text>

      <View style={{ paddingTop: 20 }}>
        <MainButton
          onPress={() => {
            scrollToIndex(0)
          }}
        >
          {`Go Login`}
        </MainButton>
      </View>

      <View style={{ paddingTop: 20 }}>
        <SecondButton>{`Second Button`}</SecondButton>
      </View>

      <View style={{ paddingTop: 20 }}>
        <ThirdButton>{`Third Button`}</ThirdButton>
      </View>
    </View>
  )
}

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: { width, justifyContent: 'center', alignItems: 'center' },
  text: { fontFamily: 'Ubuntu400', fontSize: 40 },
})
