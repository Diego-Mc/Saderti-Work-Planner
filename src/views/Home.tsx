import React from 'react'
import { Feature } from '../cmps/homepage/feature'

interface HomeProps {}

export const Home: React.FC<HomeProps> = ({}) => {
  return (
    <section className="home-view">
      <section className="hero">
        <h2 className="title">ניהול עובדי משמרת מעולם לא היה פשוט יותר</h2>
        <p className="text">
          אפליקציית סדר'תי מסדרת אותך - ניהול עובדים על בסיס ותוך יצירת סידורי
          עבודה
        </p>
        <button className="btn primary outlined">סדר אותי!</button>
        <article className="hero-media">
          <img src="img-hero.png" alt="" />
        </article>
      </section>
      <section className="features">
        <h2 className="title">מה אתה מקבל?</h2>
        <section className="feature-list">
          <Feature
            title="בקרת נתונים מלאה"
            text="צפו בנתונים סטטיסטיים מעודכנים על כל עובד ועל כל מכונה"
            icon="insert_chart"
          />
          <Feature
            title="יצירת סידורים בקלות"
            text="תגררו את העובד שאתם רוצים למקום שהוא צריך להיות - פשוט וקל"
            icon="drag_pan"
          />
          <Feature
            title="יצירת סידורים אוטומטית"
            text="מלאו את הסידור שלכם בצורה אוטומטית בעזרת אלגוריתם מתוחכם מבוסס סטטיסטיקה"
            icon="acute"
          />
          <Feature
            title="היסטוריית סידורים עדכנית"
            text="כל הסידורים נשמרים אוטומטית ותמיד זמינים לעריכה"
            icon="work_history"
          />
          <Feature
            title="ייצוא לאקסל"
            text="בניתם סידור? בלחיצת כפתור הוא בקובץ אקסל בפורמט ייעודי לסידור עבודה"
            icon="table_view"
          />
        </section>
      </section>
      <section className="demo">
        <h2 className="title">איך זה עובד?</h2>
        <ol>
          <li>הרשם לאתר</li>
          <li>הגדר עובדים</li>
          <li>הגדר מכונות</li>
          <li>צור סידורים</li>
        </ol>
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
        <button className="btn primary outlined">הרשמה</button>
        <div className="lines">
          <div className="line-1 line"></div>
          <div className="line-2 line"></div>
          <div className="line-3 line"></div>
        </div>
      </footer>
    </section>
  )
}
