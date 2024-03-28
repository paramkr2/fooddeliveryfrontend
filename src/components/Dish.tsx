import React, { useState, useContext, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { Button, Card } from 'react-bootstrap';


const Dish = ({ item , restaurantId}) => {
	const { cart, dispatch } = useContext(CartContext);
	const [quantity, setQuantity] = useState(1);
	
  useEffect(() => {
	//dispatch({ type: 'CLEAR_CART'});
	console.log(cart)
    if (cart && cart.items && cart.items[item._id]) {

      setQuantity(cart.items[item._id].quantity);
    }
  }, []);

  const handleAddToCart = () => {
	if( cart.restaurantId !== null && cart.restaurantId !== String(restaurantId) ) {
		const confirmClear = window.confirm('Adding this item will clear your current cart. Do you want to proceed?');
		if (confirmClear) {
		  // Clear the cart and then add the item
		  dispatch({ type: 'CLEAR_CART' });
		} else {
		  // User chose not to clear the cart, do nothing
		  return;
		}
	}
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
		restaurantId,
        _id: item._id,
        quantity: quantity,
        name: item.name,
        price: item.price
      }
    });
  };
  
  const handleUpdateCart= () => {
	handleAddToCart();
  }

  const handleRemoveFromCart = () => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: {  _id: item._id } });
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <Card className="dish">
      <Card.Body>
		{  item.imagePath && <Card.Img variant="top" src={`${import.meta.env.VITE_API_URL}/${item.imagePath}`} />}
        <Card.Title>{item.name}</Card.Title>
        <Card.Text>Price: ${item.price}</Card.Text>
        <div className="quantity-controls">
			<Button variant="secondary" size="sm" onClick={handleDecreaseQuantity}>-</Button>
			<span className="quantity smaller">{quantity}</span>
			<Button variant="secondary" size="sm" onClick={handleIncreaseQuantity}>+</Button>

        </div>
        <Button
		  onClick={cart.items && (cart.items[item._id] ?
			(cart.items[item._id].quantity !== quantity ? handleUpdateCart : handleRemoveFromCart) :
			handleAddToCart
		  )}
		  variant={ cart.items && ( cart.items[item._id] ?
			(cart.items[item._id].quantity !== quantity ? 'warning' : 'info') :
			'success'
		  )}
		  disabled={quantity === 0}
		>
		  {cart.items && ( cart.items[item._id] ?
			(cart.items[item._id].quantity !== quantity ? 'Update' : 'Remove') :
			'Add'
		  )}
		</Button>

      </Card.Body>
    </Card>
  );
};

export default Dish;

