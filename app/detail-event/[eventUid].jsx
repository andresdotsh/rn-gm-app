import { useLocalSearchParams } from 'expo-router'

import DetailEvent from '@/components/DetailEvent/DetailEvent'

export default function ActiveEvent() {
  const { eventUid } = useLocalSearchParams()

  return <DetailEvent eventUid={eventUid} isPastEvent={false} />
}
