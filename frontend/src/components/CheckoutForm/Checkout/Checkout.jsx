import React, { useState, useEffect } from 'react';
import { CssBaseline, Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';

import { commerce } from '../../../lib/commerce';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import useStyles from './styles';
import * as checkoutService from "../../../checkoutservice";
import {from} from "rxjs";
import { map, catchError, mergeMap } from "rxjs/operators";

const BACKEND_ENDPOINT = 
   (!process.env.NODE_ENV || process.env.NODE_ENV === 'development')? (process.env.REACT_APP_BACKEND_ENDPOINT?? "https://localhost:5001"):
   (window.location.hostname.includes("takeithome")? "https://takeithome.azurewebsites.net": "");

const fetchItemDetailsForCheckout = () => {
  let url = `${BACKEND_ENDPOINT}/market/getitemdetails/1`;
    return from(
      fetch(url, {}).then((response) => {
        if (response.ok) {
          return response.json().then((data) => {return {
            ok: response.ok,
            status: response.status,
            json: data
          }},
          (err) => {
            return "Hello";
          });
        }
        else {
          throw new Error("Application Crashed");
        }
      })
    );
}

const useLocal = true;

const steps = ['Shipping address', 'Payment details'];

const Checkout = ({ cart, onCaptureCheckout, order, error }) => {
  const [checkoutToken, setCheckoutToken] = useState(null);
  const [loaderIcon, setLoaderIcon] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState({});
  const classes = useStyles();
  const history = useHistory();

  const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  useEffect(() => {
    if (cart.id) {
      const generateToken = async () => {
        try {
          var token = null;
          if (!useLocal)
          {token = await commerce.checkout.generateToken(cart.id, { type: 'cart' });}
          else {
            setLoaderIcon(true);
            fetchItemDetailsForCheckout().subscribe(res => {
              //setLoaderIcon(false);
              alert("Order placed!");
              history.push('/');
            }, (err) => {
              setLoaderIcon(false);
              window.location = `${BACKEND_ENDPOINT}/market/getitemdetails/1`;
              //history.push('/market/getitemdetails/1');
            });
          }
          console.log(token);
          //const token = checkoutService.generateToken(cart.id, { type: 'cart' });

          setCheckoutToken(token);
        } catch {
          if (activeStep !== steps.length) history.push('/');
        }
      };

      generateToken();
    }
  }, [cart]);

  const test = (data) => {
    setShippingData(data);

    nextStep();
  };

  let Confirmation = () => (order.customer ? (
    <>
      <div>
        <Typography variant="h5">Thank you for your purchase, {order.customer.firstname} {order.customer.lastname}!</Typography>
        <Divider className={classes.divider} />
        <Typography variant="subtitle2">Order ref: {order.customer_reference}</Typography>
      </div>
      <br />
      <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
    </>
  ) : (
    <div className={classes.spinner}>
      <CircularProgress />
    </div>
  ));

  if (error) {
    Confirmation = () => (
      <>
        <Typography variant="h5">An error occurred while placing order: {error}</Typography>
        <br />
        <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
      </>
    );
  }

  const Form = () => (activeStep === 0
    ? <AddressForm checkoutToken={checkoutToken} nextStep={nextStep} setShippingData={setShippingData} test={test} />
    : <PaymentForm checkoutToken={checkoutToken} nextStep={nextStep} backStep={backStep} shippingData={shippingData} onCaptureCheckout={onCaptureCheckout} />);

  return (
    <>
    {loaderIcon? <div>Getting item details for checkout</div>:
    <>
      <CssBaseline />
      <div className={classes.toolbar} />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h4" align="center">Checkout</Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
        </Paper>
      </main>
    </>
    }
    </>
  );
};

export default Checkout;
