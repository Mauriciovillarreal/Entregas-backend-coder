import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from '../AuthContext/AuthContext';
import axiosInstance from '../AxiosInstance/AxiosInstance'; // Asegúrate de que la ruta sea correcta

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCartItems = async () => {
            if (!user || !user.cart) return;

            try {
                setLoading(true);
                const response = await axiosInstance.get(`/api/carts/${user.cart}`);
                setCartItems(response.data.products);
            } catch (error) {
                setError(error.message);
                console.error('Error fetching cart items:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [user]);

    const addToCart = async (productId) => {
        if (!user || !user.cart) {
            console.error('No cart ID found for the user.');
            return;
        }

        try {
            setLoading(true);
            const response = await axiosInstance.post(`/api/carts/${user.cart}/product/${productId}`);
            console.log('Added product to cart:', response.data.products);
            setCartItems(response.data.products);
        } catch (error) {
            console.error('Error adding product to cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateProductQuantity = async (productId, quantity) => {
        if (!user || !user.cart) {
            console.error('No cart ID found for the user.');
            return;
        }

        try {
            setLoading(true);
            await axiosInstance.put(`/api/carts/${user.cart}/products/${productId}`, { quantity });
            const updatedCartItems = [...cartItems];
            const index = updatedCartItems.findIndex(item => item.product._id === productId);
            if (index !== -1) {
                updatedCartItems[index].quantity = quantity;
            }
            console.log('Updated cart items:', updatedCartItems);
            setCartItems(updatedCartItems);
        } catch (error) {
            console.error('Error updating product quantity:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteProductFromCart = async (productId) => {
        if (!user || !user.cart) {
            console.error('No cart ID found for the user.');
            return;
        }

        try {
            setLoading(true);
            await axiosInstance.delete(`/api/carts/${user.cart}/products/${productId}`);
            const updatedCartItems = [...cartItems];
            const index = updatedCartItems.findIndex(item => item.product._id === productId);
            if (index !== -1) {
                updatedCartItems.splice(index, 1);
            }
            console.log('Deleted product from cart:', updatedCartItems);
            setCartItems(updatedCartItems);
        } catch (error) {
            console.error('Error deleting product from cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteCart = async () => {
        if (!user || !user.cart) {
            console.error('No cart ID found for the user.');
            return;
        }

        try {
            setLoading(true);
            await axiosInstance.delete(`/api/carts/${user.cart}`);
            console.log('Deleted cart');
            setCartItems([]);
        } catch (error) {
            console.error('Error deleting cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const finalizePurchase = async () => {
        if (!user || !user.cart) {
            console.error('No cart ID found for the user.');
            return;
        }

        try {
            setLoading(true);
            const response = await axiosInstance.post(`/api/carts/${user.cart}/purchase`);
            console.log('Purchase completed:', response.data);
            setCartItems([]); // Clear the cart items upon successful purchase
        } catch (error) {
            console.error('Error finalizing purchase:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, error, loading, addToCart, deleteCart, deleteProductFromCart, updateProductQuantity, finalizePurchase }}>
            {children}
        </CartContext.Provider>
    );
};
