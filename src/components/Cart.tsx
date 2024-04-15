import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { Grid, Button } from '@mui/material';
import Dish from './Dish';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentComponents/PaymentForm';
import axios from 'axios';
import {toast} from 'react-toastify'
const Cart = () => {
  const { cart } = useContext(CartContext);
  const stripePromise = loadStripe('pk_test_51OySTLSAWAYegyhdYh1zHvF2zFdEO3v0K3HANelcW216KLjdVfF9UzRkE9ovRb1inqCegG6FWK3cLGe0krOuzf6C00kAcHI8kY');
  const [clientSecret, setClientSecret] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    	
      const ctotal = Object.keys(cart.items).reduce((total, itemIndex) => {
        return total + cart.items[itemIndex].quantity * cart.items[itemIndex].price;
      }, 0);
      setCartTotal(ctotal);
    
  }, [cart]);

  const confirmPayment = async () => {
  	try{
	    const res = await axios.post(`${import.meta.env.VITE_API_URL}/payment/create`, {
	      amount: cartTotal,
	      currency: 'INR',
	      description: 'Software solutions'
	    });
	    setClientSecret(res.data.client_secret);

	    let token = localStorage.getItem('jwtToken');
	    let headers = { 'Authorization': token };
	    let payload = { paymentIntentId: res.data.id, total: cartTotal, cart: cart };
	    const response = await axios.post(`${import.meta.env.VITE_API_URL}/order/create`, payload, { headers });
	    console.log(response.data);
	    
	    setShowPaymentForm(true)
    }catch(err){
    	console.log(err);
    	toast.error(err.response.data.error)
    }
  };

  return (
    <div>
      <h2>Cart</h2>
      <Grid container spacing={2}>
        { ! cart  && (
          <Grid item xs={12}>
            <div>Cart is empty</div>
          </Grid>
        )}
        { cart && 
          Object.keys(cart.items).map((itemIndex) => (
            <Grid item key={cart.items[itemIndex]._id} xs={12} sm={6} md={4}>
              <Dish item={cart.items[itemIndex]} restaurantId={cart.restaurantId} />
            </Grid>
          ))}
      </Grid>
      { cart && clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm show={showPaymentForm} setShow={setShowPaymentForm} />
        </Elements>
      )}
      { cart  && (
      	<Button onClick={confirmPayment}>Confirm and Pay ₹{cartTotal}</Button>
    	)}
    </div>
  );
};

export default Cart;
