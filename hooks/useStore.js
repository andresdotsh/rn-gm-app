import { type } from 'ramda'
import { isString } from 'ramda-adjunct'
import { create } from 'zustand'

export const useLoggedUserStore = create((set) => ({
  isUserLoggedIn: false,
  loggedUserUid: null,
  loggedUserData: null,
  setIsUserLoggedIn: (value) => {
    set({ isUserLoggedIn: Boolean(value) })
  },
  setLoggedUserUid: (value) => {
    if (isString(value) || value === null) {
      set({ loggedUserUid: value })
    }
  },
  setLoggedUserData: (value) => {
    if (type(value) === 'Object' || value === null) {
      set({ loggedUserData: value })
    }
  },
  actionLogout: () => {
    set({ isUserLoggedIn: false, loggedUserUid: null, loggedUserData: null })
  },
}))
