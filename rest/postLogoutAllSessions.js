import { API_BASE_URL } from '@/constants/constants'

async function postLogoutAllSessions(userIdToken) {
  const res = await fetch(API_BASE_URL + '/api/logout-all-sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userIdToken}`,
    },
  })
  const data = await res.json()

  return data
}

export default postLogoutAllSessions
