import { useEffect, useState } from "react";
import api                      from "../../api";
import "./MyOrders.css";

export default function MyOrders() {
  const [active, setActive] = useState([]);
  const [done,   setDone]   = useState([]);

  useEffect(() => {
    api.get("/orders/my-orders").then(({ data }) => {
      setActive(data.filter(o => ["ממתינה", "שולם"].includes(o.status)));
      setDone  (data.filter(o => ["נשלחה", "בוטלה"].includes(o.status)));
    });
  }, []);

  const Card = ({ o }) => (
    <div className="order-card">
      <p><strong>מס׳:</strong> {o.orderId}</p>
      <p><strong>תאריך:</strong> {new Date(o.createdAt).toLocaleString("he-IL")}</p>
      <p><strong>סה״כ:</strong> ₪{o.total.toFixed(2)}</p>
      <p><strong>סטטוס:</strong> {o.status}</p>
    </div>
  );

  return (
    <div className="myorders-wrapper">
      <h2>הזמנות בטיפול</h2>
      {active.length ? active.map(o => <Card o={o} key={o._id} />)
                     : <p>אין הזמנות פעילות.</p>}

      <h2>היסטוריית הזמנות</h2>
      {done.length ? done.map(o => <Card o={o} key={o._id} />)
                   : <p>אין הזמנות קודמות.</p>}
    </div>
  );
}
