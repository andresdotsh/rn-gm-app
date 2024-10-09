import { Modal, View, StyleSheet, Pressable, Text } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { isNonEmptyString } from 'ramda-adjunct'

import useThemeColor from '@/hooks/useThemeColor'

export default function MainModal({
  title,
  visible,
  onPressClose,
  children,
  transparent = true,
  animationType = 'slide',
}) {
  const modalBg = useThemeColor('modalBg')
  const modalTitleColor = useThemeColor('color')

  const insets = useSafeAreaInsets()

  return (
    <Modal
      visible={visible}
      animationType={animationType}
      transparent={transparent}
      onRequestClose={onPressClose}
    >
      <View
        style={[
          styles.container,
          {
            marginTop: insets.top,
            backgroundColor: modalBg,
          },
        ]}
      >
        <View style={styles.topBar}>
          <Pressable
            style={({ pressed }) => {
              return {
                opacity: pressed ? 0.8 : 1,
              }
            }}
            onPress={onPressClose}
          >
            <Ionicons name='close-sharp' size={24} color={modalTitleColor} />
          </Pressable>

          {isNonEmptyString(title) && (
            <Text style={[styles.titleText, { color: modalTitleColor }]}>
              {title}
            </Text>
          )}
        </View>

        {children}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    padding: 10,
  },
  titleText: {
    fontFamily: 'Ubuntu500',
    fontSize: 18,
    flexShrink: 1,
  },
})
