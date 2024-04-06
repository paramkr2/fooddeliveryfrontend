import React, { useState, useEffect} from 'react';
import {  TileLayer, Marker, Popup,useMapEvents,useMap  } from 'react-leaflet';
import { GeoJSON } from 'react-leaflet/GeoJSON'
import axios from 'axios'
import 'leaflet/dist/leaflet.css';
import {_} from 'lodash'

const DeliveryMap = ({userLocation,restaurantLocation,driverLocation}) => {
	 const [route, setRoute] = useState(null);
	const[route2,setRoute2] = useState(null)
	  useEffect(() => {
		if (driverLocation && restaurantLocation) {
			
		  fetchRoute(driverLocation, restaurantLocation);
		}
	  }, [driverLocation, restaurantLocation]);
	
	const map = useMap();
	useEffect(() => {
		if (route) {
		  // Calculate the center of the route coordinates
		  const center = route.coordinates.reduce((acc, curr) => {
			return [acc[0] + curr[0], acc[1] + curr[1]];
		  }, [0, 0]).map(coord => coord / route.coordinates.length);

		  // Fly to the center of the route coordinates
		  map.flyTo(center, 13); // Adjust zoom level as needed
		}
	  }, []);
	  
	 const fetchRoute = async (start, end) => {
		const url = `http://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;

		try {
		  const response = await axios.get(url);
		  let coordinates = _.cloneDeep(response.data.routes[0].geometry.coordinates);
		  console.log('route data before swap ', coordinates )
		  setRoute2(coordinates)
		  coordinates = coordinates.map(cords=> [cords[1],cords[0]] )
		  console.log('route data after wap ', coordinates)
		  setRoute(coordinates);
		  
		} catch (error) {
		  console.error('Error fetching route:', error);
		}
	  };
  
  return (
    <div style={{ height: '400px', width: '100%' }}>
      
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
		
        {driverLocation && (
        <Marker position={driverLocation}>
          <Popup>
            Driver Location: {driverLocation}
          </Popup>
        </Marker>
      )}
      {restaurantLocation && (
        <Marker position={restaurantLocation} >
          <Popup>
            Restaurant Location: {restaurantLocation}
          </Popup>
        </Marker>
      )}
      {userLocation && (
        <Marker position={userLocation} >
          <Popup>
            Your Location: {userLocation}
          </Popup>
        </Marker>
      )}
		{route &&  <GeoJSON
				data={{
				  "type":"Feature",
				  "geometry": {
					"type": "LineString",
					"coordinates": route
				  },
				  "properties": {"name":"route3"}
				}}
				pathOptions={{ color: 'red' }}
			  />
       }
	  {route2 &&  <GeoJSON
				data={{
				  "type":"Feature",
				  "geometry": {
					"type": "LineString",
					"coordinates": route2
				  },
				  "properties": {"name":"route2"}
				}}
				pathOptions={{ color: 'red' }}
			  />
       }
    </div>
  );
};

export default DeliveryMap;
