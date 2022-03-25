const jwt = require('jsonwebtoken')
const {PUBLIC_KEY} = require('../app/config')

const errorTypes = require('../constants/error-types')
const userService = require('../service/user.service')
const md5password = require('../utils/password-handler')
const authService = require('../service/auth.service')


const verifyLogin = async(ctx,next)=>{
    const {username,password} = ctx.request.body
    // 判断用户名和密码是否为空
    if (!username || !password) {
        const error = new Error(errorTypes.NAME_ORPASSWORD_IS_REQUIRED)
        return ctx.app.emit('error', error, ctx)
    }
    // 判断用户输入的是邮箱还是用户名
    if(username.indexOf('@') !== -1){
        const email = username
        const emailIslogined = await userService.emailIsLogin(email)
        if(!emailIslogined){
            const error = new Error(errorTypes.EMAIL_DOES_NOT_EXISTS)
            return ctx.app.emit('error',error,ctx)
        }else{
            const passwordIsCurrent = await authService.getpasswordByEmail(email,password)
            if(!passwordIsCurrent){
                const error = new Error(errorTypes.PASSWORD_IS_NOT_CURRENT)
                return ctx.app.emit('error',error,ctx)
            }
        }
    }else{
        const usernameIslogined = await userService.userIsLogin(username)
        //console.log('usernameIslogined: ',usernameIslogined);
        if(!usernameIslogined){
            const error = new Error(errorTypes.USER_DOES_NOT_EXISTS)
                return ctx.app.emit('error',error,ctx)
        }else{
            const passwordIsCurrent = await authService.getpasswordByUsername(username,password)
            //console.log('passwordIsCurrent',passwordIsCurrent);
            if(!passwordIsCurrent){
                const error = new Error(errorTypes.PASSWORD_IS_NOT_CURRENT)
                return ctx.app.emit('error',error,ctx)
            }
        }
    }
    const userMessage = await authService.getUserMessageByUsername(username)
    ctx.user = userMessage
    await next()
}

const verifyAuth = async (ctx,next)=>{
    console.log('验证授权的middleware');
    // 获取token
    const authorization = ctx.headers.authorization
    if(!authorization){
       
        const error = new Error(errorTypes.UNAUTHORIZATION)
        return ctx.app.emit('error',error,ctx)
    }
    const token = authorization.replace('Bearer ','')
    // 验证token
    try {
        const result = jwt.verify(token,PUBLIC_KEY,{
            algorithms:['RS256']
        })
        console.log('result',result);
        ctx.user = result
        await next()
    } catch (error) {
        console.log('发生错误');
        console.log(error);
        const err = new Error(errorTypes.UNAUTHORIZATION)
        return ctx.app.emit('error',err,ctx)
    }
}

const verifyPermission = (tableName)=>{
    return async (ctx,next)=>{
        console.log('验证权限的middleware');
        // 获取momentId和用户id
        
        const {id} = ctx.params;
        const {id:userId} = ctx.user
        //console.log(id,userId);
        // 查询是否具备权限
        try {
            
            const isPermission = await authService.checkResource(tableName,id,userId)
            //console.log(isPermission);
            if(!isPermission) throw new Error()
            await next()
           
        } catch (err) {
            const error = new Error(errorTypes.UNPERMISSION)
            return ctx.app.emit('error',error,ctx)
        }
        
        
    }
}
module.exports = {
    verifyLogin,verifyAuth,verifyPermission
}