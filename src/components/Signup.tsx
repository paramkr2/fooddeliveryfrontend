import React, { useState , useContext } from 'react';
import axios from 'axios';
import { Button, Form , Alert, Spinner } from 'react-bootstrap';
import {useNavigate} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext' 
import {jwtDecode} from 'jwt-decode';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Checkbox from './Extra/AnimateCheckBox'


const Signup = () => {
	const history = useNavigate();
	 const [username, setUsername] = useState('');
	 const [email, setEmail] = useState('');
	 const [password, setPassword] = useState('');
	 const [phone, setPhone] = useState('');
	 
	const { isLoggedIn, dispatch } = useContext(AuthContext);
	const [error , setError ] = useState('');
	const [isFormSubmitting, setIsFormSubmitting] = useState(false);
	
	// collapsable form entires 
	const [restaurantOwner,setRestaurantOwner ] = useState(false)
	const [showRestaurantForm, setShowRestaurantForm] = useState(false)
   const [restaurantName, setRestaurantName] = useState('');
   
   const toggleForm = () => {
    setShowRestaurantForm(prevState => !prevState);
  };

   
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
	  restaurantName ,
	  restaurantOwner :restaurantName ? true : false ,
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
    { error && <Alert variant='danger'> {error} </Alert> }
    <Form onSubmit={handleSubmit} className="text-left"> {/* Added text-left class here */}
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
        <Form.Label>Phone</Form.Label>
        <Form.Control type="tel" placeholder="Enter phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </Form.Group>

      <div>
        <Button onClick={() => setShowRestaurantForm(!showRestaurantForm)} variant="link" className="mb-2">
          {showRestaurantForm ? <FaArrowUp /> : <FaArrowDown />} Signup as Restaurant
        </Button>
        <motion.div
          initial={false}
          animate={{ height: showRestaurantForm ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
          style={{ overflow: 'hidden' }}
        >
          <Form.Group controlId="formBasicRestaurantName">
            <Form.Label>Restaurant Name</Form.Label>
            <Form.Control type="text" placeholder="Enter restaurant name" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)}  />
          </Form.Group>
        </motion.div>
      </div>

      <Button variant="primary" type="submit">
        {isFormSubmitting ? <Spinner animation="border" size="sm" /> : 'Submit'} 
      </Button>
    </Form>
  </div>
);

};

export default Signup;
