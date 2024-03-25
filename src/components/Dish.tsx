import React, { useState, useContext, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { Button, Card } from 'react-bootstrap';

const Dish = ({ item }) => {
  const { cart, dispatch } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (cart[item._id]) {
      setQuantity(cart[item._id].quantity);
    }
  }, []);

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
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
    dispatch({ type: 'REMOVE_FROM_CART', payload: { _id: item._id } });
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
        <Card.Title>{item.name}</Card.Title>
        <Card.Text>Price: ${item.price}</Card.Text>
        <div className="quantity-controls">
          <Button variant="secondary" onClick={handleDecreaseQuantity}>-</Button>
          <span className="quantity">{quantity}</span>
          <Button variant="secondary" onClick={handleIncreaseQuantity}>+</Button>
        </div>
        <Button
		  onClick={cart[item._id] ?
			(cart[item._id].quantity !== quantity ? handleUpdateCart : handleRemoveFromCart) :
			handleAddToCart
		  }
		  variant={cart[item._id] ?
			(cart[item._id].quantity !== quantity ? 'warning' : 'info') :
			'success'
		  }
		  disabled={quantity === 0}
		>
		  {cart[item._id] ?
			(cart[item._id].quantity !== quantity ? 'Update' : 'Remove') :
			'Add'
		  }
		</Button>

      </Card.Body>
    </Card>
  );
};

export default Dish;
``
