import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { motion } from 'framer-motion';

// mui imports 
import { Button, TextField, Typography, Grid, CircularProgress, Paper, CssBaseline, Box, Avatar, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import background from './background.jpg';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

const Signup = () => {
    const history = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const { dispatch } = useContext(AuthContext);
    const [error, setError] = useState('');
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);
    const [restaurantOwner, setRestaurantOwner] = useState(false);
    const [showRestaurantForm, setShowRestaurantForm] = useState(false);
    const [restaurantName, setRestaurantName] = useState('');

    const toggleForm = () => {
        setShowRestaurantForm(prevState => !prevState);
    };

    const handleFormCheck = async () => {
        if (username === '') { setError('Check username'); return false; }
        else if (password.length < 6) { setError('Password should be 6 characters or more '); return false; }
        else if (email === '') { setError('Check email'); return false; }
        else if (phone.length < 10) { setError('Check Phone '); return false; }
        return true;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formValid = await handleFormCheck();
        if (!formValid) { return; }
        
		const payload = { username, email, password, phone,
            location: {
                type: 'Point',
                coordinates: [0, 0], // Hardcoded location
            },
            restaurantName,
            restaurantOwner: restaurantName ? true : false,
        };

        try {
            setIsFormSubmitting(true);
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, payload);
            const token = response.data.token;
            localStorage.setItem('jwtToken', token);
            const decodedToken = jwtDecode(token);
            dispatch({ type: 'SET_USER', payload: decodedToken });
            dispatch({ type: 'LOGIN' });
            history('/');
        } catch (error) {
            setError(error.response.data.error);
            console.error('Error signing up', error);
        } finally {
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
                    <Typography component="h1" variant="h5">Sign up</Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>{error && <Typography variant="body1" color="error">{error}</Typography>}</Grid>
                            <Grid item xs={12}><TextField fullWidth label="Username" variant="outlined" value={username} onChange={(e) => setUsername(e.target.value)} required /></Grid>
                            <Grid item xs={12}><TextField fullWidth label="Email address" variant="outlined" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Grid>
                            <Grid item xs={12}><TextField fullWidth label="Password" variant="outlined" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></Grid>
                            <Grid item xs={12}><TextField fullWidth label="Phone" variant="outlined" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required /></Grid>
                            <Grid item xs={12}>
                                <div>
                                    <Button onClick={toggleForm} variant="text" sx={{ mb: 2 }}>{showRestaurantForm ? <FaArrowUp /> : <FaArrowDown />} Signup as Restaurant</Button>
                                    <motion.div initial={false} animate={{ height: showRestaurantForm ? 'auto' : 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
                                        <TextField fullWidth label="Restaurant Name" variant="outlined" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} />
                                    </motion.div>
                                </div>
                            </Grid>
                            <Grid item xs={12}><Button type="submit" variant="contained" color="primary">{isFormSubmitting ? <CircularProgress size={24} /> : 'Submit'}</Button></Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default Signup;
