import React , {useContext,useEffect,useState} from 'react';
import {CartContext} from '../context/CartContext'
import { Row, Col, Button } from 'react-bootstrap';
import Dish from './Dish'
import PaymentForm from './PaymentComponents/PaymentForm'

const Cart = () => {
	  const { cart, dispatch } = useContext(CartContext);

	useEffect(() => {
	  console.log('Items changed:', cart);
	}, [cart]);
	
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
			
			<PaymentForm/>
			{ /* Add Show total amount and confirm order and pay button */}


		  {/* Add your cart content and logic here */}
		</div>
	  );
};

export default Cart;
