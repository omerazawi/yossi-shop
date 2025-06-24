import React from 'react';
import { FaHandPointLeft } from 'react-icons/fa';
import './AllProductsBtn.css';
import { useNavigate } from 'react-router-dom';

export default function AllProductsBtn() {
  const navigate = useNavigate();
  return (
    <div className='all-products' onClick={() => navigate('/products', { state: { category: 'all' } })}>
      <h3>לכל המוצרים</h3>
      <FaHandPointLeft />
    </div>
  )
}
