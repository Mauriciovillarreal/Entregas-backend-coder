import React, { useContext } from 'react';
import { CartContext } from "../../CartProvider/CartProvider"
import "./Checkout.css"
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

    return (
        <Container>
          <div className='Checkout'>
            <h2>Checkout</h2>
            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <div>
                {cartItems.map(item => (
                  <div key={item.product._id}>
                    <img src={item.product.thumbnails} style={{ width: '60px' }} alt="" />
                    {item.product.name} {item.quantity} ${item.product.price}
                  </div>
                ))}
                <div>
                  <button onClick={handlePurchase}>
                    TERMINAR COMPRA
                  </button>
                </div>
              </div>
            )}
          </div>
        </Container>
      );
};
