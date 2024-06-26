import React, { useState } from 'react';
import {  Routes, Route } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'; // Assuming you have a Navbar component

import Restaurant from './components/Restaurant';
import Home from './components/Home'; 

import Login from './components/Authentication/Login';
import Signup from './components/Authentication/Signup';

import Cart from './components/Cart';
import Admin from './components/Admin'

import OrderStatus from './components/Order/OrderStatus'
import OrderList from './components/Order/OrderList'
import OrderHistory from './components/Admin/Orders'

import UserAddressUpdatePage from './components/Address/UserAddressUpdatePage'
import RestaurantAddressUpdatePage from './components/Address/RestaurantAddressUpdatePage'

import {AuthProvider} from './context/AuthContext'
import {CartProvider} from './context/CartContext'
import  {LocationProvider} from './context/LocationContext'

import {Container } from '@mui/material';

function App() {
	
  return (
	
	<AuthProvider>
		<CartProvider>
			<LocationProvider>
				<div className="App">
					<Navbar />
					<ToastContainer />
					<Container>
						<Routes>
						  <Route  path="/" element={<Home />} />
						  <Route  path="/login" element={<Login />} />
						  <Route  path="/signup" element={<Signup />} />
						  
							<Route  path="/cart" element={<Cart />} />
						 
						  <Route  path="/restaurant/:id" element={<Restaurant />} />
						  <Route  path="/admin" element={<Admin/>} /> 
							<Route  path="/order/:orderId" element={<OrderStatus/>} />
							<Route  path="/orderlist/:page" element={<OrderList/>} />
							<Route  path="/admin/orders" element={<OrderHistory/>} />
							
							// i may have to chang ethe name, because no piont of conditionallity here
							// that shold be done in navbar. 
							<Route  path="/userlocation" element={<UserAddressUpdatePage/>} />
							<Route  path ="/restaurantlocation" element = {<RestaurantAddressUpdatePage/>} /> 
						</Routes>
					</Container>
					<footer className="text-center text-lg-start bg-light text-muted mt-4">
							<div className="text-center p-4">
							© Copyright - 
							<a target="_blank" className="text-reset fw-bold text-decoration-none" href="https://twitter.com" >
								Food Delivery Frontend Tecnologies
							</a>
						</div>
					</footer>
				</div>
			</LocationProvider>
		</CartProvider>
	</AuthProvider>

  );
}

export default App;
