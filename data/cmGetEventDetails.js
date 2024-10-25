import getEventByUid from '@/data/getEventByUid'
import getEventsUsersByEventUid from '@/data/getEventsUsersByEventUid'
import getUserByUid from '@/data/getUserByUid'
import getUsersByUids from '@/data/getUsersByUids'
import getAllEventTypes from '@/data/getAllEventTypes'
import { EVENT_ROLE_JUDGE, EVENT_ROLE_PARTICIPANT } from '@/constants/constants'

async function cmGetEventDetails(eventUid) {
  const eventData = await getEventByUid(eventUid)

  if (!eventData) {
    return null
  }

  const ownerData = await getUserByUid(eventData?.ownerUid)
  const eventTypes = await getAllEventTypes()
  const eventUsers = await getEventsUsersByEventUid(eventData?.uid)

  const eventType = eventTypes.find(
    (eventType) => eventType?.key === eventData?.eventType,
  )

  const judgesUids = eventUsers
    .filter((eventUser) => eventUser?.role === EVENT_ROLE_JUDGE)
    .map((eventUser) => eventUser?.userUid)

  const participantsUids = eventUsers
    .filter((eventUser) => eventUser?.role === EVENT_ROLE_PARTICIPANT)
    .map((eventUser) => eventUser?.userUid)

  const judgesUsers = await getUsersByUids(judgesUids)
  const participantsUsers = await getUsersByUids(participantsUids)

  return {
    eventData,
    ownerData,
    eventType,
    judgesUsers,
    participantsUsers,
    judgesUids,
    participantsUids,
  }
}

export default cmGetEventDetails
