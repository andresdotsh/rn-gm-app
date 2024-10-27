// event roles
export const EVENT_ROLE_OWNER = 'owner'
export const EVENT_ROLE_JUDGE = 'judge'
export const EVENT_ROLE_PARTICIPANT = 'participant'
export const EVENT_ROLE_ATTENDEE = 'attendee'

// form fields
export const FIELD_EMAIL_MAX_LENGTH = 254
export const FIELD_NAME_MIN_LENGTH = 2
export const FIELD_NAME_MAX_LENGTH = 60
export const FIELD_PASSWORD_MIN_LENGTH = 8
export const FIELD_PASSWORD_MAX_LENGTH = 128
export const FIELD_USERNAME_MIN_LENGTH = 3
export const FIELD_USERNAME_MAX_LENGTH = 30
export const FIELD_PHONE_MIN_LENGTH = 6
export const FIELD_PHONE_MAX_LENGTH = 16
export const FIELD_SN_USERNAME_MAX_LENGTH = 100
export const FIELD_EVENT_NAME_MIN_LENGTH = 1
export const FIELD_EVENT_NAME_MAX_LENGTH = 60
export const FIELD_EVENT_DESCRIPTION_MAX_LENGTH = 200

// regex
export const REGEX_USER_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/
export const REGEX_USER_USERNAME = /^[a-z0-9_-]+$/
export const REGEX_USER_PHONE = /^\+?[1-9]\d{1,14}$/
export const REGEX_SN_USERNAME = /^[^\s]*$/

// custom errors
export const ERROR_CODE_ACCOUNT_EXISTS =
  'auth/account-exists-with-different-credential'
export const ERROR_CODE_EMAIL_ALREADY_IN_USE = 'auth/email-already-in-use'
export const ERROR_CODE_INVALID_CREDENTIAL = 'auth/invalid-credential'
export const ERROR_CODE_POPUP_CLOSED = 'auth/popup-closed-by-user'
export const ERROR_CODE_TOO_MANY_REQUESTS = 'auth/too-many-requests'

// custom events
export const EVENT_REFRESH_USER_DATA = 'GM_CE_ID_REFRESH_USER_DATA'

// social networks
export const SN_TIKTOK_USER_LINK = 'https://www.tiktok.com/@'
export const SN_TIKTOK_USER_LABEL = 'tiktok.com/@'

export const SN_INSTAGRAM_USER_LINK = 'https://www.instagram.com/'
export const SN_INSTAGRAM_USER_LABEL = 'instagram.com/'

export const SN_X_USER_LINK = 'https://x.com/'
export const SN_X_USER_LABEL = 'x.com/'

export const SN_SNAPCHAT_USER_LINK = 'https://www.snapchat.com/add/'
export const SN_SNAPCHAT_USER_LABEL = 'snapchat.com/add/'

export const SN_YOUTUBE_USER_LINK = 'https://www.youtube.com/@'
export const SN_YOUTUBE_USER_LABEL = 'youtube.com/@'

export const SN_FACEBOOK_USER_LINK = 'https://www.facebook.com/'
export const SN_FACEBOOK_USER_LABEL = 'facebook.com/'

export const API_BASE_URL = process.env.EXPO_PUBLIC_REST_API_BASE_URL

export const CC_WIDTH_STYLES = {
  marginHorizontal: 'auto',
  minWidth: 320,
  width: '100%',
  maxWidth: 500,
}

// date picker
export const EVENTS_MIN_DATE_ISO_STRING = '2024-10-20T05:00:00Z'
export const DATEPICKER_DEFAULT_PROPS = {
  showTimeSelect: true,
  timeIntervals: 30,
  timeCaption: 'Hora',
  timeFormat: 'hh:mm aa',
  dateFormat: 'dd/MMM/yyyy hh:mm aa',
}
