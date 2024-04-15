import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Skeleton from '@mui/material/Skeleton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import { AuthContext } from '../context/AuthContext';
import { LocationContext } from '../context/LocationContext';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const { location, setLocation } = useContext(LocationContext);
  const { isLoggedIn } = useContext(AuthContext);

  const fetchAndSetLocation = async () => {
    try {
      let token = localStorage.getItem('jwtToken');
      let headers = { Authorization: token };
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/address`, { headers });
      const location = response.data.location.coordinates;
      setLocation({ lat: location[0], lng: location[1] });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      console.log('fetchsetlcoation');
      fetchAndSetLocation();
    }
  }, [isLoggedIn]);

  const restList = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/restaurant/nearby`, {
        params: { location },
      });

      if (response.status === 200) {
        setRestaurants(response.data);
      } else {
        console.error('Error fetching restaurants:', error);
        if (error.response && error.response.status === 401) {
          console.log('User is not logged in');
        }
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  useEffect(() => {
    restList();
  }, [location]);

  if (loading) {
    // Return three skeleton components while loading
    return (
      <Grid container spacing={2}>
        {[...Array(3)].map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <Skeleton variant="rectangular" height={150} />
              <CardContent>
                <Skeleton height={30} />
                <Skeleton height={20} width={'50%'} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={2}>
      {restaurants.map((restaurant) => (
        <Grid item xs={12} sm={6} md={4} key={restaurant._id}>
          <Link to={`/restaurant/${restaurant._id}`} className="card-link">
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={restaurant.imagePath ? `${import.meta.env.VITE_API_URL}/${restaurant.imagePath}` : ''}
                alt="Default"
              />
              <CardContent style={{ height: '200px' }}>
                <Typography variant="h5" component="div" style={{ height: '50px', overflow: 'hidden' }}>
                  {restaurant.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Time: {Math.trunc(restaurant.travelTime)} min
                </Typography>
                <Typography variant="body2">
                  {restaurant.description}
                </Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
};

export default Home;
