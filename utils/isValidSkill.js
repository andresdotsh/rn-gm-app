import { isValidNumber, isInteger } from 'ramda-adjunct'

export default function isValidSkill(value) {
  return isValidNumber(value) && isInteger(value) && value >= 0 && value <= 100
}
