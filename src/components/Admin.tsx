import React, { useState, useEffect } from 'react';
import { Button, Card, Modal, Form } from 'react-bootstrap';
import AddItemModal from './AddItemModal';
import axios from 'axios'

const Admin = () => {
	const [items, setItems] = useState([]);
	const [showAddModal,setShowAddModal] = useState(false);
	
	const resList = async () => {
		try{
			let token = localStorage.getItem('jwtToken')
			let headers = { 'Authorization':token }
			let res = await axios.get(`http://localhost:8000/admin/list`, {headers} );
			console.log( 'admin',res.data )
			setItems(res.data)
			
		}catch(error){
			console.log(error);
		}
	}
	
	useEffect( ()=> {
		// fetch data .. using userId,, the backend will veryify if owner and fetch related restaurant dishes 
		resList();
	} , [])

	return (
  <div>
	<Button variant="primary" onClick={() => setShowAddModal(true)}>Add Item </Button> 
      
    <AddItemModal show={showAddModal}  setShow={setShowAddModal}/>
    <div>
      {items.map((item) => (
        <Card key={item._id}>
          <Card.Body>
            <DishAdmin item={item} />
          </Card.Body>
        </Card>
      ))}
    </div>
  </div>
);


}

export default Admin;