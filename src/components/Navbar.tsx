import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Navbar';
import { AuthContext } from '../AuthContext';

const CustomNavbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    // Check for the token in local storage when the component mounts
    const token = localStorage.getItem('jwtToken');

    if (token) {
      // If a token is found, set the user as logged in
      setIsLoggedIn(true);
    }
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const handleLogout = () => {
    // Clear the stored token and update the authentication status
    localStorage.removeItem('jwtToken');
    setIsLoggedIn(false);
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
              <Nav.Link className="btn btn-link" onClick={handleLogout}>
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
              Cart
            </Nav.Link>
            <Nav.Item>
              <Nav.Link as={Link} to="/restaurant">
                Restaurant
              </Nav.Link>
            </Nav.Item>
          </Container>
        </Nav>
      </div>
    </Navbar>
  );
};

export default CustomNavbar;
