import { getDocs, collection, query, where } from 'firebase/firestore'

import { db } from '@/data/firebase'

async function getEventsUsersByEventUid(eventUid) {
  const querySnap = await getDocs(
    query(collection(db, 'events_users'), where('eventUid', '==', eventUid)),
  )
  const dataArr = querySnap.docs.map((doc) => {
    const data = doc.data()
    return { ...data, uid: doc.id }
  })

  return dataArr
}

export default getEventsUsersByEventUid
