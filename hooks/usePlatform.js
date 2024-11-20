import { Platform } from 'react-native'

/**
 * A hook that provides information about the platform in which the app is running.
 *
 * It returns an object with the following properties:
 *
 * - `isIOS`: a boolean indicating if the app is running on iOS.
 * - `isAndroid`: a boolean indicating if the app is running on Android.
 **/
export default function usePlatform() {
  const platformOs = Platform.OS

  const isIOS = platformOs === 'ios'
  const isAndroid = platformOs === 'android'

  return { isIOS, isAndroid }
}
