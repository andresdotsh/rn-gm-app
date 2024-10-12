import { EVENT_REFRESH_USER_DATA } from '@/constants/constants'
import eventEmitter from '@/events/eventEmitter'

export default function dispatchRefreshUserData(uid) {
  eventEmitter.emit(EVENT_REFRESH_USER_DATA, uid)
}
