import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { MapContainer } from 'react-leaflet';
import { fetchPreviousAddress, updateAddress , getAddressFromCoordinates} from './UserAddressUpdatePageHelper';

import MapComponent from './MapComponent';

const Map = () => {
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState({
        neighbourhood: "",
        city: '',
        country: 'India',
        postcode: '110052',
        state: 'Delhi',
    });

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            let token = localStorage.getItem('jwtToken');
            await updateAddress(token, address);
        } catch (error) {
            console.error('Error occurred during form submission:', error);
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

    const [center, setCenter] = useState({ lat: 28.666, lng: 77.182 });

    const fetchAddress = async () => {
        try {
            let token = localStorage.getItem('jwtToken');
            const addressData = await fetchPreviousAddress(token);
            setAddress(addressData);
            setCenter({ lat: addressData?.location?.coordinates[0], lng: addressData?.location?.coordinates[1] });
        } catch (error) {
            console.error('Error fetching address:', error);
        }
    };

    const getAddress = async (coords) => {
        try {
            const addr = await getAddressFromCoordinates(coords);
            setAddress(addr);
        } catch (error) {
            console.error('Error getting address from coordinates:', error);
        }
    };

    useEffect(() => {
        fetchAddress();
    }, []);

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
                            <Form.Label>Neighbourhood</Form.Label>
                            <Form.Control type="text" placeholder="H No and Locality " value={address.neighbourhood} name="neighbourhood" onChange={handleAddressChange} />
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
