import { type } from 'ramda'
import { isString } from 'ramda-adjunct'
import { create } from 'zustand'

export const useCurrentUserStore = create((set) => ({
  isLoggedIn: false,
  uid: null,
  avatarData: null,
  setIsLoggedIn: (value) => {
    set({ isLoggedIn: Boolean(value) })
  },
  setUid: (value) => {
    if (isString(value) || value === null) {
      set({ uid: value })
    }
  },
  setAvatarData: (value) => {
    if (type(value) === 'Object' || value === null) {
      set({ avatarData: value })
    }
  },
  actionLogOut: () => {
    set({ isLoggedIn: false, uid: null, avatarData: null })
  },
}))
