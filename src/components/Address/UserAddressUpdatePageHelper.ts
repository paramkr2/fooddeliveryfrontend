// api.js
import axios from 'axios';
import { toast } from 'react-toastify';
const API_URL = import.meta.env.VITE_API_URL;

export async function fetchPreviousAddress(token) {
    try {
        const headers = { 'Authorization': token };
        const response = await axios.get(`${API_URL}/user/address`, { headers });
        return response.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
}

export async function updateAddress(token, address) {
    try {
        const headers = { 'Authorization': token };
        const response = await axios.post(`${API_URL}/user/address`, address, { headers });
        toast.success('Updated Successfully');
        return response.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
}

function handleError(error) {
    console.error('Error occurred during API call:', error);
    toast.error('An error occurred. Please try again.');
}

// address.js

export function getAddressFromCoordinates(coords, language = 'ua') {
    return fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&accept-language=${language}`)
        .then(response => response.json())
        .then(data => ({
            city: data.address.city || '',
            state_district: data.address.state_district || '',
            state: data.address.state,
            country: data.address.country,
            postcode: data.address.postcode,
            neighbourhood: data.address.neighbourhood || '',
            location: { type: 'Point', coordinates: [coords.lat, coords.lng] }
        }))
        .catch(error => {
            console.error('Error occurred during address lookup:', error);
            throw error;
        });
}
