import { doc, getDoc } from 'firebase/firestore'

import { db } from '@/data/firebase'
import formatUserData from '@/utils/formatUserData'

async function getUserByUid(uid) {
  const userDocSnap = await getDoc(doc(db, 'users', uid))
  const userData = userDocSnap.data()

  return formatUserData(uid, userData)
}

export default getUserByUid
