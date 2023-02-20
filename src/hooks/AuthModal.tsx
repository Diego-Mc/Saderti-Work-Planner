import React, { useState } from 'react'
import {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
} from '../features/api/apiSlice'

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
    if (!userCred.email || !userCred.password) return
    const x = await login(userCred).unwrap()
    console.log(x)
  }

  const handleRegister = async (e: React.MouseEvent) => {
    e.preventDefault()
    //check data.. //TODO

    if (!userCred.email || !userCred.password || !userCred.username) return

    const x = await register(userCred).unwrap()
    console.log(x)
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
        </div>
      </form>
    </div>
  )
}
