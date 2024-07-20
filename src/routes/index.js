const express = require('express')
const router = express.Router()

router.use('/api/products', require('../routes/api/products.route.js'))
router.use('/api/carts', require('../routes/api/carts.routes.js'))
router.use('/api/sessions', require('../routes/api/session.routes.js'))
router.use('/api/tickets', require('../routes/api/tickets.routes.js'))
router.use('/api/mockingproducts', require('../routes/api/mockingproducts.route.js'))
router.use('/loggerTest', require('../routes/api/loggerTest.js'))

module.exports = router
