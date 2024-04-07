import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Dish from './Dish';
import { Row, Col } from 'react-bootstrap';

import Skeleton from '@mui/material/Skeleton';


const RestaurantComponent = () => {
	
  const { id } = useParams();
  const [dishes, setDishes] = useState(null);
	
	const fetchData = async () => {
			  try {
				const response = await axios.get(`${import.meta.env.VITE_API_URL}/restaurant/items`, {
				  params: { restaurantId: id }
				});
				console.log(response)
				setDishes(response.data);
			  } catch (error) {
				console.error('Error fetching restaurant data:', error);
			  }
			};
	  
	 useEffect(() => {
		fetchData();
	  }, [id]);

	if (!dishes) {
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
  {dishes ? (
    <div className="menu-items">
      <Row>
        {dishes.map((item) => (
          <Col key={item._id} md={4}>
            <Dish item={item} restaurantId={id}/>
          </Col>
        ))}
      </Row>
    </div>
  ) : (
    <p>Loading restaurant data...</p>
  )}
</div>
  );
};

export default RestaurantComponent;
