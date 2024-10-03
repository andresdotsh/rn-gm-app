import { forwardRef } from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'

import useThemeColor from '@/hooks/useThemeColor'

const MainButton = forwardRef(function PressableButton(
  { children, onPress, disabled, style },
  ref,
) {
  const backgroundColor = useThemeColor('btnBg')
  const pressedBackgroundColor = useThemeColor('btnBg2')
  const btnColor = useThemeColor('btnColor')
  const borderColor = useThemeColor('btnBg4')
  const pressedBorderColor = useThemeColor('btnBg3')

  return (
    <Pressable
      style={({ pressed }) => {
        return [
          {
            borderColor: disabled
              ? pressedBackgroundColor
              : pressed
                ? pressedBorderColor
                : borderColor,
            backgroundColor:
              pressed || disabled ? pressedBackgroundColor : backgroundColor,
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
    borderWidth: 2,
  },
  text: {
    textAlign: 'center',
    fontFamily: 'Ubuntu500',
    fontSize: 18,
  },
})
