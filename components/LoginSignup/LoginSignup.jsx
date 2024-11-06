import { useRef, useCallback, useState } from 'react'
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
} from 'react-native'
import { SwiperFlatList } from 'react-native-swiper-flatlist'
import { pick } from 'ramda'
import { isNonEmptyString, isFunction } from 'ramda-adjunct'
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  increment,
} from 'firebase/firestore'
import { sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { auth, db } from '@/data/firebase'
import {
  ERROR_CODE_ACCOUNT_EXISTS,
  ERROR_CODE_EMAIL_ALREADY_IN_USE,
  ERROR_CODE_INVALID_CREDENTIAL,
  ERROR_CODE_POPUP_CLOSED,
  ERROR_CODE_TOO_MANY_REQUESTS,
  FIELD_EMAIL_MAX_LENGTH,
} from '@/constants/constants'
import MainModal from '@/ui/MainModal'
import MainButton from '@/ui/MainButton'
import colors from '@/constants/colors'
import LoginScreen from '@/components/LoginSignup/LoginScreen'
import SignupScreen from '@/components/LoginSignup/SignupScreen'
import useThemeColor from '@/hooks/useThemeColor'
import { useLoggedUserStore } from '@/hooks/useStore'
import generateUsername from '@/utils/generateUsername'
import dispatchRefreshUserData from '@/events/dispatchRefreshUserData'

const schema = yup
  .object({
    email: yup
      .string()
      .trim()
      .lowercase()
      .required('Campo requerido')
      .email('Email inválido')
      .max(FIELD_EMAIL_MAX_LENGTH, 'Máximo ${max} caracteres'),
  })
  .required()

export default function LoginSignup() {
  const swiperRef = useRef(null)

  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [infoTitle, setInfoTitle] = useState('')
  const [infoMessage, setInfoMessage] = useState('')
  const [showVerifyModal, setShowVerifyModal] = useState(false)
  const [showRecoveryModal, setShowRecoveryModal] = useState(false)
  const [isRecovAuthenticating, setIsRecovAuthenticating] = useState(false)
  const [recovSentMode, setRecovSentMode] = useState(false)

  const modalTitleColor = useThemeColor('color1')
  const modalColor = useThemeColor('color2')
  const modalIconColor = useThemeColor('color4')
  const recovTitleColor = useThemeColor('color4')
  const recovColor = useThemeColor('color1')
  const recovPlaceholderColor = useThemeColor('color3')
  const recovTextInputBgColor = useThemeColor('mainBg2')

  const setIsUserLoggedIn = useLoggedUserStore((s) => s.setIsUserLoggedIn)
  const { width: winWidth } = useWindowDimensions()

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset: recovReset,
  } = useForm({ resolver: yupResolver(schema) })

  const scrollToIndex = useCallback((index) => {
    swiperRef.current.scrollToIndex({ animated: true, index })
  }, [])

  const openChangePasswdModal = useCallback(() => {
    setShowRecoveryModal(true)
  }, [])

  const handleErrorMessage = useCallback((error) => {
    const errorMsg = isNonEmptyString(error?.message) ? error?.message : ''
    let title = ''
    let message = ''

    if (
      errorMsg.includes(ERROR_CODE_EMAIL_ALREADY_IN_USE) ||
      errorMsg.includes(ERROR_CODE_ACCOUNT_EXISTS)
    ) {
      title = 'Ya Tienes Una Cuenta'
      message =
        'Ya existe una cuenta con este email. Puedes iniciar sesión, o intentar con otro email.'
    } else if (errorMsg.includes(ERROR_CODE_INVALID_CREDENTIAL)) {
      title = 'Email/Contraseña Incorrectos'
      message =
        'El email o contraseña son incorrectos. Por favor, revisa los campos e intenta otra vez.'
    } else if (errorMsg.includes(ERROR_CODE_POPUP_CLOSED)) {
      title = 'Ingreso Interrumpido'
      message =
        'Se interrumpió el proceso de ingreso antes de completarlo. Por favor, intenta otra vez.'
    } else if (errorMsg.includes(ERROR_CODE_TOO_MANY_REQUESTS)) {
      title = 'Muchos Intentos'
      message =
        'Cuidado, estas haciendo demasiados intentos en poco tiempo. Por favor, intenta mas tarde.'
    } else {
      title = 'Error Inesperado'
      message = 'Ha ocurrido un error inesperado. Por favor, intenta otra vez.'
    }

    setInfoTitle(title)
    setInfoMessage(message)

    setTimeout(() => {
      setShowInfoModal(true)
    }, 100)
  }, [])

  const performLogin = useCallback(
    async (result, newUserDisplayname = null, resetFn) => {
      const uid = result.user.uid
      const userPayload = {
        username: generateUsername(),
        email: result.user.email,
        displayName: result.user.displayName || newUserDisplayname,
        photoURL: result.user.photoURL,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        loginCount: increment(1),
      }

      const userDocRef = doc(db, 'users', uid)
      const userDocSnap = await getDoc(userDocRef)
      const userExists = userDocSnap.exists()

      if (userExists) {
        // if user exists, update only some fields
        const fieldsToUpdate = pick(['lastLogin', 'loginCount'], userPayload)
        await setDoc(userDocRef, fieldsToUpdate, { merge: true })
      } else {
        // if user doesn't exist, create it with the whole payload
        await setDoc(userDocRef, userPayload)
      }

      if (!result.user.emailVerified) {
        await sendEmailVerification(result.user)

        setIsAuthenticating(false)
        setShowVerifyModal(true)

        if (isFunction(resetFn)) {
          resetFn()
        }

        scrollToIndex(0)

        return null
      }

      if (isFunction(resetFn)) {
        resetFn()
      }
      dispatchRefreshUserData(uid)
      setIsAuthenticating(false)
      setIsUserLoggedIn(true)
    },
    [scrollToIndex, setIsUserLoggedIn],
  )

  const recovOnSubmit = useCallback(
    async (formData) => {
      try {
        setIsRecovAuthenticating(true)

        await sendPasswordResetEmail(auth, formData.email)

        recovReset()
        setRecovSentMode(true)
      } catch (error) {
        console.error(error)
        console.error(`💥> CPS '${error?.message}'`)
        setShowRecoveryModal(false)
        handleErrorMessage(error)
      } finally {
        setIsRecovAuthenticating(false)
      }
    },
    [handleErrorMessage, recovReset],
  )

  return (
    <View style={styles.mainContainer}>
      <SwiperFlatList ref={swiperRef} disableGesture={isAuthenticating}>
        <LoginScreen
          scrollToIndex={scrollToIndex}
          isAuthenticating={isAuthenticating}
          setIsAuthenticating={setIsAuthenticating}
          handleErrorMessage={handleErrorMessage}
          performLogin={performLogin}
          winWidth={winWidth}
          openChangePasswdModal={openChangePasswdModal}
        />

        <SignupScreen
          scrollToIndex={scrollToIndex}
          isAuthenticating={isAuthenticating}
          setIsAuthenticating={setIsAuthenticating}
          handleErrorMessage={handleErrorMessage}
          performLogin={performLogin}
          winWidth={winWidth}
        />
      </SwiperFlatList>

      <MainModal
        visible={showInfoModal}
        onPressClose={() => {
          setShowInfoModal(false)

          setTimeout(() => {
            setInfoTitle('')
            setInfoMessage('')
          }, 500)
        }}
      >
        <View style={styles.modalInfoContainer}>
          <Text style={[styles.modalInfoTitle, { color: modalTitleColor }]}>
            {infoTitle}
          </Text>
          <Text style={[styles.modalInfoMessage, { color: modalColor }]}>
            {infoMessage}
          </Text>
        </View>
      </MainModal>

      <MainModal
        visible={showVerifyModal}
        onPressClose={() => {
          setShowVerifyModal(false)
        }}
      >
        <View style={styles.modalIconContainer}>
          <MaterialCommunityIcons
            name='email-check'
            size={96}
            color={modalIconColor}
          />
          <Text style={[styles.modalIconTitle, { color: modalTitleColor }]}>
            {`Verifica Tu Email`}
          </Text>
          <Text style={[styles.modalIconMessage, { color: modalColor }]}>
            {`Te enviamos un correo con un link de verificación a tu email.`}
          </Text>
          <Text style={[styles.modalIconMessage, { color: modalColor }]}>
            {`Verifica tu email y luego regresa para que puedas Ingresar.`}
          </Text>
        </View>
      </MainModal>

      <MainModal
        title='Cambiar Contraseña'
        visible={showRecoveryModal}
        onPressClose={() => {
          setShowRecoveryModal(false)
          recovReset()
        }}
      >
        {recovSentMode ? (
          <View style={styles.modalIconContainer}>
            <MaterialCommunityIcons
              name='email-check'
              size={96}
              color={modalIconColor}
            />
            <Text style={[styles.modalIconTitle, { color: modalTitleColor }]}>
              {`Revisa Tu Email`}
            </Text>
            <Text style={[styles.modalIconMessage, { color: modalColor }]}>
              {`Te enviamos un link a tu email para cambiar tu contraseña.`}
            </Text>
          </View>
        ) : (
          <View style={styles.modalIconContainer}>
            <Text style={[styles.modalIconMessage, { color: modalColor }]}>
              {`Te enviaremos un link a tu email para que puedas cambiar tu contraseña.`}
            </Text>

            <Controller
              control={control}
              name='email'
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.recovInput,
                    {
                      backgroundColor: recovTextInputBgColor,
                      color: recovColor,
                    },
                  ]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType='email-address'
                  placeholder='* Email'
                  placeholderTextColor={recovPlaceholderColor}
                  editable={!isRecovAuthenticating}
                  autoCapitalize='none'
                />
              )}
            />
            {errors.email && (
              <Text style={[styles.recovError, { color: recovTitleColor }]}>
                {errors.email.message}
              </Text>
            )}

            <MainButton
              onPress={handleSubmit(recovOnSubmit)}
              disabled={isRecovAuthenticating}
              loading={isRecovAuthenticating}
              style={styles.recovSubmit}
            >
              {`Enviar link`}
            </MainButton>
          </View>
        )}
      </MainModal>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: colors.dark.mainBg2 },
  modalInfoContainer: {
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  modalInfoTitle: {
    fontSize: 20,
    fontFamily: 'Ubuntu500',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalInfoMessage: {
    fontSize: 18,
    fontFamily: 'Ubuntu400',
    textAlign: 'center',
  },
  modalIconContainer: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalIconTitle: {
    fontSize: 24,
    fontFamily: 'Ubuntu600',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  modalIconMessage: {
    fontSize: 18,
    fontFamily: 'Ubuntu400',
    textAlign: 'center',
    marginBottom: 20,
  },
  recovError: { fontFamily: 'Ubuntu400', fontSize: 16, textAlign: 'center' },
  recovInput: {
    fontFamily: 'Ubuntu400',
    fontSize: 18,
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
  },
  recovSubmit: {
    width: '100%',
    marginTop: 20,
  },
})
