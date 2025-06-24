import axios from 'axios';
import React, { createContext, useState, useContext, useEffect } from 'react';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [ratings, setRatings] = useState(() => {
    const saved = localStorage.getItem('ratings');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await fetch('https://yossi-shop.onrender.com/products/ratings');
        const serverRatings = await response.json();
        const localRatings = JSON.parse(localStorage.getItem('ratings')) || {};
        setRatings({ ...serverRatings, ...localRatings });
      } catch (error) {
        console.error('שגיאה בטעינת דירוגים:', error);
      }
    };
  
    fetchRatings();
  }, []);
  

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('ratings', JSON.stringify(ratings));
  }, [ratings]);

  const toggleFavorite = (product) => {
    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.some((fav) => fav._id === product._id);
      if (isFavorite) {
        return prevFavorites.filter((fav) => fav._id !== product._id);
      } else {
        return [...prevFavorites, product];
      }
    });
  };

  const isFavorite = (productId) => {
    return favorites.some((fav) => fav._id === productId || fav.id === productId);
  };

  const setRating = async (productId, rating) => {
    try {
      const response = await axios.post(`https://yossi-shop.onrender.com/products/rate/${productId}`,{ rating });
      setRatings((prevRatings) => ({
        ...prevRatings,
        [productId]: rating,
      }));
    } catch (error) {
      console.error('שגיאה בעת שליחת הדירוג:', error);
    }
  };

  const getRating = (productId) => {
    return ratings[productId] || null;
  };
  
  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        setRating,
        getRating,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
