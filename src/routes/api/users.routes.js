const { Router } = require('express')
const UserController = require('../../controller/users.controller')

const router = Router()
const {
    getUsers,
    getUser,
    createUser,
    toggleUserRole, 
} = new UserController()

router.get('/', getUsers)
router.get('/:uid', getUser)
router.post('/', createUser) 
router.post('/premium/:uid', toggleUserRole)

module.exports = router