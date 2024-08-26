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
                return res.status(400).json({
                    status: 'error',
                    message: 'ID de usuario no válido.',
                })
            }
            const user = await this.usersService.getUser(uid)
            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuario no encontrado.',
                })
            }
            // Solo aplicar la validación si el usuario intenta cambiar a premium
            if (user.role !== 'premium') {
                const requiredDocuments = ['Identificacion', 'Comprobante de domicilio', 'Comprobante de estado de cuenta']
                // Eliminar la extensión de los archivos antes de compararlos
                const uploadedDocuments = user.documents.map(doc => doc.name.split('-').pop().split('.').shift())
                const hasAllRequiredDocuments = requiredDocuments.every(doc =>
                    uploadedDocuments.includes(doc)
                )
                if (!hasAllRequiredDocuments) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'El usuario no ha terminado de procesar su documentación. Se requieren: Identificación, Comprobante de domicilio y Comprobante de estado de cuenta.',
                    })
                }
            }
            user.role = user.role === 'user' ? 'premium' : 'user'
            const updatedUser = await user.save()
            res.status(200).json({
                status: 'success',
                data: updatedUser,
            })
        } catch (error) {
            next(error)
        }
    }

    uploadDocuments = async (req, res) => {
        try {
            const { uid } = req.params
            const files = req.files
            if (!files) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Faltan datos o archivos requeridos.',
                })
            }
            const user = await this.usersService.getUser(uid)
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado.' })
            }
            user.documents = user.documents || []
            Object.values(files).forEach((fileArray) => {
                fileArray.forEach((file) => {
                    user.documents.push({
                        name: file.filename,
                        reference: file.destination,
                    })
                })
            })
            const result = await user.save()
            return res.status(200).json({
                status: 'success',
                payload: result,
            })
        } catch (error) {
            console.error('Error al subir los archivos:', error)
            return res.status(500).json({ error: 'Ocurrió un error en el servidor.' })
        }
    }

}

module.exports = UserController