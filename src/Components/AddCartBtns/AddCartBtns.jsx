import React,{useContext} from 'react';
import './AddCartBtns.css';
import { ProductsContext } from '../../Contexts/ProductContext';
import {FaPlus, FaMinus, FaCartPlus} from 'react-icons/fa';

export default function AddCartBtns({product,width}) {
      const { isProductInCart, getCartQuantity,addToCart,removeFromCart } = useContext(ProductsContext);
    
    const cartQuantity = getCartQuantity(product._id || product.id);
    const isInCart = isProductInCart(product._id || product.id);

    const handleAddQuantity = (e) => {
        e.stopPropagation();
        addToCart(product);
      };
    
      const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart(product);
      };
    
      const handleRemoveFromCart = (e) => {
        e.stopPropagation();
        removeFromCart(product._id || product.id);
      };
    

    return (
    <div onClick={(e) => e.stopPropagation()} style={{minWidth:width}}>
    {isInCart ? (
      <div className="product-quantity-controls">
        <button
          className="quantity-button"
          onClick={handleRemoveFromCart}
          title="הסר מוצר"
        >
          <FaMinus />
        </button>
        <span className="quantity-display">{cartQuantity}</span>
        <button
          className="quantity-button"
          onClick={handleAddQuantity}
          title="הוסף מוצר"
        >
          <FaPlus />
        </button>
      </div>
    ) : (
      <button className="add-to-cart-button" onClick={handleAddToCart}>
        <FaCartPlus />
        <span>הוסף לסל</span>
      </button>
    )}
  </div>
  )
}
