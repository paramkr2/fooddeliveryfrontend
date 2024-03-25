import React, { useContext, useEffect , useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Navbar';
import {AuthContext} from '../context/AuthContext' 
import {CartContext} from '../context/CartContext'

const CustomNavbar = () => {
  const { isLoggedIn, authAction  } = useContext(AuthContext);
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
		  authAction('LOGIN');
		}
	  }, []); // Empty dependency array ensures this effect runs only once on mount

  const handleLogout = () => {
    // Clear the stored token and update the authentication status
    localStorage.removeItem('jwtToken');
    authAction('LOGOUT')
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
