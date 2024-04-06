import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Dish from './Dish';
import { Row, Col } from 'react-bootstrap';
const RestaurantComponent = () => {
	
  const { id } = useParams();
  const [dishes, setDishes] = useState([]);
	
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
