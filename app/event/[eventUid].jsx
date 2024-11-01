import { useLocalSearchParams } from 'expo-router'

import EventDetail from '@/components/EventDetail/EventDetail'

export default function Event() {
  const { eventUid } = useLocalSearchParams()

  return <EventDetail eventUid={eventUid} isPastEvent={false} />
}
