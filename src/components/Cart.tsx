import React , {useContext,useEffect,useState} from 'react';
import {CartContext} from '../context/CartContext'
import { Row, Col, Button } from 'react-bootstrap';
import Dish from './Dish'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentComponents/PaymentForm'
import axios from 'axios'



const Cart = () => {
	 const { cart, dispatch } = useContext(CartContext);
	 const stripePromise = loadStripe('pk_test_51OySTLSAWAYegyhdYh1zHvF2zFdEO3v0K3HANelcW216KLjdVfF9UzRkE9ovRb1inqCegG6FWK3cLGe0krOuzf6C00kAcHI8kY');
	const [clientSecret, setClientSecret] = useState(null);
	const [showPaymentFrom,setShowPaymentForm] = useState(false);
	const [cartTotal,setCartTotal] = useState(0);
	
	useEffect(() => {
		console.log('Items changed:', cart);
	  // this should update the total amount 
		const ctotal =  Object.keys(cart.items).reduce( (total,itemIndex) =>{
			return total + cart.items[itemIndex].quantity*cart.items[itemIndex].price  
		},0)
		console.log('cartTotal' ,ctotal);
		setCartTotal(ctotal);
	}, [cart]);
	
	const confirmPayment = async  ()=>{
		// First create payment Intent. we'll look at refreshing the cart content later .
		const res = await axios.post(`${import.meta.env.VITE_API_URL}/payment/create`, {
		  amount: cartTotal ,
		  currency: 'INR',
		  description:'Softwere solutions' // send description here and shipping while confirming payment 
		})
		setClientSecret(res.data.client_secret);	
		console.log('paymentintent created',res.data )
		// Create Order in backend 
		// if successfull then we can show paymentform..
			
		// test order creationg 
		let token = localStorage.getItem('jwtToken');
		 let headers = { 'Authorization': token };		
		 let payload = {paymentIntentId:res.data.id, total:cartTotal , cart:cart }
		const response = await axios.post(`${import.meta.env.VITE_API_URL}/order/create`, payload  , {headers})
		console.log(response.body);
		// then set showPayment form to trigger payment form render
		setShowPaymentForm(true);
	}
	
	
	  
	 return (
		<div>
		  <h2>Cart</h2>
		  <div>
			<Row>
			  {Object.keys(cart.items).map((itemIndex) => (
				<Col key={cart.items[itemIndex]._id} md={4}>
					<Dish item={cart.items[itemIndex]} restaurantId={cart.restaurantId}/>
				  </Col>
			  ))}
			 </Row>  
			</div>
			{clientSecret && <Elements stripe={stripePromise} options={{clientSecret}}>
				<PaymentForm show={showPaymentFrom} setShow={setShowPaymentForm} />
			</Elements> }
			{ /* Add Show total amount and confirm order and pay button */}
			<Button onClick={(e)=>{confirmPayment()}} > Confirm and Pay ₹{cartTotal} </Button>

		  {/* Add your cart content and logic here */}
		</div>
	  );
};

export default Cart;
