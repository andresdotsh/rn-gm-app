import { forwardRef } from 'react'
import { Pressable, StyleSheet, Text, ActivityIndicator } from 'react-native'
import { isNonEmptyString } from 'ramda-adjunct'

import useThemeColor from '@/hooks/useThemeColor'

const ThirdButton = forwardRef(function ThirdPressableButton(
  { children, onPress, disabled, loading, style, leftIcon, rightIcon },
  ref,
) {
  const backgroundColor = useThemeColor('btn5')
  const color1 = useThemeColor('color1')
  const borderColor = useThemeColor('color3')

  return (
    <Pressable
      style={({ pressed }) => {
        return [
          {
            backgroundColor,
            borderColor: disabled ? backgroundColor : borderColor,
            opacity: disabled || pressed ? 0.8 : 1,
          },
          styles.pressable,
          style,
        ]
      }}
      disabled={disabled}
      onPress={onPress}
      ref={ref}
    >
      {Boolean(loading) && <ActivityIndicator size='small' color={color1} />}

      {Boolean(leftIcon) && leftIcon}

      {isNonEmptyString(children) ? (
        <Text style={[{ color: color1 }, styles.text]}>{children}</Text>
      ) : (
        children
      )}

      {Boolean(rightIcon) && rightIcon}
    </Pressable>
  )
})

export default ThirdButton

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
