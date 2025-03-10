import { getDocs, collection, query, orderBy } from 'firebase/firestore'

import { db } from '@/data/firebase'

async function getAllEventTypes() {
  const querySnap = await getDocs(
    query(collection(db, 'event_types'), orderBy('name')),
  )
  const dataArr = querySnap.docs.map((doc) => {
    const data = doc.data()
    return { ...data, uid: doc.id }
  })

  return dataArr
}

export default getAllEventTypes
