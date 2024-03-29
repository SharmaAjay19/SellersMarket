import React, { useState, useEffect } from 'react';
import { CssBaseline } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Navbar, Products, Cart, Checkout } from './components';
import { commerce } from './lib/commerce';
import * as cartService from "./cartservice";

const useLocal = true;

const App = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [productInfoLoadFailed, setProductInfoLoadFailed] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [order, setOrder] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const fetchProducts = async () => {
    var data = null;
    if (!useLocal)
    {
      let sdata = await commerce.products.list();
      data = sdata.data;
      setProducts(data);
    }
    else {
      setLoadingItems(true);
      setTimeout(() => {
        cartService.getProductInfo().subscribe(res => {
          setLoadingItems(false);
          let sdata = res;
          data = sdata.data;
          setProducts(data);
        }, err => {
          setLoadingItems(false);
          setProductInfoLoadFailed(true);
        });
      }, 2000);
    }
  };

  const fetchCart = async () => {
    var cart = null;
    if (!useLocal)
    {cart = await commerce.cart.retrieve();}
    else
    {cart = cartService.retrieve();}
    let newCart = {...cart};
    
    setCart(newCart);
  };

  const handleAddToCart = async (productId, quantity) => {
    var item = null;
    if (!useLocal)
    {item = await commerce.cart.add(productId, quantity);}
    else
    {item = cartService.add(productId, quantity);}
    let newCart = {...item.cart};
    
    setCart(newCart);
  };

  const handleUpdateCartQty = async (lineItemId, quantity) => {
    var response = null;
    if (!useLocal)
    {response = await commerce.cart.update(lineItemId, { quantity });}
    else
    {response = cartService.update(lineItemId, quantity);}
    let newCart = {...response.cart};
    
    setCart(newCart);
  };

  const handleRemoveFromCart = async (lineItemId) => {
    var response = null;
    if (!useLocal)
    {response = await commerce.cart.remove(lineItemId);}
    else
    {response = cartService.remove(lineItemId);}
    let newCart = {...response.cart};
    
    setCart(newCart);
  };

  const handleEmptyCart = async () => {
    var response = null;
    if (!useLocal)
    {response = await commerce.cart.empty();}
    else
    {response = cartService.empty();}
    let newCart = {...response.cart};
    
    setCart(newCart);
  };

  const refreshCart = async () => {
    var response = null;
    if (!useLocal)
    {response = await commerce.cart.refresh();}
    else
    {response = cartService.refresh();}
    let newCart = {...response};
    
    setCart(newCart);
  };

  const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
    try {
      alert("Order placed!");

      refreshCart();
    } catch (error) {
      setErrorMessage(error.data.error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <CssBaseline />
        <Navbar totalItems={cart.total_items} handleDrawerToggle={handleDrawerToggle} />
        {productInfoLoadFailed? "" : <Switch>
          <Route exact path="/">
            <Products products={products} onAddToCart={handleAddToCart} handleUpdateCartQty />
          </Route>
          <Route exact path="/cart">
            <Cart cart={cart} onUpdateCartQty={handleUpdateCartQty} onRemoveFromCart={handleRemoveFromCart} onEmptyCart={handleEmptyCart} />
          </Route>
          <Route path="/checkout" exact>
            <Checkout cart={cart} order={order} onCaptureCheckout={handleCaptureCheckout} error={errorMessage} />
          </Route>
        </Switch>}
      </div>
      {productInfoLoadFailed?
      <div style={{color: "#e80505", fontSize: "26px", margin: "75px auto auto auto", width: "50%"}}>
        An error occurred while loading the available products.
      </div> : ""}
      {loadingItems?
      <div style={{fontSize: "26px", backgroundColor: "grey", opacity: 0.3, margin: "auto", width: "100%", height: "100%", position: "absolute", top: "0px", left: "0px"}}>
      <img src="/LoaderIcon.svg" style={{width: "100%", margin: "auto", height: "100%"}}/>
      </div> : ""}
    </Router>
  );
};

export default App;
