import React, { useState } from 'react'
import { useLoginMutation } from '../features/api/apiSlice'
import { userService } from '../services/user.service'

interface AuthBtnProps {}

type UserCred = {
  email: string
  password: string
  username?: string
  imgUrl?: string
}

export const AuthBtn: React.FC<AuthBtnProps> = ({}) => {
  const [login] = useLoginMutation()
  const [userCred, setUserCred] = useState<UserCred>({
    email: '',
    password: '',
  })
  const [showModal, setShowModal] = useState(false)

  const handleChange = (el: HTMLInputElement) => {
    const val = el.value
    const name = el.name
    setUserCred((cred) => ({ ...cred, [name]: val }))
  }

  const handleLogin = async (e: React.MouseEvent) => {
    e.preventDefault()
    const x = await login(userCred)
    console.log(x)
  }

  return (
    <section className="auth-wrapper">
      {userService.isLoggedIn() ? (
        <p>{userService.getLoggedInUser()?.username}</p>
      ) : (
        <>
          {!showModal ? (
            <button className="auth-btn" onClick={(e) => setShowModal(true)}>
              כניסה
            </button>
          ) : (
            <button className="auth-btn" onClick={(e) => setShowModal(false)}>
              סגירה
            </button>
          )}
          {showModal ? (
            <form className="auth-modal">
              <label className="custom-field one">
                <input
                  type="text"
                  name="email"
                  placeholder="&nbsp;"
                  value={userCred.email}
                  onChange={(e) => handleChange(e.target)}
                />
                <span className="placeholder">שם משתמש / מייל</span>
              </label>
              <label className="custom-field one">
                <input
                  type="password"
                  name="password"
                  placeholder="&nbsp;"
                  value={userCred.password}
                  onChange={(e) => handleChange(e.target)}
                />
                <span className="placeholder">סיסמה</span>
              </label>
              <div className="btns">
                <button
                  className="auth-login btn primary"
                  onClick={handleLogin}>
                  התחבר
                </button>
                <button className="auth-login btn outlined">חדש?</button>
              </div>
            </form>
          ) : null}
        </>
      )}
    </section>
  )
}
