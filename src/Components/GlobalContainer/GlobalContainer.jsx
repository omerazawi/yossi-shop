import React from 'react';
import './GlobalContainer.css';

export default function GlobalContainer({ children }) {
  return (
    <div className='global-conainer'>
        {children}
    </div>
  )
}
