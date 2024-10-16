import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import AsyncStorage from '@react-native-async-storage/async-storage'

import firebaseConfig from '@/constants/firebaseConfig'

const app = initializeApp(firebaseConfig)

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
})
auth.useDeviceLanguage()

const db = getFirestore(app)

const storage = getStorage(app)

export { auth, db, storage }
