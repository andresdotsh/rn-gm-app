import { doc, getDoc } from 'firebase/firestore'

import { db } from '@/data/firebase'

async function getEventByUid(uid) {
  const docSnap = await getDoc(doc(db, 'events', uid))
  const data = docSnap.data()

  if (data) {
    return {
      ...data,
      uid: docSnap.id,
    }
  }

  return null
}

export default getEventByUid
