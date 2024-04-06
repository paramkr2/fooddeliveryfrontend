import React, { useState } from 'react';
import {  Routes, Route } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'; // Assuming you have a Navbar component

import Restaurant from './components/Restaurant';
import Home from './components/Home'; 
import Login from './components/Login';
import Signup from './components/Signup';
import Cart from './components/Cart';
import Admin from './components/Admin'

import OrderStatus from './components/Order/OrderStatus'
import OrderList from './components/Order/OrderList'
import OrderHistory from './components/AdminComponents/Orders'

import UserAddressUpdatePage from './components/Address/UserAddressUpdatePage'
import RestaurantAddressUpdatePage from './components/Address/RestaurantAddressUpdatePage'

import {AuthProvider} from './context/AuthContext'
import {CartProvider} from './context/CartContext'


function App() {
	
  return (
	
	<AuthProvider>
		<CartProvider>
		<div className="App">
			<Navbar />
			<ToastContainer />
			<div className="container mt-4">
				<Routes>
				  <Route exact path="/" element={<Home />} />
				  <Route exact path="/login" element={<Login />} />
				  <Route exact path="/signup" element={<Signup />} />
				  
					<Route exact path="/cart" element={<Cart />} />
				 
				  <Route exact path="/restaurant/:id" element={<Restaurant />} />
				  <Route exact path="/admin" element={<Admin/>} /> 
					<Route exact path="/order/:orderId" element={<OrderStatus/>} />
					<Route exact path="/orderlist/:page" element={<OrderList/>} />
					<Route exact path="/admin/orders" element={<OrderHistory/>} />
					
					// i may have to chang ethe name, because no piont of conditionallity here
					// that shold be done in navbar. 
					<Route exact path="/userlocation" element={<UserAddressUpdatePage/>} />
					<Route exact path ="/restaurantlocation" element = {<RestaurantAddressUpdatePage/>} /> 
				</Routes>
			</div>
			<footer className="text-center text-lg-start bg-light text-muted mt-4">
					<div className="text-center p-4">
					© Copyright - 
					<a target="_blank" className="text-reset fw-bold text-decoration-none" href="https://twitter.com" >
						Paramanand Kumar
					</a>
				</div>
			</footer>
		</div>
		</CartProvider>
	</AuthProvider>

  );
}

export default App;
