import React, { useContext } from 'react';
import './SalePage.css';
import ProductsBar from '../../Components/ProductsBar/ProductsBar';
import CategoryBar from '../../Components/CategotyBar/CategoryBar';
import { ProductsContext } from '../../Contexts/ProductContext';


export default function SalePage() {
  const { products } = useContext(ProductsContext);
  // מוצרים במבצע
  const saleProducts = products.filter(product => product.onSale);
  // מוצרים עם דירוג 4 ומעלה
  const topRatedProducts = products.filter(product => product.rating >= 4);

  return (
    <div className='sale-page'>
      <CategoryBar />
      <ProductsBar title="מבצעים" types={saleProducts} />
      <ProductsBar title="המדורגים ביותר" types={topRatedProducts} />
      <ProductsBar title="המוצרים שלנו" types={products} />
    </div>
  );
}
