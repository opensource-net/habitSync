import express from 'express'
import userController from '../controllers/user.controller'

const userRouter = express.Router()

userRouter.get('/', userController.createUser, (req, res) => {
    res.status(200).json(res.locals.user)
})
userRouter.post('/', userController.createUser, (req, res) => {
    res.status(201).json(res.locals.user)
})
userRouter.delete('/', userController.deleteUser, (req, res) => {
    
})

export default userRouter;

