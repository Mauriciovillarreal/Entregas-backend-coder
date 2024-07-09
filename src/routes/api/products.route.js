// products.route.js
const { Router } = require('express')
const ProductController = require('../../controller/producuts.controller.js')
const { authAdmin } = require('../../middlewares/auth.middleware.js')

const router = Router()
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = new ProductController()

router.get('/', getProducts)
router.get('/:pid', getProduct)
router.post('/', authAdmin, createProduct)
router.put('/:pid', authAdmin, updateProduct)
router.delete('/:pid', authAdmin, deleteProduct)

module.exports = router
