import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Background from './Components/Background/Background';
import Favorites from './Pages/Favorites/Favorites';
import NavBar from './Components/NavBar/NavBar';
import ShoppingCart from './Components/ShoppingCurt/ShoppingCart';
import Products from './Pages/Products/Products';
import ProductDetails from './Components/ProductDetails/ProductDetails';
import Footer from './Components/Footer/Footer';
import AccessibilityMenu from './Components/AccessibilityMenu/AccessibilityMenu';
import Accessibility from './Components/Accessibility/Accessibility';
import MyOrders from './Pages/MyOrders/MyOrders';
import Checkout from './Pages/Checkout/Checkout';
import Success from './Pages/Cancel-Succses/Succses';
import Cancel from './Pages/Cancel-Succses/Cancel';
import LoadingPage from './Components/LoadingPage/LoadingPage';
import ErrorMessage from './Components/Message/ErrorMessage';
import { GlobalContext } from './Contexts/GlobalContext';
import Register from './Pages/Auth/Register';
import Login from './Pages/Auth/Login';
import Content from './Components/Content/Content';

function App() {
  const { isLoading, errorMessage } = useContext(GlobalContext);
  return (
    <>
      <ErrorMessage message={errorMessage} />
    {isLoading ? (<LoadingPage />) : (
    <Router>
      <Background />
      <NavBar />
      <ShoppingCart />
      <AccessibilityMenu />
      <Content />
      <Routes>
        <Route path='/Register' element={<Register />} />
        <Route path='/Login' element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/accessibility" element={<Accessibility />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path='/my-orders' element={<MyOrders />} />
        <Route path='/checkout' element={<Checkout />} />
  
      </Routes>
      <Footer />
    </Router>
    )}
    </>
  );
}

export default App;
