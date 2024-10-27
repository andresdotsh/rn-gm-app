import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  Text,
  ScrollView,
} from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { isNonEmptyString, isFunction } from 'ramda-adjunct'

import useThemeColor from '@/hooks/useThemeColor'
import { CC_WIDTH_STYLES } from '@/constants/constants'

const SUPPORTED_ORIENTATIONS = [
  'portrait',
  'portrait-upside-down',
  'landscape',
  'landscape-left',
  'landscape-right',
]

export default function MainModal({
  title,
  visible,
  onPressClose,
  disabled,
  children,
  regularView = false,
  transparent = true,
  animationType = 'slide',
}) {
  const modalBg1 = useThemeColor('modalBg1')
  const modalTitleColor = useThemeColor('color1')

  const insets = useSafeAreaInsets()

  return (
    <Modal
      visible={visible}
      animationType={animationType}
      transparent={transparent}
      supportedOrientations={SUPPORTED_ORIENTATIONS}
      onRequestClose={() => {
        if (!disabled && isFunction(onPressClose)) {
          onPressClose()
        }
      }}
    >
      <View
        style={[
          styles.mainContainer,
          {
            marginTop: insets.top,
            backgroundColor: modalBg1,
          },
        ]}
      >
        <View style={styles.topBar}>
          <Pressable
            style={({ pressed }) => {
              return {
                opacity: disabled ? 0.6 : pressed ? 0.8 : 1,
              }
            }}
            onPress={(e) => {
              if (!disabled && isFunction(onPressClose)) {
                onPressClose(e)
              }
            }}
          >
            <Ionicons name='close-sharp' size={24} color={modalTitleColor} />
          </Pressable>

          {isNonEmptyString(title) && (
            <Text style={[styles.titleText, { color: modalTitleColor }]}>
              {title}
            </Text>
          )}
        </View>

        {regularView ? (
          <View style={styles.regularContainer}>{children}</View>
        ) : (
          <ScrollView contentContainerStyle={styles.svContentContainer}>
            {children}
          </ScrollView>
        )}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  svContentContainer: {
    flexGrow: 1,
    ...CC_WIDTH_STYLES,
  },
  regularContainer: {
    flex: 1,
    ...CC_WIDTH_STYLES,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    padding: 10,
    ...CC_WIDTH_STYLES,
  },
  titleText: {
    fontFamily: 'Ubuntu500',
    fontSize: 18,
    flexShrink: 1,
  },
})
