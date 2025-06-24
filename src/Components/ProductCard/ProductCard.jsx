import React, { useContext, useState } from 'react';
import { FaHeart, FaStar } from 'react-icons/fa';
import { ProductsContext } from '../../Contexts/ProductContext';
import { FavoritesContext } from '../../Contexts/favoriteProducts';
import './ProductCard.css';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../Contexts/GlobalContext';
import AddCartBtns from '../AddCartBtns/AddCartBtns';

export default function ProductCard({ product, category }) {
  const navigate = useNavigate();
  const [hoverRating, setHoverRating] = useState(null);
  const { getImageUrl } = useContext(GlobalContext);
  const { isFavorite, toggleFavorite, getRating, setRating } = useContext(FavoritesContext);
  const isProductFavorite = isFavorite(product._id || product.id);
  const productRating = getRating(product._id || product.id);
  const [selectedRating, setSelectedRating] = useState(productRating);

  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    toggleFavorite(product);
  };

  const handleRatingChange = (e, rating) => {
    e.stopPropagation();
    setRating(product._id || product.id, rating);
    setSelectedRating(rating);
  };

  const HandleProductsTypes = () => {
    navigate('/products', { state: { category: category?.name } });
  };

  return (
    <div className="product-card" onClick={() => navigate(`/products/${product._id}`)}>
      <div className="product-container-press" onClick={HandleProductsTypes}>
        <div className="product-image-container">
          <img
            src={getImageUrl(product.images?.[0])}
            alt={product.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
            }}
          />
          {product.onSale && <div className="sale-badge">מבצע</div>}
          <button
            className={`favorite-button ${isProductFavorite ? 'active' : ''}`}
            onClick={handleFavoriteToggle}
            title={isProductFavorite ? 'הסר ממועדפים' : 'הוסף למועדפים'}
          >
            <FaHeart />
          </button>
        </div>

        <div className="product-info">
          <h3>{product.name}</h3>
          <p className="product-category">{product.category}</p>
          <div className="product-price">
            {product.onSale && product.salePrice ? (
              <>
                <span className="sale-price">{product.salePrice} ₪</span>
                <span className="original-price">
                  {product.price} ₪
                </span>
              </>
            ) : (
              <span className='sale-price'>{product.price} ₪</span>
            )}
          </div>

          {/* הצגת סוג מבצע */}
          {product.onSale && product.promotion?.type && (
            <div className="promotion-details">
              {product.promotion.type === 'percentage' && (
                <p>הנחה של {product.discountPercent}%</p>
              )}
              {product.promotion.type === 'bundle' && (
                <p>{product.promotion.bundleQuantity} ב־₪{product.promotion.bundlePrice}</p>
              )}
              {product.promotion.type === 'multiToOne' && (
                <p>{product.promotion.multiToOneQuantity} במחיר של 1</p>
              )}
            </div>
          )}

          <div className="rating-container">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`star ${star <= (hoverRating || selectedRating) ? 'active' : ''}`}
                onClick={(e) => handleRatingChange(e, star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(null)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
        </div>
      </div>
      <AddCartBtns product={product} />
    </div>
  );
}
