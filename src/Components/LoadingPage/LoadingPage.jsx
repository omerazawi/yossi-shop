import React from 'react';
import './LoadingPage.css';

export default function LoadingPage() {
  return (
    <div className="loading-container">
      <h1>טוען...</h1>
      <div className="bubbles">
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
      </div>
    </div>
  );
}
