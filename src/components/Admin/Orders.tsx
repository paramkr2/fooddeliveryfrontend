import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button } from 'react-bootstrap';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/orders/today`, {
        headers: { Authorization: token }
      });
	  console.log('admin/orders',response.data)
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/admin/orders/${orderId}/accept`, null, {
        headers: { Authorization: token }
      });
      setOrders(prevOrders => {
		  return prevOrders.map(order => {
			if (order._id === res.data._id) { return res.data  } 
			else {  return order; }
		  });
		});
    } catch (error) {
      console.error('Error accepting order:', error);
    }
  };

  return (
    <div>
      <h2>Order History</h2>
      {orders.map((order) => (
        <Card key={order._id}>
          <Card.Body>
            <Card.Title>Order ID: {order._id}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              Status: {order.status}
            </Card.Subtitle>
            <Button
              variant="primary"
              onClick={() => handleAcceptOrder(order._id)}
              disabled={order.status !== 'Pending'}
            >
              Accept
            </Button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default OrderHistory;
