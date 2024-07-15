import React, { useContext } from 'react';
import { CartContext } from "../../CartProvider/CartProvider";
import "./Checkout.css";
import { Container } from 'react-bootstrap';

export const Checkout = () => {
  const { cartItems, loading, error, finalizePurchase } = useContext(CartContext);

  const handlePurchase = async () => {
    await finalizePurchase();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const total = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <Container>
      <div className='Checkout'>
        <div className='productList'>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cartItems.map(item => (
              <div key={item.product._id} className='cartItem'>
                <img src={item.product.thumbnails} alt={item.product.name} />
                <div className='cartItemDetails'>
                  <p>{item.product.name}</p>
                  <p>{item.quantity}</p>
                  <p>${item.product.price.toFixed(2)}</p>
                </div>
             
              </div>
            ))
          )}
        </div>
        <div className='cartSummary'>
       
          <div className='summaryItem'>
            <span>Subtotal:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className='summaryItem'>
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className='finalizarCompra'>
            <button onClick={handlePurchase}>Finalizar Compra</button>
          </div>
        </div>
      </div>
    </Container>
  );
};
