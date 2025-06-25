import { useContext, useEffect }   from "react";
import { useNavigate } from "react-router-dom";
import { ProductsContext } from "../../Contexts/ProductContext";

export default function Success() {
  const nav = useNavigate();
  const {setCartItems} = useContext(ProductsContext);

  useEffect(() => {
    // לאחר שהתשלום הצליח, Stripe הפנה לכאן
    // ההזמנה עצמה כבר נשמרה בשלב create-checkout,
    // כך שאין צורך לשלוח אותה שוב.
    localStorage.removeItem("orderData");
    setCartItems([]);
    nav("/my-orders");
  }, [nav]);

  return <p>התשלום התקבל, מעביר לדף ההזמנות…</p>;
}
