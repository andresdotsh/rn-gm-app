import { nanoid } from 'nanoid/non-secure'

export default function generateUsername() {
  return nanoid().toLowerCase()
}
