import { useCallback, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  createUserWithEmailAndPassword,
  // GoogleAuthProvider,
  // FacebookAuthProvider,
  // signInWithCredential,
} from 'firebase/auth'
// import Fontisto from '@expo/vector-icons/Fontisto'
// import { makeRedirectUri } from 'expo-auth-session'
// import * as Google from 'expo-auth-session/providers/google'
// import * as Facebook from 'expo-auth-session/providers/facebook'

import { auth } from '@/data/firebase'
import useThemeColor from '@/hooks/useThemeColor'
import usePlatform from '@/hooks/usePlatform'
import BlankSpaceView from '@/ui/BlankSpaceView'
import MainButton from '@/ui/MainButton'
// import SecondButton from '@/ui/SecondButton'
import ThirdButton from '@/ui/ThirdButton'
import ShowToggleButton from '@/ui/ShowToggleButton'
import {
  // APP_SCHEME,
  // APP_BUNDLE_ID,
  // GOOGLE_IOS_CLIENT_ID,
  // GOOGLE_ANDROID_CLIENT_ID,
  // FACEBOOK_IOS_CLIENT_ID,
  // FACEBOOK_ANDROID_CLIENT_ID,
  CC_WIDTH_STYLES,
  FIELD_EMAIL_MAX_LENGTH,
  FIELD_NAME_MAX_LENGTH,
  FIELD_NAME_MIN_LENGTH,
  FIELD_PASSWORD_MAX_LENGTH,
  FIELD_PASSWORD_MIN_LENGTH,
  REGEX_USER_PASSWORD,
} from '@/constants/constants'
import normalizeSpaces from '@/utils/normalizeSpaces'

const schema = yup
  .object({
    name: yup
      .string()
      .trim()
      .required('Campo requerido')
      .min(FIELD_NAME_MIN_LENGTH, 'Mínimo ${min} caracteres')
      .max(FIELD_NAME_MAX_LENGTH, 'Máximo ${max} caracteres'),
    email: yup
      .string()
      .trim()
      .lowercase()
      .required('Campo requerido')
      .email('Email inválido')
      .max(FIELD_EMAIL_MAX_LENGTH, 'Máximo ${max} caracteres'),
    password: yup
      .string()
      .required('Campo requerido')
      .min(FIELD_PASSWORD_MIN_LENGTH, 'Mínimo ${min} caracteres')
      .max(FIELD_PASSWORD_MAX_LENGTH, 'Máximo ${max} caracteres')
      .matches(
        REGEX_USER_PASSWORD,
        'Debe tener al menos una mayúscula, una minúscula y un número',
      ),
  })
  .required()

export default function SignupScreen({
  scrollToIndex,
  isAuthenticating,
  setIsAuthenticating,
  handleErrorMessage,
  performLogin,
  winWidth,
}) {
  const bgColor = useThemeColor('btn5')
  const titleColor = useThemeColor('color4')
  const color = useThemeColor('color1')
  const placeholderColor = useThemeColor('color3')
  const textInputBgColor = useThemeColor('mainBg2')
  // const secondButtonColor = useThemeColor('mainBg2')

  const { isIOS } = usePlatform()

  const [showPassword, setShowPassword] = useState(true)

  const insets = useSafeAreaInsets()

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) })

  const onSubmit = useCallback(
    async (formData) => {
      try {
        setIsAuthenticating(true)

        const cleanedDisplayName = normalizeSpaces(formData.name)
        const result = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password,
        )
        await performLogin(result, cleanedDisplayName, reset)
      } catch (error) {
        console.error(error)
        console.error(`💥> SSU '${error?.message}'`)
        handleErrorMessage(error)
        setIsAuthenticating(false)
      }
    },
    [setIsAuthenticating, handleErrorMessage, performLogin, reset],
  )

  // const redirectUri = makeRedirectUri({
  //   scheme: APP_SCHEME,
  //   native: APP_BUNDLE_ID + '://',
  // })

  // const [requestGoogle, responseGoogle, promptGoogle] = Google.useAuthRequest({
  //   redirectUri,
  //   clientId: isIOS ? GOOGLE_IOS_CLIENT_ID : GOOGLE_ANDROID_CLIENT_ID,
  //   iosClientId: GOOGLE_IOS_CLIENT_ID,
  //   androidClientId: GOOGLE_ANDROID_CLIENT_ID,
  // })

  // const [requestFacebook, responseFacebook, promptFacebook] =
  //   Facebook.useAuthRequest({
  //     redirectUri,
  //     clientId: isIOS ? FACEBOOK_IOS_CLIENT_ID : FACEBOOK_ANDROID_CLIENT_ID,
  //     iosClientId: FACEBOOK_IOS_CLIENT_ID,
  //     androidClientId: FACEBOOK_ANDROID_CLIENT_ID,
  //   })

  // useEffect(() => {
  //   async function handleSingleSignOn() {
  //     try {
  //       if (responseGoogle?.type === 'success') {
  //         const { id_token } = responseGoogle.params
  //         const credential = GoogleAuthProvider.credential(id_token)
  //         const result = await signInWithCredential(auth, credential)

  //         await performLogin(result, null, reset)
  //       } else if (responseFacebook?.type === 'success') {
  //         const { access_token } = responseFacebook.params
  //         const credential = FacebookAuthProvider.credential(access_token)
  //         const result = await signInWithCredential(auth, credential)

  //         await performLogin(result, null, reset)
  //       } else {
  //         setIsAuthenticating(false)
  //       }
  //     } catch (error) {
  //       console.error(error)
  //       console.error(`💥> HSS '${error?.message}'`)
  //       handleErrorMessage(error)
  //       setIsAuthenticating(false)
  //     }
  //   }

  //   handleSingleSignOn()
  // }, [
  //   handleErrorMessage,
  //   performLogin,
  //   reset,
  //   responseFacebook,
  //   responseGoogle,
  //   setIsAuthenticating,
  // ])

  return (
    <KeyboardAvoidingView
      behavior={isIOS ? 'padding' : 'height'}
      style={styles.kbAvoidingView}
    >
      <ScrollView
        style={{
          width: winWidth,
          backgroundColor: bgColor,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
        contentContainerStyle={styles.svContentContainer}
      >
        <View>
          <BlankSpaceView />
          <Text
            style={[styles.title, { color: titleColor }]}
          >{`Crear cuenta`}</Text>

          {/* <View style={styles.pt2}>
            <Text
              style={[styles.label, { color: color }]}
            >{`Puedes crear tu cuenta con:`}</Text>
          </View>

          <View style={styles.pt1}>
            <SecondButton
              disabled={isAuthenticating || !requestGoogle}
              leftIcon={
                <Fontisto name='google' size={16} color={secondButtonColor} />
              }
              onPress={() => {
                setIsAuthenticating(true)
                promptGoogle()
              }}
            >{`Google`}</SecondButton>
          </View>

          <View style={styles.pt1}>
            <SecondButton
              disabled={isAuthenticating || !requestFacebook}
              leftIcon={
                <Fontisto name='facebook' size={16} color={secondButtonColor} />
              }
              onPress={() => {
                setIsAuthenticating(true)
                promptFacebook()
              }}
            >{`Facebook`}</SecondButton>
          </View>

          <View style={styles.pt2}>
            <Text
              style={[styles.label, { color: color }]}
            >{`O continuar con:`}</Text>
          </View> */}

          <View style={styles.pt2}>
            <Controller
              control={control}
              name='name'
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: textInputBgColor, color },
                  ]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder='* Nombre'
                  placeholderTextColor={placeholderColor}
                  editable={!isAuthenticating}
                />
              )}
            />
            {errors.name && (
              <Text style={[styles.error, { color: titleColor }]}>
                {errors.name.message}
              </Text>
            )}
          </View>

          <View style={styles.pt2}>
            <Controller
              control={control}
              name='email'
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: textInputBgColor, color },
                  ]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType='email-address'
                  placeholder='* Email'
                  placeholderTextColor={placeholderColor}
                  editable={!isAuthenticating}
                  autoCapitalize='none'
                />
              )}
            />
            {errors.email && (
              <Text style={[styles.error, { color: titleColor }]}>
                {errors.email.message}
              </Text>
            )}
          </View>

          <View style={styles.pt2}>
            <Controller
              control={control}
              name='password'
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: textInputBgColor, color },
                  ]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder='* Contraseña'
                  secureTextEntry={!showPassword}
                  placeholderTextColor={placeholderColor}
                  editable={!isAuthenticating}
                  autoCapitalize='none'
                />
              )}
            />
            {errors.password && (
              <Text style={[styles.error, { color: titleColor }]}>
                {errors.password.message}
              </Text>
            )}
          </View>

          <View style={styles.showPasswdContainer}>
            <ShowToggleButton
              onPress={() => {
                setShowPassword((prevState) => !prevState)
              }}
              value={showPassword}
              disabled={isAuthenticating}
            />
          </View>

          <View style={styles.pt2}>
            <MainButton
              onPress={handleSubmit(onSubmit)}
              disabled={isAuthenticating}
              loading={isAuthenticating}
            >
              {`Crear cuenta`}
            </MainButton>
          </View>

          <View style={styles.pt1}>
            <ThirdButton
              onPress={() => {
                scrollToIndex(0)
              }}
              disabled={isAuthenticating}
            >{`Ya tengo una cuenta`}</ThirdButton>
          </View>
          <BlankSpaceView />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  kbAvoidingView: {
    flex: 1,
  },
  svContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
    ...CC_WIDTH_STYLES,
  },
  showPasswdContainer: {
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  title: {
    fontFamily: 'Ubuntu600',
    fontSize: 30,
    textAlign: 'right',
  },
  // label: { fontFamily: 'Ubuntu400', fontSize: 18, textAlign: 'right' },
  error: { fontFamily: 'Ubuntu400', fontSize: 16, textAlign: 'right' },
  input: {
    fontFamily: 'Ubuntu400',
    fontSize: 18,
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    textAlign: 'right',
  },
  pt1: {
    paddingTop: 10,
  },
  pt2: {
    paddingTop: 20,
  },
})
