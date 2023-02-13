import { sessionUser } from '../types'
import { httpService } from './http.service'

const STORAGE_KEY_LOGGED_IN_USER = 'loggedInUser'

export const userService = {
  // login,
  // logout,
  // register,
  getLoggedInUser,
  saveLocalUser,
  isLoggedIn,
}

// window.userService = userService

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

// async function login(userCred: userCredInterface) {
//   const user = await httpService.post('auth/login', userCred)
//   if (user) {
//     return saveLocalUser(user)
//   }
// }

// async function register(userCred: userCredInterface) {
//   if (!userCred.imgUrl)
//     userCred.imgUrl =
//       'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png'
//   const user = await httpService.post('auth/register', userCred)
//   return saveLocalUser(user)
// }

// async function logout() {
//   sessionStorage.removeItem(STORAGE_KEY_LOGGED_IN_USER)
//   return await httpService.post('auth/logout')
// }

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
