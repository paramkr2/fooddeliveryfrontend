import React , {useContext,useEffect} from 'react';
import {CartContext} from '../context/CartContext'

const Cart = () => {
	const {cart,dispatch} = useContext(CartContext);

	useEffect(() => {
	  console.log('Items changed:', cart);
	}, [cart]);
	
	 return (
		<div>
		  <h2>Cart</h2>
		  <div>
			  {Object.keys(cart).map((itemIndex) => (
				<div key={itemIndex}>
				  <h3>Item Id {itemIndex}</h3>
				  <p>Name: {cart[itemIndex].name}</p>
				  <p>Price: ${cart[itemIndex].price}</p>
				  {/* Add additional item details here */}
				</div>
			  ))}
			</div>


		  {/* Add your cart content and logic here */}
		</div>
	  );
};

export default Cart;
