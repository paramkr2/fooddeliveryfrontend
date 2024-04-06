import React, { useState, useEffect} from 'react';
import {  TileLayer, Marker, Popup,useMapEvents,useMap  } from 'react-leaflet';
import { GeoJSON } from 'react-leaflet/GeoJSON'
import axios from 'axios'
import 'leaflet/dist/leaflet.css';
import {_} from 'lodash'

const DeliveryMap = ({userLocation,restaurantLocation,driverLocation}) => {
	const [route, setRoute] = useState(null);
	const [simulatedDriverLocation,setSimulatedDriverLocation] = useState(driverLocation)
	
	const findFirstUnequalCoordinate = (cords, arr) => {
		const val = [cords.lng, cords.lat];
		for (let i = 0; i < arr.length; i++) {
			const item = arr[i];
			const latDiff = Math.abs(item[1] - val[1]);
			const lngDiff = Math.abs(item[0] - val[0]);
			if (latDiff >= 0.005 || lngDiff >= 0.005) {
				return { lat: item[1], lng: item[0] };
			}
		}
	}
	
	useEffect(() => {
		if (route != undefined) {
			console.log('driver location', { ...simulatedDriverLocation }, route.coordinates[0]);
			setTimeout(() => {
				const newLocation = findFirstUnequalCoordinate(simulatedDriverLocation, route.coordinates.slice(1,) );
				setSimulatedDriverLocation((prevLocation) => {
					return newLocation;
				});
				fetchRoute(newLocation, restaurantLocation);
				
			}, 3000); // Wait for 3 seconds before updating the simulated driver location
		}
	}, [route]);


	 useEffect(() => {
		if (simulatedDriverLocation && restaurantLocation) {
			console.log('this first triggers')
		  fetchRoute(simulatedDriverLocation, restaurantLocation);
		}
	  }, [ restaurantLocation]);
	
	 const fetchRoute = async (start, end) => {
		const url = `http://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
		try {
			const response = await axios.get(url);
			let data = response.data.routes[0].geometry;
			console.log('the fetching part is running')
			setRoute({...data})
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
		{simulatedDriverLocation && (
        <Marker position={simulatedDriverLocation} >
          <Popup>
            Restaurant Location: {simulatedDriverLocation}
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
		{route &&  <GeoJSON key={JSON.stringify(route)}
				data={{
				  "type":"Feature",
				  "geometry": {
					"type": "LineString",
					"coordinates": route.coordinates
				  },
				  "properties": {"name":"route3"}
				}}
				pathOptions={{ color: 'red' }}
			  />
       }
    </div>
  );
};

export default DeliveryMap;
