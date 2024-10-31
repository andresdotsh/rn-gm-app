import {
  getDocs,
  documentId,
  collection,
  query,
  where,
  orderBy,
} from 'firebase/firestore'
import { isNonEmptyArray } from 'ramda-adjunct'

import { db } from '@/data/firebase'

async function getEventsByUids(eventsUids) {
  if (isNonEmptyArray(eventsUids)) {
    const querySnap = await getDocs(
      query(
        collection(db, 'events'),
        where(documentId(), 'in', eventsUids),
        orderBy('startDate'),
      ),
    )
    const dataArr = querySnap.docs.map((doc) => {
      const data = doc.data()
      return { ...data, uid: doc.id }
    })

    return dataArr
  }

  return []
}

export default getEventsByUids
