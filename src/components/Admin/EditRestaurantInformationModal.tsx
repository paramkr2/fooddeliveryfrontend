import React, { useState, useEffect } from 'react';
import { Modal, TextField, Button, Typography, Grid, CircularProgress } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditRestaurantInformationModal = ({ show, setShow }) => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    description: '',
    image: null
  });

  useEffect(() => {
    const fetchItemDetails = async () => {
      if (show) {
        try {
          // Fetch item details here
		  const token = localStorage.getItem('jwtToken');
			const headers = { 'Authorization': token };
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/getRestaurantInformation`,{headers}); // Replace with your API endpoint
          setFormData({
            name: response.data.name || '',
            phone: response.data.phone || '',
            description: response.data.description || ''
          });
          setLoading(false);
        } catch (error) {
          console.error('Error fetching item details:', error);
        }
      }
    };
    fetchItemDetails();
  }, [show]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleClose = () => {
    setFormData({
      name: '',
      phone: '',
      description: '',
      image: null
    });
    setShow(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('jwtToken');
      const headers = { 'Authorization': token };
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('image', formData.image);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/admin/updateRestaurantInformation`, formDataToSend, { headers });
      handleClose();
      toast.success('Item Successfully updated');
      return response.data; // Return the updated item data
    } catch (error) {
      console.log(error);
      toast.error('Error while updating Item');
    }
  };

  const handleImageChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      image: e.target.files[0]
    }));
  };

  return (
    <Modal open={show} onClose={handleClose} sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '20px', borderRadius: '8px', maxWidth: '400px', margin: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center' }}>
            <CircularProgress />
          </div>
        ) : (
          <>
            <Typography variant="h5" align="center" gutterBottom>Update Item</Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleInputChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth multiline rows={3} label="Description" name="description" value={formData.description} onChange={handleInputChange} />
                </Grid>
                <Grid item xs={12}>
                  <input type="file" onChange={handleImageChange} />
                </Grid>
              </Grid>
              <Grid container justifyContent="flex-end" spacing={2} style={{ marginTop: '20px' }}>
                <Grid item>
                  <Button variant="contained" color="secondary" onClick={handleClose}>Cancel</Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="primary" type="submit">Submit</Button>
                </Grid>
              </Grid>
            </form>
          </>
        )}
      </div>
    </Modal>
  );
};

export default EditRestaurantInformationModal;
