import { forwardRef } from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'

import useThemeColor from '@/hooks/useThemeColor'

const SecondButton = forwardRef(function SecondPressableButton(
  { children, onPress, disabled, style, leftIcon, rightIcon },
  ref,
) {
  const backgroundColor = useThemeColor('btnColor')
  const btnColor = useThemeColor('backgroundColor')
  const borderColor = useThemeColor('color3')

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
      {Boolean(leftIcon) && leftIcon}
      <Text style={[{ color: btnColor }, styles.text]}>{children}</Text>
      {Boolean(rightIcon) && rightIcon}
    </Pressable>
  )
})

export default SecondButton

const styles = StyleSheet.create({
  pressable: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
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
