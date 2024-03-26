import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const AddItemModal = ({ show,setShow }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleClose = () => {
    setFormData({ name: '', price: '', description: '' }); // Reset form data when closing
    setShow(false); // Close the modal
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let token = localStorage.getItem('jwtToken');
      let headers = { 'Authorization': token };
      let res = await axios.post('http://localhost:8000/admin/create', formData, { headers });
      handleClose(); // Close the modal after submission
      resList(); // Assuming resList is defined somewhere
    } catch (error) {
      console.log(error);
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
