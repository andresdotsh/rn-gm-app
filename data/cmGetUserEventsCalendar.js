import { subHours } from 'date-fns'
import { not } from 'ramda'

import { EVENT_ROLE_OWNER } from '@/constants/constants'
import getAllEventTypes from '@/data/getAllEventTypes'
import getEventsUsersByUserUid from '@/data/getEventsUsersByUserUid'
import getEventsByUids from '@/data/getEventsByUids'
import getEventsByOwnerUid from '@/data/getEventsByOwnerUid'

async function cmGetUserEventsCalendar(userUid) {
  const eventTypes = await getAllEventTypes()

  const eventsUsers = await getEventsUsersByUserUid(userUid)
  const eventRoleObj = {}
  const eventsUids = eventsUsers.map((eventUser) => {
    const eventUid = eventUser?.eventUid
    eventRoleObj[eventUid] = eventUser?.role
    return eventUid
  })

  const eventsInvolvedArr = await getEventsByUids(eventsUids)
  const eventsInvolvedData = eventsInvolvedArr.map((eventData) => {
    const role = eventRoleObj[eventData?.uid]
    return {
      ...eventData,
      _role: role,
    }
  })

  const eventsAsOwnerArr = await getEventsByOwnerUid(userUid)
  const eventsAsOwnerData = eventsAsOwnerArr
    .filter((eventAsOwner) => {
      return not(
        eventsInvolvedData.some((eventInvolved) => {
          return eventInvolved.uid === eventAsOwner.uid
        }),
      )
    })
    .map((eventAsOwner) => {
      return {
        ...eventAsOwner,
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
