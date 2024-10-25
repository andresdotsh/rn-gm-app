import { getDocs, collection, query, where } from 'firebase/firestore'

import { db } from '@/data/firebase'

async function getEventsUsersByUserUid(userUid) {
  const querySnap = await getDocs(
    query(collection(db, 'events_users'), where('userUid', '==', userUid)),
  )
  const dataArr = querySnap.docs.map((doc) => {
    const data = doc.data()
    return { ...data, uid: doc.id }
  })

  return dataArr
}

export default getEventsUsersByUserUid
