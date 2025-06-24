import React, { useState } from "react";
import axios               from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./Checkout.css";

const Checkout = () => {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const cartItems = state?.cartItems || [];

  /* --- טוקן לקוח --- */
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    fullName: "",
    phone:    "",
    address:  "",
    email:    "",
  });

  const [errors, setErrors] = useState({});
  const [showMergePrompt, setShowMergePrompt] = useState(false);
  const [existingOrderId, setExistingOrderId] = useState(null);

  /* ---------- ולידציה ---------- */
  const patterns = {
    fullName: /^[א-ת]{2,}(?: [א-ת]{2,})+$/,
    phone: /^(?:0|\+972)[5][0-9]{8}$/,
    address: /^.+\s\d+$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  };
  const errorMessages = {
    fullName: "יש להזין שם מלא לפחות עם שתי מילים בעברית (למשל: ישראל כהן)",
    phone: "מספר הטלפון חייב להיות תקני בפורמט ישראלי (למשל: 0501234567)",
    address: "יש להזין כתובת מלאה כולל שם רחוב ומספר בית (למשל: הרצל 10)",
    email: "יש להזין כתובת אימייל תקינה",
  };

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const validate = () => {
    const newErr = {};
    Object.keys(formData).forEach((k) => {
      if (!formData[k].trim()) newErr[k] = "שדה חובה";
      else if (!patterns[k].test(formData[k].trim()))
        newErr[k] = errorMessages[k];
    });
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  /* ---------- חישובי מחיר ---------- */
  const calculateItemFinalPrice = (item) => {
    const q = item.quantity || 1;
    if (item.onSale && item.promotion?.type) {
      switch (item.promotion.type) {
        case "percentage":
          const disc = (item.price * item.discountPercent) / 100;
          return (item.price - disc) * q;
        case "multiToOne":
          const gs = item.promotion.multiToOneQuantity || 1;
          const groups = Math.floor(q / gs);
          return (groups + (q % gs)) * item.price;
        case "bundle":
          const bQty  = item.promotion.bundleQuantity || 1;
          const bPrice = item.promotion.bundlePrice || item.price;
          const fullB = Math.floor(q / bQty);
          return fullB * bPrice + (q % bQty) * item.price;
        default:
          return item.price * q;
      }
    }
    const effPrice = item.salePrice || item.price;
    return effPrice * q;
  };

  const prepareItemsWithFinalPrice = () =>
    cartItems.map((it) => {
      const q = it.quantity || 1;
      const tot = calculateItemFinalPrice(it);
      return {
        productId: it._id,
        name:      it.name,
        quantity:  q,
        finalPrice: Math.round((tot / q) * 100) / 100,
      };
    });

  const calculateTotal = (items) =>
    items.reduce((acc, it) => acc + it.finalPrice * it.quantity, 0);

  /* ---------- בדיקת הזמנה קיימת ---------- */
  const checkExistingOrder = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:3001/orders/check-existing",
        { fullName: formData.fullName, phone: formData.phone }
      );
      if (data?.existingOrderId) {
        setExistingOrderId(data.existingOrderId);
        setShowMergePrompt(true);
      } else {
        submitOrder();
      }
    } catch (err) {
      alert("שגיאה בבדיקת הזמנות קיימות");
      console.error(err);
    }
  };

  /* ---------- שליחת הזמנה ויצירת תשלום ---------- */
  const submitOrder = async (merge = false) => {
    try {
      const items = prepareItemsWithFinalPrice();
      const total = calculateTotal(items);

      const orderData = {
        cartItems: items,
        total,
        email:  formData.email,
        address: formData.address,
        fullName:formData.fullName,
        phone:   formData.phone,
        mergeWithOrderId: merge ? existingOrderId : null,
      };
      localStorage.setItem("orderData", JSON.stringify(orderData));

      const { data } = await axios.post(
        "http://localhost:3001/payment/create-checkout",
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = data.url;
    } catch (err) {
      alert("שגיאה בעת התחלת התשלום");
      console.error(err);
    }
  };

  /* ---------- כפתור תשלום ---------- */
  const handlePayment = async () => {
    if (!token) {
      alert("עליך להתחבר או להירשם לפני ביצוע הזמנה.");
      navigate("/login");
      return;
    }
    if (!validate()) return;
    await checkExistingOrder();
  };

  /* ---------- UI ---------- */
  const totalToDisplay = Math.round(
    calculateTotal(prepareItemsWithFinalPrice()) * 100
  ) / 100;

  if (cartItems.length === 0) {
    return (
      <div className="checkout-container">
        <p className="empty-cart-message">העגלה ריקה</p>
        <button className="checkout-button" onClick={() => navigate("/")}>
          חזרה לדף הבית
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">סיכום הזמנה</h2>

      <ul className="checkout-list">
        {cartItems.map((it, i) => {
          const tot = calculateItemFinalPrice(it);
          const unit = tot / (it.quantity || 1);
          return (
            <li key={i} className="checkout-item">
              <span>{it.name}</span>
              <span>
                {it.quantity} × {unit.toFixed(2)} ₪
              </span>
              <span>{tot.toFixed(2)} ₪</span>
            </li>
          );
        })}
      </ul>

      <h3 className="checkout-total">סה״כ לתשלום: ₪{totalToDisplay.toFixed(2)}</h3>

      <form className="checkout-form" onSubmit={(e) => e.preventDefault()}>
        <h4>פרטי משלוח</h4>

        <input
          name="fullName"
          placeholder="שם מלא"
          value={formData.fullName}
          onChange={handleChange}
        />
        {errors.fullName && <span className="error-msg">{errors.fullName}</span>}

        <input
          name="phone"
          placeholder="טלפון"
          value={formData.phone}
          onChange={handleChange}
        />
        {errors.phone && <span className="error-msg">{errors.phone}</span>}

        <input
          name="address"
          placeholder="כתובת למשלוח"
          value={formData.address}
          onChange={handleChange}
        />
        {errors.address && <span className="error-msg">{errors.address}</span>}

        <input
          name="email"
          type="email"
          placeholder="אימייל"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span className="error-msg">{errors.email}</span>}
      </form>

      {showMergePrompt ? (
        <div className="merge-prompt">
          <p>
            נמצאה הזמנה קודמת תחת אותם פרטים. האם לצרף את ההזמנה הנוכחית
            אליה?
          </p>
          <button onClick={() => submitOrder(true)}>כן, צרף</button>
          <button onClick={() => submitOrder(false)}>לא, חדשה</button>
        </div>
      ) : (
        <button className="checkout-button" onClick={handlePayment}>
          מעבר לתשלום
        </button>
      )}
    </div>
  );
};

export default Checkout;
