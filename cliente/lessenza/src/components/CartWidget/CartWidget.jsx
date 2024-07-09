import React, { useState, useContext } from 'react';
import { Cart } from "../Cart/Cart";
import { CartContext } from '../../CartProvider/CartProvider';
import "./CartWidget.css";

export const CartWidget = () => {
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
    const { cartItems = [] } = useContext(CartContext);

    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const toggleOffcanvas = () => {
        setIsOffcanvasOpen(!isOffcanvasOpen);
    };

    const closeOffcanvas = () => {
        setIsOffcanvasOpen(false);
    };

    return (
        <div className='cart'>
            <button className="toggle-button" onClick={toggleOffcanvas}>
                <img src="../img/cart.png" className='loginAcces' alt="Cart" />
                {totalQuantity > 0 && <span className='quantity'>{totalQuantity}</span>}
            </button>
            <Cart isOffcanvasOpen={isOffcanvasOpen} closeOffcanvas={closeOffcanvas} />
        </div>
    );
};

