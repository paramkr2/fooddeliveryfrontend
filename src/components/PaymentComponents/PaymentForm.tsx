import styled from "styled-components";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import React, { useState } from "react";
import { Spinner } from "react-bootstrap"; // Import Spinner component from React Bootstrap

const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#c4f0ff",
      color: "#cfffde",
      fontWeight: 500,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": { color: "#fce883" },
      "::placeholder": { color: "#87bbfd" },
    },
    invalid: {
      iconColor: "#fa0000",
      color: "#ffc7ee",
    },
  },
};

const PaymentForm = () => {
	  const [success, setSuccess] = useState(false);
	  const stripe = useStripe();
	  const elements = useElements();
		const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
		const amountInDollars = 4564;
		const finalTotal = amountInDollars * 100;
		e.preventDefault();
		
		const { error, paymentMethod } = await stripe.createPaymentMethod({
		  type: "card",
		  card: elements.getElement(CardElement),
		});

		if (!error) {
		  try {
			setLoading(true);
			console.log('trying payment');
			const { id } = paymentMethod;
			const response = await axios.post("http://localhost:8000/payment/create", {
			  amount: finalTotal
			  currency:'USD',
			  description: 'Software development services',
			  shipping: {
				name: 'Jenny Rosen',
				address: {
				  line1: '510 Townsend St',
				  postal_code: '98140',
				  city: 'San Francisco',
				  state: 'CA',
				  country: 'US',
				},
			  }, // required for indian regualtion warning
			});
			console.log(response.data);
			const  paymentIntent  = response.data;
			  if (paymentIntent.status === 'requires_confirmation') {
				// Confirm the Payment Intent on the client side using the client secret
				//const result = await stripe.confirmCardPayment(paymentIntent.client_secret);
				const result = await stripe
				  .confirmCardPayment(paymentIntent.client_secret, {
					payment_method: {
					  card: elements.getElement(CardElement),
					  billing_details: {
						name: 'Jenny Rosen',
						address: {
						  line1: '1 Main street',
						  city: 'San Francisco',
						  postal_code: '90210',
						  state: 'CA',
						  country: 'US',
						},
					  },
					  
					},
				  });
				if (result.error) {
				  console.error(result.error.message);
				  return;
				}

				// Handle the result of confirmation
				if (result.paymentIntent.status === 'succeeded') {
				  console.log('Payment successful!');
				  setSuccess(true)
				} else {
				  console.log('Payment failed.');
				}
			}
		  } catch (error) {
			console.log("Error", error);
		  } finally{
			setLoading(false);
		  }
		} else {
		  console.log(error.message);
		}
	  };

  return (
    <div>
      {!success ? (
        <form onSubmit={handleSubmit}>
          <fieldset className="FormGroup">
            <div className="FormRow">
              <PaymentElement/>
            </div>
          </fieldset>
          <button type="submit" disabled={loading} onClick={handleSubmit}> {/* Disable button when loading */}
            {loading ? <Spinner /> : "Pay"}
          </button>
          <h2>$10</h2>
        </form>
      ) : (
        <div>
          <h2>Payment successful!</h2>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;

