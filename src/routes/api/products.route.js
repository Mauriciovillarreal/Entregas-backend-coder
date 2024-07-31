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
router.post('/', createProduct)
router.put('/:pid', authAdmin, updateProduct)
router.delete('/:pid', deleteProduct)

module.exports = router
