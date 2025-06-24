import React from 'react'
import Welcome from '../../Components/Welcome/Welcome'
import './Home.css';
import SalePage from '../SalePage/SalePage';

export default function Home() {
  return (
    <div className="home-container">
      <Welcome />
      <SalePage />
    </div>
  )
}
