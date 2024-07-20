const mongoose = require('mongoose');
const { productService } = require('../service/index.js');
const { CustomError } = require('../service/errors/CustomError.js');
const { EErrors } = require('../service/errors/enums.js');
const { generateProductErrorInfo } = require('../service/errors/info.js');

class ProductController {
    constructor() {
        this.productsService = productService;
    }

    getProducts = async (req, res, next) => {
        try {
            const products = await this.productsService.getProducts();
            res.send(products);
        } catch (error) {
            next(error);
        }
    }

    getProduct = async (req, res, next) => {
        const { pid } = req.params;
        try {
            if (!mongoose.Types.ObjectId.isValid(pid)) {
                CustomError.createError({
                    name: 'InvalidProductError',
                    cause: generateProductErrorInfo({ pid }),
                    message: 'Invalid product ID',
                    code: EErrors.INVALID_TYPES_ERROR,
                });
            }
            const result = await this.productsService.getProduct(pid);
            if (!result) {
                CustomError.createError({
                    name: 'ProductNotFoundError',
                    cause: `Product with ID ${pid} not found`,
                    message: 'Product not found',
                    code: EErrors.PRODUCT_NOT_FOUND,
                });
            }
            res.send({ status: 'success', data: result });
        } catch (error) {
            next(error);
        }
    }

    createProduct = async (req, res, next) => {
        const productData = req.body;
        try {
            const requiredFields = ['name', 'price', 'stock'];
            for (const field of requiredFields) {
                if (!productData[field]) {
                    CustomError.createError({
                        name: 'InvalidProductDataError',
                        cause: generateProductErrorInfo(productData),
                        message: `Missing required field: ${field}`,
                        code: EErrors.INVALID_TYPES_ERROR,
                    });
                }
            }
            const result = await this.productsService.createProduct(productData);
            res.status(201).json({ status: 'success', data: result });
        } catch (error) {
            next(error);
        }
    }

    updateProduct = async (req, res, next) => {
        const { pid } = req.params;
        const { name, description, code, price, stock, category } = req.body;
        const updateData = {
            name: name || undefined,
            description: description || undefined,
            code: code || undefined,
            price: price || undefined,
            stock: stock || undefined,
            category: category || undefined,
        };
        try {
            if (!mongoose.Types.ObjectId.isValid(pid)) {
                CustomError.createError({
                    name: 'InvalidProductError',
                    cause: generateProductErrorInfo({ pid }),
                    message: 'Invalid product ID',
                    code: EErrors.INVALID_TYPES_ERROR,
                });
            }
            const result = await this.productsService.updateProduct(pid, updateData);
            if (!result) {
                CustomError.createError({
                    name: 'ProductNotFoundError',
                    cause: `Product with ID ${pid} not found`,
                    message: 'Product not found',
                    code: EErrors.PRODUCT_NOT_FOUND,
                });
            }
            res.json({ status: 'success', data: result });
        } catch (error) {
            next(error);
        }
    }

    deleteProduct = async (req, res, next) => {
        const { pid } = req.params;
        try {
            if (!mongoose.Types.ObjectId.isValid(pid)) {
                CustomError.createError({
                    name: 'InvalidProductError',
                    cause: generateProductErrorInfo({ pid }),
                    message: 'Invalid product ID',
                    code: EErrors.INVALID_TYPES_ERROR,
                });
            }
            const result = await this.productsService.deleteProduct(pid);
            if (!result) {
                CustomError.createError({
                    name: 'ProductNotFoundError',
                    cause: `Product with ID ${pid} not found`,
                    message: 'Product not found',
                    code: EErrors.PRODUCT_NOT_FOUND,
                });
            }
            res.json({ message: "Product deleted successfully", data: result });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ProductController;
