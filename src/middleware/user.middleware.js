const errorTypes = require('../constants/error-types')
const { userIsLogin, emailIsLogin,inviteCodeIsCurrent, getpasswordByEmail,getpasswordByUsername } = require('../service/user.service')
const md5password = require('../utils/password-handler')
// 验证用户信息
const verifyUser = async(ctx,next)=>{
    // 获取用户名和密码
    //console.log(ctx.request);
    const {username,password,email} = ctx.request.body
    //console.log('打印',username,password,email);
    if(!username||!password){
        const error = new Error(errorTypes.NAME_ORPASSWORD_IS_REQUIRED)
        return ctx.app.emit('error',error,ctx)
    }

    // 判断用户名是否注册过
    const usernameIslogined = await userIsLogin(username)
    if(usernameIslogined){
        const error = new Error(errorTypes.USER_ALREADY_EXISTS)
        return ctx.app.emit('error',error,ctx)
    }
    // 判断邮箱是否注册过
    const emailIslogined = await emailIsLogin(email)
    if(emailIslogined){
        const error = new Error(errorTypes.EMAIL_ALREADY_EXISTS)
        return ctx.app.emit('error',error,ctx)
    }
    
    await next()
    
}

// const verifyLogin = async(ctx,next)=>{
//     const {username,password} = ctx.request.body
//     if(username.indexOf('@') !== -1){
//         const email = username
//         const emailIslogined = await emailIsLogin(email)
//         if(!emailIslogined){
//             const error = new Error(errorTypes.EMAIL_DOES_NOT_EXISTS)
//             return ctx.app.emit('error',error,ctx)
//         }else{
//             const passwordIsCurrent = await getpasswordByEmail(email,password)
//             if(!passwordIsCurrent){
//                 const error = new Error(errorTypes.PASSWORD_IS_NOT_CURRENT)
//                 return ctx.app.emit('error',error,ctx)
//             }
//         }
//     }else{
//         const usernameIslogined = await userIsLogin(username)
//         if(!usernameIslogined){
//             const error = new Error(errorTypes.USER_DOES_NOT_EXISTS)
//                 return ctx.app.emit('error',error,ctx)
//         }else{
//             const passwordIsCurrent = await getpasswordByUsername(username,password)
//             if(!passwordIsCurrent){
//                 const error = new Error(errorTypes.PASSWORD_IS_NOT_CURRENT)
//                 return ctx.app.emit('error',error,ctx)
//             }
//         }
//     }
// }
// 验证邀请码是否正确
const verifyAdmin = async(ctx,next)=>{
    const {userKind,inviteCode} = ctx.request.body
    if(userKind === 'admin'){
        const inviteCodeCurrent = await inviteCodeIsCurrent(inviteCode)
        if(!inviteCodeCurrent){
            const error = new Error(errorTypes.INVITE_CODE_IS_ERROR)
            return ctx.app.emit('error',error,ctx)
        }
    }
    await next()
}
// 加密密码
const handlerPassword = async(ctx,next)=>{
    const {password} = ctx.request.body
    ctx.request.body.password = md5password(password)
    //console.log(ctx.request.body.password);

    await next()

}

module.exports = {
    verifyUser,
    verifyAdmin,
    handlerPassword
}