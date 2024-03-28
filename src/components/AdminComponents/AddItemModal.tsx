import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
const AddItemModal = ({ show, setShow, setItems }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: null // New state for image file
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
      image: e.target.files[0] // Set the selected image file
    }));
  };

  const handleClose = () => {
    setFormData({ name: '', price: '', description: '', image: null }); // Reset form data when closing
    setShow(false); // Close the modal
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
      formDataToSend.append('image', formData.image); // Append image file to FormData
      const res = await axios.post('http://localhost:8000/admin/create', formDataToSend, { headers });
      handleClose(); // Close the modal after submission
      setItems(prevItems => [ res.data,...prevItems]);
	  toast.success('Item Successfully Added')
    } catch (error) {
      console.log(error);
	  toast.error('Error while Adding Item')
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Item</Modal.Title>
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

export default AddItemModal;
