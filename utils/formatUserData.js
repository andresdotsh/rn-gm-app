import { omit, type } from 'ramda'

/**
 * Given a user's data, returns a formatted version of it, with only the relevant
 * fields.
 *
 * @param {String} uid - the user's id
 * @param {Object} userData - the user's data
 * @return {Object|Null} the formatted data, or null if the input is not an object.
 */
export default function formatUserData(uid, userData) {
  if (type(userData) !== 'Object') {
    return null
  }

  const cleanData = omit(['createdAt', 'lastLogin', 'loginCount'], userData)

  return { ...cleanData, uid }
}
