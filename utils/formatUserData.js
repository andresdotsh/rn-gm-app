import { omit, type } from 'ramda'

export default function formatUserData(uid, userData) {
  if (type(userData) !== 'Object') {
    return null
  }

  const cleanData = omit(
    ['createdAt', 'lastLogin', 'loginCount', 'providerData'],
    userData,
  )

  return { ...cleanData, uid }
}
