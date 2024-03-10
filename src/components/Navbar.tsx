import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Navbar';
const CustomNavbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check authentication status using the stored token
    const token = localStorage.getItem('jwtToken');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    // Clear the stored token and update the authentication status
    localStorage.removeItem('jwtToken');
    setIsLoggedIn(false);
  };

  return (
    <Navbar bg="primary" variant="dark" >
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
