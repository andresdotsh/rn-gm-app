import { getDocs, collection, query, orderBy } from 'firebase/firestore'

import { db } from '@/data/firebase'

async function getAllEvents() {
  const querySnap = await getDocs(
    query(collection(db, 'events'), orderBy('startDate')),
  )
  const dataArr = querySnap.docs.map((doc) => {
    const data = doc.data()
    return { ...data, uid: doc.id }
  })

  return dataArr
}

export default getAllEvents
