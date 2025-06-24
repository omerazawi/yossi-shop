import React from 'react';
import './CategoryCard.css';

export default function CategoryCard({ category, onClickCategory, active }) {
    const handleClick = () => {
        if (onClickCategory) {
            onClickCategory();
        }
    };

    return (
        <div
            className={`category-card ${active ? 'active' : ''}`}
            onClick={handleClick}
        >
            <div className="category-card-img">
            <img src={category.image} alt={category.name} />
            </div>
            <div className="category-card-title">
            <h3>{category.name}</h3>
            </div>
        </div>
    );
}
