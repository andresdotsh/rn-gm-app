import { startsWith, not } from 'ramda'
import { isNonEmptyString } from 'ramda-adjunct'

export default function isLocalImageFileUri(value) {
  return isNonEmptyString(value) && not(startsWith('https://', value))
}
