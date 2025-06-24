import React from 'react';
import './PaymentStatus.css';
import { useNavigate } from 'react-router-dom';

const Cancel = () => {
const navigate = useNavigate();

  return (
    <div className="status-container">
      <div className="status-icon cancel">❌</div>
      <h2 className="status-title">התשלום בוטל</h2>
      <p className="status-message">לא נורא, תוכל לנסות שוב מאוחר יותר.</p>
      <button onClick={() => navigate('/')}>לחץ כאן לחזרה</button>
    </div>
  );
};

export default Cancel;
