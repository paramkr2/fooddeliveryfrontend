// Map.js
import React , {useState,useEffect} from 'react';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { MapContainer} from 'react-leaflet';

import MapComponent from './MapComponent';
import axios from 'axios';
const Map = () => {
	const [loading, setLoading] = useState(false);
     const [address, setAddress] = useState({
		neighbourhood:"",
		city:'',
        country: 'India',
        postcode: '110052',
        state: 'Delhi',
    });
	const [center,setCenter] = useState({ lat: 28.666, lng: 77.182 })
	
	const fetchPreviousAddress = async () => {
        try {
            // Make API call to fetch previous address and location
            let token = localStorage.getItem('jwtToken');
            let headers = { 'Authorization': token };
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/restaurant/address`, { headers });
           // if response doest have address  yet then , 
			
            setAddress(response.data);
			setCenter({ lat: response.data?.location?.coordinates[0], 
							lng: response.data?.location?.coordinates[1]
						})
        } catch (error) {
			if( response.status == 404){
				// some kind toast is need 
				console.log('No previous address found ')
				return ;
			}
            console.error('Error fetching previous address:', error);
        } finally {
            setLoading(false);
        }
    };
	
	useEffect(() => {
        fetchPreviousAddress();
    }, []); 
	
	const getAddress = async (coords) => {
		console.log(coords)
		const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&accept-language=ua`)
		 const data = await res.json()
		 const addr = { 
								city:data.address.city || '',
								state_district: data.address.state_district || '' , 
								state: data.address.state,
								country: data.address.country,
								postcode: data.address.postcode,
								neighbourhood: data.address.neighbourhood|| '',
								location:{type:'Point',coordinates:[coords.lat,coords.lng]}
								}
		console.log(data.address,addr)
		setAddress(addr);
	
	}
	
	const handleFormSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            // Make API call here with the form data
			let token = localStorage.getItem('jwtToken');
			let headers = { 'Authorization': token };		
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/restaurant/address`, address, { headers });
			console.log(response.data);
            console.log('API call successful');
        } catch (error) {
            console.error('Error occurred during API call:', error);
        } finally {
            setLoading(false);
        }
    };
	
	const handleAddressChange = (event) => {
        setAddress({
            ...address,
            [event.target.name]: event.target.value
        });
    };


   return (
        <Container fluid>
            <Row>
			
			
			
                <Col xs={12} md={9}>
					<MapContainer  center={center} zoom={13} style={{ height: '100%', width: '100%' }} whenCreated={map => setMap( map )  } >
						<MapComponent getAddress={getAddress} center = {center} setCenter={setCenter}/>
					</MapContainer>
                </Col>
				
				
				
                <Col xs={12} md={3}>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Group controlId="addressForm">
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" placeholder="Shop Number/Street " value={address.neighbourhood} name="road" onChange={handleAddressChange} />
                        </Form.Group>
						
                        <Form.Group controlId="cityForm">
                            <Form.Label>City</Form.Label>
                            <Form.Control type="text" placeholder="City" value={address.city} name="city" onChange={handleAddressChange} />
                        </Form.Group>
						<Form.Group controlId="addressForm">
                            <Form.Label>District</Form.Label>
                            <Form.Control type="text" placeholder="District " value={address.state_district} name="Area" onChange={handleAddressChange} />
                        </Form.Group>
                        <Form.Group controlId="postcodeForm">
                            <Form.Label>Postcode</Form.Label>
                            <Form.Control type="text" placeholder="Postcode" value={address.postcode} name="postcode" onChange={handleAddressChange} />
                        </Form.Group>
                        <Form.Group controlId="stateForm">
                            <Form.Label>State</Form.Label>
                            <Form.Control disabled type="text" placeholder="State" value={address.state} name="state" onChange={handleAddressChange} />
                        </Form.Group>
                        
                        
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                    <span className="sr-only">Loading...</span>
                                </>
                            ) : 'Submit'}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Map;
