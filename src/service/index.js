const ProductDao = require('../dao/MONGO/productsDao.Mongo.js')
const ProductsRepository = require('../repositories/product.repository.js')
const CartsDao = require('../dao/MONGO/cartDao.Mongo.js')
const CartsRepository = require('../repositories/cart.repository.js')
const TicketDao = require('../dao/MONGO/ticketDao.mongo.js')
const TicketRepository = require('../repositories/ticket.repository.js')

const productService = new ProductsRepository(new ProductDao())
const cartService = new CartsRepository(new CartsDao())
const ticketDao = new TicketDao() 
const ticketService = new TicketRepository(ticketDao)

module.exports = {
    productService,
    cartService,
    ticketService,
    usersModel: require('../models/users.model.js')
}
