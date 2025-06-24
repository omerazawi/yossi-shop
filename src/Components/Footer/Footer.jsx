import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { ProductsContext } from '../../Contexts/ProductContext';

export default function Footer() {
  const { categories } = useContext(ProductsContext);

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-section keywords">
          <h4>קטגוריות פופולריות</h4>
          <ul>
            {categories.map(cat => (
              <li key={cat._id}>
                <Link to="/products" state={{ category: cat.name }}>
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section info">
          <h4>מידע שימושי</h4>
          <ul>
            <li><Link to="/favorites">מוצרים אהובים</Link></li>
            <li><Link to="/accessibility">הצהרת נגישות</Link></li>
            <li><a href="mailto:example@email.com">צור קשר</a></li>
          </ul>
        </div>

        <div className="footer-section about">
          <h4>על האתר</h4>
          <p>
            חנות אונליין לכול הדברים המתוקים שכולנו אוהבים כולל מוצרי טבק ושתייה קרה במחירים מטורפים!
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} כל הזכויות שמורות | Sweet-Shop אתר זה נוצר ע"י עומר אזאוי.</p>
      </div>
    </footer>
  );
}
