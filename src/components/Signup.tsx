import React, { useState , useContext } from 'react';
import axios from 'axios';
import { Button, Form , Alert, Spinner } from 'react-bootstrap';
import {useNavigate} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext' 
import {jwtDecode} from 'jwt-decode';

const Signup = () => {
	const history = useNavigate();
	  const [username, setUsername] = useState('');
	  const [email, setEmail] = useState('');
	  const [password, setPassword] = useState('');
	  const [phone, setPhone] = useState('');
	  const [restaurantOwner,setRestaurantOwner ] = useState(false)
	const { isLoggedIn, dispatch } = useContext(AuthContext);
	const [error , setError ] = useState('');
	const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  
  const handleFormCheck = async => {
	if( username == '' ){ setError('Check username') ; return false }
	else if( password.length < 6 ){ setError('Password should be 6 characters or more '); return false }
	else if( email == '' ){ setError('Check email') ; return false }
	else if( phone.length < 10 ){ setError('Check Phone '); return false }
	return true ;
  }
  
	const handleSubmit = async (event) => {
    event.preventDefault(); //prevents default behaviour of form submit which is reload page
	const formValid = await handleFormCheck();
	if( !formValid ){ return ;}
    const payload = {
      username,
      email,
      password,
      phone,
      location: {
        type: 'Point',
        coordinates: [0, 0], // Hardcoded location
      },
	  restaurantOwner
    };

    try {
	 setIsFormSubmitting(true);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, payload);
      const token = response.data.token;

      // Store the token in local storage for future authorization
      localStorage.setItem('jwtToken', token);
	  
		const decodedToken = jwtDecode(token);
		dispatch({type:'SET_USER' ,payload: decodedToken });  
		  dispatch({type:'LOGIN'})
		history('/');
      // Redirect to home page or dashboard
    } catch (error) {
		setError(error.response.data.error);
      console.error('Error signing up', error);
    } finally{
		setIsFormSubmitting(false);
	}
  };
	
	

  return (
	<div> 
		{ error && <Alert variant = 'danger'> {error} </Alert> }
		<Form onSubmit={handleSubmit}>
		  <Form.Group controlId="formBasicEmail">
			<Form.Label>Username</Form.Label>
			<Form.Control type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
		  </Form.Group>

		  <Form.Group controlId="formBasicEmail">
			<Form.Label>Email address</Form.Label>
			<Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
		  </Form.Group>

		  <Form.Group controlId="formBasicPassword">
			<Form.Label>Password</Form.Label>
			<Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
		  </Form.Group>

		  <Form.Group controlId="formBasicPhone">
			<Form.Label >Phone</Form.Label>
			<Form.Control type="tel" placeholder="Enter phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
		  </Form.Group>
			<Form.Check
				type="checkbox"
				label="Signup as Restaurant Admin"
				checked={restaurantOwner}
				onChange={() => setRestaurantOwner(!restaurantOwner)}
			  />
		  <Button variant="primary" type="submit">
				{isFormSubmitting ? <Spinner animation="border" size="sm" /> : 'Submit'} 
			</Button>
			
			
		</Form>
	</div>
  );
};

export default Signup;
