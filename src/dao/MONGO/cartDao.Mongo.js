const { cartsModel } = require('../../models/carts.model.js')
const { productsModel } = require('../../models/products.model.js')

class CartsDaoMongo {
    constructor() {
        this.model = cartsModel
    }

    async getAll() {
        return await this.model.find()
    }

    async get(cId) {
        return await this.model.findById(cId)
    }

    async create() {
        return await this.model.create({ products: [] })
    }

    async delete(cId) {
        return await this.model.findOneAndUpdate({ _id: cId }, { $set: { products: [] } }, { new: true })
    }

    async deleteProduct(cId, pId) {
        try {
            const cart = await this.model.findById(cId)
            if (!cart) {
                throw new Error('Cart not found')
            }
            cart.products = cart.products.filter(product => product.product.toString() !== pId)
            await cart.save()
            return await this.model.findById(cId).populate('products.product').exec()
        } catch (error) {
            throw new Error('Error while deleting product from cart: ' + error.message)
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await this.model.findById(cartId)
            if (!cart) {
                throw new Error('Cart not found')
            }
            const product = cart.products.find(prod => prod.product.toString() === productId)
            if (!product) {
                throw new Error('Product not found in cart')
            }
            product.quantity = quantity
            await cart.save()
            return cart
        } catch (error) {
            throw new Error('Error while updating product quantity: ' + error.message)
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const cart = await this.model.findById(cartId)
            if (!cart) {
                throw new Error('Cart not found')
            }
            const product = await productsModel.findById(productId)
            if (!product) {
                throw new Error('Product not found')
            }
            const existingProductIndex = cart.products.findIndex(product => product.product.toString() === productId)
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity++
            } else {
                const newProduct = {
                    product: productId,
                    quantity: 1
                }
                cart.products.push(newProduct)
            }

            await cart.save()
            return await this.model.findById(cartId).populate('products.product').exec()
        } catch (error) {
            throw new Error('Error while adding product to cart: ' + error.message)
        }
    }

    async updateCart(cartId, updateData) {
        try {
            const cart = await this.model.findByIdAndUpdate(cartId, updateData, { new: true });
            return cart;
        } catch (error) {
            throw new Error('Error while updating cart: ' + error.message);
        }
    }
}

module.exports = CartsDaoMongo