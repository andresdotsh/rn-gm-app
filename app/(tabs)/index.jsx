import { StyleSheet, Text, View, ScrollView } from 'react-native'

import useThemeColor from '@/hooks/useThemeColor'
import { CC_WIDTH_STYLES } from '@/constants/constants'

export default function Index() {
  const mainBg = useThemeColor('mainBg1')
  const textColor = useThemeColor('color1')

  return (
    <ScrollView
      style={{ backgroundColor: mainBg }}
      contentContainerStyle={styles.svContentContainer}
    >
      <View>
        <Text
          style={[styles.text, { color: textColor }]}
        >{`Hello World!`}</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  svContentContainer: {
    flexGrow: 1,
    padding: 20,
    ...CC_WIDTH_STYLES,
  },
  text: {
    fontSize: 20,
    fontFamily: 'Ubuntu400',
    textAlign: 'center',
  },
})
