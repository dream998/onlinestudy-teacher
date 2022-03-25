const Multer = require('koa-multer')
const path = require('path')
const Jimp = require('jimp')
const { AVATAR_PATH, PICTURE_PATH, COVER_PATH ,VIDEO_PATH, FILE_PATH} = require('../constants/file-path')
const avatarUpload = Multer({
    dest: AVATAR_PATH
})

const avatarHandler = avatarUpload.single('avatar')


const pictureUpload = Multer({
    dest: PICTURE_PATH
})

const coverUpload = Multer({
    dest: COVER_PATH
})
const fileUpload = Multer({
    dest: FILE_PATH
})
const fileHandler = fileUpload.single('file')

const pictureHandler = pictureUpload.array('picture', 9)
const coverHandler = coverUpload.single('cover')

const videoUpload = Multer({
    dest: VIDEO_PATH
})
const videoHandler = videoUpload.single('video')

const pictureResize = async (ctx, next) => {
    // 1.获取所有的图像信息
    const files = ctx.req.files;
    // 2. 处理图像

    for (const file of files) {
        const destPath = path.join(file.destination, file.filename)
        Jimp.read(file.path).then(image => {
            image.resize(1280, Jimp.AUTO).write(`${destPath}-large`)
            image.resize(640, Jimp.AUTO).write(`${destPath}-middle`)
            image.resize(320, Jimp.AUTO).write(`${destPath}-small`)
        });

    }
    await next()
}
const avatarResize = async (ctx, next) => {
    // 1.获取所有的图像信息
    const file = ctx.req.file;
    // 2. 处理图像
    console.log(file);

    const destPath = path.join(file.destination, file.filename)
    Jimp.read(file.path).then(image => {
        
        image.resize(320, Jimp.AUTO).write(`${destPath}`)
    });


    await next()
}
module.exports = {
    avatarHandler,
    pictureHandler,
    coverHandler,
    pictureResize,
    avatarResize,
    videoHandler,
    fileHandler
}