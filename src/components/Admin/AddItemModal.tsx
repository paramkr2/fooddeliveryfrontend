import React, { useState } from 'react';
import { Modal, TextField, Button, Grid } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddItemModal = ({ show, setShow, setItems }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      image: e.target.files[0]
    }));
  };

  const handleClose = () => {
    setFormData({ name: '', price: '', description: '', image: null });
    setShow(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwtToken');
      const headers = { 'Authorization': token };
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('image', formData.image);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/admin/create`, formDataToSend, { headers });
      handleClose();
      setItems(prevItems => [res.data, ...prevItems]);
      toast.success('Item Successfully Added');
    } catch (error) {
      console.error(error);
      toast.error('Error while Adding Item');
    }
  };

  return (
    <Modal
      open={show}
      onClose={handleClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '24px',
          borderRadius: '8px',
          maxWidth: '400px'
        }}
      >
        <h2>Add New Item</h2>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Price" type="number" name="price" value={formData.price} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={3} label="Description" name="description" value={formData.description} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12}>
              <input type="file" name="image" onChange={handleImageChange} />
            </Grid>
          </Grid>
          <div style={{ marginTop: 16 }}>
            <Button variant="contained" color="secondary" onClick={handleClose}>Close</Button>
            <Button variant="contained" color="primary" type="submit">Submit</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddItemModal;
