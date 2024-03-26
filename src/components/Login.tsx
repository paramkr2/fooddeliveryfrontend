import React, { useState,useContext } from 'react';
import axios from 'axios';
import { Button, Form , Alert , Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {AuthContext} from '../context/AuthContext' 
import {jwtDecode} from 'jwt-decode';

const Login = () => {
	const { isLoggedIn,  dispatch  } = useContext(AuthContext);
	const history = useNavigate();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error , setError ] = useState('');
	const [isFormSubmitting, setIsFormSubmitting] = useState(false);
	
	
	const handleSubmit = async (event) => {
		if( username == '' || password == '' ){
			setError('Username or password cannot be empty');
			return;
		}
	  
		event.preventDefault();
		const payload = {
		  username,
		  password,
		};
		try {
		  setIsFormSubmitting(true);
		  const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, payload);
		  const token = response.data.token;
		  // Store the token in local storage for future authorization
		  localStorage.setItem('jwtToken', token);
		  const decodedToken = jwtDecode(token);
		  dispatch({type:'SET_USER' ,payload :decodedToken });  
		  dispatch({type:'LOGIN'})
		  history('/');
		} catch (error) {
			if( error.response.status && error.response.status == 409 ){
				setError('Invalid Credentials')
			}
		  console.error('Error logging in', error);
		} finally{
			setIsFormSubmitting(false);
			
		}
	  };
  
  

  return (
	<div>
		{error && <Alert variant="danger" > {error} </Alert> }
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
				{isFormSubmitting ? <Spinner animation="border" size="sm" /> : 'Submit'} 
			  </Button>
		</Form>
	</div>
  );
};

export default Login;
