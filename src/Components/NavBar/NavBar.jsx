import React, { useContext, useEffect, useState } from "react";
import "./NavBar.css";
import {
  FaSearch,
  FaUser,
  FaHeart,
  FaShoppingCart,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../Contexts/GlobalContext";
import { useFavorites } from "../../Contexts/favoriteProducts";
import { ProductsContext } from "../../Contexts/ProductContext";
import BackButton from "../BackButton/BackButton";
import Search from "../Search/Search";
import api from "../../api"; // Axios instance with JWT interceptor

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { scrolled, ToggleCurt } = useContext(GlobalContext);
  const { cartItems } = useContext(ProductsContext);
  const { favorites } = useFavorites();

  const [greet, setGreet] = useState(""); // "שלום, יוסי"

  /* ----- שליפת שם המשתמש אם יש JWT ----- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setGreet("");

    api
      .get("/auth/profile")
      .then(({ data }) => {
        const firstName = data.fullName.split(" ")[0];
        setGreet(`שלום, ${firstName}`);
      })
      .catch(() => setGreet(""));
  }, []);

  const cartItemCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const favoriteCount = favorites.length;

  const NavigateHome = () => {
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  return (
    <nav className={`nav-bar ${scrolled ? "scrolled" : ""}`}>
      <BackButton />
      <Search />

      <div className="logo-img" onClick={NavigateHome}>
        <img src="/logo.png" alt="לוגו" />
      </div>

      <div className="tools">
        {/* Greeting if logged in */}
        {greet && <span className="greet-text">{greet}</span>}

        {/* קישור להזמנות שלי / פרופיל */}
        <Link to="/my-orders">
          <FaUser />
        </Link>

        {/* מועדפים */}
        <Link to="/favorites" className="favorites-link">
          <FaHeart />
          {favoriteCount > 0 && (
            <span className="favorites-count">{favoriteCount}</span>
          )}
        </Link>

        {/* עגלת קניות */}
        <div className="cart-icon" onClick={ToggleCurt}>
          <FaShoppingCart />
          {cartItemCount > 0 && (
            <span className="cart-count">{cartItemCount}</span>
          )}
        </div>
      </div>
    </nav>
  );
}
