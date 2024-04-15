import React, { createContext, useReducer, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext'; // Import your AuthContext
export const CartContext = createContext();

type CartState = {
  restaurantId: string | null;
  items: { [itemId: string]: CartItem };
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

export const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      return {
        ...state,
		'restaurantId':action.payload.restaurantId,
        items: {
          ...state.items,
          [action.payload._id]: { ...action.payload }
        }
      };
    case 'REMOVE_FROM_CART':
      const { [action.payload._id]: _, ...newItems } = state.items;
      return {
        ...state,
        items: newItems
      };
    case 'CLEAR_CART':
      return { restaurantId: null, items: {} };
    default:
      return state;
  }
};


export const CartProvider = ({ children }) => {
	  const [cart, dispatch] = useReducer(cartReducer, initialState , () => {
		const localData = localStorage.getItem('cart');
		return localData ? JSON.parse(localData) : {};
	  });
	  
	  useEffect(() => {
		localStorage.setItem('cart', JSON.stringify(cart));
	  }, [cart]);
  
  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};
