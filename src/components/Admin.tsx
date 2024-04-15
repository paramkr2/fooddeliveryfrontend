import React, { useState, useEffect } from 'react';
import { Button, Card, Grid } from '@mui/material';
import AddItemModal from './Admin/AddItemModal';
import UpdateItemModal from './Admin/UpdateItemModal';
import EditRestaurantInformationModal from './Admin/EditRestaurantInformationModal';
import axios from 'axios';
import DishAdmin from './Admin/DishAdmin';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [items, setItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRestEdit, setShowRestEdit] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleDelete = async (item) => {
    try {
      let token = localStorage.getItem('jwtToken');
      let headers = { 'Authorization': token };
      let res = await axios.delete(`${import.meta.env.VITE_API_URL}/admin/delete`, { headers, params: { dishId: item._id } });
      setItems(prevItems => prevItems.filter(prevItem => prevItem._id !== item._id));
    } catch (err) {
      console.log('Error ', err);
    }
  };

  const resList = async () => {
    try {
      let token = localStorage.getItem('jwtToken');
      let headers = { 'Authorization': token };
      let res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/list`, { headers });
      setItems(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    resList();
  }, []);

  return (
    <div>
      <Button variant="contained" onClick={() => setShowAddModal(true)}>Add Item</Button>
      <Button variant="contained" onClick={() => navigate('/admin/orders')}>Orders</Button>
      <Button variant="contained" onClick={() => setShowRestEdit(true)}>Edit Restaurant Information</Button>

      <AddItemModal show={showAddModal} setShow={setShowAddModal} setItems={setItems} />
      <EditRestaurantInformationModal show={showRestEdit} setShow={setShowRestEdit} />
      <UpdateItemModal show={showEditModal} setShow={setShowEditModal} item={selectedItem} setItems={setItems} />

      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card>
              <DishAdmin item={item}  />
              
                <Button variant="contained" onClick={() => handleEdit(item)}>Edit</Button>
                <Button variant="contained" onClick={() => handleDelete(item)}>Delete</Button>
              
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Admin;
