const Router = require('koa-router')

const {verifyUser,verifyAdmin,handlerPassword} = require('../middleware/user.middleware')
const {create,avatarInfo} = require('../controller/user.controller')
const userRouter = new Router({prefix:'/users'})

userRouter.post('/register',verifyUser,verifyAdmin,handlerPassword,create)
userRouter.get('/:userId/avatar',avatarInfo)

module.exports = userRouter