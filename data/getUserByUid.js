import { doc, getDoc } from 'firebase/firestore'

import { db } from '@/data/firebase'
import formatUserData from '@/utils/formatUserData'

async function getUserByUid(userUid) {
  const docSnap = await getDoc(doc(db, 'users', userUid))
  const data = docSnap.data()

  return formatUserData(userUid, data)
}

export default getUserByUid
