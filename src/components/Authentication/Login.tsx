import React, { useState,useContext } from 'react';
import axios from 'axios';
import {  Alert  } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {AuthContext} from '../../context/AuthContext' 
import {jwtDecode} from 'jwt-decode';

import { Button, TextField, Typography, Grid, CircularProgress, Paper, CssBaseline, Box, Avatar, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import background from './background.jpg';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

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
        <ThemeProvider theme={defaultTheme}>
            <Container component="main"   sx={{
               backgroundColor: 'rgba(240, 240, 240, 0.8)',
                backgroundSize: 'cover', // set the background size
                backgroundPosition: 'center', // set the background position
                height: '100vh', // set the height to fill the viewport
				width:'100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <CssBaseline />
                <Box sx={{
					mt: 3,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					maxWidth: '400px', // Set maximum width for the form container
					padding: '20px', // Add padding to the form container
					borderRadius: '10px', // Add border radius to the form container for a rounded appearance
					backgroundColor: 'rgba(255, 255, 255, 0.8)', // Add background color with some transparency
					backdropFilter: 'blur(10px)', // Apply backdrop filter for a frosted glass effect
					boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Add box shadow for depth
				}}  >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">Log In</Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
							<Grid item xs={12} > {error && <Alert variant="danger" > {error} </Alert> } </Grid> 
								
							 <Grid item xs={12}> <TextField fullWidth label="Iserma,e" variant="outlined" type="username" value={username} onChange={(e) => setUsername(e.target.value)} required /></Grid>
							  
							 <Grid item xs={12}><TextField fullWidth label="Password" variant="outlined" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></Grid>
							 <Grid item xs={12}>
								<Button variant="primary" type="submit">
									{isFormSubmitting ? <CircularProgress size={24} /> : 'Submit'} 
								</Button>
							</Grid>
						</Grid> 
					</Box>
				</Box> 
			</Container>
		</ThemeProvider>
  );
};

export default Login;
