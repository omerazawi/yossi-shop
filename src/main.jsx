import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { GlobalProvider } from './Contexts/GlobalContext.jsx';
import { FavoritesProvider } from './Contexts/favoriteProducts.jsx';
import { ProductsProvider } from './Contexts/ProductContext.jsx';




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalProvider>
      <FavoritesProvider>
      <ProductsProvider>
    <App />
      </ProductsProvider>
      </FavoritesProvider>
    </GlobalProvider>
  </StrictMode>,
)
