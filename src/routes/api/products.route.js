const { Router } = require('express')
const ProductController = require('../../controller/producuts.controller.js')
const { authPremium , authAdmin } = require('../../middlewares/auth.middleware.js')

const router = Router()
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = new ProductController()

router.get('/', getProducts)
router.get('/:pid', getProduct)
router.post('/',  [ authPremium , authAdmin ] , createProduct)
router.put('/:pid', [ authPremium , authAdmin ] , updateProduct)
router.delete('/:pid', [ authPremium , authAdmin ] , deleteProduct)

module.exports = router