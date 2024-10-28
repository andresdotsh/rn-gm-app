import { getDocs, collection, query, orderBy } from 'firebase/firestore'

import { db } from '@/data/firebase'
import normalizeForSearch from '@/utils/normalizeForSearch'
import getUsernameFromEmail from '@/utils/getUsernameFromEmail'

/**
 * Retrieves some public fields of all users data from the 'users' collection in the DB,
 * and formats them in a standardized object for searching.
 *
 * @return {Promise<Array<{
 *   uid: string,
 *   displayName: string
 *   username: string
 *   _s: string
 * }>> | null>} An array of user data objects, or null if an error occurs.
 */
export default async function cmGetUsersToSearchData() {
  const querySnap = await getDocs(
    query(collection(db, 'users'), orderBy('displayName')),
  )
  const dataArr = querySnap.docs.map((doc) => {
    const data = doc.data()
    const displayName = data?.displayName ?? ''
    const username = data?.username ?? ''
    const emailUsername = getUsernameFromEmail(data?.email)

    return {
      uid: doc.id,
      displayName,
      username,
      _s:
        normalizeForSearch(displayName) +
        ' ' +
        normalizeForSearch(emailUsername) +
        ' ' +
        normalizeForSearch(username),
    }
  })

  return dataArr
}
