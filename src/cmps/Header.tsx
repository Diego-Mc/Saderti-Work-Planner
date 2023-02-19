import React, { useState } from 'react'
import { Link, NavLink, useLocation, useParams } from 'react-router-dom'
import { AuthBtn } from './AuthBtn'
import { ReactComponent as Logo } from '../assets/imgs/logo.svg'
import { slide as Menu } from 'react-burger-menu'
import { useFetchUserQuery } from '../features/api/apiSlice'

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
  const location = useLocation()
  const [isBurgerOpen, setIsBurgerOpen] = useState(false)
  const { data: loggedInUser } = useFetchUserQuery()

  const handleMenuSelect = () => {
    setIsBurgerOpen(false)
  }

  return (
    <header
      className={`main-header ${
        location?.pathname === '/' ? 'home-header' : ''
      }`}>
      <nav className="nav mb-only">
        <Menu right onOpen={() => setIsBurgerOpen(true)} isOpen={isBurgerOpen}>
          {loggedInUser ? (
            <>
              <NavLink onClick={handleMenuSelect} to="/new">
                סידור חדש
              </NavLink>
              <NavLink onClick={handleMenuSelect} to="/schedules">
                סידורים
              </NavLink>
              <NavLink onClick={handleMenuSelect} to="/machines">
                מכונות
              </NavLink>
              <NavLink onClick={handleMenuSelect} to="/workers">
                עובדים
              </NavLink>
            </>
          ) : null}
          <AuthBtn />
        </Menu>
      </nav>
      <div className="logo">
        <Link to="/">
          <Logo />
        </Link>
      </div>
      <nav className="nav">
        {loggedInUser ? (
          <>
            <NavLink to="/new">סידור חדש</NavLink>
            <NavLink to="/schedules">סידורים</NavLink>
            <NavLink to="/machines">מכונות</NavLink>
            <NavLink to="/workers">עובדים</NavLink>
          </>
        ) : null}
      </nav>

      <div className="user">
        <AuthBtn />
      </div>
    </header>
  )
}
export default Header
