import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';

import { MapContainer } from 'react-leaflet';
import DeliveryMap from './DeliveryMap';
import 'leaflet/dist/leaflet.css';

const OrderStatusPage = () => {
  const [order, setOrder] = useState(null);
  const { orderId } = useParams();
  const [userLocation, setUserLocation] = useState(null);
  const [restaurantLocation, setRestaurantLocation] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);

  const fetchOrder = async () => {
    try {
      let token = localStorage.getItem('jwtToken');
      let headers = { 'Authorization': token };
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/order/get/${orderId}`, { headers });
      console.log('order is ', response.data);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order status:', error);
    }
  };

  const setLocation = async () => {
    try {
      let token = localStorage.getItem('jwtToken');
      let headers = { 'Authorization': token };
      const userAddress = await axios.get(`${import.meta.env.VITE_API_URL}/user/address`, { headers });
      setUserLocation({
        lat: userAddress.data?.location?.coordinates[0],
        lng: userAddress.data?.location?.coordinates[1]
      });
      console.log('userAddress', userAddress, userAddress.data?.location?.coordinates[0]);
      const restaurantAddress = await axios.get(`${import.meta.env.VITE_API_URL}/restaurant/address/${order.restaurantId}`, { headers });
      setRestaurantLocation({
        lat: restaurantAddress.data?.location?.coordinates[0],
        lng: restaurantAddress.data?.location?.coordinates[1]
      });
      console.log('restaurant address', restaurantAddress);
      if (order.driverId != undefined) {
        const driverLocation = await axios.get(`${import.meta.env.VITE_API_URL}/driver/location/${order.driverId}`, { headers });
        setDriverLocation({
          lat: driverLocation.data?.coordinates[1],
          lng: driverLocation.data?.coordinates[0]
        });
        console.log('driverAddress', driverLocation);
      }

    } catch (err) {
      console.log('setLocation error ', err);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  useEffect(() => {
    if (order != null) {
      console.log('order before setLocation', order);
      setLocation();
    }
  }, [order]);

  return (
    <Container>
      <Typography variant="h2" gutterBottom>
        Order Status
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          {order ? (
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>{order._id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Amount</TableCell>
                    <TableCell>{order.totalAmount}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Payment Status</TableCell>
                    <TableCell>{order.paymentStatus}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Order Status</TableCell>
                    <TableCell>{order.status}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <p>Loading...</p>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          {userLocation && driverLocation && restaurantLocation && (
            <MapContainer center={userLocation} zoom={11} style={{ height: "80vh" }}>
              <DeliveryMap userLocation={userLocation} restaurantLocation={restaurantLocation} driverLocation={driverLocation} />
            </MapContainer>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderStatusPage;
