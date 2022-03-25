const errorTypes = require('../constants/error-types')
    const errorHandler = (error, ctx) => {
        console.log(error.message);
        let status, message
    
        switch (error.message) {
            case errorTypes.NAME_ORPASSWORD_IS_REQUIRED:
                status = 200
                message = {
                    statusCode: 0,
                    message: "用户名或者密码不能为空"
                }
                break;
    
            case errorTypes.USER_ALREADY_EXISTS:
                status = 200
                message = {
                    statusCode: 1,
                    message: "用户名已经存在"
                }
                break;
            case errorTypes.USER_DOES_NOT_EXISTS:
                status = 200
                message = {
                    statusCode: 2,
                    message: "用户名不存在"
                }
                break;
            case errorTypes.PASSWORD_IS_NOT_CURRENT:
                status = 200
                message = {
                    statusCode: 3,
                    message: "密码错误"
                }
                break;
            case errorTypes.UNAUTHORIZATION:
                status = 200
                message = {
                    statusCode: 4,
                    message: "无效的token"
                }
                break;
            case errorTypes.UNPERMISSION:
                status = 200
                message = {
                    statusCode: 5,
                    message: "不具备操作权限"
                }
                break;
            case errorTypes.EMAIL_ALREADY_EXISTS:
                status = 200
                message = {
                    statusCode: 6,
                    message: "邮箱已经存在"
                }
                break;
            case errorTypes.EMAIL_DOES_NOT_EXISTS:
                status = 200
                message = {
                    statusCode: 7,
                    message: "邮箱不存在"
                }
                break;
            case errorTypes.INVITE_CODE_IS_ERROR:
                status = 200
                message = {
                    statusCode: 8,
                    message: "邀请码错误，禁止注册为管理员！"
                }
                break;
            default:
                status = 404
                message = 'NOT FOUND'
                break;
        }
        ctx.status = status
        ctx.body = message
    }
    
    module.exports = errorHandler