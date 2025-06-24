import { useEffect }   from "react";
import { useNavigate } from "react-router-dom";
import api             from "../../api";

export default function Success() {
  const nav = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("orderData");
    if (!data) return nav("/");
    api.post("/orders", JSON.parse(data))
       .then(() => {
         localStorage.removeItem("orderData");
         nav("/my-orders");
       })
       .catch(() => nav("/cancel"));
  }, [nav]);

  return <p>מעבד הזמנה…</p>;
}
