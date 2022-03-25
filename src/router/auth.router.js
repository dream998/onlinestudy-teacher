const Router = require('koa-router')
const {verifyLogin,verifyAuth} = require('../middleware/auth.middleware')
const {
    login,success
} = require('../controller/auth.controller')
const { handlerPassword } = require('../middleware/user.middleware')

const authRouter = new Router({prefix:'/users'})

authRouter.post('/login',handlerPassword,verifyLogin,login)
//authRouter.get('/test',verifyAuth,success)

module.exports = authRouter