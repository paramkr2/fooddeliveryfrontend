import React, { useState , useContext } from 'react';
import {CartContext,cartReducer } from '../context/CartContext'
import axios from 'axios'


const Dish = ({ item }) => {
  const [addedToCart, setAddedToCart] = useState(false);
	const { items, dispatch } = useContext(CartContext); // Destructure dispatch from CartContext

  const handleAddToCart = async () => {
    try {
		
		let token = localStorage.getItem('jwtToken');
		let headers = { 'Authorization':token }
        let payload = { itemId:item._id,quantity:0,forceAdd:0 } 
		const response = await axios.post(`${import.meta.env.VITE_API_URL}/cart/add`, payload , {headers} );
        console.log(response.data);
		dispatch( { type: 'ADD_TO_CART', payload } );
		setAddedToCart(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleRemoveFromCart = () => {
    // Placeholder logic for removing from cart
    // Here you can perform any logic to remove the item from the cart
    setAddedToCart(false);
  };

  return (
    <div className="dish">
      <h3>{item.name}</h3>
      <p>Price: ${item.price}</p>
      <button onClick={addedToCart ? handleRemoveFromCart : handleAddToCart} style={{ color: addedToCart ? 'red' : 'black' }}>
        {addedToCart ? 'Added' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default Dish;
