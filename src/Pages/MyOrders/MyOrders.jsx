import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/orders/my');
        setOrders(res.data);
      } catch (error) {
        console.error('שגיאה בקבלת ההזמנות', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h2>ההזמנות שלי</h2>
      {orders.map((order) => (
        <div key={order._id}>
          <p>כתובת: {order.address}</p>
          <p>סה״כ לתשלום: ₪{order.totalPrice}</p>
          <ul>
            {order.products.map((item, index) => (
              <li key={index}>
                {item.name} - כמות: {item.quantity}
              </li>
            ))}
          </ul>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
