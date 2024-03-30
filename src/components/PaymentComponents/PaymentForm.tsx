import styled from "styled-components";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import React, { useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom'
import { Modal, Button, Spinner } from 'react-bootstrap';

const PaymentForm = ({show,setShow}) => {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setLoading(true);
    try {
      const { error } = await stripe.confirmPayment( {
	  elements,
       redirect: 'if_required',
         confirmParams: {
            // Make sure to change this to your payment completion page
            return_url: `http://localhost:5173/cart`,
			shipping: {
				name: 'Jenny Rosen',
				address: {
				  line1: '510 Townsend St',
				  postal_code: '98140',
				  city: 'San Francisco',
				  state: 'CA',
				  country: 'US',
				},
			  },
		 },
      });

      if (error) {
        console.error("Payment confirmation error:", error.message);
        return;
      }

      setSuccess(true); // Update state to indicate successful payment
	   setTimeout(() => {
        navigate(`/order/recent`); // Navigate to the order details page after a delay
      }, 1000);
    } catch (error) {
      console.error("Error confirming payment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={()=>setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Payment Form</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!success ? (
          <form onSubmit={handleSubmit}>
            <fieldset className="FormGroup">
              <div className="FormRow">
                <PaymentElement />
              </div>
            </fieldset>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Pay'}
            </Button>
            <h2>$10</h2>
          </form>
        ) : (
          <div>
            <h2>Payment successful!</h2>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default PaymentForm;
