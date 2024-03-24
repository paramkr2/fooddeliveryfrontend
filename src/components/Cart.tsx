import React , {useContext,useEffect} from 'react';
import {CartContext} from '../context/CartContext'

const Cart = () => {
	const {items,dispatch} = useContext(CartContext);

	useEffect(() => {
	  console.log('Items changed:', items);
	}, [items]);
	
	 return (
		<div>
		  <h2>Cart</h2>
		  <div>
			  {Object.keys(items).map((itemIndex) => (
				<div key={itemIndex}>
				  <h3>Item {itemIndex}</h3>
				  <p>Name: {items[itemIndex].name}</p>
				  <p>Price: ${items[itemIndex].price}</p>
				  {/* Add additional item details here */}
				</div>
			  ))}
			</div>


		  {/* Add your cart content and logic here */}
		</div>
	  );
};

export default Cart;
