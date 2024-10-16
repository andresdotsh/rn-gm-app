import { useState, useCallback, useEffect, useMemo } from 'react'
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  RefreshControl,
  ActivityIndicator,
  Image,
  Pressable,
  Linking,
} from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import {
  isValidNumber,
  isInteger,
  isNonEmptyArray,
  isNonEmptyString,
} from 'ramda-adjunct'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons'
import Feather from '@expo/vector-icons/Feather'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

import {
  CC_WIDTH_STYLES,
  REGEX_USER_PHONE,
  REGEX_USER_USERNAME,
  REGEX_SN_USERNAME,
  FIELD_PHONE_MAX_LENGTH,
  FIELD_NAME_MIN_LENGTH,
  FIELD_NAME_MAX_LENGTH,
  FIELD_USERNAME_MIN_LENGTH,
  FIELD_USERNAME_MAX_LENGTH,
  SN_TIKTOK_USER_LABEL,
  SN_INSTAGRAM_USER_LABEL,
  SN_X_USER_LABEL,
  SN_SNAPCHAT_USER_LABEL,
  SN_YOUTUBE_USER_LABEL,
  SN_FACEBOOK_USER_LABEL,
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

const schema = yup
  .object({
    displayName: yup
      .string()
      .trim()
      .required('Campo requerido')
      .min(FIELD_NAME_MIN_LENGTH, 'Mínimo ${min} caracteres')
      .max(FIELD_NAME_MAX_LENGTH, 'Máximo ${max} caracteres'),
    phoneNumber: yup
      .string()
      .trim()
      .max(FIELD_PHONE_MAX_LENGTH, 'Máximo ${max} dígitos')
      .matches(REGEX_USER_PHONE, {
        message: 'Ejemplo: +573101234567',
        excludeEmptyString: true,
      }),
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
  const [refreshing, setRefreshing] = useState(false)
  const [deletePhotoModal, setDeletePhotoModal] = useState(false)

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
  console.log(`---------------------------------------------------`)

  const onRefresh = useCallback(() => {
    // TODO: -> es necesario el pull and refresh?
    setRefreshing(true)
    userRefetch()
    skillsRefetch()
  }, [userRefetch, skillsRefetch])

  useEffect(() => {
    if (!userIsFetching) {
      setRefreshing(false)
    }
  }, [userIsFetching])

  const skillsDefaultValues = useMemo(() => {
    const res = {}

    if (isNonEmptyArray(skillsData) && userData) {
      skillsData.forEach((skill) => {
        const skillKey = skill?.key
        const rawValue = userData?.[skillKey] ?? 0
        const skillValue =
          isValidNumber(rawValue) &&
          isInteger(rawValue) &&
          rawValue >= 0 &&
          rawValue <= 100
            ? rawValue
            : 0

        res[skillKey] = skillValue
      })
    }

    return res
  }, [skillsData, userData])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      photoURL: userData?.photoURL ?? '',
      displayName: userData?.displayName ?? '',
      phoneNumber: userData?.phoneNumber ?? '',
      username: userData?.username ?? '',
      snUserTiktok: userData?.snUserTiktok ?? '',
      snUserInstagram: userData?.snUserInstagram ?? '',
      snUserXcom: userData?.snUserXcom ?? '',
      snUserSnapchat: userData?.snUserSnapchat ?? '',
      snUserYoutube: userData?.snUserYoutube ?? '',
      snUserFacebook: userData?.snUserFacebook ?? '',
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

  return (
    <ScrollView
      style={{ backgroundColor: mainBg1 }}
      contentContainerStyle={styles.svContentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          progressBackgroundColor={mainBg1}
          colors={[color1]}
          tintColor={color1}
        />
      }
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
                onPress={() => {
                  setDeletePhotoModal(true)
                }}
              >
                <Feather name='trash-2' size={24} color={color1} />
              </ThirdButton>

              <ThirdButton style={styles.photoBtn}>
                <Feather name='camera' size={24} color={color1} />
              </ThirdButton>
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: cardBg1 }]}>
            <Text
              style={[styles.errorText, { color: color1 }]}
            >{`hello world`}</Text>
          </View>

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
  )
}

const styles = StyleSheet.create({
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
})
