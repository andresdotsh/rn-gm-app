import { subHours } from 'date-fns'
import { isNonEmptyString } from 'ramda-adjunct'

import getAllEvents from '@/data/getAllEvents'
import getAllEventTypes from '@/data/getAllEventTypes'
import getUsersByUids from '@/data/getUsersByUids'

async function cmGetPastEvents() {
  const rawEvents = await getAllEvents()
  const eventTypes = await getAllEventTypes()
  const ownersUids = []

  const maxDateTime = subHours(new Date(), 25) // 25 hours ago

  const timeFilteredEvents = rawEvents
    .filter((event) => {
      return new Date(event?.startDateIsoString) <= maxDateTime
    })
    .map((event) => {
      if (isNonEmptyString(event?.ownerUid)) {
        ownersUids.push(event?.ownerUid)
      }
      return event
    })

  const ownersUsers = await getUsersByUids(ownersUids)

  const eventsData = timeFilteredEvents.map((event) => {
    const _owner = ownersUsers.find((user) => user?.uid === event?.ownerUid)
    const _eventType = eventTypes.find((type) => type?.key === event?.eventType)

    return { ...event, _owner, _eventType }
  })

  return eventsData
}

export default cmGetPastEvents
