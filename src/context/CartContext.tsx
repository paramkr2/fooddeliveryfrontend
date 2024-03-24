import React, { createContext, useReducer, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext'; // Import your AuthContext

export const CartContext = createContext();

const initialState = {
  items: [],
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART_ITEMS':
      return { ...state, items: action.payload };
    case 'ADD_TO_CART':
      return { ...state, items: [...state.items, action.payload] };
    case 'REMOVE_FROM_CART':
      return { ...state, items: state.items.filter(item => item.id !== action.payload) };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isLoggedIn } = useContext(AuthContext); // Get the isLoggedIn state from AuthContext

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
		
		let token = localStorage.getItem('jwtToken');
		let headers = { 'Authorization':token }
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/cart/fetch`,{headers} );
		
		if( response.data.msg === 'empty'){
			dispatch({ type: 'SET_CART_ITEMS', payload: [] });
			return ;
		}
		console.log(`set_cart_item ${response.data}`)
        dispatch({ type: 'SET_CART_ITEMS', payload: response.data });
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    if (isLoggedIn) {
      fetchCartItems(); // Fetch cart items only if user is logged in
    }
  }, [isLoggedIn]);

  return (
    <CartContext.Provider value={{ items: state.items, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};
