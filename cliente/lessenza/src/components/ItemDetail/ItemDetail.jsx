import React from 'react';

export const ItemDetail = ({ product }) => {
    if (!product) {
        return null;
    }

    return (
        <div>
            <h1>{product.brands}</h1>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <img src={product.thumbnails} alt={product.name} />
        </div>
    );
};
