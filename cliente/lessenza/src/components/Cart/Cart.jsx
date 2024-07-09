import React, { useContext } from 'react';
import { CartContext } from '../../CartProvider/CartProvider';
import './Cart.css';
import { Link } from 'react-router-dom';

export const Cart = ({ isOffcanvasOpen, closeOffcanvas }) => {
    const { cartItems = [], error, loading, deleteCart, deleteProductFromCart, updateProductQuantity } = useContext(CartContext);

    const handleIncreaseQuantity = (productId, currentQuantity) => {
        updateProductQuantity(productId, currentQuantity + 1);
    };

    const handleDecreaseQuantity = (productId, currentQuantity) => {
        if (currentQuantity - 1 <= 0) {
            deleteProductFromCart(productId);
        } else {
            updateProductQuantity(productId, currentQuantity - 1);
        }
    };

    const total = cartItems.reduce((acc, item) => acc + item.quantity * item.product.price, 0);

    return (
        <div>
            <div className={`offcanvas-cart ${isOffcanvasOpen ? 'open' : ''}`}>
                <button className="close-button" onClick={closeOffcanvas}>
                    <img src="../img/cerrar-cruz.png" style={{ width: '12px' }} alt="Close" />
                </button>
                <div className='cartInfo'>
                    <h5>CARRITO DE COMPRAS</h5>
                    <div className='containerCart'>
                        {loading && <div></div>}
                        {error ? (
                            <p>{error}</p>
                        ) : cartItems.length === 0 ? (
                            <p className='cardEmpty'>El carrito de compras está vacío.</p>
                        ) : (
                            cartItems.map(item => (
                                <div key={item.product._id} className='cartItem'>
                                    <div className='cartItemImage'>
                                        <img src={item.product.thumbnails} style={{ width: '60px' }} alt="" />
                                    </div>
                                    <div className='CartItemDetail'>
                                        <h6>{item.product.brands}</h6>
                                        <h6>{item.product.name}</h6>
                                        <h6>${item.product.price}</h6>
                                        <div className='quantityControls'>
                                            <div className='quantityBtn'>
                                                <button onClick={() => handleDecreaseQuantity(item.product._id, item.quantity)} >-</button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => handleIncreaseQuantity(item.product._id, item.quantity)} >+</button>
                                            </div>
                                            <button className='btnDelateProduct' onClick={() => deleteProductFromCart(item.product._id)}>
                                                <img src="../img/tacho.png" style={{ width: '19px' }} alt="" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    {cartItems.length > 0 && (
                        <div className='containerTotal'>
                            <h4><span>TOTAL:</span> ${total.toFixed(2)}</h4>
                            <div>
                                <button onClick={deleteCart} className="deleteCartBtn">BORRAR CARRITO</button>
                            </div>
                            <div>
                                <Link to="/checkout">
                                    <button className='finalizarCompraBtn'>TERMINAR COMPRA</button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
