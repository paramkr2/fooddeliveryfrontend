import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination } from '@mui/material';

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
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/order/list?page=${page}`, { headers });
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
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id} component={Link} to={`/order/${order._id}`} style={{ textDecoration: 'none' }}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>{order.totalAmount}</TableCell>
                    <TableCell>{order.createdAt}</TableCell>
                    <TableCell>
                      {order.status === 'Completed' ? (
                        <span style={{ color: 'green' }}>Completed</span>
                      ) : (
                        <span style={{ color: 'red' }}>{order.status}</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination>
            <Pagination.Item onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
              Prev
            </Pagination.Item>
            {Array.from({ length: totalPages }, (_, index) => (
              <Pagination.Item key={index + 1} active={index + 1 === page} onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Item onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
              Next
            </Pagination.Item>
          </Pagination>
        </>
      )}
    </div>
  );
};

export default OrderList;
