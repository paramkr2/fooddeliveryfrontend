import React, { createContext, useReducer, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext'; // Import your AuthContext
export const CartContext = createContext();

const initialState = {restaurantId :null, items:{}}
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

/*
// cartReducer.js
export const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      return [...state, action.payload];
    case 'REMOVE_FROM_CART':
      return state.filter(item => item.id !== action.payload);
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
};

*/

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
