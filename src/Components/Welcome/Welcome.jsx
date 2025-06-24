import React,{useContext} from 'react';
import MouseData from '../../assets/Lottie/mouse.json';
import {GlobalContext} from '../../Contexts/GlobalContext';
import Lottie from 'lottie-react';

export default function Welcome() {
  const {scrolled} = useContext(GlobalContext);

  return (
    <div className='welcome-container'>
        <div className="welcome">
            <div className="welcome-text">
                <p>ברוכים הבאים</p>
                <p>לעולם המתוק של</p>
                <p className='logo-text'>sweet shop</p>
                <p>כאן תמצאו את כל מה שאתם אוהבים במחירים הכי משתלמים שיש!</p>
            </div>
            <a className="welcome-btn" onClick={() => window.scrollTo({top: 600, behavior: 'smooth'})}>לחץ עכשיו לרכישה!</a>
            {!scrolled && (
            <div className="mouse-down">
            <Lottie 
            className='mouse'
    animationData={MouseData}
    loop={true}
    autoplay={true}
/>
            </div>
            )}
        </div>
    </div>
  )
}
