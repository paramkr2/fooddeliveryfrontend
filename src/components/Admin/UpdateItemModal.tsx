import React, { useState ,useEffect} from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const UpdateItemModal = ({ item, show, setShow, setItems }) => {

	if (!item) {
		return null; // Return null if item is null or undefined
	 }
  
	const [formData, setFormData] = useState({});

	useEffect( ()=>{
		setFormData({
		dishId:item._id ,
		name: item.name || '',
		price: item.price || '',
		description: item.description || '',
		
	  })
	},[item])
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleClose = () => {
    setFormData({
      name: item.name || '',
      price: item.price || '',
      description: item.description || ''
    }); // Reset form data to original item details when closing
    setShow(false); // Close the modal
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
	console.log('form data before submit' , formData )
      let token = localStorage.getItem('jwtToken');
      let headers = { 'Authorization': token };
	   const formDataToSend = new FormData();
	   formDataToSend.append('dishId',formData.dishId);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('image', formData.image); // Append image file to FormData
      let res = await axios.post(`http://localhost:8000/admin/update`, formDataToSend, { headers });
	  console.log(res.data );
      handleClose(); // Close the modal after submission
      setItems(prevItems => prevItems.map(prevItem => prevItem._id == item._id ? res.data : prevItem));
	  toast.success('Item Successfully updated')
    } catch (error) {
      console.log(error);
	  toast.error('Error while updating Item')
    }
  };

	const handleImageChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      image: e.target.files[0] // Set the selected image file
    }));
  };
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} />
          </Form.Group>
          <Form.Group controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control type="number" name="price" value={formData.price} onChange={handleInputChange} />
          </Form.Group>
          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} />
          </Form.Group>
        
		<Form.Group controlId="image">
			  <Form.Label>Image</Form.Label>
			  <Form.Control type="file" name="image" onChange={handleImageChange} />
			</Form.Group>
        </Form>
		
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Button variant="primary" onClick={handleSubmit}>Submit</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateItemModal;
