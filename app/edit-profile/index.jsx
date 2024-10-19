import { useState, useCallback, useMemo, useRef } from 'react'
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  ActivityIndicator,
  Image,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from 'react-native'
import {
  addDoc,
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore'
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { startsWith, not, keys, pick, identity } from 'ramda'
import { isNonEmptyArray, isNonEmptyString } from 'ramda-adjunct'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons'
import Feather from '@expo/vector-icons/Feather'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { Slider } from '@miblanchard/react-native-slider'
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker'
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator'
import { useNavigation } from '@react-navigation/native'

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
import { db, storage } from '@/data/firebase'
import getUserByUid from '@/data/getUserByUid'
import getAllSkills from '@/data/getAllSkills'
import MainButton from '@/ui/MainButton'
import ThirdButton from '@/ui/ThirdButton'
import BlankSpaceView from '@/ui/BlankSpaceView'
import MainModal from '@/ui/MainModal'
import isValidSkill from '@/utils/isValidSkill'

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

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [deletePhotoModal, setDeletePhotoModal] = useState(false)
  const [settingProfilePhoto, setSettingProfilePhoto] = useState(false)

  const mainBg1 = useThemeColor('mainBg1')
  const color1 = useThemeColor('color1')
  const color2 = useThemeColor('color2')
  const color3 = useThemeColor('color3')
  const color4 = useThemeColor('color4')
  const cardBg1 = useThemeColor('cardBg1')
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

  const queryClient = useQueryClient()
  const navigation = useNavigation()

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
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      photoURL: userData?.photoURL,
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

  const isPhotoInForm = isNonEmptyString(photoURLFieldValue)

  const wip = isSubmitting || settingProfilePhoto

  const handleMeasure = useCallback((x, y, width, height, pageX, pageY) => {
    const ADJUSTMENT = 140
    const errorPosY = contentOffsetYRef.current - ADJUSTMENT + pageY

    scrollViewRef.current?.scrollTo({
      y: errorPosY,
      animated: true,
    })
  }, [])

  const onSubmit = useCallback(
    async (formData) => {
      try {
        setIsSubmitting(true)
        const shouldUploadNewProfilePhoto =
          isNonEmptyString(formData.photoURL) &&
          not(startsWith('https://', formData.photoURL))

        const q = query(
          collection(db, 'users'),
          where('username', '==', formData.username),
        )
        const querySnap = await getDocs(q)

        const logUserArr = []
        const foundUids = querySnap.docs.map((doc) => {
          logUserArr.push({
            ...doc.data(),
            _uid: doc.id,
            _loggedAt: serverTimestamp(),
          })

          return doc.id
        })

        if (
          foundUids.length === 0 ||
          (foundUids.length === 1 && foundUids[0] === loggedUserUid)
        ) {
          let newPhotoURL = formData.photoURL

          const profilePhotoRef = ref(
            storage,
            'user/' + loggedUserUid + '/profile/photo.jpg',
          )

          if (shouldUploadNewProfilePhoto) {
            const fileRes = await fetch(formData.photoURL)
            const fileBlob = await fileRes.blob()

            await uploadBytes(profilePhotoRef, fileBlob)
            newPhotoURL = await getDownloadURL(profilePhotoRef)
          } else if (!newPhotoURL) {
            deleteObject(profilePhotoRef).then(identity).catch(identity)
          }

          const skillsKeys = keys(skillsDefaultValues)
          const formValues = pick(
            [
              'displayName',
              'username',
              'snUserTiktok',
              'snUserInstagram',
              'snUserXcom',
              'snUserSnapchat',
              'snUserYoutube',
              'snUserFacebook',
              ...skillsKeys,
            ],
            formData,
          )
          const userPayload = {
            ...formValues,
            photoURL: newPhotoURL,
          }

          const userDocRef = doc(db, 'users', loggedUserUid)

          let logPayload = null
          if (foundUids.length === 1) {
            logPayload = logUserArr[0]
          } else {
            const currentUserDocSnap = await getDoc(userDocRef)
            logPayload = {
              ...currentUserDocSnap.data(),
              _uid: currentUserDocSnap.id,
              _loggedAt: serverTimestamp(),
            }
          }
          addDoc(collection(db, 'log_users'), logPayload)
            .then(identity)
            .catch(identity)

          await updateDoc(userDocRef, userPayload)
          await queryClient.invalidateQueries(['users', loggedUserUid])

          setIsSubmitting(false)

          if (navigation.canGoBack()) {
            navigation.goBack()
          } else {
            navigation.navigate('(tabs)')
          }
        } else {
          setIsSubmitting(false)
          setError(
            'username',
            {
              type: 'custom',
              message: 'Usuario no disponible',
            },
            {
              shouldFocus: false,
            },
          )
          usernameFormFieldRef.current?.measure(handleMeasure)
        }
      } catch (error) {
        console.error(error)

        setIsSubmitting(false)
        setShowErrorModal(true)
      }
    },
    [
      handleMeasure,
      loggedUserUid,
      navigation,
      queryClient,
      setError,
      skillsDefaultValues,
    ],
  )

  const onError = useCallback(
    (formErrors) => {
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
    },
    [handleMeasure],
  )

  const onScrollScrollView = useCallback((e) => {
    contentOffsetYRef.current = e.nativeEvent.contentOffset.y
  }, [])

  const pickImage = useCallback(async () => {
    try {
      setSettingProfilePhoto(true)
      const result = await launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      })
      const pickedImageUri = result.assets?.[0]?.uri

      if (!result.canceled && isNonEmptyString(pickedImageUri)) {
        const croppedImage = await manipulateAsync(
          pickedImageUri,
          [{ resize: { width: 400, height: 400 } }],
          { compress: 0.7, format: SaveFormat.PNG },
        )
        setValue('photoURL', croppedImage.uri)
      }
    } catch (error) {
      console.error(error)
      setShowErrorModal(true)
    } finally {
      setSettingProfilePhoto(false)
    }
  }, [setValue])

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
                  disabled={!isPhotoInForm || wip}
                  onPress={() => {
                    setDeletePhotoModal(true)
                  }}
                >
                  <Feather name='trash-2' size={24} color={color2} />
                </ThirdButton>

                <ThirdButton
                  style={styles.photoBtn}
                  disabled={wip}
                  onPress={() => {
                    pickImage()
                  }}
                >
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
                      editable={!wip}
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
                      editable={!wip}
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
                        disabled={wip}
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
                      editable={!wip}
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
                      editable={!wip}
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
                      editable={!wip}
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
                      editable={!wip}
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
                      editable={!wip}
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
                      editable={!wip}
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
              disabled={wip}
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
          <View style={styles.modalContainer}>
            <Text style={[styles.modalText, { color: modalColor }]}>
              {`¿Deseas eliminar tu foto de perfil?`}
            </Text>

            <MainButton
              onPress={() => {
                setValue('photoURL', null)
                setDeletePhotoModal(false)
              }}
            >{`Si, eliminar`}</MainButton>

            <ThirdButton
              onPress={() => {
                setDeletePhotoModal(false)
              }}
            >{`Cancelar`}</ThirdButton>
          </View>
        </MainModal>

        <MainModal
          title={`Error`}
          visible={showErrorModal}
          onPressClose={() => {
            setShowErrorModal(false)
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalIconContainer}>
              <MaterialCommunityIcons
                name='ghost-outline'
                size={96}
                color={color4}
              />
            </View>

            <Text style={[styles.modalText, { color: modalColor }]}>
              {`Oops! Ha ocurrido un error inesperado. Por favor, intenta de nuevo.`}
            </Text>

            <MainButton
              onPress={() => {
                setShowErrorModal(false)
              }}
            >{`Ok`}</MainButton>
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
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
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
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    gap: 25,
  },
  modalText: {
    fontSize: 18,
    fontFamily: 'Ubuntu400',
    textAlign: 'center',
  },
  modalIconContainer: {
    alignItems: 'center',
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
