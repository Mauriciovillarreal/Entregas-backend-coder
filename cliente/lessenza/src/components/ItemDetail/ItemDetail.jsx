import React from 'react';
import { Container } from 'react-bootstrap';
import "./ItemDetail.css"

export const ItemDetail = ({ product }) => {
    if (!product) {
        return null;
    }

    return (
        <Container>
            <h2>{product.name}</h2>
          
            <div className='containerDetail'>
                <div className='imageContainer'>
                    <img src={product.thumbnails} alt={product.name} />
                </div>
                <div className='productDetail'>
                    <h4>{product.brands}</h4>
                    <h6>{product.category}</h6>
                    <h6>Price: ${product.price}</h6>
                </div>
            </div>
            <hr />
            <h5>Descripción</h5>
                    <p>{product.description}</p>
        </Container>
    );
};
