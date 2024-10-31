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
import formatUserData from '@/utils/formatUserData'

async function getUsersByUids(usersUids) {
  if (isNonEmptyArray(usersUids)) {
    const querySnap = await getDocs(
      query(
        collection(db, 'users'),
        where(documentId(), 'in', usersUids),
        orderBy('displayName'),
      ),
    )
    const dataArr = querySnap.docs.map((doc) => {
      const data = doc.data()
      return formatUserData(doc.id, data)
    })

    return dataArr
  }

  return []
}

export default getUsersByUids
