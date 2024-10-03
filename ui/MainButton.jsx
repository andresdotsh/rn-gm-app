import { forwardRef } from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'

import useThemeColor from '@/hooks/useThemeColor'

const MainButton = forwardRef(function MainPressableButton(
  { children, onPress, disabled, style },
  ref,
) {
  const backgroundColor = useThemeColor('btnBg')
  const btnColor = useThemeColor('btnColor')
  const borderColor = useThemeColor('btnBg4')

  return (
    <Pressable
      style={({ pressed }) => {
        return [
          {
            backgroundColor,
            borderColor: disabled ? backgroundColor : borderColor,
            opacity: disabled ? 0.6 : pressed ? 0.8 : 1,
          },
          styles.pressable,
          style,
        ]
      }}
      disabled={disabled}
      onPress={onPress}
      ref={ref}
    >
      <Text style={[{ color: btnColor }, styles.text]}>{children}</Text>
    </Pressable>
  )
})

export default MainButton

const styles = StyleSheet.create({
  pressable: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 50,
    borderWidth: 1,
  },
  text: {
    textAlign: 'center',
    fontFamily: 'Ubuntu500',
    fontSize: 18,
  },
})
