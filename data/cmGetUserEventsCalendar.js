import {
  getDocs,
  query,
  collection,
  where,
  documentId,
} from 'firebase/firestore'
import { subHours } from 'date-fns'

import { EVENT_ROLE_OWNER } from '@/constants/constants'
import { db } from '@/data/firebase'
import getAllEventTypes from '@/data/getAllEventTypes'
import getEventsUsersByUserUid from '@/data/getEventsUsersByUserUid'

async function cmGetUserEventsCalendar(userUid) {
  const eventTypes = await getAllEventTypes()

  const eventsUsers = await getEventsUsersByUserUid(userUid)
  const eventRoleObj = {}
  const eventsUids = eventsUsers.map((eu) => {
    const eventUid = eu?.eventUid
    eventRoleObj[eventUid] = eu?.role
    return eventUid
  })

  const eventsInvolvedQuerySnap = await getDocs(
    query(collection(db, 'events'), where(documentId(), 'in', eventsUids)),
  )
  const eventsInvolvedData = eventsInvolvedQuerySnap.docs.map((doc) => {
    const data = doc.data()
    const role = eventRoleObj[doc.id]
    return {
      ...data,
      uid: doc.id,
      _role: role,
    }
  })

  const eventsAsOwnerQuerySnap = await getDocs(
    query(collection(db, 'events'), where('ownerUid', '==', userUid)),
  )
  const eventsAsOwnerData = eventsAsOwnerQuerySnap.docs
    .filter((doc) => !eventsInvolvedData.some((e) => e.uid === doc.id))
    .map((doc) => {
      const eventData = doc.data()
      return {
        ...eventData,
        uid: doc.id,
        _role: EVENT_ROLE_OWNER,
      }
    })

  const eventsData = [...eventsInvolvedData, ...eventsAsOwnerData]

  eventsData.sort((a, b) => {
    return new Date(a.startDateIsoString) - new Date(b.startDateIsoString)
  })

  const minDateTime = subHours(new Date(), 25) // 25 hours ago

  const recentEvents = eventsData
    .filter((event) => {
      return new Date(event?.startDateIsoString) >= minDateTime
    })
    .map((event) => {
      const _eventType = eventTypes.find(
        (type) => type.key === event?.eventType,
      )
      return { ...event, _eventType }
    })

  return recentEvents
}

export default cmGetUserEventsCalendar
