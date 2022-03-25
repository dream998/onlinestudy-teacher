const Router = require('koa-router')
const {avatarHandler,pictureHandler,pictureResize,avatarResize, coverHandler, videoHandler, fileHandler} = require('../middleware/file.middleware')
const {verifyAuth} = require('../middleware/auth.middleware')
const {saveAvatarInfo,savePictureInfo,saveCoverInfo, sevaVideoInfo, saveFileInfo} = require('../controller/file.controller')
const fileRouter = new Router({prefix:'/upload'})

// 上传头像
fileRouter.post('/avatar',verifyAuth,avatarHandler,avatarResize,saveAvatarInfo)
// 上传课程封面
fileRouter.post('/cover/:courseid',verifyAuth,coverHandler,saveCoverInfo)
// 上传课程视频资源
fileRouter.post('/course/:subsectionId/video',verifyAuth, videoHandler, sevaVideoInfo)
// 上传课程文件资源
fileRouter.post('/course/:subsectionId/file',verifyAuth,fileHandler,saveFileInfo)

module.exports = fileRouter