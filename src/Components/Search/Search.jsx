import React, { useContext, useState } from 'react';
import { ProductsContext } from '../../Contexts/ProductContext';
import { FaSearch, FaHandPointLeft, FaTimes } from "react-icons/fa"; // נוסיף את FaTimes
import './Search.css';
import { useNavigate } from 'react-router-dom';

export default function Search() {
  const { searchQuery, setSearchQuery } = useContext(ProductsContext);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSearch = () => {
    setIsSearchOpen(prev => !prev);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="search">
      <div className='search-icon-container' onClick={toggleSearch}>
        <FaSearch />
      </div>
      <div className={`search-bar ${isSearchOpen ? 'open' : ''}`}>
        <div className="input-wrapper">
          <input
            id='search-bar-input'
            type="text"
            placeholder="חפש מוצר..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
          />
          {/* איקס שמופיע רק אם יש טקסט */}
          {searchQuery && (
            <button className="clear-button" onClick={clearSearch}>
              <FaTimes />
            </button>
          )}
        </div>

        <div onClick={handleSearchSubmit} className="search-submit-button">
          <p>חפש</p>
          <FaHandPointLeft />
        </div>
      </div>
    </div>
  );
}
