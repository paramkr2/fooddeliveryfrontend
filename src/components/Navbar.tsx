import React, { useContext, useEffect , useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Navbar';
import {AuthContext} from '../context/AuthContext' 
import {CartContext} from '../context/CartContext'
import {jwtDecode} from 'jwt-decode';

const CustomNavbar = () => {
  const { isLoggedIn, user , dispatch } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const [cartCount, setCartCount] = useState(Object.keys(cart.items).length);
	
	useEffect(() => {
		setCartCount(Object.keys(cart.items).length);
		animateCart();
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
	const animateCart = () => {
    const icon = document.querySelector('.cart-icon');
    icon.classList.add('cart-icon-animate');
    setTimeout(() => {
      icon.classList.remove('cart-icon-animate');
    }, 1000); // Duration of animation in milliseconds
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
    <Navbar bg="primary" variant="dark">
      <div className="container-fluid">
        <Navbar.Brand as={Link} to="/">
          Food Delivery Frontend
        </Navbar.Brand>
        <Nav className="ml-auto">
          <Container>
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            {isLoggedIn ? (
              <Nav.Link className="btn btn-link" onClick={handleLogout} data-testid="logout-link">
                Logout
              </Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
            )}
            {!isLoggedIn && (
              <Nav.Link as={Link} to="/signup">
                Signup
              </Nav.Link>
            )}
			{ isLoggedIn && user.restaurantOwner && 
				<Nav.Link as={Link} to={`/admin`}>
					Admin
				</Nav.Link>
			}
			{ isLoggedIn  && 
				<Nav.Link as={Link} to={`/orderlist/1`}>
					History
				</Nav.Link>
			}
			{ isLoggedIn  && 
				( user.restaurantOwner ? ( 
					<Nav.Link as={Link} to={`/restaurantlocation`}>
						Location
					</Nav.Link>
				):(
					<Nav.Link as={Link} to={`/userlocation`}>
						Location
					</Nav.Link>
				))
			}
            <Nav.Link as={Link} to="/cart">
				<div className="cart-icon" style={cartIconStyle} >
				<div className="cart-icon-content">Cart:{cartCount}</div>
			  </div>
            </Nav.Link>
          </Container>
        </Nav>
      </div>
    </Navbar>
  );
};

export default CustomNavbar;
