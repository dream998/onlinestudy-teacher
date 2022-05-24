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
    createdCoursesInfo,
    choiceAnswerInfo,
    judgeAnswerInfo,
    myCourseInfo,
    choiceCourseInfo,
    allStudyProcessInfo,
    createJoinCourse,
    createSections,
    createSubsections, 
    createChoiceQuestions, 
    createJudgeQuestions,
    saveStudyProcess,
    createComment,
    commentInfo,
    allCommentInfo,
    allTestInfo,
    updataCommentState,
    createWarning,
    getWarning,
    updateWarningState,
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
// 获取选择题答案
courseRouter.get('/:questionId/choiceanswer',verifyAuth,choiceAnswerInfo)
// 获取判断题答案
courseRouter.get('/:questionId/judgeanswer',verifyAuth,judgeAnswerInfo)
// 获取学习进度
courseRouter.get('/:subsectionId/studyprocess',verifyAuth,sutdyProcessInfo)
// 获取选课信息
courseRouter.get('/:courseId/choicecourse',verifyAuth,choiceCourseInfo)
// 获取加入的课程
courseRouter.get('/mycourses',verifyAuth,myCourseInfo)
// 获取创建的课程
courseRouter.get('/createdcourses', verifyAuth, createdCoursesInfo)
// 获取所有学习进度
courseRouter.post('/allstudyprocess',verifyAuth, allStudyProcessInfo)
// 获取所有小节测试题
courseRouter.post('/alltest',verifyAuth,allTestInfo)
// 发表评论
courseRouter.post('/:subsectionId/comment',verifyAuth,createComment)
// 根据小节id获取评论
courseRouter.get('/:subsectionId/comment',commentInfo)
// 根据课程id获取评论
courseRouter.get('/:courseId/allcomments',allCommentInfo)
// 更新评论状态
courseRouter.post('/updatacommentstate',updataCommentState)
// 创建课程预警
courseRouter.post('/coursewarning',createWarning)
// 获取课程预警
courseRouter.get('/coursewarning',verifyAuth, getWarning)
// 更新课程预警state
courseRouter.get('/updatewarningstate',verifyAuth,updateWarningState)
module.exports = courseRouter