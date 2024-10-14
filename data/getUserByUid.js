import { doc, getDoc } from 'firebase/firestore'

import { db } from '@/data/firebase'
import formatUserData from '@/utils/formatUserData'

async function getUserByUid(uid) {
  const docSnap = await getDoc(doc(db, 'users', uid))
  const data = docSnap.data()

  return formatUserData(uid, data)
}

export default getUserByUid
