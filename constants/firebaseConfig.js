const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIRE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIRE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIRE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIRE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIRE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIRE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIRE_MEASUREMENT_ID,
}

export default firebaseConfig
