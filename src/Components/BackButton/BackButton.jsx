import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowRight } from "react-icons/fa";
import './BackButton.css'; 

export default function BackButton() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleGoBack = () => {
        navigate(-1);
    };

    // נסתיר את הכפתור בדף הבית (או כל דף אחר שתרצה)
    const hideOnPaths = ['/', '/home'];
    const shouldShowBackButton = !hideOnPaths.includes(location.pathname);

    if (!shouldShowBackButton) {
        return null;
    }

    return (
        <FaArrowRight className="back-button" onClick={handleGoBack} />
    );
}
