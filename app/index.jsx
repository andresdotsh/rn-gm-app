import { StyleSheet, Text, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'

export default function App() {
  return (
    <View style={styles.container}>
      <Ionicons name='glasses-sharp' size={30} color='black' />
      <Text
        style={{ fontSize: 20, fontFamily: 'Ubuntu400' }}
      >{`Hello World!`}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
