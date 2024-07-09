import React, { useEffect, useState, useContext } from 'react';
import io from 'socket.io-client';
import './RealTimeProducts.css'; // Importa los estilos
import { AuthContext } from '../../AuthContext/AuthContext';

const socket = io('http://localhost:8080');

const RealTimeProducts = () => {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
        brands: '',
        name: '',
        description: '',
        code: '',
        price: '',
        status: false,
        stock: '',
        category: '',
        thumbnails: ''
    });
    const [deleteProductId, setDeleteProductId] = useState('');
    const { user } = useContext(AuthContext); // Usa el contexto para obtener el usuario

    useEffect(() => {
        socket.on('update-products', (products) => {
            setProducts(products);
        });

        // Emitir evento para obtener productos al montar el componente
        socket.emit('get-products');

        socket.on('product-not-found', () => {
            alert('No se encontró el producto con el ID proporcionado.');
        });

        return () => {
            socket.off('update-products');
            socket.off('product-not-found');
        };
    }, []);

    const handleInputChange = (e) => {
        const { id, value, type, checked } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [id]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleAddProduct = (e) => {
        e.preventDefault();
        const newProduct = {
            ...form,
            price: parseFloat(form.price),
            stock: parseInt(form.stock),
        };
        socket.emit('add-product', newProduct);
        setForm({
            brands: '',
            name: '',
            description: '',
            code: '',
            price: '',
            status: false,
            stock: '',
            category: '',
            thumbnails: ''
        });
    };

    const handleDeleteProduct = (e) => {
        e.preventDefault();
        socket.emit('delete-product', deleteProductId);
        setDeleteProductId('');
    };

    return (
        <main>
            <h1 className="text-start h6 container">Real-time Products</h1>
            <div className="realTimeProducts container">
                <div>
                    <ul id="products-list" className="row">
                        {products.map((product) => (
                            <li key={product._id} className="col">
                                <h2>{product.brands}</h2>
                                <h2>{product.name}</h2>
                                <div>id: {product._id}</div>
                                <div>${product.price}</div>
                            </li>
                        ))}
                    </ul>
                </div>
                {user && user.role === 'admin' ? (
                    <div className="operateProducts">
                        <h3>Add Products</h3>
                        <form id="add-product-form" onSubmit={handleAddProduct}>
                            <label>Brands</label>
                            <input
                                type="text"
                                id="brands"
                                className="form-control"
                                value={form.brands}
                                onChange={handleInputChange}
                                required
                            />
                            <label>Name</label>
                            <input
                                type="text"
                                id="name"
                                className="form-control"
                                value={form.name}
                                onChange={handleInputChange}
                                required
                            />
                            <label>Description</label>
                            <input
                                type="text"
                                id="description"
                                className="form-control"
                                value={form.description}
                                onChange={handleInputChange}
                                required
                            />
                            <label>Code</label>
                            <input
                                type="text"
                                id="code"
                                className="form-control"
                                value={form.code}
                                onChange={handleInputChange}
                                required
                            />
                            <label>Price</label>
                            <input
                                type="number"
                                id="price"
                                className="form-control"
                                value={form.price}
                                onChange={handleInputChange}
                                required
                            />
                            <label>Stock</label>
                            <input
                                type="number"
                                id="stock"
                                className="form-control"
                                value={form.stock}
                                onChange={handleInputChange}
                                required
                            />
                            <label>Category</label>
                            <input
                                type="text"
                                id="category"
                                className="form-control"
                                value={form.category}
                                onChange={handleInputChange}
                                required
                            />
                            <label>Thumbnails</label>
                            <input
                                type="text"
                                id="thumbnails"
                                className="form-control"
                                value={form.thumbnails}
                                onChange={handleInputChange}
                            />
                            <div>
                                <label>Status</label>
                                <input
                                    type="checkbox"
                                    id="status"
                                    checked={form.status}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <button type="submit" className="btn btn-secondary btn-sm bg-black col btnAdd">
                                ADD
                            </button>
                        </form>
                        <h3>Delete Products</h3>
                        <form id="delete-product-form" onSubmit={handleDeleteProduct}>
                            <label>Product ID</label>
                            <input
                                type="text"
                                id="delete-product-id"
                                className="form-control"
                                value={deleteProductId}
                                onChange={(e) => setDeleteProductId(e.target.value)}
                                required
                            />
                            <button type="submit" className="btn btn-secondary btn-sm bg-black col btnAdd">
                                DELETE
                            </button>
                        </form>
                    </div>
                ) : (
                    <div>
                        <h3>No tienes permisos para agregar o eliminar productos</h3>
                    </div>
                )}
            </div>
        </main>
    );
};

export default RealTimeProducts;
