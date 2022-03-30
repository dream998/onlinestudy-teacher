const Router  = require('koa-router')
const { verifyAuth } = require('../middleware/auth.middleware')
const {create, 
    coverInfo, 
    videoInfo, 
    fileInfo, 
    labelInfo, 
    catalogInfo, 
    hotCourseInfo,
    choiceQuestionInfo,
    sutdyProcessInfo,
    judgeQuestionInfo,
    createJoinCourse,
    createSections,
    createSubsections, 
    createChoiceQuestions, 
    createJudgeQuestions,
    saveStudyProcess,
    saveAnswers} = require('../controller/course.controller')

const courseRouter = new Router({prefix:'/courses'})
// 课程基本信息接口
courseRouter.post('/base',verifyAuth,create)
// 课程章节接口
courseRouter.post('/:courseId/sections',verifyAuth,createSections)
// 课程小节接口
courseRouter.post('/:sectionId/subsections',verifyAuth,createSubsections)
// 获取标签
courseRouter.get('/label',  labelInfo)
// 获取课程封面接口
courseRouter.get('/:courseId/cover',coverInfo )
// 获取课程视频接口
courseRouter.get('/:subsectionId/video',videoInfo)
// 获取课程文件接口
courseRouter.get('/:subsectionId/file',fileInfo)
// 获取课程目录接口
courseRouter.get('/:courseId/catalog',catalogInfo)
// 上传小节选择题
courseRouter.post('/:subsectionId/choicequestions',verifyAuth, createChoiceQuestions)
// 获取小节选择题
courseRouter.get('/:subsectionId/choicequestions',verifyAuth, choiceQuestionInfo)
// 上传小节判断题
courseRouter.post('/:subsectionId/judgequestions',verifyAuth, createJudgeQuestions)
// 获取小节判断题
courseRouter.get('/:subsectionId/judgequestions',verifyAuth, judgeQuestionInfo)
// 获取最新课程信息
courseRouter.get('/newcourses',hotCourseInfo)
//加入课程
courseRouter.get('/:courseId/joincourse',verifyAuth, createJoinCourse)
// 保存学习进度
courseRouter.post('/:subsectionId/studyprocess', verifyAuth,saveStudyProcess)
// 保存答案
courseRouter.post('/:subsectionId/answers',verifyAuth,saveAnswers)
// 获取学习进度
courseRouter.get('/:subsectionId/studyprocess',verifyAuth,sutdyProcessInfo)
module.exports = courseRouter