import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  ActivityIndicator,
  Image,
  Pressable,
  Linking,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { keys } from 'ramda'
import { isNonEmptyArray, isNonEmptyString } from 'ramda-adjunct'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons'
import Feather from '@expo/vector-icons/Feather'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { Slider } from '@miblanchard/react-native-slider'

import {
  CC_WIDTH_STYLES,
  REGEX_USER_USERNAME,
  REGEX_SN_USERNAME,
  FIELD_NAME_MIN_LENGTH,
  FIELD_NAME_MAX_LENGTH,
  FIELD_USERNAME_MIN_LENGTH,
  FIELD_USERNAME_MAX_LENGTH,
  FIELD_SN_USERNAME_MAX_LENGTH,
} from '@/constants/constants'
import { useLoggedUserStore } from '@/hooks/useStore'
import useThemeColor from '@/hooks/useThemeColor'
import { storage } from '@/data/firebase'
import getUserByUid from '@/data/getUserByUid'
import getAllSkills from '@/data/getAllSkills'
import MainButton from '@/ui/MainButton'
import SecondButton from '@/ui/SecondButton'
import ThirdButton from '@/ui/ThirdButton'
import BlankSpaceView from '@/ui/BlankSpaceView'
import MainModal from '@/ui/MainModal'
import isValidSkill from '@/utils/isValidSkill'
import dispatchRefreshUserData from '@/events/dispatchRefreshUserData'

const safeString = (value) => {
  return isNonEmptyString(value) ? value : ''
}

const schema = yup
  .object({
    displayName: yup
      .string()
      .trim()
      .required('Campo requerido')
      .min(FIELD_NAME_MIN_LENGTH, 'Mínimo ${min} caracteres')
      .max(FIELD_NAME_MAX_LENGTH, 'Máximo ${max} caracteres'),
    username: yup
      .string()
      .trim()
      .lowercase()
      .required('Campo requerido')
      .min(FIELD_USERNAME_MIN_LENGTH, 'Mínimo ${min} caracteres')
      .max(FIELD_USERNAME_MAX_LENGTH, 'Máximo ${max} caracteres')
      .matches(REGEX_USER_USERNAME, 'Ejemplo: john_titor-0'),
    snUserTiktok: yup
      .string()
      .trim()
      .max(FIELD_SN_USERNAME_MAX_LENGTH, 'Máximo ${max} caracteres')
      .matches(REGEX_SN_USERNAME, {
        message: 'Sin espacios',
        excludeEmptyString: true,
      }),
    snUserInstagram: yup
      .string()
      .trim()
      .max(FIELD_SN_USERNAME_MAX_LENGTH, 'Máximo ${max} caracteres')
      .matches(REGEX_SN_USERNAME, {
        message: 'Sin espacios',
        excludeEmptyString: true,
      }),
    snUserXcom: yup
      .string()
      .trim()
      .max(FIELD_SN_USERNAME_MAX_LENGTH, 'Máximo ${max} caracteres')
      .matches(REGEX_SN_USERNAME, {
        message: 'Sin espacios',
        excludeEmptyString: true,
      }),
    snUserSnapchat: yup
      .string()
      .trim()
      .max(FIELD_SN_USERNAME_MAX_LENGTH, 'Máximo ${max} caracteres')
      .matches(REGEX_SN_USERNAME, {
        message: 'Sin espacios',
        excludeEmptyString: true,
      }),
    snUserYoutube: yup
      .string()
      .trim()
      .max(FIELD_SN_USERNAME_MAX_LENGTH, 'Máximo ${max} caracteres')
      .matches(REGEX_SN_USERNAME, {
        message: 'Sin espacios',
        excludeEmptyString: true,
      }),
    snUserFacebook: yup
      .string()
      .trim()
      .max(FIELD_SN_USERNAME_MAX_LENGTH, 'Máximo ${max} caracteres')
      .matches(REGEX_SN_USERNAME, {
        message: 'Sin espacios',
        excludeEmptyString: true,
      }),
  })
  .required()

export default function EditProfile() {
  const scrollViewRef = useRef(null)
  const contentOffsetYRef = useRef(0)
  const displayNameFormFieldRef = useRef(null)
  const usernameFormFieldRef = useRef(null)
  const snUserTiktokFormFieldRef = useRef(null)
  const snUserInstagramFormFieldRef = useRef(null)
  const snUserXcomFormFieldRef = useRef(null)
  const snUserSnapchatFormFieldRef = useRef(null)
  const snUserYoutubeFormFieldRef = useRef(null)
  const snUserFacebookFormFieldRef = useRef(null)

  const [deletePhotoModal, setDeletePhotoModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const mainBg1 = useThemeColor('mainBg1')
  const mainBg2 = useThemeColor('mainBg2')
  const color1 = useThemeColor('color1')
  const color2 = useThemeColor('color2')
  const color3 = useThemeColor('color3')
  const color4 = useThemeColor('color4')
  const color5 = useThemeColor('color5')
  const cardBg1 = useThemeColor('cardBg1')
  const cardBg2 = useThemeColor('cardBg2')
  const modalColor = useThemeColor('color2')
  const textInputBgColor = useThemeColor('mainBg2')
  const placeholderColor = useThemeColor('color3')
  const errorColor = useThemeColor('color4')
  const inputBorderColor = useThemeColor('color3')
  const pgColor = useThemeColor('btn1')
  const pgBgColor = useThemeColor('cardBg2')

  const loggedUserUid = useLoggedUserStore((s) => s.loggedUserUid)

  const {
    isFetching: userIsFetching,
    isLoading: userIsLoading,
    error: userError,
    data: userData,
    refetch: userRefetch,
  } = useQuery({
    queryKey: ['users', loggedUserUid],
    queryFn: () => getUserByUid(loggedUserUid),
    enabled: Boolean(loggedUserUid),
  })
  const {
    isLoading: skillsIsLoading,
    data: skillsData,
    error: skillsError,
    refetch: skillsRefetch,
  } = useQuery({
    queryKey: ['skills'],
    queryFn: () => getAllSkills(),
  })

  const skillsDefaultValues = useMemo(() => {
    const res = {}

    if (isNonEmptyArray(skillsData) && userData) {
      skillsData.forEach((skill) => {
        const skillKey = skill?.key
        const rawValue = userData?.[skillKey] ?? 0
        const skillValue = isValidSkill(rawValue) ? rawValue : 0

        res[skillKey] = skillValue
      })
    }

    return res
  }, [skillsData, userData])

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      photoURL: safeString(userData?.photoURL),
      displayName: safeString(userData?.displayName),
      username: safeString(userData?.username),
      snUserTiktok: safeString(userData?.snUserTiktok),
      snUserInstagram: safeString(userData?.snUserInstagram),
      snUserXcom: safeString(userData?.snUserXcom),
      snUserSnapchat: safeString(userData?.snUserSnapchat),
      snUserYoutube: safeString(userData?.snUserYoutube),
      snUserFacebook: safeString(userData?.snUserFacebook),
      ...skillsDefaultValues,
    },
  })
  const usernameFieldValue = watch('username')
  const photoURLFieldValue = watch('photoURL')
  const snUserTiktokFieldValue = watch('snUserTiktok')
  const snUserInstagramFieldValue = watch('snUserInstagram')
  const snUserXcomFieldValue = watch('snUserXcom')
  const snUserSnapchatFieldValue = watch('snUserSnapchat')
  const snUserYoutubeFieldValue = watch('snUserYoutube')
  const snUserFacebookFieldValue = watch('snUserFacebook')

  const onSubmit = useCallback(async (formData) => {
    console.log(`formData`, formData)
  }, [])

  const onError = useCallback((formErrors) => {
    function handleMeasure(x, y, width, height, pageX, pageY) {
      const ADJUSTMENT = 140
      const errorPosY = contentOffsetYRef.current - ADJUSTMENT + pageY

      scrollViewRef.current?.scrollTo({
        y: errorPosY,
        animated: true,
      })
    }

    if (formErrors?.displayName) {
      displayNameFormFieldRef.current?.measure(handleMeasure)
    } else if (formErrors?.username) {
      usernameFormFieldRef.current?.measure(handleMeasure)
    } else if (formErrors?.snUserTiktok) {
      snUserTiktokFormFieldRef.current?.measure(handleMeasure)
    } else if (formErrors?.snUserInstagram) {
      snUserInstagramFormFieldRef.current?.measure(handleMeasure)
    } else if (formErrors?.snUserXcom) {
      snUserXcomFormFieldRef.current?.measure(handleMeasure)
    } else if (formErrors?.snUserSnapchat) {
      snUserSnapchatFormFieldRef.current?.measure(handleMeasure)
    } else if (formErrors?.snUserYoutube) {
      snUserYoutubeFormFieldRef.current?.measure(handleMeasure)
    } else if (formErrors?.snUserFacebook) {
      snUserFacebookFormFieldRef.current?.measure(handleMeasure)
    }
  }, [])

  const onScrollScrollView = useCallback((e) => {
    contentOffsetYRef.current = e.nativeEvent.contentOffset.y
  }, [])

  const isPhotoInForm = isNonEmptyString(photoURLFieldValue)

  console.log(`---------------------------------------------------`)

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.kbAvoidingView}
    >
      <ScrollView
        ref={scrollViewRef}
        style={{ backgroundColor: mainBg1 }}
        contentContainerStyle={styles.svContentContainer}
        onScroll={onScrollScrollView}
      >
        <Stack.Screen
          options={{
            headerTitle: 'Editar Perfil',
            headerLeft: null,
            headerRight: null,
            headerStyle: {
              backgroundColor: mainBg1,
            },
          }}
        />

        {userIsLoading || skillsIsLoading ? (
          <View style={styles.noContent}>
            <ActivityIndicator size='large' color={color1} />
          </View>
        ) : !userData || !skillsData || userError || skillsError ? (
          <View style={styles.noContent}>
            <Text
              style={[styles.errorText, { color: color1 }]}
            >{`Ha ocurrido un error al obtener los datos, o puede ser que no tengas conexión a internet.`}</Text>
            <ThirdButton
              loading={userIsFetching}
              disabled={userIsFetching}
              onPress={() => {
                userRefetch()
                skillsRefetch()
              }}
            >{`Reintentar`}</ThirdButton>
          </View>
        ) : (
          <View>
            <View style={[styles.card, { backgroundColor: cardBg1 }]}>
              <View style={styles.profilePhotoContainer}>
                {isPhotoInForm ? (
                  <Image
                    source={{ uri: photoURLFieldValue }}
                    style={styles.profilePhoto}
                  />
                ) : (
                  <SimpleLineIcons name='user' size={96} color={color2} />
                )}
              </View>

              <View style={styles.photoButtonsContainer}>
                <ThirdButton
                  style={styles.photoBtn}
                  disabled={isSubmitting}
                  onPress={() => {
                    setDeletePhotoModal(true)
                  }}
                >
                  <Feather name='trash-2' size={24} color={color2} />
                </ThirdButton>

                <ThirdButton style={styles.photoBtn} disabled={isSubmitting}>
                  <Feather name='image' size={24} color={color2} />
                </ThirdButton>
              </View>
            </View>

            <View style={[styles.card, { backgroundColor: cardBg1 }]}>
              <View>
                <Text style={[styles.formInputLabel, { color: color1 }]}>
                  {`* Nombre`}
                </Text>
                <Controller
                  control={control}
                  name='displayName'
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      ref={displayNameFormFieldRef}
                      style={[
                        styles.formInputField,
                        {
                          backgroundColor: textInputBgColor,
                          color: color1,
                          borderColor: errors.displayName
                            ? errorColor
                            : inputBorderColor,
                        },
                      ]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder='* Nombre'
                      placeholderTextColor={placeholderColor}
                      editable={!isSubmitting}
                    />
                  )}
                />
                {errors.displayName && (
                  <Text style={[styles.formInputError, { color: errorColor }]}>
                    {errors.displayName.message}
                  </Text>
                )}
              </View>

              <View>
                <Text style={[styles.formInputLabel, { color: color1 }]}>
                  {`* Usuario`}
                </Text>
                <Text style={[styles.formInputLabel, { color: color3 }]}>
                  {`@` + usernameFieldValue.toLowerCase()}
                </Text>
                <Controller
                  control={control}
                  name='username'
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      ref={usernameFormFieldRef}
                      style={[
                        styles.formInputField,
                        {
                          backgroundColor: textInputBgColor,
                          color: color1,
                          borderColor: errors.username
                            ? errorColor
                            : inputBorderColor,
                        },
                      ]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder='* Usuario'
                      placeholderTextColor={placeholderColor}
                      editable={!isSubmitting}
                      autoCapitalize='none'
                    />
                  )}
                />
                {errors.username && (
                  <Text style={[styles.formInputError, { color: errorColor }]}>
                    {errors.username.message}
                  </Text>
                )}
              </View>
            </View>

            {isNonEmptyArray(skillsData) && (
              <View style={[styles.card, { backgroundColor: cardBg1 }]}>
                {skillsData.map((skill) => {
                  const formSkillValue = watch(skill?.key)

                  return (
                    <View key={skill?.uid}>
                      <Text style={[styles.formSliderLabel, { color: color1 }]}>
                        {`${skill?.name}: ${formSkillValue}`}
                      </Text>
                      <Slider
                        value={formSkillValue}
                        onValueChange={(value) => {
                          setValue(skill?.key, value[0])
                        }}
                        minimumValue={0}
                        maximumValue={100}
                        step={1}
                        thumbTintColor={pgColor}
                        minimumTrackTintColor={pgColor}
                        maximumTrackTintColor={pgBgColor}
                        containerStyle={styles.formSliderContainer}
                      />
                    </View>
                  )
                })}
              </View>
            )}

            <View style={[styles.card, { backgroundColor: cardBg1 }]}>
              <View>
                <Text style={[styles.formInputLabel, { color: color1 }]}>
                  {'Usuario de TikTok:'}
                </Text>
                <Text style={[styles.formInputLabel, { color: color3 }]}>
                  {'@' + snUserTiktokFieldValue}
                </Text>
                <Controller
                  control={control}
                  name='snUserTiktok'
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      ref={snUserTiktokFormFieldRef}
                      style={[
                        styles.formInputField,
                        {
                          backgroundColor: textInputBgColor,
                          color: color1,
                          borderColor: errors.snUserTiktok
                            ? errorColor
                            : inputBorderColor,
                        },
                      ]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder='...'
                      placeholderTextColor={placeholderColor}
                      editable={!isSubmitting}
                      autoCapitalize='none'
                    />
                  )}
                />
                {errors.snUserTiktok && (
                  <Text style={[styles.formInputError, { color: errorColor }]}>
                    {errors.snUserTiktok.message}
                  </Text>
                )}
              </View>

              <View>
                <Text style={[styles.formInputLabel, { color: color1 }]}>
                  {'Usuario de Instagram:'}
                </Text>
                <Text style={[styles.formInputLabel, { color: color3 }]}>
                  {'@' + snUserInstagramFieldValue}
                </Text>
                <Controller
                  control={control}
                  name='snUserInstagram'
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      ref={snUserInstagramFormFieldRef}
                      style={[
                        styles.formInputField,
                        {
                          backgroundColor: textInputBgColor,
                          color: color1,
                          borderColor: errors.snUserInstagram
                            ? errorColor
                            : inputBorderColor,
                        },
                      ]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder='...'
                      placeholderTextColor={placeholderColor}
                      editable={!isSubmitting}
                      autoCapitalize='none'
                    />
                  )}
                />
                {errors.snUserInstagram && (
                  <Text style={[styles.formInputError, { color: errorColor }]}>
                    {errors.snUserInstagram.message}
                  </Text>
                )}
              </View>

              <View>
                <Text style={[styles.formInputLabel, { color: color1 }]}>
                  {'Usuario de X (twitter):'}
                </Text>
                <Text style={[styles.formInputLabel, { color: color3 }]}>
                  {'@' + snUserXcomFieldValue}
                </Text>
                <Controller
                  control={control}
                  name='snUserXcom'
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      ref={snUserXcomFormFieldRef}
                      style={[
                        styles.formInputField,
                        {
                          backgroundColor: textInputBgColor,
                          color: color1,
                          borderColor: errors.snUserXcom
                            ? errorColor
                            : inputBorderColor,
                        },
                      ]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder='...'
                      placeholderTextColor={placeholderColor}
                      editable={!isSubmitting}
                      autoCapitalize='none'
                    />
                  )}
                />
                {errors.snUserXcom && (
                  <Text style={[styles.formInputError, { color: errorColor }]}>
                    {errors.snUserXcom.message}
                  </Text>
                )}
              </View>

              <View>
                <Text style={[styles.formInputLabel, { color: color1 }]}>
                  {'Usuario de Snapchat:'}
                </Text>
                <Text style={[styles.formInputLabel, { color: color3 }]}>
                  {'@' + snUserSnapchatFieldValue}
                </Text>
                <Controller
                  control={control}
                  name='snUserSnapchat'
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      ref={snUserSnapchatFormFieldRef}
                      style={[
                        styles.formInputField,
                        {
                          backgroundColor: textInputBgColor,
                          color: color1,
                          borderColor: errors.snUserSnapchat
                            ? errorColor
                            : inputBorderColor,
                        },
                      ]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder='...'
                      placeholderTextColor={placeholderColor}
                      editable={!isSubmitting}
                      autoCapitalize='none'
                    />
                  )}
                />
                {errors.snUserSnapchat && (
                  <Text style={[styles.formInputError, { color: errorColor }]}>
                    {errors.snUserSnapchat.message}
                  </Text>
                )}
              </View>

              <View>
                <Text style={[styles.formInputLabel, { color: color1 }]}>
                  {'Usuario de YouTube:'}
                </Text>
                <Text style={[styles.formInputLabel, { color: color3 }]}>
                  {'@' + snUserYoutubeFieldValue}
                </Text>
                <Controller
                  control={control}
                  name='snUserYoutube'
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      ref={snUserYoutubeFormFieldRef}
                      style={[
                        styles.formInputField,
                        {
                          backgroundColor: textInputBgColor,
                          color: color1,
                          borderColor: errors.snUserYoutube
                            ? errorColor
                            : inputBorderColor,
                        },
                      ]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder='...'
                      placeholderTextColor={placeholderColor}
                      editable={!isSubmitting}
                      autoCapitalize='none'
                    />
                  )}
                />
                {errors.snUserYoutube && (
                  <Text style={[styles.formInputError, { color: errorColor }]}>
                    {errors.snUserYoutube.message}
                  </Text>
                )}
              </View>

              <View>
                <Text style={[styles.formInputLabel, { color: color1 }]}>
                  {'Usuario de Facebook:'}
                </Text>
                <Text style={[styles.formInputLabel, { color: color3 }]}>
                  {'@' + snUserFacebookFieldValue}
                </Text>
                <Controller
                  control={control}
                  name='snUserFacebook'
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      ref={snUserFacebookFormFieldRef}
                      style={[
                        styles.formInputField,
                        {
                          backgroundColor: textInputBgColor,
                          color: color1,
                          borderColor: errors.snUserFacebook
                            ? errorColor
                            : inputBorderColor,
                        },
                      ]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder='...'
                      placeholderTextColor={placeholderColor}
                      editable={!isSubmitting}
                      autoCapitalize='none'
                    />
                  )}
                />
                {errors.snUserFacebook && (
                  <Text style={[styles.formInputError, { color: errorColor }]}>
                    {errors.snUserFacebook.message}
                  </Text>
                )}
              </View>
            </View>

            <MainButton
              onPress={handleSubmit(onSubmit, onError)}
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {`Guardar`}
            </MainButton>

            <BlankSpaceView />
          </View>
        )}

        <MainModal
          title={`Confirmar`}
          visible={deletePhotoModal}
          onPressClose={() => {
            setDeletePhotoModal(false)
          }}
        >
          <View style={styles.deletePhotoModalContainer}>
            <Text style={[styles.deletePhotoModalText, { color: modalColor }]}>
              {`¿Deseas eliminar tu foto de perfil?`}
            </Text>

            <MainButton>{`Si, eliminar`}</MainButton>

            <ThirdButton
              onPress={() => {
                setDeletePhotoModal(false)
              }}
            >{`Cancelar`}</ThirdButton>
          </View>
        </MainModal>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  kbAvoidingView: {
    flex: 1,
  },
  svContentContainer: {
    padding: 20,
    flexGrow: 1,
    ...CC_WIDTH_STYLES,
  },
  noContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Ubuntu400',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    gap: 25,
  },
  profilePhotoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  profilePhoto: {
    borderRadius: 10,
    aspectRatio: 1,
    width: '100%',
    maxWidth: 400,
  },
  photoButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 30,
  },
  photoBtn: {
    flex: 1,
  },
  deletePhotoModalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    gap: 25,
  },
  deletePhotoModalText: {
    fontSize: 18,
    fontFamily: 'Ubuntu400',
    textAlign: 'center',
  },
  formSliderLabel: { fontFamily: 'Ubuntu400', fontSize: 16 },
  formSliderContainer: { height: 22 },
  formInputLabel: { fontFamily: 'Ubuntu400', fontSize: 16, marginBottom: 5 },
  formInputError: { fontFamily: 'Ubuntu400', fontSize: 16, marginTop: 2 },
  formInputField: {
    fontFamily: 'Ubuntu400',
    fontSize: 18,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
  },
})
