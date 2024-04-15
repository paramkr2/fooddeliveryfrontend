import React, { createContext, useReducer, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext'; // Import your AuthContext
export const CartContext = createContext();

type CartState = {
  restaurantId: string | null;
  items: { [key: string]: CartItem };
};

// Define the type for a single item in the cart
type CartItem = {
  _id: string;
  quantity: number;
  price: number;
  // Add any other properties of a cart item here
};

const initialState: CartState = {
  restaurantId: null,
  items: {},
};

// making the return typesafe 
export const cartReducer = (cart, action):CartState => {
  switch (action.type) {
    case 'ADD_TO_CART':
      return {
        ...cart,
		'restaurantId':action.payload.restaurantId,
        items: {
          ...cart.items,
          [action.payload._id]: { ...action.payload }
        }
      };
    case 'REMOVE_FROM_CART':
      const { [action.payload._id]: _, ...newItems } = cart.items;
      return {
        ...cart,
        items: newItems
      };
    case 'CLEAR_CART':
      return { restaurantId: null, items: {} };
    default:
      return cart;
  }
};


export const CartProvider = ({ children }) => {

	  const [cart, dispatch] = useReducer(cartReducer, initialState, ():CartState => {
  		  const localData = localStorage.getItem('cart');
  		  return localData ? JSON.parse(localData) : initialState;
	  });

    // store cart in localstorage everytime it is changed

    useEffect(() => {
		  localStorage.setItem('cart', JSON.stringify(cart));
	  }, [cart]);
  
  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};
