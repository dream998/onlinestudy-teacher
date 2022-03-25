const service = require('../service/user.service')
const fileService = require('../service/file.service')
const fs = require('fs')

class UserController{
    async create(ctx,next){
        // 获取用户请求的参数
        const user = ctx.request.body
        // 查询参数
        const result = await service.create(user)
        // 返回数据
        ctx.body = result
    }
    async avatarInfo(ctx,next){
        const {userId} = ctx.params;
        const avatarInfo = await fileService.getAvatarByUserId(userId);
        // 提供图像信息
        ctx.response.set('content-type',avatarInfo.mimetype)
        ctx.body = fs.createReadStream('./uploads/avatar/'+avatarInfo.filename);    
    }
}
const userController = new UserController
module.exports = userController