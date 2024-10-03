import { View, Text, StyleSheet, Dimensions } from 'react-native'

import useThemeColor from '@/hooks/useThemeColor'
import MainButton from '@/ui/MainButton'
import SecondButton from '@/ui/SecondButton'
import ThirdButton from '@/ui/ThirdButton'

export default function LoginScreen({ scrollToIndex }) {
  const loginBg = useThemeColor('color4')
  const loginColor = useThemeColor('backgroundColor')

  return (
    <View style={[styles.container, { backgroundColor: loginBg }]}>
      <Text style={[styles.text, { color: loginColor }]}>{`Login`}</Text>

      <View style={{ paddingTop: 20 }}>
        <MainButton
          onPress={() => {
            scrollToIndex(1)
          }}
        >
          {`Go Signup`}
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
