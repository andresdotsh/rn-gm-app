import { getDocs, collection, query, where, orderBy } from 'firebase/firestore'

import { db } from '@/data/firebase'

async function getEventsByOwnerUid(ownerUid) {
  const querySnap = await getDocs(
    query(
      collection(db, 'events'),
      where('ownerUid', '==', ownerUid),
      orderBy('startDate'),
    ),
  )
  const dataArr = querySnap.docs.map((doc) => {
    const data = doc.data()
    return { ...data, uid: doc.id }
  })

  return dataArr
}

export default getEventsByOwnerUid
