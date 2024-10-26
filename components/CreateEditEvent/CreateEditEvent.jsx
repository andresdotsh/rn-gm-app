import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
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
import { isNonEmptyArray, isNonEmptyString, isBoolean } from 'ramda-adjunct'
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
  FIELD_EVENT_NAME_MIN_LENGTH,
  FIELD_EVENT_NAME_MAX_LENGTH,
  FIELD_EVENT_DESCRIPTION_MAX_LENGTH,
} from '@/constants/constants'
import { useLoggedUserStore } from '@/hooks/useStore'
import useThemeColor from '@/hooks/useThemeColor'
import { db, storage } from '@/data/firebase'
import getEventByUid from '@/data/getEventByUid'
import MainButton from '@/ui/MainButton'
import ThirdButton from '@/ui/ThirdButton'
import BlankSpaceView from '@/ui/BlankSpaceView'
import MainModal from '@/ui/MainModal'
import isValidSkill from '@/utils/isValidSkill'
import showToast from '@/utils/showToast'
import safeString from '@/utils/safeString'

const schema = yup
  .object({
    name: yup
      .string()
      .trim()
      .required('Campo requerido')
      .min(FIELD_EVENT_NAME_MIN_LENGTH, 'Mínimo ${min} caracteres')
      .max(FIELD_EVENT_NAME_MAX_LENGTH, 'Máximo ${max} caracteres'),
    startDate: yup.date().required('Campo requerido'),
    description: yup
      .string()
      .trim()
      .max(FIELD_EVENT_DESCRIPTION_MAX_LENGTH, 'Máximo ${max} caracteres'),
    eventType: yup.string().trim().required('Campo requerido'),
    bannerUrl: yup.string().trim().required('Campo requerido'),
    isPublished: yup.bool(),
  })
  .required()

export default function CreateEditEvent({ eventUid }) {
  const scrollViewRef = useRef(null)
  const contentOffsetYRef = useRef(0)
  const initializedFormRef = useRef(false)
  const nameFormFieldRef = useRef(null)
  const startDateFormFieldRef = useRef(null)
  const descriptionFormFieldRef = useRef(null)
  const eventTypeFormFieldRef = useRef(null)
  const bannerUrlFormFieldRef = useRef(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [deletePhotoModal, setDeletePhotoModal] = useState(false)
  const [settingBannerPhoto, setSettingBannerPhoto] = useState(false)

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

  const isEditMode = Boolean(eventUid)

  const {
    isFetching: eventIsFetching,
    isLoading: eventIsLoading,
    error: eventError,
    data: eventData,
    refetch: eventRefetch,
  } = useQuery({
    queryKey: ['events', eventUid],
    queryFn: () => getEventByUid(eventUid),
    enabled: Boolean(eventUid),
  })

  const queryClient = useQueryClient()
  const navigation = useNavigation()

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      startDate: null,
      description: '',
      eventType: '',
      bannerUrl: '',
      isPublished: true,
    },
  })

  useEffect(() => {
    if (eventData && !initializedFormRef.current) {
      initializedFormRef.current = true

      reset({
        name: safeString(eventData?.name),
        startDate: isNonEmptyString(eventData?.startDateIsoString)
          ? new Date(eventData?.startDateIsoString)
          : null,
        description: safeString(eventData?.description),
        eventType: safeString(eventData?.eventType),
        bannerUrl: safeString(eventData?.bannerUrl),
        isPublished: isBoolean(eventData?.isPublished)
          ? eventData?.isPublished
          : true,
      })
    }
  }, [eventData, reset])

  const nameFieldValue = watch('name')
  const startDateFieldValue = watch('startDate')
  const descriptionFieldValue = watch('description')
  const eventTypeFieldValue = watch('eventType')
  const bannerUrlFieldValue = watch('bannerUrl')
  const isPublishedFieldValue = watch('isPublished')

  const isBannerInForm = isNonEmptyString(bannerUrlFieldValue)

  const wip = isSubmitting || settingBannerPhoto

  const handleMeasure = useCallback((x, y, width, height, pageX, pageY) => {
    const ADJUSTMENT = 140
    const errorPosY = contentOffsetYRef.current - ADJUSTMENT + pageY

    scrollViewRef.current?.scrollTo({
      y: errorPosY,
      animated: true,
    })
  }, [])

  const onSubmit = useCallback(async (formData) => {
    try {
      // setIsSubmitting(true)
      console.log(`🚀🚀🚀 -> formData:`, formData)
    } catch (error) {
      console.error(error)

      setIsSubmitting(false)
      setShowErrorModal(true)
    }
  }, [])

  const onError = useCallback(
    (formErrors) => {
      if (formErrors?.name) {
        nameFormFieldRef.current?.measure(handleMeasure)
      } else if (formErrors?.startDate) {
        startDateFormFieldRef.current?.measure(handleMeasure)
      } else if (formErrors?.description) {
        descriptionFormFieldRef.current?.measure(handleMeasure)
      } else if (formErrors?.eventType) {
        eventTypeFormFieldRef.current?.measure(handleMeasure)
      } else if (formErrors?.bannerUrl) {
        bannerUrlFormFieldRef.current?.measure(handleMeasure)
      }
    },
    [handleMeasure],
  )

  const onScrollScrollView = useCallback((e) => {
    contentOffsetYRef.current = e.nativeEvent.contentOffset.y
  }, [])

  const pickImage = useCallback(async () => {
    try {
      setSettingBannerPhoto(true)
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
        setValue('bannerUrl', croppedImage.uri)
      }
    } catch (error) {
      console.error(error)
      setShowErrorModal(true)
    } finally {
      setSettingBannerPhoto(false)
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
            headerTitle: isEditMode ? 'Editar Evento' : 'Crear Evento',
            headerLeft: null,
            headerRight: null,
            headerStyle: {
              backgroundColor: mainBg1,
            },
          }}
        />

        {isEditMode && eventIsLoading ? (
          <View style={styles.noContent}>
            <ActivityIndicator size='large' color={color1} />
          </View>
        ) : isEditMode && (!eventData || eventError) ? (
          <View style={styles.noContent}>
            <Text style={[styles.errorText, { color: color1 }]}>
              {`Ha ocurrido un error al obtener los datos. Puede ser que no tengas conexión a internet, o que el evento no exista.`}
            </Text>
            <ThirdButton
              loading={eventIsFetching}
              disabled={eventIsFetching}
              onPress={() => {
                eventRefetch()
              }}
            >{`Reintentar`}</ThirdButton>
          </View>
        ) : (
          <View>
            <View style={[styles.card, { backgroundColor: cardBg1 }]}>
              <View style={styles.bannerPhotoContainer}>
                {isBannerInForm ? (
                  <Image
                    source={{ uri: bannerUrlFieldValue }}
                    style={styles.bannerPhoto}
                    resizeMode='contain'
                  />
                ) : (
                  <SimpleLineIcons name='picture' size={96} color={color2} />
                )}
              </View>

              <View style={styles.photoButtonsContainer}>
                <ThirdButton
                  style={styles.photoBtn}
                  disabled={!isBannerInForm || wip}
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
                  {`* Nombre del evento`}
                </Text>
                <Controller
                  control={control}
                  name='name'
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      ref={nameFormFieldRef}
                      style={[
                        styles.formInputField,
                        {
                          backgroundColor: textInputBgColor,
                          color: color1,
                          borderColor: errors.name
                            ? errorColor
                            : inputBorderColor,
                        },
                      ]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder='* Nombre del evento'
                      placeholderTextColor={placeholderColor}
                      editable={!wip}
                    />
                  )}
                />
                {errors.name && (
                  <Text style={[styles.formInputError, { color: errorColor }]}>
                    {errors.name.message}
                  </Text>
                )}
              </View>

              <View>
                <Text style={[styles.formInputLabel, { color: color1 }]}>
                  {`Descripción`}
                </Text>
                <Controller
                  control={control}
                  name='description'
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      ref={descriptionFormFieldRef}
                      style={[
                        styles.formInputField,
                        {
                          backgroundColor: textInputBgColor,
                          color: color1,
                          borderColor: errors.description
                            ? errorColor
                            : inputBorderColor,
                        },
                      ]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder='Descripción'
                      placeholderTextColor={placeholderColor}
                      editable={!wip}
                      autoCapitalize='none'
                    />
                  )}
                />
                {errors.description && (
                  <Text style={[styles.formInputError, { color: errorColor }]}>
                    {errors.description.message}
                  </Text>
                )}
              </View>
            </View>

            <MainButton
              onPress={handleSubmit(onSubmit, onError)}
              disabled={wip}
              loading={isSubmitting}
            >
              {isEditMode
                ? isPublishedFieldValue
                  ? `Guardar`
                  : `Pausar Evento`
                : `Publicar`}
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
              {`¿Deseas eliminar el banner del evento?`}
            </Text>

            <MainButton
              onPress={() => {
                setValue('bannerUrl', null)
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
  bannerPhotoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  bannerPhoto: {
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
