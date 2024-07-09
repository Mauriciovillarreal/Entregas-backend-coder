// src/components/ItemListContainer/ItemListContainer.jsx

import React, { useEffect, useState } from 'react';
import { ItemList } from '../ItemList/ItemList';
import FilterList from '../FilterList/FilterList';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import "./ItemListContainer.css";

const getProducts = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/products').then(res => res.json());
        return response;
    } catch (error) {
        console.log(error);
    }
};

const ItemsListContainer = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const products = await getProducts();
            setProducts(products);
            setFilteredProducts(products);
        };
        fetchProducts();
    }, []);

    return (
        <Container fluid className='containerCard'>
            <FilterList products={products} setFilteredProducts={setFilteredProducts} />
            <Row>
                <ItemList products={filteredProducts} />
            </Row>
        </Container>
    );
};

export default ItemsListContainer;
