const fileService = require('../service/file.service')
const userService = require('../service/user.service')
const courseService = require('../service/course.service')
const { APP_HOST, APP_PORT } = require('../app/config')
class FileController {
    async saveAvatarInfo(ctx, next) {
        const { mimetype, filename, size } = ctx.req.file
        console.log("token解密信息");
        console.log(ctx.user);
        const { user_id: id } = ctx.user
        console.log(id);
        const result = await fileService.createAvatar(filename, mimetype, size, id)
        // 2.将图像信息保存在服务器中
        const avatarUrl = `${APP_HOST}:${APP_PORT}/users/${id}/avatar`;
        await userService.updateAvatarUrlById(id, avatarUrl)
        ctx.body = '上传头像成功';

    }
    async saveFileInfo(ctx, next){
        try {
            const { mimetype, filename, size } = ctx.req.file
            const subsectionId = ctx.params.subsectionId
            const result = await fileService.createFile(filename, mimetype, size, subsectionId)
            const fileUrl = `${APP_HOST}:${APP_PORT}/courses/${subsectionId}/file`;
            await courseService.updateFileBySubsectionId(subsectionId, fileUrl)
            
            ctx.body = '上传文件成功'
        } catch (error) {
            console.log(error);
        }
    }

    async savePictureInfo(ctx, next) {
        // 1.获取图像信息
        const files = ctx.req.files;
        const { id } = ctx.user
        const { momentId } = ctx.query

        // 2. 将文件信息保存在数据库中
        for (const file of files) {
            const { mimetype, filename, size } = file;
            await fileService.createFile(filename, mimetype, size, id, momentId)
        }
        ctx.body = '动态配图上传完成'
    }

    async saveCoverInfo(ctx, nect) {
        try {
            const { mimetype, filename, size } = ctx.req.file
           // console.log(mimetype, filename, size);
            const courseid = ctx.params.courseid
            //console.log(courseid);
            const result = await fileService.createCover(filename, mimetype, size, courseid)
            // 2.将图像信息保存在服务器中
            const coverUrl = `${APP_HOST}:${APP_PORT}/courses/${courseid}/cover`;
            await courseService.updateCoverByCourseId(courseid, coverUrl)
            ctx.body = {
                message: "上传成功",
                coverUrl
            };
        } catch (error) {
            console.log(error);
        }
    }

    async sevaVideoInfo(ctx,next){
        try {
            const { mimetype, filename, size } = ctx.req.file
            const subsectionId = ctx.params.subsectionId
            const result = await fileService.createVideo(filename, mimetype, size, subsectionId)
            const videoUrl = `${APP_HOST}:${APP_PORT}/courses/${subsectionId}/video`;
            await courseService.updateVideoBysubsectionId(subsectionId, videoUrl)
            ctx.body = '上传视频成功'
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new FileController()