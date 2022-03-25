const jwt = require('jsonwebtoken')

const {PRIVATE_KEY} = require('../app/config')
class AuthController{
    async login(ctx,next){
        const {user_id, user_name,user_email,user_school,user_college,user_class,introduction,user_avator_url} = ctx.user
        const token = jwt.sign({user_id,user_name},PRIVATE_KEY,{
            expiresIn: 60*60*24,
            algorithm: 'RS256'
        })
        ctx.body = {
            userId:user_id,
            username:user_name,
            userEmail:user_email,
            userSchool:user_school,
            userCollege:user_college,
            userClass:user_class,
            userIntro:introduction,
            userAvatar:user_avator_url,
            token
        }
    }

    async success(ctx,next){
        ctx.body = '授权成功'
    }
}

module.exports = new AuthController()