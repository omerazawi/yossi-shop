import React, { useContext, useRef, useState, useEffect } from 'react';
import './CategoryBar.css';
import AllProductsBtn from '../AllProductsBtn/AllProductsBtn';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import CategoryCard from '../CategoryCard/CategoryCard';
import { ProductsContext } from '../../Contexts/ProductContext';
import { useNavigate } from 'react-router-dom';

export default function CategoryBar() {
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const { categories, filterCategory } = useContext(ProductsContext);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const scrollAmount = 250;

  const handleScrollRight = () => {
    scrollRef.current?.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleScrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  };

  const checkScrollButtonsCategorys = () => {
    const el = scrollRef.current;
    if (el) {
      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      const currentScroll = Math.abs(el.scrollLeft); // ב-RTL scrollLeft עלול להיות שלילי
  
      setCanScrollRight(currentScroll > 5); // האם אפשר לגלול ימינה (כלומר scrollLeft קטן מ-0)
      setCanScrollLeft(currentScroll < maxScrollLeft - 5); // האם אפשר לגלול שמאלה
    }
  };

  useEffect(() => {
    const checkScroll = () => {
      const el = scrollRef.current;
      if (el) {
        const maxScrollLeft = el.scrollWidth - el.clientWidth;
        const currentScroll = Math.abs(el.scrollLeft);
  
        // בדיקה אם יש בכלל גלילה
        const isScrollable = maxScrollLeft > 5;
        setCanScrollRight(isScrollable && currentScroll > 5);
        setCanScrollLeft(isScrollable && currentScroll < maxScrollLeft - 5);
      }
    };
  
    const handleResizeOrScroll = () => {
      requestAnimationFrame(checkScroll);
    };
  
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleResizeOrScroll);
    }
    window.addEventListener('resize', handleResizeOrScroll);
  
    // delay קטן כדי להבטיח מדידה נכונה לאחר הרנדר
    const timeout = setTimeout(checkScroll, 100);
  
    return () => {
      clearTimeout(timeout);
      el?.removeEventListener('scroll', handleResizeOrScroll);
      window.removeEventListener('resize', handleResizeOrScroll);
    };
  }, [categories]);
  
  
  
  return (
    <div className="product-categorys">
                {!canScrollLeft && (
                <div className="all-product-btn-bar">
                  <AllProductsBtn />
                </div>
                )}
      <div className="categorys-title">
        <h1>הקטגוריות שלנו</h1>
      </div>
      <div className="categorys" ref={scrollRef}>
      {canScrollLeft && (
        <div className="scroll-btn left-btn" onClick={handleScrollLeft}>
          <FaChevronLeft />
        </div>
      )}
        {categories.map(category => (
          <CategoryCard
          key={category._id}
          category={category}
          onClickCategory={() =>
            navigate('/products', { state: { category: category.name } })
          }
            active={filterCategory === category.name}
          />
        ))}
      {canScrollRight && (
        <div className="scroll-btn right-btn" onClick={handleScrollRight}>
          <FaChevronRight />
        </div>
      )}
      </div>
    </div>
  );
}
