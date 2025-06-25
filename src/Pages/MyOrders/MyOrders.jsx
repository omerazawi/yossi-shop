import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "./MyOrders.css";

export default function MyOrders() {
  const nav = useNavigate();
  const token = localStorage.getItem("token");

  const [notLogged, setNotLogged] = useState(!token);
  const [active,    setActive] = useState([]);
  const [done,      setDone] = useState([]);

  /* -- טעינת הזמנות רק אם יש טוקן -- */
  useEffect(() => {
    if (!token) return;             
    api.get("/orders/my-orders")
       .then(({ data }) => {
         setActive(data.filter(o => ["ממתינה", "שולם"].includes(o.status)));
         setDone  (data.filter(o => ["בוצעה בהצלחה","נשלחה", "בוטלה"].includes(o.status)));
       })
       .catch(() => setNotLogged(true));  
  }, [token]);

  /* -- כרטיס הזמנה -- */
  const Card = ({ o }) => (
    <div className="order-card">
      <p><strong>מס׳:</strong> {o.orderId}</p>
      <p><strong>תאריך:</strong> {new Date(o.createdAt).toLocaleString("he-IL")}</p>
      <p><strong>כתובת:</strong> {o.address}</p>
      <p><strong>טלפון:</strong> {o.phone}</p>
      <p><strong>סה״כ:</strong> ₪{o.total.toFixed(2)}</p>
      <p><strong>סטטוס:</strong> {o.status}</p>
    </div>
  );

  /* -- אם לא מחובר -- */
  if (notLogged) {
    return (
      <div className="myorders-wrapper">
        <p>
          עליך להתחבר כדי לצפות בהיסטוריית ההזמנות שלך.
        </p>
        <div className="to-login-btn">
          <button
            onClick={() => nav("/login")}
          >
            מעבר להתחברות
          </button>
        </div>
      </div>
    );
  }

  /* -- תצוגה רגילה -- */
  return (
    <div className="myorders-wrapper">
      <h2>הזמנות בטיפול</h2>
      {active.length
        ? active.map((o) => <Card key={o._id} o={o} />)
        : <p>אין הזמנות פעילות.</p>}

      <h2>היסטוריית הזמנות</h2>
      {done.length
        ? done.map((o) => <Card key={o._id} o={o} />)
        : <p>אין הזמנות קודמות.</p>}
    </div>
  );
}
