import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Accessibility.css';

export default function Accessibility() {
  const navigate = useNavigate();

  return (
    <div className="accessibility-container">
    <div className="accessibility-declaration">
      <button className="close-btn" onClick={() => navigate(-1)}>❌ חזרה</button>
      <h1>הצהרת נגישות</h1>
      <p>
        אנו רואים חשיבות רבה בהנגשת האתר שלנו לכלל המשתמשים, ובפרט לאנשים עם מוגבלויות,
        ופועלים בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות, התשנ״ח–1998, ותקנות הנגישות.
      </p>
      <p>בין היתר, האתר כולל:</p>
      <ul>
        <li>תפריט נגישות להתאמות תצוגה (הגדלת טקסט, ניגודיות ועוד)</li>
        <li>ניווט מלא באמצעות מקלדת</li>
        <li>שימוש נכון בכותרות ובמבנה היררכי</li>
        <li>טקסט חלופי (alt) לכל התמונות</li>
        <li>התאמה לתצוגה במכשירים ניידים</li>
      </ul>
      <p>
        במידה שנתקלתם בקושי או בתקלה כלשהי בנושא נגישות – נשמח שתפנו אלינו:
        <br />
        <strong>דוא״ל:</strong> <a href="mailto:omer949494@gmail.com">omer949494@gmail.com</a><br />
        <strong>טלפון:</strong> <a href="tel:0522649299">052-2649299</a>
      </p>
      <p>תאריך עדכון ההצהרה: <strong>{new Date().toLocaleDateString('he-IL')}</strong></p>
    </div>
    </div>
  );
}
