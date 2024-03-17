import React, { useContext, useState } from 'react';
import { CartContext } from './CartContext';
import { Card, Button } from 'react-bootstrap';

const CardComponent = ({ menuItem }) => {
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart({ ...menuItem, quantity });
    setQuantity(1);
  };

  const handleQuantityChange = (amount) => {
    const newQuantity = Math.max(1, quantity + amount);
    setQuantity(newQuantity);
  };

  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>{menuItem.name}</Card.Title>
        <Card.Text>{menuItem.description}</Card.Text>
        <Card.Text>Price: ${menuItem.price}</Card.Text>
        <div className="quantity-container">
          <Button variant="outline-secondary" onClick={() => handleQuantityChange(-1)}>-</Button>
          <span className="quantity">{quantity}</span>
          <Button variant="outline-secondary" onClick={() => handleQuantityChange(1)}>+</Button>
        </div>
        <Button variant="primary" onClick={handleAddToCart}>Add to Cart</Button>
      </Card.Body>
    </Card>
  );
};

export default CardComponent;
