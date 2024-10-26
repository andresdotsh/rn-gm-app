import { isNonEmptyString } from 'ramda-adjunct'

export default function safeString(value) {
  return isNonEmptyString(value) ? value : ''
}
