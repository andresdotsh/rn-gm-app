import { useLocalSearchParams } from 'expo-router'

import DetailEvent from '@/components/DetailEvent/DetailEvent'

export default function PastEvent() {
  const { eventUid } = useLocalSearchParams()

  return <DetailEvent eventUid={eventUid} isPastEvent={true} />
}
