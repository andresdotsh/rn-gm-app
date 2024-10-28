import getEventByUid from '@/data/getEventByUid'
import getAllEventTypes from '@/data/getAllEventTypes'
import getEventsUsersByEventUid from '@/data/getEventsUsersByEventUid'
import cmGetUsersToSearchData from '@/data/cmGetUsersToSearchData'
import { EVENT_ROLE_JUDGE, EVENT_ROLE_PARTICIPANT } from '@/constants/constants'

async function cmGetEventEdit(eventUid) {
  let eventData = null
  let judgesUids = []
  let participantsUids = []
  const isEditMode = Boolean(eventUid)

  const eventTypes = await getAllEventTypes()

  if (isEditMode) {
    eventData = await getEventByUid(eventUid)

    if (!eventData) {
      throw new Error('Event not found')
    }

    if (eventData?.eventType) {
      const existsEventType = eventTypes.some((type) => {
        return type.key === eventData?.eventType
      })
      if (!existsEventType) {
        eventData.eventType = ''
      }
    }

    const eventUsers = await getEventsUsersByEventUid(eventData?.uid)

    judgesUids = eventUsers
      .filter((eventUser) => eventUser?.role === EVENT_ROLE_JUDGE)
      .map((eventUser) => eventUser?.userUid)

    participantsUids = eventUsers
      .filter((eventUser) => eventUser?.role === EVENT_ROLE_PARTICIPANT)
      .map((eventUser) => eventUser?.userUid)
  }

  const usersToSearch = await cmGetUsersToSearchData()

  return {
    eventData,
    eventTypes,
    usersToSearch,
    judgesUids,
    participantsUids,
  }
}

export default cmGetEventEdit
