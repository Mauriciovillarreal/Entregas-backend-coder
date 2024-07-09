const { Router } = require('express')
const CartController = require('../../controller/carts.controller.js')
const { authUser } = require('../../middlewares/auth.middleware.js')

const router = Router()
const {
  getCarts,
  createCart,
  addProductToCart,
  createTicket,
  deleteCart,
  deleteProduct,
  updateProductQuantity,
  getCartById
} = new CartController()

router.get('/', getCarts)
router.get('/:cid', getCartById)
router.post('/', createCart)
router.post('/:cid/product/:pid' , authUser , addProductToCart)
router.post('/:cid/purchase', createTicket)
router.delete('/:cid', authUser ,deleteCart)
router.delete('/:cid/products/:pid', authUser ,deleteProduct)
router.put('/:cid/products/:pid', authUser ,updateProductQuantity)

module.exports = router
 