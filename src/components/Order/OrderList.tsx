import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ListGroup, Pagination, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
	

  useEffect(() => {
  
  const fetchOrders = async () => {
    setLoading(true);
    try {
		let token = localStorage.getItem('jwtToken');
		let headers = { 'Authorization': token };		
      const response = await axios.get(`http://localhost:8000/order/list?page=${page}`,{headers});
      setOrders(response.data.orders);
      setTotalPages(response.data.totalPages);
      
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    setLoading(false);
  };

  fetchOrders();
}, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <h2>Order History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ListGroup>
            {orders.map((order) => (
              <Link to={`/order/${order._id}`} key={order._id} style={{ textDecoration: 'none' }}>
                <ListGroup.Item>
                  <span>Order ID: {order._id}, Total Amount: {order.totalAmount} CreatedAt:{order.createdAt}</span>
                  {order.status == 'Completed' ? (
                    <Badge pill bg="success" className="ms-2">Completed</Badge>
                  ) : (
                    <Badge pill bg="danger" className="ms-2">{order.status}</Badge>
                  )}
                </ListGroup.Item>
              </Link>
            ))}
          </ListGroup>
          <Pagination>
            <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 1} />
            {Array.from({ length: totalPages }, (_, index) => (
              <Pagination.Item key={index + 1} active={index + 1 === page} onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} />
          </Pagination>
        </>
      )}
    </div>
  );
};

export default OrderList;
