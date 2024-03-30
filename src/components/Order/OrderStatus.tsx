import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
const OrderStatusPage = () => {
  const [order, setOrder] = useState(null);
  const { orderId } = useParams();
  useEffect(() => {
    const fetchOrder = async () => {
      try {
		let token = localStorage.getItem('jwtToken');
		 let headers = { 'Authorization': token };		
        const response = await axios.get(`http://localhost:8000/order/get/${orderId}`,{headers});
		console.log(response)
        setOrder(response.data);
      } catch (error){
        console.error('Error fetching order status:', error);
      }
    };
    fetchOrder();
  }, []);

  return (
    <div>
      <h2>Order Status</h2>
      {order ? (
        <div>
          <p>Order ID: {order._id}</p>
          <p>Total Amount: {order.totalAmount}</p>
		  <p> Payment Status:{order.paymentStatus} </p>
		  <p> Order Status:{order.status} </p> 
          {/* Display other order details as needed */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default OrderStatusPage;
