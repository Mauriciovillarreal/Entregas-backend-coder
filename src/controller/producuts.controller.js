const { productService } = require('../service/index.js')

class ProductController {
    constructor() {
        this.productsService = productService
    }

    getProducts = async (req, res) => {
        try {
            const products = await this.productsService.getProducts() // Correct method name
            res.send(products)
        } catch (error) {
            res.status(500).send({ status: 'error', message: error.message })
        }
    }

    getProduct = async (req, res) => {
        const { pid } = req.params
        try {
            const result = await this.productsService.getProduct(pid) // Correct method name
            res.send({ status: 'success', data: result })
        } catch (error) {
            res.status(500).send({ status: 'error', message: error.message })
        }
    }

    createProduct = async (req, res) => {
        const productData = req.body
        try {
            const result = await this.productsService.createProduct(productData) // Correct method name
            res.status(201).json({ status: 'success', data: result })
        } catch (error) {
            res.status(500).send({ status: 'error', message: error.message })
        }
    }

    updateProduct = async (req, res) => {
        const { pid } = req.params
        const { name, description, code, price, stock, category } = req.body
        const updateData = {
            name: name || undefined,
            description: description || undefined,
            code: code || undefined,
            price: price || undefined,
            stock: stock || undefined,
            category: category || undefined,
        }
        try {
            const result = await this.productsService.updateProduct(pid, updateData) // Correct method name
            res.json({ status: 'success', data: result })
        } catch (error) {
            res.status(500).send({ status: 'error', message: error.message })
        }
    }

    deleteProduct = async (req, res) => {
        const { pid } = req.params
        try {
            const result = await this.productsService.deleteProduct(pid) // Correct method name
            res.json({ message: "Product deleted successfully", data: result })
        } catch (error) {
            res.status(500).send({ status: 'error', message: error.message })
        }
    }
}

module.exports = ProductController
