import React, { createContext, useReducer , useState } from 'react';

export const LocationContext = createContext();

const initialLocation = { lat:28.617,lng:77.205};

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(initialLocation);
  return (
    <LocationContext.Provider value={{ location,setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
