import { useLocalSearchParams } from 'expo-router'

import CreateEditEvent from '@/components/CreateEditEvent/CreateEditEvent'

export default function EditEvent() {
  const { eventUid } = useLocalSearchParams()

  return <CreateEditEvent eventUid={eventUid} />
}
