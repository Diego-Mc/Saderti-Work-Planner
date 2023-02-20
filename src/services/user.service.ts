import { sessionUser } from '../types'

const STORAGE_KEY_LOGGED_IN_USER = 'loggedInUser'

export const userService = {
  getLoggedInUser,
  saveLocalUser,
  isLoggedIn,
}

interface userCredInterface {
  username: string
  password: string
  email: string
  imgUrl?: string
}

interface userInterface {
  username: string
  imgUrl?: string
  _id: string
}

function saveLocalUser(user: userInterface) {
  user = {
    _id: user._id,
    username: user.username,
  }
  sessionStorage.setItem(STORAGE_KEY_LOGGED_IN_USER, JSON.stringify(user))
  return user
}

function getLoggedInUser(): sessionUser | null {
  const sessionUser = sessionStorage.getItem(STORAGE_KEY_LOGGED_IN_USER)
  if (!sessionUser) return null
  return JSON.parse(sessionUser)
}

function isLoggedIn() {
  const sessionUser = sessionStorage.getItem(STORAGE_KEY_LOGGED_IN_USER)
  return !!sessionUser
}
