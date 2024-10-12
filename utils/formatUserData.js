import { omit } from 'ramda'

export default function formatUserData(uid, userData) {
  const cleanData = omit(
    ['createdAt', 'lastLogin', 'loginCount', 'providerData'],
    userData,
  )

  return { ...cleanData, uid }
}
