import React from 'react';
import { Item } from '../Item/Item';
import Col from 'react-bootstrap/Col';

export const ItemList = ({ products, addToCart }) => {
    return (
        <>
            {products.map(product => (
                <Col key={product._id}>
                    <Item product={product} addToCart={addToCart} />
                </Col>
            ))}
        </>
    );
};