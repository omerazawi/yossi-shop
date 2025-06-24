import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProductsContext } from '../../Contexts/ProductContext';
import './ProductDetails.css';
import ProductCard from '../ProductCard/ProductCard';
import AddCartBtns from '../AddCartBtns/AddCartBtns';

export default function ProductDetails() {
  const { id } = useParams();
  const { products } = useContext(ProductsContext);

  const product = products.find(p => String(p._id) === id || String(p.id) === id);
  const defaultImage = product?.images?.[0] || 'https://via.placeholder.com/300';
  const [selectedImage, setSelectedImage] = useState(defaultImage);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (product?.images?.[0]) {
      setSelectedImage(product.images[0]);
    }
  }, [product]);

  if (!product) return <div className="not-found">המוצר לא נמצא</div>;

  const category = Array.isArray(product.category) ? product.category[0] : product.category;
  const relatedProducts = products.filter(p => {
    const pCat = Array.isArray(p.category) ? p.category[0] : p.category;
    return pCat === category && p._id !== product._id;
  });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div className="product-details-container">
      <div className="product-details-card">
        <div className="product-image-section">
          <div className="zoom-wrapper" onMouseMove={handleMouseMove}>
            <img
              src={selectedImage}
              alt={product.name}
              className="zoom-image"
              style={{
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
              }}
            />
          </div>

          <div className="all-images">
            {[...new Set(product.images || [])].map((img, idx) => (
              <img
                key={idx}
                src={img}
                className={`thumbnail ${img === selectedImage ? 'active' : ''}`}
                onClick={() => setSelectedImage(img)}
                alt={`תמונה ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="product-info-section">
          <h1>{product.name}</h1>
          <p className="product-desc">{product.description}</p>
          <div className="price-section">
            {product.onSale ? (
              <>
              <span className="sale-price">₪{product.salePrice}</span>
            <span className="original-price">₪{product.price}</span>
            </>
            ) :
            <span className="price">₪{product.price}</span>
            }
          </div>

          {/* מבצע */}
          {product.onSale && product.promotion?.type && (
            <div className="promotion-details-details">
              {product.promotion.type === 'percentage' && (
                <p>הנחה של {product.discountPercent}%</p>
              )}
              {product.promotion.type === 'bundle' && (
                <p>{product.promotion.bundleQuantity} יחידות ב־₪{product.promotion.bundlePrice}</p>
              )}
              {product.promotion.type === 'multiToOne' && (
                <p>{product.promotion.multiToOneQuantity} במחיר של 1</p>
              )}
            </div>
          )}

          <p className="category-label">קטגוריה: {category}</p>
          <p className="rating-label">דירוג: {product.rating || 'לא דורג'}</p>
          <AddCartBtns product={product} width={400} />
        </div>
      </div>

      <div className="related-section">
        <h2>מוצרים דומים בקטגוריה "{category}"</h2>
        <div className="related-products-grid">
          {relatedProducts.map(r => (
            <ProductCard key={r._id} product={r} />
          ))}
        </div>
      </div>
    </div>
  );
}
