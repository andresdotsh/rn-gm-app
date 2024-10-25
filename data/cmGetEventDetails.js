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

  const eventJudgesUids = eventUsers
    .filter((eventUser) => eventUser?.role === EVENT_ROLE_JUDGE)
    .map((eventUser) => eventUser?.userUid)

  const eventParticipantsUids = eventUsers
    .filter((eventUser) => eventUser?.role === EVENT_ROLE_PARTICIPANT)
    .map((eventUser) => eventUser?.userUid)

  const judgesUsers = await getUsersByUids(eventJudgesUids)
  const participantsUsers = await getUsersByUids(eventParticipantsUids)

  return {
    eventData,
    ownerData,
    eventType,
    judgesUsers,
    participantsUsers,
  }
}

export default cmGetEventDetails
