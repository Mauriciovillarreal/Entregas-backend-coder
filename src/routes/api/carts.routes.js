const { Router } = require('express')
const CartController = require('../../controller/carts.controller.js')
const { authUser, authAdmin , authPremium } = require('../../middlewares/auth.middleware.js')

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

router.get('/', [ authAdmin ] , getCarts)
router.get('/:cid', getCartById)
router.post('/', createCart)
router.post('/:cid/product/:pid', [ authUser, authPremium ] , addProductToCart)
router.post('/:cid/purchase', [ authUser, authPremium ] , createTicket)
router.delete('/:cid', [ authUser, authPremium ] , deleteCart)
router.delete('/:cid/products/:pid', [ authUser, authPremium ] , deleteProduct)
router.put('/:cid/products/:pid',[ authUser, authPremium ] , updateProductQuantity)

module.exports = router
