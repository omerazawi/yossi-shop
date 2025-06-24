import React, { useContext, useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProductsContext } from '../../Contexts/ProductContext';
import ProductCard from '../../Components/ProductCard/ProductCard';
import './Products.css';
import Search from '../../Components/Search/Search';
import CategoryBar from '../../Components/CategotyBar/CategoryBar';
import FiltersBar from '../../Components/FiltersBar/FiltersBar';

export default function Products() {
    const location = useLocation();
    const selectedCategoryFromLocation = location.state?.category || null;
  const { searchQuery,filterCategory,filteredProducts,setFilterCategory } = useContext(ProductsContext);

  useEffect(() => {
    if (selectedCategoryFromLocation) {
      setFilterCategory(selectedCategoryFromLocation);
    } else {
      setFilterCategory('all');
    }
  }, [selectedCategoryFromLocation]);


  return (
    <div className="products-home">
      <div className="products-title">
      <h1>{filterCategory === 'all' ? 'המוצרים שלנו' : filterCategory}</h1>
      </div>
      <FiltersBar />
      <div className="search-bar-container">
      <Search />
      </div>
      {/* הצגת מוצרים או הודעת "לא נמצאו" */}
      {filteredProducts.length === 0 ? (
        <div className="no-products-message">
          {searchQuery.trim() ? (
            <p>לא נמצאו מוצרים התואמים את החיפוש: "{searchQuery}"</p>
          ) : filterCategory !== 'all' ? (
            <p>לא נמצאו מוצרים בקטגוריה: "{filterCategory}"</p>
          ) : (
            <p>לא נמצאו מוצרים להצגה</p>
          )}
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard
              key={product._id || product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
}
