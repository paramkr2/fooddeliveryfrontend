import React, { useState, useEffect} from 'react';
import { MapContainer, TileLayer, Marker, Popup,useMapEvents , Polygon ,useMap} from 'react-leaflet';

// getting displayed inconsitently without this 
// https://stackoverflow.com/questions/40365440/react-leaflet-map-not-correctly-displayed 
import 'leaflet/dist/leaflet.css';

const MapComponent = ({getAddress,center,setCenter}) => {
  //const [center, setCenter] = useState({ lat: 28.666, lng: 77.182 }); // Initial center position
	 const [bounds , setBounds ] = useState([]);
	 const map = useMap();
	 
	 useEffect( ()=> {
		console.log('changed',center)
		if( center){
			console.log('flying')
			map.flyTo(center)
		}
	 },[center])
	 useEffect( ()=> {
		getCitiesBounds();
	 },[])
	const getCitiesBounds = async()=>{
		try {
		   const res = await fetch(`https://nominatim.openstreetmap.org/search.php?q=Delhi+India&polygon_geojson=1&format=json`)
		  const data = await res.json()
		  if(data!=null){
			let lonLat = data[0].geojson.coordinates[0];
			console.log('cityboundries',)
			setBounds(lonLat.map(cords=>[cords[1],cords[0]] ) );
		   //dispatch(setAddress(data));
			return data
		  }
		  return null
		} catch (error) {
		  console.log(error.message)
		}
	  }

	

	// chatgpt, recommended using onclick .found this on stackoverlow 
	//https://stackoverflow.com/questions/67019569/how-to-update-the-new-position-of-my-marker-when-is-moved-dragged-with-react
	 const GetCurrentCoordinates = () => {
		 useMapEvents({
		  click(e) {
			console.log('clicked',e);
			setCenter(e.latlng)
			getAddress(e.latlng)
			// at this point we also find how to get address 
		  },
		});
		return false;
	  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
		<GetCurrentCoordinates/>
		{ bounds && <Polygon  positions={bounds} pathOptions={{ color: 'blue' }}/> }
      
		
        <Marker
          position={[center.lat, center.lng]} // Using center as position
          draggable={true} // Boolean value, no need to wrap in quotes
          //eventHandlers={eventHandlers}
        >
          <Popup>
            <span>y</span>
          </Popup>
        </Marker>
      
	  
    </div>
  );
};

export default MapComponent;
