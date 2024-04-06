import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import L from 'leaflet';
import 'leaflet-defaulticon-compatibility';

const MapView = () => {

	const geojsonData = {
		
				"type": "Feature",
				"properties": { "name": "Location 1" },
				"geometry": {
					"type": "LineString",
					"coordinates":[ [-0.09, 51.505] ,[-0.09, 52.505] ]
				}
			
			// ... more features
		
	};
    return (
       <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100vh" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <GeoJSON data={geojsonData} pathOptions={{ color: 'red' }} />
        </MapContainer>
    );
};

export default MapView;