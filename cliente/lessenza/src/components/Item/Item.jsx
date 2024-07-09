import React, { useContext } from 'react';
import Col from 'react-bootstrap/Col';
import { CartContext } from '../../CartProvider/CartProvider';
import { AuthContext } from '../../AuthContext/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import "./Item.css";

export const Item = ({ product }) => {
    const { addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext); 

    const handleAddToCart = () => {
        if (user.role === 'admin') {
            toast.error(`No puedes agregar productos al carrito porque eres administrador`, {
                position: "bottom-left",
                style: {
                    backgroundColor: "black",
                    color: "white",
                    borderRadius: "0px"
                },
                progressClassName: 'toastify__progress-bar',
                icon: () => (
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                    </svg>
                )
            });
        } else {
            addToCart(product._id);
            toast.success(`${product.name} agregado al carrito`, {
                position: "bottom-left",
                style: {
                    backgroundColor: "black",
                    color: "white",
                    borderRadius: "0px"
                },
                progressClassName: 'toastify__progress-bar',
                icon: () => (
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                        <path d="M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l7.1-7.1 1.4 1.4L9 16.2z" />
                    </svg>
                )
            });
        }
    };

    return (
        <Col className='cardProducts'>
            <div className='cardImg'>
                <Link to={`/detail/${product._id}`} className='linkProduct'>
                    <img src={product.thumbnails} alt="" />
                </Link>
            </div>
            <h1>{product.brands}</h1>
            <h2>{product.name}</h2>
            <h2>${product.price}</h2>
            <div className='btnAddContainer'>
                <button onClick={handleAddToCart} className='btnAdd'>AGREGAR AL CARRITO</button>
            </div>
        </Col>
    );
}
