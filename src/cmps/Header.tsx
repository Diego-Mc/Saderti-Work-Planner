import React from 'react'
import { Link } from 'react-router-dom'
import { AuthBtn } from './AuthBtn'
import { ReactComponent as Logo } from '../assets/imgs/logo.svg'

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
  return (
    <header className="main-header">
      <div className="logo">
        <Logo />
      </div>
      <nav className="nav">
        <Link to="/new">סידור חדש</Link>
        <Link to="/schedules">סידורים</Link>
        <Link to="/machines">מכונות</Link>
        <Link to="/workers">עובדים</Link>
      </nav>
      <div className="user">
        <AuthBtn />
      </div>
    </header>
  )
}
