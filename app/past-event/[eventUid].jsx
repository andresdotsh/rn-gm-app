import { useLocalSearchParams } from 'expo-router'

import EventDetail from '@/components/EventDetail/EventDetail'

export default function PastEvent() {
  const { eventUid } = useLocalSearchParams()

  return <EventDetail eventUid={eventUid} isPastEvent={true} />
}
