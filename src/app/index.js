const Koa = require('koa')
const cors = require('koa2-cors')
const bodyParser = require('koa-bodyparser')

const useRoutes = require('../router')
const errorHandler = require('./error-handler')

const app = new Koa()
app.use(bodyParser())
app.use(cors({
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Date'],
    maxAge: 100,
    credentials: true,
    allowMethods: ['GET', 'POST', 'OPTIONS','DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Custom-Header', 'anonymous'],
}));




useRoutes(app)
// 错误处理
app.on('error', errorHandler)
module.exports = app