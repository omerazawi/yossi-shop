import React, { useContext } from 'react';
import './ErrorMessage.css';
import { IoMdRefresh } from "react-icons/io";
import { ProductsContext } from '../../Contexts/ProductContext';

export default function ErrorMessage({ message }) {

  if (!message) return null;

  const {fetchProducts} = useContext(ProductsContext);

  return (
    <div className="error-message">
      <p>
      <strong>שגיאה: </strong>
      {message}
      </p>
      <div className="return-btn" onClick={fetchProducts}>
<IoMdRefresh />
      </div>
    </div>
  );
}
