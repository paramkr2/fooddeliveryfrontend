import React, { useEffect, useState ,useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import {AuthContext} from '../context/AuthContext'
import {LocationContext} from '../context/LocationContext'
import Skeleton from '@mui/material/Skeleton';

const Home = () => {
	const [restaurants, setRestaurants] = useState([]);
	const [loading, setLoading] = useState(true); // Added loading state
	const {location,setLocation}= useContext(LocationContext)
	const {isLoggedIn} = useContext(AuthContext)
	
	
	const fetchAndSetLocation = async()=>{
		try{
			let token = localStorage.getItem('jwtToken');
            let headers = { 'Authorization': token };
           const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/address`, { headers });
           const location = response.data.location.coordinates ;
			setLocation ({lat:location[0],lng:location[1]})
		}catch(err){
			console.log(err);
		}
	}
	useEffect( ()=> {
		if(isLoggedIn ){
			console.log('fetchsetlcoation')
			fetchAndSetLocation() ;
		}
	},[isLoggedIn])
	
  const restList = async () => {
    try {
      const response = await axios.get(
			`${import.meta.env.VITE_API_URL}/restaurant/nearby`,
			{  params: {location}, } 
		);

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

	if (loading ) {
		// Return three skeleton components while loading
		return (
		  <div className="row">
			{[...Array(3)].map((_, index) => (
			  <div className="col-md-4" key={index}>
				<Skeleton variant="rectangular" height={150} />
				<Skeleton heignt={30} />
				<Skeleton height={20} width={'50%'} />
			  </div>
			))}
		  </div>
		);
	  }

  return (
    <div>
      {loading ? (
        // Loading indicator while fetching data
        <div className="text-center">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="row">
          {restaurants.map((restaurant) => (
            <div className="col-md-4" key={restaurant._id}>
              <Link to={`/restaurant/${restaurant._id}`} className="card-link">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{restaurant.name}</h5>
                    <p className="card-text">Travel Time: {restaurant.travelTime} minutes</p>
                    <img src={restaurant.imagePath ? `${import.meta.env.VITE_API_URL}/${restaurant.imagePath}` : ''} alt="Default" className="card-img-top" />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
