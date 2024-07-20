const { Server } = require('socket.io')
const { productsModel } = require('../models/products.model.js')
const { chatsModel } = require('../models/chat.model.js')
const { productionLogger } = require('../utils/logger.js')

let io

function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true
        }
    })

    io.on('connection', async (socket) => {
        productionLogger.info('New user connected')

        try {
            const products = await productsModel.find({})
            socket.emit('update-products', products)
        } catch (error) {
            console.error('Error occurred while fetching products:', error)
        }

        socket.on('get-products', async () => {
            try {
                const products = await productsModel.find({})
                socket.emit('update-products', products)
            } catch (error) {
                console.error('Error occurred while fetching products:', error)
            }
        })

        socket.on('add-product', async (product) => {
            try {
                productionLogger.info('Adding product:', product) 
                const newProduct = await productsModel.create(product)
                const updatedProducts = await productsModel.find({})
                io.emit('update-products', updatedProducts)
            } catch (error) {
                productionLogger.info('Error occurred while adding product:', error)
            }
        })

        socket.on('delete-product', async (productId) => {
            try {
                productionLogger.info('Deleting product with ID:', productId)
                const product = await productsModel.findById(productId)
                if (!product) {
                    io.to(socket.id).emit('product-not-found')
                    return
                }
                await productsModel.findByIdAndDelete(productId)
                const updatedProducts = await productsModel.find({})
                io.emit('update-products', updatedProducts)
            } catch (error) {
                productionLogger.info('Error occurred while deleting product:', error)
            }
        })

        socket.on('chat message', async (msg) => {
            productionLogger.info('Received chat message:', msg) 
            try {
                const newMessage = new chatsModel({ email: msg.user, message: msg.message })
                const savedMessage = await newMessage.save()
                productionLogger.info('Saved message:', savedMessage) 
                io.emit('chat message', msg)
            } catch (error) {
                productionLogger.info('Error occurred while saving message:', error)
            }
        })

        socket.on('disconnect', () => {
            productionLogger.info('User disconnected')
        })
    })
}

function getIO() {
    if (!io) {
        throw new Error('Socket.io not initialized')
    }
    return io
}

module.exports = { initSocket, getIO }
