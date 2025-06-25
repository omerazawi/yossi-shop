import React from 'react';
import './Content.css';
import { FaWhatsapp } from "react-icons/fa";

export default function Content() {
  const phoneNumber = '972556669156'; 
  const message = 'שלום, יש לי בעיה באתר..';

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className='content-container'>
    <div className="speech-bubble">
    <p>צור איתנו קשר</p>
    </div>
    <a className='whatsapp-btn' href={whatsappLink} target="_blank" rel="noopener noreferrer">
<FaWhatsapp />
    </a>
    </div>
  )
}
