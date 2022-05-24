const Router = require('koa-router')

const {verifyUser,verifyAdmin,handlerPassword} = require('../middleware/user.middleware')
const {create,avatarInfo, choosedStudentInfo, personalInfo, messageInfo} = require('../controller/user.controller')
const { verifyAuth } = require('../middleware/auth.middleware')
const userRouter = new Router({prefix:'/users'})

userRouter.post('/register',verifyUser,verifyAdmin,handlerPassword,create)
userRouter.get('/:userId/avatar',avatarInfo)
userRouter.get('/:courseId/choosedstudent', choosedStudentInfo)
// 获取个人信息
userRouter.get('/personalinfo',verifyAuth,personalInfo)
// 获取消息
userRouter.get('/mymessage',verifyAuth,messageInfo)

module.exports = userRouter