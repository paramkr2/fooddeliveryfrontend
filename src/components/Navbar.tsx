import React, { useContext, useEffect , useState } from 'react';
import { Link } from 'react-router-dom';

// mui 
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import MailIcon from '@mui/icons-material/Mail';

import {AuthContext} from '../context/AuthContext' 
import {CartContext} from '../context/CartContext'
import {jwtDecode} from 'jwt-decode';

const CustomNavbar = () => {
  const { isLoggedIn, user , dispatch } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const [cartCount, setCartCount] = useState( null);
  
  useEffect(() => {
    setCartCount( cart.items ? Object.keys(cart.items).length : 0);
  }, [cart.items]);
  
  useEffect(() => {
        // Check for the token in local storage when the component mounts
        const token = localStorage.getItem('jwtToken');

        if (token) {
            // Decode the token to verify its validity
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000; // Convert milliseconds to seconds
            // Check if the token is expired
            if (decodedToken.exp < currentTime) {
                // Token is expired, dispatch logout action
                dispatch({ type: 'LOGOUT' });
            } else {
                // Token is valid, dispatch login action and set user data
                dispatch({ type: 'LOGIN' });
                dispatch({ type: 'SET_USER', payload: decodedToken });
            }
        }
    }, [dispatch]); 
  
  const handleLogout = () => {
    // Clear the stored token and update the authentication status
    localStorage.removeItem('jwtToken');
    dispatch({type:'LOGOUT'})
  };
 
  const cartIconStyle = {
    backgroundColor: cartCount > 0 ? 'green' : 'transparent',
    color: cartCount > 0 ? '#fff' : '#000',
    border: '1px solid #ccc',
    borderRadius: '50%',
    padding: '5px 10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s, color 0.3s'
  };
  
  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Container>
          <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
            Food Delivery Frontend
          </Typography>
         
            <Button component={Link} to="/" color="inherit" sx={{ mr: 2 }}>
              Home
            </Button>
            {isLoggedIn ? (
              <Button color="inherit" onClick={handleLogout} data-testid="logout-link">
                Logout
              </Button>
            ) : (
              <Button component={Link} to="/login" color="inherit">
                Login
              </Button>
            )}
            {!isLoggedIn && (
              <Button component={Link} to="/signup" color="inherit">
                Signup
              </Button>
            )}
            { isLoggedIn && user.restaurantOwner && 
              <Button component={Link} to={`/admin`} color="inherit">
                Admin
              </Button>
            }
            { isLoggedIn  && !user.restaurantOwner && 
              <Button component={Link} to={`/orderlist/1`} color="inherit">
                History
              </Button>
            }
            { isLoggedIn  && 
              ( user.restaurantOwner ? ( 
                <Button component={Link} to={`/restaurantlocation`} color="inherit">
                  Location
                </Button>
              ):(
                <Button component={Link} to={`/userlocation`} color="inherit">
                  Location
                </Button>
              ))
            }
            <IconButton component={Link} to="/cart" color="inherit">
              <Badge badgeContent={cartCount} color="secondary">
                <ShoppingCartIcon className="cart-icon"  />
              </Badge>
            </IconButton>
			
			
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default CustomNavbar;
