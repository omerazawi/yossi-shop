import React,{createContext,useState,useEffect, useContext,useMemo} from "react";
import axios from "axios";
import { GlobalContext } from "./GlobalContext";

export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
      });
    const {selectedCategoryFromLocation,setIsLoading,setErrorMessage} = useContext(GlobalContext);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortType, setSortType] = useState('');
    const [filterOnSale, setFilterOnSale] = useState(false);
    const [filterTopRated, setFilterTopRated] = useState(false);
    const [filterCategory, setFilterCategory] = useState(selectedCategoryFromLocation || 'all');
    const {} = useContext(GlobalContext);

    const getProductId = (product) => String(product._id || product.id);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
      }, [cartItems]);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    // ------------מחיקת פריטים מהסל---------
    const removeFromCart = (productId) => {
        const currentQuantity = getCartQuantity(productId);
        if (currentQuantity > 1) {
            updateQuantity(productId, currentQuantity - 1);
        } else {
            setCartItems(prevItems =>
                prevItems.filter(item => !isSameProduct(item, productId))
            );
        }
    };
    


     // --- מוצרים אחרי סינון ומיון ---
     const filteredProducts = useMemo(() => {
        let filtered = [...products];
    
        // חיפוש
        if (searchQuery.trim()) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
    
        // סינון לפי קטגוריה
        if (filterCategory !== 'all') {
            filtered = filtered.filter(product => {
                const productCategory = Array.isArray(product.category) ? product.category[0] : product.category;
                return productCategory === filterCategory;
            });
        }
    
        // ✅ סינון לפי מבצע
        if (filterOnSale) {
            filtered = filtered.filter(product => product.onSale);
        }
    
        // ✅ סינון לפי דירוג גבוה (למשל דירוג 4 ומעלה)
        if (filterTopRated) {
            filtered = filtered.filter(product => product.rating >= 4);
        }
    
        // מיון
        if (sortType === 'nameAsc') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortType === 'nameDesc') {
            filtered.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortType === 'priceAsc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortType === 'priceDesc') {
            filtered.sort((a, b) => b.price - a.price);
        }
    
    
        return filtered;
    }, [products, filterCategory, sortType, searchQuery, filterOnSale, filterTopRated]);

    // --------כמות מוצרים בסל----------
    const getCartQuantity = (productId) => {
        if (!productId) {
            console.error('Invalid productId for getCartQuantity', productId);
            return 0;
        }

        const item = cartItems.find(item => isSameProduct(item, productId));
        return item ? item.quantity : 0;
    };

    // ----------הוספת/הסרת מוצרים מהסל-------
    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
        } else {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    isSameProduct(item, productId)
                        ? { ...item, quantity: newQuantity }
                        : item
                )
            );
        }
    };


const getCartTotal = () => {
  return cartItems.reduce((total, item) => {
    const quantity = item.quantity || 1;

    if (item.onSale && item.promotion?.type) {
      switch (item.promotion.type) {
        case 'percentage': {
          const discount = (item.price * item.discountPercent) / 100;
          const discountedPrice = item.price - discount;
          return total + discountedPrice * quantity;
        }

        case 'multiToOne': {
          const groupSize = item.promotion.multiToOneQuantity || 1;
          const groupCount = Math.floor(quantity / groupSize);
          const remaining = quantity % groupSize;
          return total + (groupCount + remaining) * item.price;
        }

        case 'bundle': {
          const bundleQty = item.promotion.bundleQuantity || 1;
          const bundlePrice = item.promotion.bundlePrice || item.price;
          const fullBundles = Math.floor(quantity / bundleQty);
          const remaining = quantity % bundleQty;
          return total + fullBundles * bundlePrice + remaining * item.price;
        }

        default:
          return total + item.price * quantity;
      }
    }

    // מחיר רגיל או מבצע ללא סוג
    const effectivePrice = item.salePrice || item.price;
    return total + effectivePrice * quantity;
  }, 0);
};


    const addToCart = (product) => {
        if (!product || (!product._id && !product.id)) {
            console.error('Invalid product added to cart', product);
            return;
        }

        const productId = getProductId(product);

        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => getProductId(item) === productId);

            if (existingItem) {
                return prevItems.map(item =>
                    getProductId(item) === productId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...prevItems, { ...product, quantity: 1 }];
        });
    };

    const isSameProduct = (item, productId) => {
        const id = String(productId);
        return String(item._id) === id || String(item.id) === id;
    };

    const isProductInCart = (productId) => {
        if (!productId) {
            console.error('Invalid productId for isProductInCart', productId);
            return false;
        }

        return cartItems.some(item => isSameProduct(item, productId));
    };

    const fetchProducts = async () => {
        setErrorMessage('');
        setIsLoading(true);
        try {
            if (process.env.NODE_ENV === 'development') console.log("Fetching products...");
            const response = await axios.get('https://yossi-shop.onrender.com/Products/');
            if (process.env.NODE_ENV === 'development') console.log("Products fetched:", response.data);
            
            // מחשב מחיר מבצע אם חסר
            const updatedProducts = response.data.map(product => {
                if (product.onSale && !product.salePrice && product.discountPercent > 0) {
                    const discountAmount = (product.price * product.discountPercent) / 100;
                    product.salePrice = Math.round((product.price - discountAmount) * 100) / 100;
                }
                return product;
            });
    
            setProducts(updatedProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
            setIsLoading(false);
            setErrorMessage('לא ניתן לטעון מוצרים כרגע.. אנא נסה שנית');
        }
        finally{
            setIsLoading(false);
        }
    }
    

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('https://yossi-shop.onrender.com/Category/');
            setCategories(response.data);
        } catch (error) {
            set
            setIsLoading(false);
            console.error('Error fetching categories:', error);
        }
        finally{
            setIsLoading(false);
        }
    };

    return(
        <ProductsContext.Provider value={{
            getProductId,
            cartItems,
            setCartItems,
            categories,
            products,
            isProductInCart,
            addToCart,
            getCartTotal,
            updateQuantity,
            getCartQuantity,
            removeFromCart,
            searchQuery,
            setSearchQuery,
            filterCategory,
            setFilterCategory,
            filteredProducts,
            setSortType,
            sortType,
            filterOnSale,
            setFilterOnSale,
            filterTopRated,
            setFilterTopRated,
            fetchProducts

        }}>
            {children}
        </ProductsContext.Provider>
    )
}
