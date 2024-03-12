import React, { useState,useContext } from 'react';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {AuthContext} from '../AuthContext' 
const Login = () => {
	const { isLoggedIn, authAction  } = useContext(AuthContext);
  
  const history = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      username,
      password,
    };
    try {
      const response = await axios.post('http://localhost:8000/auth/login', payload);
      const token = response.data.token;
      // Store the token in local storage for future authorization
      localStorage.setItem('jwtToken', token);
	  authAction('LOGIN');
      history('/');
      // Redirect to home page or dashboard
    } catch (error) {
      console.error('Error logging in', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Username</Form.Label>
        <Form.Control type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default Login;
