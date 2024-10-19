import { getDocs, collection } from 'firebase/firestore'

import { db } from '@/data/firebase'

async function getAllSkills() {
  const querySnap = await getDocs(collection(db, 'skills'))
  const dataArr = querySnap.docs.map((doc) => {
    const data = doc.data()
    return { ...data, uid: doc.id }
  })

  return dataArr
}

export default getAllSkills
