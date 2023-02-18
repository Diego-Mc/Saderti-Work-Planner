import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AuthBtn } from './AuthBtn'
import { ReactComponent as Logo } from '../assets/imgs/logo.svg'

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
  return (
    <header className="main-header">
      <nav className="nav">
        <NavLink to="/new">סידור חדש</NavLink>
        <NavLink to="/schedules">סידורים</NavLink>
        <NavLink to="/machines">מכונות</NavLink>
        <NavLink to="/workers">עובדים</NavLink>
      </nav>
      <div className="logo">
        <Link to="/">
          <Logo />
        </Link>
      </div>
      <div className="user">
        <AuthBtn />
      </div>
    </header>
  )
}
