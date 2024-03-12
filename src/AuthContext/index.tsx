import React, { createContext, useReducer } from 'react';

interface AuthContextProps {
  isLoggedIn: boolean;
  authAction: (type: string) => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const initialState = {
  isLoggedIn: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isLoggedIn: true };
    case 'LOGOUT':
      return { ...state, isLoggedIn: false };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const authAction = (type: string) => {
    dispatch({ type });
  };

  return (
    <AuthContext.Provider value={{ ...state, authAction }}>
      {children}
    </AuthContext.Provider>
  );
};
