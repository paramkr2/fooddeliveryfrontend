import React, { useState, useContext, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { Button, Card } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';

const Dish = ({ item }) => {
	  const [name, setName] = useState(item.name);
	  const [price, setPrice] = useState(item.price);
	  const [description, setDescription] = useState(item.description);
	  const [isDirty, setIsDirty] = useState(false); // Track if any field is updated

	  const handleUpdate = () => {
		const updatedItem = { ...item, name, price, description };
		onUpdate(updatedItem);
		setIsDirty(false); // Reset dirty flag after update
	  };

	  const handleRemove = () => {
		onRemove(item);
	  };

	  const handleInputChange = (e) => {
		const { name, value } = e.target;
		// Update state and set dirty flag if any field changes
		if (item[name] !== value) {
		  setIsDirty(true);
		}
		switch (name) {
		  case 'name':
			setName(value);
			break;
		  case 'price':
			setPrice(value);
			break;
		  case 'description':
			setDescription(value);
			break;
		  default:
			break;
		}
	  };
  return (
    <Card className="dish">
      <Card.Body>
        <Card.Title>{item.name}</Card.Title>
        <Card.Text>Price: ${item.price}</Card.Text>
		<Card.Text>Price: ${item.description}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Dish;

