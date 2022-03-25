const fs = require('fs')

const courseService = require('../service/course.service')
const fileService = require('../service/file.service')

class CourseController {
    async create(ctx, next) {
        const { courseName, courseIntroduction, courseAnnouncement, courseKinds } = ctx.request.body
        //console.log(courseName, courseIntroduction, courseAnnouncement);
        const { user_id } = ctx.user
        //console.log(user_id);
        const result = await courseService.create(courseName, courseIntroduction, user_id, courseAnnouncement)
        const kindResult = await courseService.createKind(result.insertId,courseKinds)
        console.log('insertId是：',result.insertId);
        const courseMessage = await courseService.getCourseByCourseId(result.insertId)
        courseMessage.courseKinds = kindResult
        console.log("courseMessage是：",courseMessage);
        ctx.body = courseMessage
    }

    async coverInfo(ctx, next) {
        const { courseId } = ctx.params
        const coverInfo = await fileService.getCoverByCourserId(courseId)
        ctx.response.set('content-type', coverInfo.mimetype)
        ctx.body = fs.createReadStream('./uploads/cover/' + coverInfo.filename)
    }
    async fileInfo(ctx, next){
        const {subsectionId} = ctx.params
        const fileInfo = await fileService.getFileBysubsectionId(subsectionId)
        ctx.response.set('content-type', fileInfo.mimetype)
        ctx.body = fs.createReadStream('./uploads/file/' + fileInfo.filename)
    }
    async labelInfo(ctx, next){
        const labelInfo = await courseService.getLabels()
        ctx.body = labelInfo
    }

    async videoInfo(ctx, next){
        const subsectionId = ctx.params.subsectionId
        console.log(subsectionId);
        const videoInfo = await fileService.getVideoBySubsectionId(subsectionId)
        ctx.response.set('content-type', videoInfo.mimetype)
        ctx.body = fs.createReadStream('./uploads/video/' + videoInfo.filename)
    }

    async catalogInfo(ctx,next){
        const courseId = ctx.params.courseId
        let catalog = []
        const sections =  await courseService.getSectionsByCourseId(courseId)
        catalog = sections
        console.log('目录是',catalog);
        for(let i = 0; i < catalog.length; i++){
            const result = await courseService.getSubsectionsBySectionId(catalog[i].section_id)
            catalog[i].subsections = result
        }
        console.log(catalog);
        ctx.body =  catalog

    }

    async hotCourseInfo(ctx, next){
        const result = await courseService.getNewCourses()
        for(let i = 0; i < result.length; i++){
            const creatorInfo = await courseService.getCreatorInfo(result[i].course_creator)
            result[i].creatorInfo = creatorInfo
            
        }
        ctx.body = result
        
    }

    async createSections(ctx, next) {
        const sectionList = ctx.request.body.sectionList
        console.log(ctx.request.body);
        //const sectionListWithId = []
        console.log(sectionList);
        const courseId = ctx.params.courseId
        // const sectionListWithId = await sectionList.map(async (item, index) => {
        //     const result = await courseService.insertSection(item, index + 1, courseId)  
        //     console.log(result);        
        //     return result
        // })
        const sectionListWithId = []
        for(let i = 0; i < sectionList.length; i++){
            const result = await courseService.insertSection(sectionList[i], i + 1, courseId)  
            console.log(result);   
            sectionListWithId.push(result)     
        }
        console.log(sectionListWithId);
        ctx.body = sectionListWithId

    }

    async createChoiceQuestions(ctx, next){
        const {subsectionId} = ctx.params
        const choiceQuestionList = ctx.request.body
        //console.log(ctx.params);
        //console.log(ctx.request.body);
        //console.log('subsectionId是：'+subsectionId+'   choicequestionList是：'+choiceQuestionList);
        for(let i = 0; i < choiceQuestionList.length; i++){
            await courseService.createChoiceQuestion(choiceQuestionList[i], i+1,subsectionId)

        }
        ctx.body = "已成功上传选择题！"
    }

    async createJudgeQuestions(ctx, next){
        const {subsectionId} = ctx.params
        const judgeQuestionList = ctx.request.body
        console.log('subsectionId是：'+subsectionId+'   judgeQuestionList是'+judgeQuestionList);
        for(let i = 0; i < judgeQuestionList.length; i++){
            await courseService.createJudgeQuestion(judgeQuestionList[i], i+1,subsectionId)

        }
        ctx.body = "已成功上传判断题！"
    }
    async createSubsections(ctx,next){
        const sectionId = ctx.params.sectionId
        const subsectionList = ctx.request.body.subsectionList
        const subsectionListWithId = []
        for(let i = 0; i < subsectionList.length; i++){
            const result = await courseService.insertSubsection(subsectionList[i],i+1,sectionId)
            subsectionListWithId.push(result)
        }
        ctx.body = subsectionListWithId
    }

    

}


module.exports = new CourseController()