import React, { useEffect, useState } from "react";
import { useLocation, useNavigate }   from "react-router-dom";
import api from "../../api";
import "./Checkout.css";

const Checkout = () => {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const cartItems = state?.cartItems || [];

  const token = localStorage.getItem("token");
  const [user , setUser ] = useState({ fullName: "", email: "" });
  const [form , setForm ] = useState({ phone: "", address: "" });
  const [err  , setErr  ] = useState({});

  const [merge , setMerge ] = useState(false);
  const [mergeId, setMergeId] = useState(null);

  /* ---------- פרופיל ---------- */
  useEffect(() => {
    if (!token) return navigate("/login");
    api.get("/auth/profile")
       .then(({ data }) => setUser({ fullName: data.fullName, email: data.email }))
       .catch(() => navigate("/login"));
  }, [token, navigate]);

  /* ---------- ולידציה ---------- */
  const validate = () => {
    const e = {};
    if (!/^(?:0|\+972)[5][0-9]{8}$/.test(form.phone))   e.phone   = "טלפון לא תקין";
    if (!/^.+\s\d+$/.test(form.address))                e.address = "כתובת לא תקינה";
    setErr(e);
    return !Object.keys(e).length;
  };

  /* ---------- חישובי מחיר (פשוט) ---------- */
  const items = cartItems.map((it) => ({
    productId: it._id,
    name: it.name,
    quantity: it.quantity || 1,
    finalPrice: it.salePrice || it.price,
  }));
  const total = items.reduce((s, it) => s + it.finalPrice * it.quantity, 0).toFixed(2);

  /* ---------- בדיקת הזמנה קיימת ---------- */
  const checkExisting = async () => {
    const { data } = await api.post("/orders/check-existing", { phone: form.phone });
    if (data?.existingOrderId) {
      setMerge(true); setMergeId(data.existingOrderId);
    } else submit(false);
  };

  /* ---------- Submit ---------- */
  const submit = async (attach) => {
    const body = {
      cartItems: items,
      total,
      phone: form.phone,
      address: form.address,
      fullName: user.fullName,
      email: user.email,
      mergeWithOrderId: attach ? mergeId : null,
    };
    localStorage.setItem("orderData", JSON.stringify(body));
    const { data } = await api.post("/payment/create-checkout", body);
    window.location.href = data.url;
  };

  const pay = async () => {
    if (!token) return navigate("/login");
    if (!validate()) return;
    await checkExisting();
  };

  /* ---------- UI ---------- */
  return (
    <div className="checkout-container">
      <h2 className="checkout-title">סיכום הזמנה</h2>

      <ul className="checkout-list">
        {cartItems.map((it, i) => (
          <li key={i} className="checkout-item">
            <span>{it.name}</span>
            <span>{it.quantity} × {it.price.toFixed(2)} ₪</span>
            <span>{(it.price * it.quantity).toFixed(2)} ₪</span>
          </li>
        ))}
      </ul>

      <h3 className="checkout-total">סה״כ: ₪{total}</h3>

      <form className="checkout-form" onSubmit={(e) => e.preventDefault()}>
        <h4>פרטי משלוח</h4>

        <input
          name="phone"
          placeholder="טלפון"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        {err.phone && <span className="error-msg">{err.phone}</span>}

        <input
          name="address"
          placeholder="כתובת משלוח"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        {err.address && <span className="error-msg">{err.address}</span>}
      </form>

      {merge ? (
        <div className="merge-prompt">
          <p>נמצאה הזמנה קודמת עם אותו טלפון. לצרף?</p>
          <button onClick={() => submit(true)}>כן</button>
          <button onClick={() => submit(false)}>לא</button>
        </div>
      ) : (
        <button className="checkout-button" onClick={pay}>
          מעבר לתשלום
        </button>
      )}
    </div>
  );
};

export default Checkout;
