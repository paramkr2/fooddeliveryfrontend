import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import { MapContainer} from 'react-leaflet';
import DeliveryMap from './DeliveryMap'
import DummyMap from './DummyMap'

import {Container} from 'react-bootstrap'
import 'leaflet/dist/leaflet.css';



const OrderStatusPage = () => {
  const [order, setOrder] = useState(null);
  const { orderId } = useParams();
  const [userLocation,setUserLocation] = useState(null)
  const [restaurantLocation,setRestaurantLocation] = useState(null);
  const [driverLocation,setDriverlocation] = useState(null);
  
	 const fetchOrder = async () => {
		  try {
			let token = localStorage.getItem('jwtToken');
			 let headers = { 'Authorization': token };		
			const response = await axios.get(`http://localhost:8000/order/get/${orderId}`,{headers});
			console.log('order is ',response.data)
			setOrder(response.data);
		  } catch (error){
			console.error('Error fetching order status:', error);
		  }
		};
	
	const setLocation = async  ()=> {
			try{
				let token = localStorage.getItem('jwtToken');
				let headers = { 'Authorization': token };		 
				const userAddress = await axios.get(`${import.meta.env.VITE_API_URL}/user/address` , {headers})
				setUserLocation({ lat: userAddress.data?.location?.coordinates[0], 
							lng: userAddress.data?.location?.coordinates[1]
						})
				console.log('userAddress',userAddress,userAddress.data?.location?.coordinates[0]);
				const restaurantAddress = await axios.get(`${import.meta.env.VITE_API_URL}/restaurant/address/${order.restaurantId}`,{headers})
				setRestaurantLocation({ lat: restaurantAddress.data?.location?.coordinates[0], 
							lng: restaurantAddress.data?.location?.coordinates[1]
						})
				
				console.log('restaurant address',restaurantAddress );
				if( order.driverId != undefined ){
					const driverLocation = await axios.get(`${import.meta.env.VITE_API_URL}/driver/location/${order.driverId}`,{headers})
					setDriverlocation({ lat: driverLocation.data?.coordinates[1], 
							lng: driverLocation.data?.coordinates[0]
						})
					console.log('driverAddress', driverLocation );
				}
				
			}catch(err){
				console.log('setLocation error ', err)
			}
		}
	  useEffect(() => {
		fetchOrder();
	  }, []);
	  
	  useEffect( ()=> {
		if( order != null ){
			console.log( 'order before setLocation', order )
			setLocation();
		}
	  },[order])
	  
	  
  
  // we need all the user , restaurant, driver location to show it in map 

  return (
    <Container fluid>
      <h2>Order Status</h2>
      {order ? (
        <div>
			<div>
			
			
			  { userLocation && driverLocation && restaurantLocation &&  
			  <MapContainer center={userLocation} zoom={11} style={{ height: "100vh" }} >
				<DeliveryMap  userLocation={userLocation} restaurantLocation={restaurantLocation} driverLocation={driverLocation} />
			  </MapContainer>}
			 
			 </div>
			 <div>
			 {<DummyMap/>}
			</div>
          <p>Order ID: {order._id}</p>
          <p>Total Amount: {order.totalAmount}</p>
		  <p> Payment Status:{order.paymentStatus} </p>
		  <p> Order Status:{order.status} </p> 
			
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </Container>
  );
};

export default OrderStatusPage;
