const mongoose = require('mongoose')
const { userService } = require('../service/index.js')
const { CustomError } = require('../service/errors/CustomError.js')
const { EErrors } = require('../service/errors/enums.js')
const { generateUserErrorInfo } = require('../service/errors/info.js')

class UserController {
    constructor() {
        this.usersService = userService
    }

    getUsers = async (req, res, next) => {
        try {
            const users = await this.usersService.getUsers()
            res.send(users)
        } catch (error) {
            next(error)
        }
    }

    getUser = async (req, res, next) => {
        const { uid } = req.params
        try {
            if (!mongoose.Types.ObjectId.isValid(uid)) {
                CustomError.createError({
                    name: 'InvalidUserError',
                    cause: generateUserErrorInfo({ uid }),
                    message: 'Invalid user ID',
                    code: EErrors.INVALID_TYPES_ERROR,
                })
            }
            const result = await this.usersService.getUser(uid)
            if (!result) {
                CustomError.createError({
                    name: 'UserNotFoundError',
                    cause: `User with ID ${uid} not found`,
                    message: 'User not found',
                    code: EErrors.USER_NOT_FOUND,
                })
            }
            res.send({ status: 'success', data: result })
        } catch (error) {
            next(error)
        }
    }

    createUser = async (req, res, next) => {
        const userData = req.body
        try {
            const requiredFields = ['name', 'email', 'password']
            for (const field of requiredFields) {
                if (!userData[field]) {
                    CustomError.createError({
                        name: 'InvalidUserDataError',
                        cause: generateUserErrorInfo(userData),
                        message: `Missing required field: ${field}`,
                        code: EErrors.INVALID_TYPES_ERROR,
                    })
                }
            }
            const result = await this.usersService.createUser(userData)
            res.status(201).json({ status: 'success', data: result })
        } catch (error) {
            next(error)
        }
    }

    toggleUserRole = async (req, res, next) => {
        const { uid } = req.params
        try {
            if (!mongoose.Types.ObjectId.isValid(uid)) {
                CustomError.createError({
                    name: 'InvalidUserError',
                    cause: generateUserErrorInfo({ uid }),
                    message: 'Invalid user ID',
                    code: EErrors.INVALID_TYPES_ERROR,
                })
            }
            const result = await this.usersService.toggleUserRole(uid)
            if (!result) {
                CustomError.createError({
                    name: 'UserNotFoundError',
                    cause: `User with ID ${uid} not found`,
                    message: 'User not found',
                    code: EErrors.USER_NOT_FOUND,
                })
            }
            res.json({ status: 'success', data: result })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = UserController
