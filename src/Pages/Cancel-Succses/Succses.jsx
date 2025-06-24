import React, { useContext, useEffect } from 'react';
import './PaymentStatus.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ProductsContext } from '../../Contexts/ProductContext';

const Success = () => {
  const {setCartItems} = useContext(ProductsContext);
  const navigate = useNavigate();

  useEffect(() => {
    const orderData = localStorage.getItem('orderData');

    if (orderData) {
      axios.post('http://localhost:3001/orders', JSON.parse(orderData))
        .then(() => {
          localStorage.clear();
          setCartItems('');
        })
        .catch((err) => {
          console.error('שגיאה בשמירת ההזמנה בשרת:', err);
          navigate('/cancel');
        });
    } else {
      navigate('/cancel');
    }
  }, [navigate]);

  return (
    <div className="status-container">
      <div className="status-icon success">🎉</div>
      <h2 className="status-title">התשלום בוצע בהצלחה!</h2>
      <p className="status-message">הזמנתך נשמרה ונשלחה אליך במייל.</p>
      <button onClick={() => navigate('/')}>לחץ כאן לחזרה</button>
    </div>
  );
};

export default Success;
