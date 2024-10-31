import { getDocs, collection, query, orderBy, where } from 'firebase/firestore'

import { db } from '@/data/firebase'

async function getAllPublishedEvents(isPublished = true) {
  const querySnap = await getDocs(
    query(
      collection(db, 'events'),
      where('isPublished', '==', Boolean(isPublished)),
      orderBy('startDate'),
    ),
  )
  const dataArr = querySnap.docs.map((doc) => {
    const data = doc.data()
    return { ...data, uid: doc.id }
  })

  return dataArr
}

export default getAllPublishedEvents
