import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Feature } from '../cmps/homepage/Feature'
import { AuthModal } from '../hooks/AuthModal'
import { userService } from '../services/user.service'

interface HomeProps {}

export const Home: React.FC<HomeProps> = ({}) => {
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const handleShowNodal = () => {
    const isLoggedIn = userService.isLoggedIn()
    if (isLoggedIn) navigate('/new')
    else setShowModal(true)
  }
  return (
    <section className="home-view">
      {showModal ? <AuthModal onClose={() => setShowModal(false)} /> : null}
      <section className="hero">
        <h2 className="title">ניהול עובדי משמרת מעולם לא היה פשוט יותר</h2>
        <p className="text">
          אפליקציית סדר'תי מסדרת אותך - ניהול עובדים על בסיס ותוך יצירת סידורי
          עבודה
        </p>
        <button className="btn primary outlined" onClick={handleShowNodal}>
          סדר אותי!
        </button>
        <article className="hero-media">
          <img
            src="https://res.cloudinary.com/wewix/image/upload/v1676854968/saderti/img-hero_g8fze7.png"
            alt="hero image showcasing a schedule being built"
          />
        </article>
      </section>
      <section className="features">
        <h2 className="title">מה אתם מקבלים?</h2>
        <section className="feature-list">
          <Feature
            title="בקרת נתונים מלאה"
            text="צפו בנתונים סטטיסטיים מעודכנים על כל עובד ועל כל מכונה"
            icon="&#xe24b;"
          />
          <Feature
            title="יצירת סידורים בקלות"
            text="תגררו את העובד שאתם רוצים למקום שהוא צריך להיות - פשוט וקל"
            icon="&#xf71e;"
          />
          <Feature
            title="יצירת סידורים אוטומטית"
            text="מלאו את הסידור שלכם בצורה אוטומטית בעזרת אלגוריתם מתוחכם מבוסס סטטיסטיקה"
            icon="&#xe4cb;"
          />
          <Feature
            title="היסטוריית סידורים עדכנית"
            text="כל הסידורים נשמרים אוטומטית ותמיד זמינים לעריכה"
            icon="&#xec09;"
          />
          <Feature
            title="ייצוא לאקסל"
            text="בניתם סידור? בלחיצת כפתור הוא בקובץ אקסל בפורמט ייעודי לסידור עבודה"
            icon="&#xf1be;"
          />
        </section>
      </section>
      <section className="demo">
        <h2 className="title">איך זה עובד?</h2>
        <div className="content">
          <p>
            בסדר'תי לא צריך לעבוד קשה, נרשמים, מגדירים עובדים, מגדירים מכונות
            ו... וזהו. רק נשאר לבנות סידור (או ללחוץ על כפתור המילוי האוטומטי).
          </p>
          <div className="video">
            <video
              src="https://res.cloudinary.com/wewix/video/upload/v1676916973/saderti/Saderti_showcase_video_wpp1da.mp4"
              autoPlay
              loop
              muted
              controls={false}></video>
          </div>
        </div>
      </section>
      <section className="about">
        <h2 className="title">אודות יוצר הפרויקט</h2>
        <p>
          הפרויקט נבנה על ידי{' '}
          <a className="cta" href="https://www.diego-mc.com" target="_blank">
            דיאגו מונסון קונטררס
          </a>
          . מטרת הפרויקט היא לפתור בעיה חשובה - כמות העבודה הידנית והזמן הרב
          שנדרש ליצירת סידורי עבודה ולניהול בקרה על עובדי משמרות.
        </p>
        <p>
          אני כרגע מחפש עבודה כמתכנת Full-Stack/Front-End באיזור המרכז-שרון,
          אפשר למצוא אותי במקומות הבאים:
        </p>

        <div className="links">
          <a href="https://www.github.com/diego-mc" target="_blank">
            Github
          </a>
          <span>·</span>
          <a href="https://www.linkedin.com/in/diego-mon" target="_blank">
            Linkedin
          </a>
          <span>·</span>
          <a href="mailto:projkd1@gmail.com" target="_blank">
            projkd1@gmail.com
          </a>
          <span>·</span>
          <a href="https://www.diego-mc.com" target="_blank">
            Website
          </a>
        </div>
      </section>
      <footer className="footer">
        <p className="text">הצטרפו לסדר'תי ותנו לו לסדר אתכם כבר עכשיו</p>
        <button className="btn primary outlined" onClick={handleShowNodal}>
          הרשמה
        </button>
        <div className="lines">
          <div className="line-1 line"></div>
          <div className="line-2 line"></div>
          <div className="line-3 line"></div>
        </div>
      </footer>
    </section>
  )
}
export default Home
