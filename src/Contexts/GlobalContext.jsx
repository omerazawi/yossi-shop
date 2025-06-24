import React,{createContext,useState,useEffect,useRef} from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [canScrollProductRight, setCanScrollProductRight] = useState(false);
    const [canScrollProductLeft, setCanScrollProductLeft] = useState(false);
  const scrollProductRef = useRef(null);

  const checkScrollButtons = () => {
    const el = scrollProductRef.current;
    if (el) {
      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      const currentScroll = Math.abs(el.scrollLeft); // ב-RTL scrollLeft עלול להיות שלילי
  
      setCanScrollProductRight(currentScroll > 5); // האם אפשר לגלול ימינה (כלומר scrollLeft קטן מ-0)
      setCanScrollProductLeft(currentScroll < maxScrollLeft - 5); // האם אפשר לגלול שמאלה
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const current = scrollProductRef.current;
    current?.addEventListener('scroll', checkScrollButtons);
    window.addEventListener('resize', checkScrollButtons);
    return () => {
      current?.removeEventListener('scroll', checkScrollButtons);
      window.removeEventListener('resize', checkScrollButtons);
    };
  }, []);

    const getImageUrl = (image) => {
      if (typeof image === 'string') {
        if (image.startsWith('data:image')) {
          return image;
        }
        return `https://yossi-shop.onrender.com/${image}`;
      }
      return '';
    };


    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };
  
    useEffect(() => {
      window.addEventListener('scroll', handleScroll);
      handleScroll();
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);

    const ToggleCurt = () =>{
      setIsCartOpen((prev) => !prev);
    }

  
return(
  <GlobalContext.Provider value={{
    scrolled,
    ToggleCurt,
    isCartOpen,
    getImageUrl,
    canScrollProductRight,
    canScrollProductLeft,
    scrollProductRef,
    checkScrollButtons,
    setIsCartOpen,
    isLoading,
    setIsLoading,
    errorMessage,
setErrorMessage,
  }}>
    {children}
  </GlobalContext.Provider>
)
    }
    
