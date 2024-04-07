import React, { useState, useContext, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

const Dish = ({ item, restaurantId }) => {
  const { cart, dispatch } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (cart && cart.items && cart.items[item._id]) {
      setQuantity(cart.items[item._id].quantity);
    }
  }, []);

  const handleAddToCart = () => {
    if (cart.restaurantId !== null && cart.restaurantId !== String(restaurantId)) {
      const confirmClear = window.confirm('Adding this item will clear your current cart. Do you want to proceed?');
      if (confirmClear) {
        dispatch({ type: 'CLEAR_CART' });
      } else {
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

  const handleUpdateCart = () => {
    handleAddToCart();
  };

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
      <CardMedia
        component="img"
        height="140"
        image={item.imagePath ? `${import.meta.env.VITE_API_URL}/${item.imagePath}` : ''}
        alt={item.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Price: Rupee:{item.price}
        </Typography>
        <div className="quantity-controls"  style={{ display: 'flex', alignItems: 'center',justifyContent: 'center'  }}>
          <IconButton aria-label="decrease quantity" onClick={handleDecreaseQuantity}>
            <RemoveIcon />
          </IconButton>
          <Typography variant="body2" className="quantity smaller">
            {quantity}
          </Typography>
          <IconButton aria-label="increase quantity" onClick={handleIncreaseQuantity}>
            <AddIcon />
          </IconButton>
        </div>
        <Button
          onClick={
            cart.items && cart.items[item._id]
              ? cart.items[item._id].quantity !== quantity
                ? handleUpdateCart
                : handleRemoveFromCart
              : handleAddToCart
          }
		  variant='contained'
          color={
            cart.items && cart.items[item._id]
              ? cart.items[item._id].quantity !== quantity
                ? 'warning'
                : 'error'
              : 'success'
          }
          disabled={quantity === 0}
        >
          {cart.items && cart.items[item._id] ? (cart.items[item._id].quantity !== quantity ? 'Update' : 'Remove') : 'Add'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default Dish;
