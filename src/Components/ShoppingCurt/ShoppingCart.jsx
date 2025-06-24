import React, { useContext, useRef, useEffect } from 'react';
import { FaShoppingCart, FaTimes, FaPlus, FaMinus } from 'react-icons/fa';
import { GlobalContext } from '../../Contexts/GlobalContext';
import { ProductsContext } from '../../Contexts/ProductContext';
import './ShoppingCart.css';
import { useNavigate } from 'react-router-dom';

export default function ShoppingCart() {
  const navigate = useNavigate();
  const { isCartOpen, ToggleCurt, setIsCartOpen } = useContext(GlobalContext);
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getCartTotal
  } = useContext(ProductsContext);

  const cartRef = useRef(null);
  const total = getCartTotal();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };

    if (isCartOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCartOpen, setIsCartOpen]);

  const getImageUrl = (image) => {
    if (typeof image === 'string') {
      if (image.startsWith('data:image')) {
        return image;
      }
      return `https://yossi-shop.onrender.com/${image}`;
    }
    return '';
  };

  const calculateItemTotal = (item) => {
    const quantity = item.quantity || 1;

    if (item.onSale && item.promotion?.type) {
      switch (item.promotion.type) {
        case 'percentage': {
          const discount = (item.price * item.discountPercent) / 100;
          const discountedPrice = item.price - discount;
          return discountedPrice * quantity;
        }
        case 'multiToOne': {
          const groupSize = item.promotion.multiToOneQuantity || 1;
          const groupCount = Math.floor(quantity / groupSize);
          const remaining = quantity % groupSize;
          return (groupCount + remaining) * item.price;
        }
        case 'bundle': {
          const bundleQty = item.promotion.bundleQuantity || 1;
          const bundlePrice = item.promotion.bundlePrice || item.price;
          const fullBundles = Math.floor(quantity / bundleQty);
          const remaining = quantity % bundleQty;
          return fullBundles * bundlePrice + remaining * item.price;
        }
        default:
          return item.price * quantity;
      }
    }

    const effectivePrice = item.salePrice || item.price;
    return effectivePrice * quantity;
  };

  if (!isCartOpen) return null;

  return (
    <>
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} />
      <div className="shopping-cart open" ref={cartRef}>
        <div className="cart-header">
          <h2>סל הקניות</h2>
          <button className="close-button" onClick={ToggleCurt}>
            <FaTimes />
          </button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p className="empty-cart">הסל ריק</p>
          ) : (
            cartItems.map(item => (
              <div key={item._id} className="cart-item">
                <img
                  src={getImageUrl(item.images[0])}
                  alt={item.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                  }}
                />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-price">
                    מחיר ליחידה:{" "}
                    {item.onSale && item.salePrice
                      ? `${item.salePrice} ₪`
                      : `${item.price} ₪`}
                  </p>
                  <p className="item-total">
                    סה"כ לשורה: {calculateItemTotal(item).toFixed(2)} ₪
                  </p>
                </div>
                <div className="item-quantity">
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>
                    <FaMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                    <FaPlus />
                  </button>
                </div>
                <button
                  className="remove-item"
                  onClick={() => removeFromCart(item._id)}
                >
                  <FaTimes />
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>סה"כ:</span>
              <span>{total.toFixed(2)} ₪</span>
            </div>
            <button
              className="checkout-button"
              onClick={() => {
                navigate('/checkout', {
                  state: {
                    cartItems,
                    total
                  }
                });
                ToggleCurt();
              }}
            >
              <FaShoppingCart /> לתשלום
            </button>
          </div>
        )}
      </div>
    </>
  );
}
