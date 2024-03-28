import React, { useState, useEffect } from 'react';
import { Button, Card } from 'react-bootstrap';
import AddItemModal from './AdminComponents/AddItemModal';
import UpdateItemModal from './AdminComponents/UpdateItemModal';
import axios from 'axios';
import DishAdmin from './AdminComponents/DishAdmin';

const Admin = () => {
  const [items, setItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // State to store the selected item

  const handleEdit = (item) => {
	console.log(`Edit item:${item.name}`)
    setSelectedItem(item);
    setShowEditModal(true); // Show the edit modal
  };
  
  const handleDelete = async (item)=> {
		try{
			let token = localStorage.getItem('jwtToken');
			  let headers = { 'Authorization': token };		 
			  let res = await axios.delete(`http://localhost:8000/admin/delete`,   {headers , params:{dishId:item._id}} );
			  setItems(prevItems => prevItems.filter( prevItem => prevItem._id != item._id ) )
		}catch(err){
			console.log('Error ', err );
		}
  }
  

  const resList = async () => {
    try {
      let token = localStorage.getItem('jwtToken');
      let headers = { 'Authorization': token };
      let res = await axios.get(`http://localhost:8000/admin/list`, { headers });
      console.log('admin', res.data);
      setItems(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Fetch data .. using userId,, the backend will verify if owner and fetch related restaurant dishes 
    resList();
  }, []);

  return (
    <div>
      <Button variant="primary" onClick={() => setShowAddModal(true)}>Add Item</Button>

      <AddItemModal show={showAddModal} setShow={setShowAddModal} setItems={setItems} />
      
      <UpdateItemModal show={showEditModal} setShow={setShowEditModal} item={selectedItem} setItems={setItems} />

      <div>
        {items.map((item) => (
          <Card key={item._id}>
            <Card.Body>
              {/* Display dish details */}
              <DishAdmin item={item} />
              {/* Edit button */}
              <Button variant="primary" onClick={() => handleEdit(item)}>Edit</Button>
			  <Button variant="primary" onClick={ ()=> handleDelete(item) }> Delete </Button> 
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Admin;
