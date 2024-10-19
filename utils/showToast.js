import Toast from 'react-native-root-toast'
import { isNonEmptyString } from 'ramda-adjunct'

import colors from '@/constants/colors'
import { CC_WIDTH_STYLES } from '@/constants/constants'

/**
 * Shows a toast message on the screen.
 *
 * @param {string} [message='...'] The message to show on the toast.
 * @returns {void}
 */
export default function showToast(message) {
  const msg = isNonEmptyString(message) ? message : '...'

  Toast.show(msg, {
    backgroundColor: colors.dark.color4,
    textColor: colors.dark.color5,
    duration: 4000,
    position: 120,
    opacity: 1,
    textStyle: {
      fontSize: 20,
      fontFamily: 'Ubuntu400',
    },
    containerStyle: {
      maxWidth: CC_WIDTH_STYLES.minWidth,
      borderWidth: 1,
      borderColor: colors.dark.color5,
    },
    shadowColor: colors.dark.color5,
  })
}
