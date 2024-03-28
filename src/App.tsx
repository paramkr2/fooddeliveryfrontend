import React, { useState } from 'react';
import {  Routes, Route } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'; // Assuming you have a Navbar component

import Restaurant from './components/Restaurant';
import Home from './components/Home'; // Fix typo in the import
import Login from './components/Login';
import Signup from './components/Signup';
import Cart from './components/Cart';
import Admin from './components/Admin'
import {AuthProvider} from './context/AuthContext'
import {CartProvider} from './context/CartContext'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';



function App() {
	const stripePromise = loadStripe('pk_test_51OySTLSAWAYegyhdYh1zHvF2zFdEO3v0K3HANelcW216KLjdVfF9UzRkE9ovRb1inqCegG6FWK3cLGe0krOuzf6C00kAcHI8kY');

  return (
	<Elements stripe={stripePromise}>
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
	 </Elements>
  );
}

export default App;
