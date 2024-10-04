import { View, StyleSheet } from 'react-native'

export default function BlankSpaceView({ children, style }) {
  return <View style={[styles.container, style]}>{children}</View>
}

const styles = StyleSheet.create({
  container: {
    height: 80,
  },
})
