import { StyleSheet } from 'react-native'

import View from '@/ui/ThemedView'
import Text from '@/ui/ThemedText'

export default function App() {
  return (
    <View style={styles.container}>
      <Text
        style={{ fontSize: 20, fontFamily: 'Ubuntu400' }}
      >{`Hello World!`}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
