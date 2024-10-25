import { doc, getDoc } from 'firebase/firestore'

import { db } from '@/data/firebase'

async function getEventByUid(eventUid) {
  const docSnap = await getDoc(doc(db, 'events', eventUid))
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
