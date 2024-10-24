import { getDocs, collection } from 'firebase/firestore'

import { db } from '@/data/firebase'

async function getAllEventTypes() {
  const querySnap = await getDocs(collection(db, 'event_types'))
  const dataArr = querySnap.docs.map((doc) => {
    const data = doc.data()
    return { ...data, uid: doc.id }
  })

  return dataArr
}

export default getAllEventTypes
