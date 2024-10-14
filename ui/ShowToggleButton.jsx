import { forwardRef } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'

import useThemeColor from '@/hooks/useThemeColor'

const ShowToggleButton = forwardRef(function ShowPressableButton(
  { disabled, onPress, value, style },
  ref,
) {
  const bgColor = useThemeColor('mainBg2')
  const color = useThemeColor('color1')

  return (
    <Pressable
      ref={ref}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => {
        return [
          styles.pressable,
          {
            backgroundColor: bgColor,
            opacity: disabled ? 0.6 : pressed ? 0.8 : 1,
          },
          style,
        ]
      }}
    >
      {value ? (
        <FontAwesome5 name='eye' size={18} color={color} />
      ) : (
        <FontAwesome5 name='eye-slash' size={18} color={color} />
      )}
    </Pressable>
  )
})

export default ShowToggleButton

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 10,
    width: 50,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
