import Toast from 'react-native-root-toast'
import { isNonEmptyString } from 'ramda-adjunct'

import colors from '@/constants/colors'

/**
 * Shows a toast message on the screen.
 *
 * @param {string} [message='...'] The message to show on the toast.
 * @returns {void}
 */
export default function showToast(message) {
  const msg = isNonEmptyString(message) ? message : '...'

  Toast.show(msg, {
    backgroundColor: colors.dark.btn1,
    textColor: colors.dark.color1,
    duration: Toast.durations.LONG,
    position: 100,
    opacity: 1,
  })
}
