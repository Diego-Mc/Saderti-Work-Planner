import React, { useState } from 'react'
import { useLogoutMutation } from '../features/api/apiSlice'
import { userService } from '../services/user.service'
import 'sweetalert2'
import { AuthModal } from '../hooks/AuthModal'

interface AuthBtnProps {}

export const AuthBtn: React.FC<AuthBtnProps> = ({}) => {
  const [logout] = useLogoutMutation()
  const [showModal, setShowModal] = useState(false)

  return (
    <section className="auth-wrapper">
      {userService.isLoggedIn() ? (
        <section className="logged-section">
          <p className="username-box">
            מנהל: {userService.getLoggedInUser()?.username}
          </p>
          <p className="logout-opt" onClick={() => logout()}>
            יציאה
          </p>
        </section>
      ) : (
        <>
          <button className="auth-btn" onClick={(e) => setShowModal(true)}>
            כניסה
          </button>
          {showModal ? <AuthModal onClose={() => setShowModal(false)} /> : null}
        </>
      )}
    </section>
  )
}
