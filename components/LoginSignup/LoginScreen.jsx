import { useCallback, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { signInWithEmailAndPassword } from 'firebase/auth'
// import Fontisto from '@expo/vector-icons/Fontisto'

import { auth } from '@/data/firebase'
import useThemeColor from '@/hooks/useThemeColor'
import ShowToggleButton from '@/ui/ShowToggleButton'
import BlankSpaceView from '@/ui/BlankSpaceView'
import MainButton from '@/ui/MainButton'
// import SecondButton from '@/ui/SecondButton'
import ThirdButton from '@/ui/ThirdButton'
import {
  CC_WIDTH_STYLES,
  FIELD_EMAIL_MAX_LENGTH,
  FIELD_PASSWORD_MAX_LENGTH,
  FIELD_PASSWORD_MIN_LENGTH,
} from '@/constants/constants'

const schema = yup
  .object({
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
      .max(FIELD_PASSWORD_MAX_LENGTH, 'Máximo ${max} caracteres'),
  })
  .required()

export default function LoginScreen({
  scrollToIndex,
  isAuthenticating,
  setIsAuthenticating,
  handleErrorMessage,
  performLogin,
  openChangePasswdModal,
  winWidth,
}) {
  const bgColor = useThemeColor('color4')
  const titleColor = useThemeColor('color5')
  const color = useThemeColor('color5')
  const placeholderColor = useThemeColor('cardBg1')
  const textInputBgColor = useThemeColor('btn2')
  const showToggleBgColor = useThemeColor('btn4')
  // const secondButtonColor = useThemeColor('mainBg2')

  const [showPassword, setShowPassword] = useState(false)

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

        const result = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password,
        )
        await performLogin(result, null, reset)
      } catch (error) {
        console.error(error)
        console.error(`💥> SSI '${error?.message}'`)
        handleErrorMessage(error)
        setIsAuthenticating(false)
      }
    },
    [handleErrorMessage, performLogin, reset, setIsAuthenticating],
  )

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
          >{`Ingresar`}</Text>

          {/* <View style={styles.pt2}>
            <Text
              style={[styles.label, { color: color }]}
            >{`Puedes ingresar con:`}</Text>
          </View>

          <View style={styles.pt1}>
            <SecondButton
              disabled={isAuthenticating}
              leftIcon={
                <Fontisto name='google' size={16} color={secondButtonColor} />
              }
            >{`Google`}</SecondButton>
          </View>

          <View style={styles.pt1}>
            <SecondButton
              disabled={isAuthenticating}
              leftIcon={
                <Fontisto name='facebook' size={16} color={secondButtonColor} />
              }
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
              style={{ backgroundColor: showToggleBgColor }}
              onPress={() => {
                setShowPassword((prevState) => !prevState)
              }}
              value={showPassword}
              disabled={isAuthenticating}
            />
          </View>

          <View style={styles.pt2}>
            <ThirdButton
              onPress={handleSubmit(onSubmit)}
              disabled={isAuthenticating}
              loading={isAuthenticating}
            >
              {`Ingresar`}
            </ThirdButton>
          </View>

          <View style={styles.pt1}>
            <MainButton
              onPress={() => {
                scrollToIndex(1)
              }}
              disabled={isAuthenticating}
            >{`No tengo una cuenta`}</MainButton>
          </View>

          <View style={styles.pt1}>
            <MainButton
              onPress={() => {
                openChangePasswdModal()
              }}
              disabled={isAuthenticating}
            >{`Olvidé mi contraseña`}</MainButton>
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
  },
  title: {
    fontFamily: 'Ubuntu600',
    fontSize: 30,
  },
  // label: { fontFamily: 'Ubuntu400', fontSize: 18 },
  error: { fontFamily: 'Ubuntu400', fontSize: 16 },
  input: {
    fontFamily: 'Ubuntu400',
    fontSize: 18,
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  pt1: {
    paddingTop: 10,
  },
  pt2: {
    paddingTop: 20,
  },
})
