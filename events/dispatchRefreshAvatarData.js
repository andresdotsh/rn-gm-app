import { EVENT_REFRESH_AVATAR_DATA } from '@/constants/constants'
import eventEmitter from '@/events/eventEmitter'

export default function dispatchRefreshAvatarData(uid) {
  eventEmitter.emit(EVENT_REFRESH_AVATAR_DATA, uid)
}
