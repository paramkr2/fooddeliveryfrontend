import React, { createContext, useReducer , useState } from 'react';



export const AuthContext = createContext();

const initialState = {
  isLoggedIn: false,
  user:{}
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isLoggedIn: true };
    case 'LOGOUT':
      return { ...state, isLoggedIn: false };
	 case 'SET_USER':
		console.log('set user' , action.payload )
		const newState = {...state,user:{ ...action.payload }}
		console.log(newState)
		return newState;
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
	console.log('autrhprovider', state)

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
