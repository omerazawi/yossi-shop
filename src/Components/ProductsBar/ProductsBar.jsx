import React, { useEffect, useState, useRef } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import AllProductsBtn from '../AllProductsBtn/AllProductsBtn';
import './ProductsBar.css';

export default function ProductsBar({ title, types }) {
  const scrollProductRef = useRef(null);
  const [canScrollProductRight, setCanScrollProductRight] = useState(false);
  const [canScrollProductLeft, setCanScrollProductLeft] = useState(false);

  const scrollAmount = 600;

  const checkScrollButtons = () => {
    const el = scrollProductRef.current;
    if (el) {
      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      const currentScroll = Math.abs(el.scrollLeft);
      setCanScrollProductRight(currentScroll > 5);
      setCanScrollProductLeft(currentScroll < maxScrollLeft - 5);
    }
  };

  const handleScrollRight = () => {
    scrollProductRef.current?.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleScrollLeft = () => {
    scrollProductRef.current?.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  };

  useEffect(() => {
    checkScrollButtons();
    const el = scrollProductRef.current;
    el?.addEventListener('scroll', checkScrollButtons);
    window.addEventListener('resize', checkScrollButtons);

    return () => {
      el?.removeEventListener('scroll', checkScrollButtons);
      window.removeEventListener('resize', checkScrollButtons);
    };
  }, [types]);

  return (
    <div className="products-bar">
      <div className="products-bar-title">
        <h1>{title}</h1>
      </div>
      <div className="products-bar-view" >
          {canScrollProductLeft && (
            <div className="scroll-product-btn left-product-btn" onClick={handleScrollLeft}>
              <FaChevronLeft />
            </div>
          )}
          <div className="views-scroling" ref={scrollProductRef}>
            {types.map((product, i) => (
              <ProductCard product={product} key={i} />
            ))}
          </div>
          {canScrollProductRight && (
            <div className="scroll-product-btn right-product-btn" onClick={handleScrollRight}>
              <FaChevronRight />
            </div>
          )}
      </div>
          {!canScrollProductLeft && (
          <div className="all-product-btn-bar">
            <AllProductsBtn />
          </div>
          )}
    </div>
  );
}
