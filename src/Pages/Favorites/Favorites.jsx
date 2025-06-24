import React from 'react';
import {useFavorites} from '../../Contexts/favoriteProducts'
import ProductCard from '../../Components/ProductCard/ProductCard';
import './Favorites.css';

export default function Favorites() {
    const { favorites } = useFavorites();

    return (
      <div className="favorites-container">
        <h2>המוצרים שאהבת</h2>
        {favorites.length === 0 ? (
          <p>לא סימנת אף מוצר כאהוב עדיין.</p>
        ) : (
          <div className="favorites-products">
            {favorites.map(product => (
            <ProductCard product={product}/>
            ))}
          </div>
        )}
      </div>
    );
}
