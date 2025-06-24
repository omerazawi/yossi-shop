import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = location.state || { cartItems: [] };

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    email: '',
  });

  const [errors, setErrors] = useState({});
  const [showMergePrompt, setShowMergePrompt] = useState(false);
  const [existingOrderId, setExistingOrderId] = useState(null);

  const patterns = {
    fullName: /^[א-ת]{2,}(?: [א-ת]{2,})+$/, // שתי מילים לפחות בעברית
    phone: /^(?:0|\+972)[5][0-9]{8}$/,       // מספר סלולרי ישראלי
    address: /^.+\s\d+$/,                   // טקסט כלשהו (רחוב) ואז מספר
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  };

  const errorMessages = {
    fullName: 'יש להזין שם מלא לפחות עם שתי מילים בעברית (למשל: ישראל כהן)',
    phone: 'מספר הטלפון חייב להיות תקני בפורמט ישראלי (למשל: 0501234567)',
    address: 'יש להזין כתובת מלאה כולל שם רחוב ומספר בית (למשל: הרצל 10)',
    email: 'יש להזין כתובת אימייל תקינה (למשל: name@example.com)',
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (!formData[key].trim()) newErrors[key] = 'שדה חובה';
      else if (!patterns[key].test(formData[key].trim()))
        newErrors[key] = errorMessages[key];
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateItemFinalPrice = (item) => {
    const quantity = item.quantity || 1;
    if (item.onSale && item.promotion?.type) {
      switch (item.promotion.type) {
        case 'percentage':
          const discount = (item.price * item.discountPercent) / 100;
          return (item.price - discount) * quantity;
        case 'multiToOne':
          const groupSize = item.promotion.multiToOneQuantity || 1;
          const groupCount = Math.floor(quantity / groupSize);
          const remaining = quantity % groupSize;
          return (groupCount + remaining) * item.price;
        case 'bundle':
          const bundleQty = item.promotion.bundleQuantity || 1;
          const bundlePrice = item.promotion.bundlePrice || item.price;
          const fullBundles = Math.floor(quantity / bundleQty);
          const remainingBundle = quantity % bundleQty;
          return fullBundles * bundlePrice + remainingBundle * item.price;
        default:
          return item.price * quantity;
      }
    }
    const effectivePrice = item.salePrice || item.price;
    return effectivePrice * quantity;
  };

  const prepareItemsWithFinalPrice = () => {
    return cartItems.map(item => {
      const quantity = item.quantity || 1;
      const totalItemPrice = calculateItemFinalPrice(item);
      const finalPrice = totalItemPrice / quantity;

      return {
        productId: item._id,
        name: item.name,
        quantity,
        finalPrice: Math.round(finalPrice * 100) / 100,
      };
    });
  };

  const calculateTotal = (items) => {
    return items.reduce((acc, item) => acc + item.finalPrice * item.quantity, 0);
  };

  const checkExistingOrder = async () => {
    try {
      const { data } = await axios.post('http://localhost:3001/orders/check-existing', {
        fullName: formData.fullName,
        phone: formData.phone,
      });
      if (data?.existingOrderId) {
        setExistingOrderId(data.existingOrderId);
        setShowMergePrompt(true);
      } else {
        submitOrder();
      }
    } catch (err) {
      alert('שגיאה בבדיקת הזמנות קיימות');
      console.error(err);
    }
  };

  const submitOrder = async (merge = false) => {
    try {
      const preparedItems = prepareItemsWithFinalPrice();
      const updatedTotal = calculateTotal(preparedItems);

      const orderData = {
        cartItems: preparedItems,
        total: updatedTotal,
        email: formData.email,
        userId: 'example-user-id',
        address: formData.address,
        fullName: formData.fullName,
        phone: formData.phone,
        mergeWithOrderId: merge ? existingOrderId : null,
      };

      localStorage.setItem('orderData', JSON.stringify(orderData));

      const res = await axios.post('http://localhost:3001/Payment/create-checkout', orderData);
      window.location.href = res.data.url;
    } catch (err) {
      alert('שגיאה בעת התחלת התשלום');
      console.error(err);
    }
  };

  const handlePayment = async () => {
    if (!validate()) return;
    await checkExistingOrder();
  };

  const totalToDisplay = Math.round(calculateTotal(prepareItemsWithFinalPrice()) * 100) / 100;

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="checkout-container">
        <p className="empty-cart-message">העגלה ריקה</p>
        <button className="checkout-button" onClick={() => navigate('/')}>חזרה לדף הבית</button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">סיכום הזמנה</h2>
      <ul className="checkout-list">
        {cartItems.map((item, i) => {
          const totalItemPrice = calculateItemFinalPrice(item);
          const unitPrice = totalItemPrice / (item.quantity || 1);
          return (
            <li key={i} className="checkout-item">
              <span>{item.name}</span>
              <span>{item.quantity} × {unitPrice.toFixed(2)} ₪</span>
              <span> {totalItemPrice.toFixed(2)} ₪</span>
            </li>
          );
        })}
      </ul>

      <h3 className="checkout-total">סה״כ לתשלום: ₪{totalToDisplay.toFixed(2)}</h3>

      <form className="checkout-form" onSubmit={e => e.preventDefault()}>
        <h4>פרטי משלוח</h4>

        <input type="text" name="fullName" placeholder="שם מלא" value={formData.fullName} onChange={handleChange} />
        {errors.fullName && <span className="error-msg">{errors.fullName}</span>}

        <input type="tel" name="phone" placeholder="טלפון" value={formData.phone} onChange={handleChange} />
        {errors.phone && <span className="error-msg">{errors.phone}</span>}

        <input type="text" name="address" placeholder="כתובת למשלוח" value={formData.address} onChange={handleChange} />
        {errors.address && <span className="error-msg">{errors.address}</span>}

        <input type="email" name="email" placeholder="אימייל" value={formData.email} onChange={handleChange} />
        {errors.email && <span className="error-msg">{errors.email}</span>}
      </form>

      {showMergePrompt && (
        <div className="merge-prompt">
          <p>נמצאה הזמנה קודמת תחת אותם פרטים. האם ברצונך לצרף את ההזמנה הנוכחית אליה?</p>
          <button onClick={() => submitOrder(true)}>כן, צרף להזמנה קיימת</button>
          <button onClick={() => submitOrder(false)}>לא, צור הזמנה חדשה</button>
        </div>
      )}

      {!showMergePrompt && (
        <button className="checkout-button" onClick={handlePayment}>מעבר לתשלום</button>
      )}
    </div>
  );
};

export default Checkout;
