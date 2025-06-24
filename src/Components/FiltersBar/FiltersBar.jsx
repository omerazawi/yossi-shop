import React, { useContext } from 'react';
import './FiltersBar.css';
import {
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaSortAmountUpAlt,
  FaSortAmountDown
} from 'react-icons/fa';
import { BiCategory } from 'react-icons/bi';
import { ProductsContext } from '../../Contexts/ProductContext';

export default function FiltersBar() {
  const {
    setSortType,
            sortType,
    categories,
    filterCategory,
    setFilterCategory
  } = useContext(ProductsContext);

  return (
    <div className="filters">
      <div className="filters-title">
        <h2>סינון מוצרים</h2>
      </div>
      <div className="filters-container">
        <div
          className={`filter-btn ${sortType === 'nameAsc' ? 'filtered' : ''}`}
          onClick={() =>
            setSortType((prev) => (prev === 'nameAsc' ? '' : 'nameAsc'))
          }
        >
          <FaSortAlphaDown />
          <h2>סדר לפי שם א'-ת'</h2>
        </div>

        <div
          className={`filter-btn ${sortType === 'nameDesc' ? 'filtered' : ''}`}
          onClick={() =>
            setSortType((prev) => (prev === 'nameDesc' ? '' : 'nameDesc'))}
        >
          <FaSortAlphaUp />
          <h2>סדר לפי שם ת'-א'</h2>
        </div>

        <div
          className={`filter-btn ${sortType === 'priceAsc' ? 'filtered' : ''}`}
          onClick={() =>
            setSortType((prev) => (prev === 'priceAsc' ? '' : 'priceAsc'))
          }
        >
          <FaSortAmountUpAlt />
          <h2>מהזול ליקר</h2>
        </div>

        <div
          className={`filter-btn ${sortType === 'priceDesc' ? 'filtered' : ''}`}
          onClick={() =>
            setSortType((prev) => (prev === 'priceDesc' ? '' : 'priceDesc'))
          }
        >
          <FaSortAmountDown />
          <h2>מהיקר לזול</h2>
        </div>

        <div
          className={`filter-btn filter-category ${filterCategory !== 'all' ? 'filtered' : ''}`}
        >
          <div className="filter-category-title">
          <BiCategory />
          <h2>סינון לפי קטגוריה</h2>
          </div>
          <div className="filter-category-content">            
          <select
             className={`category-select ${filterCategory !== 'all' ? 'selected' : ''}`}
             value={filterCategory}
             onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">הכל</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          </div>
        </div>
      </div>
    </div>
  );
}
