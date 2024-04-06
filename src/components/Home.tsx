import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state

  const restList = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const headers = token
        ? {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          }
        : {
            'Content-Type': 'application/json',
          };

      const response = await axios.get(
       `${import.meta.env.VITE_API_URL}/restaurant/nearby`,
        {
          headers,
          params: {
            location: {
              type: 'Point',
              coordinates:  [28.666681811136993,77.20675182681249] //[-122.4195, 37.7748],
            } as any,
          },
        }
      );

      if (response.status === 200) {
        setRestaurants(response.data);
      } else {
        console.error('Error fetching restaurants:', error);

        // Handle unauthorized or other errors here
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
  }, []);

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
                    <img src="path/to/default-image.jpg" alt="Default" className="card-img-top" />
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
