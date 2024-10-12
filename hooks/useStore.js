import { type } from 'ramda'
import { isString } from 'ramda-adjunct'
import { create } from 'zustand'

export const useCurrentUserStore = create((set) => ({
  isLoggedIn: false,
  uid: null,
  data: null,
  setIsLoggedIn: (value) => {
    set({ isLoggedIn: Boolean(value) })
  },
  setUid: (value) => {
    if (isString(value) || value === null) {
      set({ uid: value })
    }
  },
  setData: (value) => {
    if (type(value) === 'Object' || value === null) {
      set({ data: value })
    }
  },
  actionLogOut: () => {
    set({ isLoggedIn: false, uid: null, data: null })
  },
}))
