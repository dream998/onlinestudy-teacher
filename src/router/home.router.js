const Router = require('koa-router')
const { verifyAuth } = require('../middleware/auth.middleware')

const homeRouter = new Router()
homeRouter.get('/',verifyAuth)

module.exports = homeRouter