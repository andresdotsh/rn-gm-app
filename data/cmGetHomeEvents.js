import { subHours } from 'date-fns'
import { isNonEmptyString } from 'ramda-adjunct'

import getAllPublishedEvents from '@/data/getAllPublishedEvents'
import getAllEventTypes from '@/data/getAllEventTypes'
import getUsersByUids from '@/data/getUsersByUids'

async function cmGetHomeEvents() {
  const rawEvents = await getAllPublishedEvents()
  const eventTypes = await getAllEventTypes()
  const ownersUids = []

  const minDateTime = subHours(new Date(), 25) // 25 hours ago

  const timeFilteredEvents = rawEvents
    .filter((event) => {
      return new Date(event?.startDateIsoString) >= minDateTime
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

export default cmGetHomeEvents
