import React, { useState } from 'react'
import {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
} from '../features/api/apiSlice'
import Chance from 'chance'
import Swal from 'sweetalert2'
const chance = new Chance()

const Toast = Swal.mixin({
  toast: true,
  position: 'top-right',
  iconColor: 'white',
  customClass: {
    popup: 'colored-toast',
  },
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
})

interface Props {
  onClose?: () => void
}

type UserCred = {
  email: string
  password: string
  username: string
  imgUrl?: string
}

export const AuthModal: React.FC<Props> = ({ onClose }) => {
  const [login] = useLoginMutation()
  const [register] = useRegisterMutation()
  const [userCred, setUserCred] = useState<UserCred>({
    username: '',
    email: '',
    password: '',
  })
  const [isRegister, setIsRegister] = useState(false)

  const handleChange = (el: HTMLInputElement) => {
    const val = el.value
    const name = el.name
    setUserCred((cred) => ({ ...cred, [name]: val }))
  }

  const handleLogin = async (e: React.MouseEvent) => {
    e.preventDefault()
    //check data.. //TODO
    try {
      if (!userCred.email || !userCred.password) throw new Error()
      const x = await login(userCred).unwrap()
    } catch (e) {
      await Toast.fire({
        icon: 'error',
        title: 'לא מצליחים לחבר אותך',
      })
    }
  }

  const handleRegister = async (e: React.MouseEvent) => {
    e.preventDefault()
    //check data.. //TODO

    try {
      if (!userCred.email || !userCred.password || !userCred.username)
        throw new Error()
      const x = await register(userCred).unwrap()
    } catch (e) {
      await Toast.fire({
        icon: 'error',
        title: 'לא מצליחים לרשום אותך',
      })
    }
  }

  const handleAutoRegister = async (e: React.MouseEvent) => {
    e.preventDefault()
    //check data.. //TODO

    try {
      await Toast.fire({
        icon: 'success',
        title: 'כבר מכניסים אותך',
      })
      const x = await register({
        email: chance.email(),
        username: chance.first({ gender: 'male' }),
        password: '!!secret!!',
      }).unwrap()
    } catch (e) {
      await Toast.fire({
        icon: 'error',
        title: 'משהו לא מסתדר, צרו קשר אם הבעיה חוזרת',
      })
    }
  }

  const handleSetRegister = (e: React.MouseEvent, force: boolean) => {
    e.preventDefault()
    setIsRegister(force)
    if (force === false) {
      //if logging:
      userCred.username = ''
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClose && onClose()
  }

  return (
    <div className="auth-modal-overlay" onClick={handleOverlayClick}>
      <form className="auth-modal" onClick={(e) => e.stopPropagation()}>
        {isRegister ? (
          <input
            type="text"
            name="username"
            className="swal2-input"
            placeholder="שם פרטי"
            autoComplete="none"
            value={userCred.username}
            onChange={(e) => handleChange(e.target)}
          />
        ) : null}
        <input
          type="text"
          name="email"
          className="swal2-input"
          placeholder="שם משתמש / מייל"
          autoComplete="none"
          value={userCred.email}
          onChange={(e) => handleChange(e.target)}
        />
        <input
          type="password"
          name="password"
          className="swal2-input"
          placeholder="סיסמה"
          value={userCred.password}
          onChange={(e) => handleChange(e.target)}
        />
        <div className="btns">
          {isRegister ? (
            <button className="auth-login btn primary" onClick={handleRegister}>
              הרשמה
            </button>
          ) : (
            <button className="auth-login btn primary" onClick={handleLogin}>
              התחברות
            </button>
          )}
          {isRegister ? (
            <button
              onClick={(e) => handleSetRegister(e, false)}
              className="auth-login btn outlined">
              רשום?
            </button>
          ) : (
            <button
              onClick={(e) => handleSetRegister(e, true)}
              className="auth-login btn outlined">
              חדש?
            </button>
          )}
          <button className="btn fill" onClick={handleAutoRegister}>
            טסטר? הרשמה בלחיצה אחת
          </button>
        </div>
      </form>
    </div>
  )
}
