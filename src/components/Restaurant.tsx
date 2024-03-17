import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RestaurantComponent = ({ match }) => {
  const [restaurantData, setRestaurantData] = useState(null);
  const restaurantId = match.params.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/itemsRestaurants`,{
			params:{restaurantId}
		});
        setRestaurantData(response.data);
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
      }
    };

    fetchData();
  }, [restaurantId]);

  return (
    <div>
      {restaurantData ? (
        <div>
          <h1>{restaurantData.name}</h1>
          <p>{restaurantData.description}</p>
          <div className="menu-items">
            {restaurantData.menuItems.map((item) => (
              <CardComponent key={item.id} menuItem={item} />
            ))}
          </div>
        </div>
      ) : (
        <p>Loading restaurant data...</p>
      )}
    </div>
  );
};

export default RestaurantComponent;
