const { cartService, productService, ticketService } = require('../service/index.js');
const mongoose = require('mongoose');
const CustomError = require('../service/errors/CustomError.js');
const EErrors = require('../service/errors/enums.js');
const generateCartErrorInfo = require('../service/errors/info.js');

class CartController {
    constructor() {
        this.cartsService = cartService;
    }

    getCarts = async (req, res) => {
        try {
            const carts = await cartService.getCarts();
            res.send(carts);
        } catch (error) {
            console.error('An error occurred while retrieving the carts:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    getCartById = async (req, res) => {
        try {
            const { cid } = req.params;
            if (!mongoose.Types.ObjectId.isValid(cid)) {
                return res.status(400).json({ error: 'Invalid cart ID' });
            }
            const cart = await cartService.getCart(cid);
            if (!cart) {
                return res.status(404).json({ error: 'Cart not found' });
            }
            res.json(cart);
        } catch (error) {
            console.error('An error occurred while retrieving the cart:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    createCart = async (req, res) => {
        try {
            const cart = await cartService.createCart();
            res.send(cart);
        } catch (error) {
            console.error('An error occurred while creating the cart:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    addProductToCart = async (req, res, next) => {
        try {
            const { cid, pid } = req.params;
            if (!cid || !pid) {
                CustomError.createError({
                    name: 'InvalidCartError',
                    cause: generateCartErrorInfo({ cid, pid }),
                    message: 'Missing cart ID or product ID',
                    code: EErrors.INVALID_TYPES_ERROR,
                });
            }
            const cart = await cartService.addProductToCart(cid, pid);
            res.json(cart);
        } catch (error) {
            next(error)
        }
    }    

    deleteCart = async (req, res) => {
        try {
            const { cid } = req.params;
            const result = await cartService.deleteCart(cid);
            res.json({ message: "Cart deleted successfully", data: result });
        } catch (error) {
            console.error('An error occurred while deleting the cart:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    deleteProduct = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            console.log('Received cid:', cid, 'pid:', pid); // Debugging log
            if (!cid || !pid) {
                return res.status(400).json({ error: 'Missing cart ID or product ID' });
            }
            const cart = await cartService.deleteProduct(cid, pid);
            res.json({ message: "Product deleted successfully", data: cart });
        } catch (error) {
            console.error('An error occurred while deleting the product from the cart:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    updateProductQuantity = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
            const updatedCart = await cartService.updateProductQuantity(cid, pid, quantity);
            res.json({ message: "Quantity was changed successfully", data: updatedCart });
        } catch (error) {
            console.error('An error occurred while updating the product quantity:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    createTicket = async (req, res) => {
        try {
            if (!req.isAuthenticated()) {
                return res.status(401).json({ error: 'User not authenticated' })
            }    

            const { cid } = req.params;
            if (!mongoose.Types.ObjectId.isValid(cid)) {
                return res.status(400).json({ error: 'Invalid cart ID' });
            }

            const userId = req.user.email

            console.log("user", userId)
    
            const cart = await cartService.getCart(cid);
            if (!cart || !cart.products || cart.products.length === 0) {
                return res.status(400).json({ error: 'Cart is empty or invalid' });
            }
    
            const unprocessedProducts = [];
            const processedProducts = [];
    
            for (const item of cart.products) {
                if (!item.product) {
                    console.warn('Product item is missing product ID');
                    unprocessedProducts.push({ productId: null, reason: 'Missing product ID' });
                    continue;
                }
    
                const product = await productService.getProduct(item.product);
                console.log(`Checking product ${item.product}:`, product); // Debugging log
    
                if (!product) {
                    console.warn(`Product with ID ${item.product} not found`);
                    unprocessedProducts.push({ productId: item.product, reason: 'Product not found' });
                    continue;
                }
    
                if (product.stock >= item.quantity) {
                    console.log(`Product ${product._id} has sufficient stock:`, product.stock); // Debugging log
                    product.stock -= item.quantity;
                    await productService.updateProduct(product._id, product);
                    processedProducts.push({
                        productId: product._id,
                        name: product.name,
                        quantity: item.quantity,
                        price: product.price
                    });
                } else {
                    console.log(`Insufficient stock for product ${product._id}:`, product.stock); // Debugging log
                    unprocessedProducts.push({ productId: item.product, reason: 'Insufficient stock' });
                }
            }
    
            if (processedProducts.length > 0) {
                await cartService.updateCart(cid, {
                    products: cart.products.filter(item => unprocessedProducts.some(up => up.productId === item.product))
                });
                console.log('Updated cart products:', cart.products);
    
                const ticket = await ticketService.createTicket({
                    purchaser: userId,
                    products: processedProducts,
                    amount: processedProducts.reduce((acc, item) => acc + (item.quantity * item.price), 0)
                });
    
                return res.json({
                    message: "Purchase completed successfully",
                    ticket: ticket,
                    unprocessedProducts: unprocessedProducts
                });
            } else {
                return res.status(400).json({ error: 'No products were processed' });
            }
        } catch (error) {
            console.error('An error occurred while creating the ticket:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    
}

module.exports = CartController;