const connection = require('../app/database')
class CourseService {

    async create(courseName, courseIntroduction, courseCreator, courseAnnouncement) {
        try {
            const statement = `insert into courses(course_name,course_introduction,course_creator,course_announcement) values(?,?,?,?)`
            const [result] = await connection.execute(statement, [courseName, courseIntroduction, courseCreator, courseAnnouncement])
            return result
        } catch (error) {
            console.log(error);
        }
    }

    async createChoiceQuestion(item, index, subsectionId) {
        const statement = `insert into choiceQuestions(
                                question_content,
                                question_item_a,
                                question_item_b,
                                question_item_c,
                                question_item_d,
                                question_answer,
                                question_order,
                                subsection_id)
                                values(?,?,?,?,?,?,?,?)`
        const [result] = await connection.execute(statement,
            [item.questionContent,
            item.choiceA,
            item.choiceB,
            item.choiceC,
            item.choiceD,
            item.answer,
                index,
                subsectionId])

        console.log(result);
        return result

    }

    async createKind(courseId, courseKinds) {
        const kinds = []
        for (let i = 0; i < courseKinds.length; i++) {
            const getIdStatement = 'select kind_id, kind_name from kinds where kind_name = ?'
            const [result] = await connection.execute(getIdStatement, [courseKinds[i]])
            console.log(result[0]);
            const createCourseKindStatement = `insert into coursekinds(course_id, kind_id, kind_name) values(?,?,?)`
            const insertResult = await connection.execute(createCourseKindStatement, [courseId, result[0].kind_id, result[0].kind_name])
            console.log(insertResult);
            kinds.push({ kindId: result[0].kind_id, kindName: courseKinds[i] })

        }
        return kinds

    }


    async createJudgeQuestion(item, index, subsectionId) {
        const answer = item.answer === 'current' ? 1 : 0
        const statement = `insert into judgequestions(question_content,question_answer,subsection_id,question_order)
                          values(?,?,?,?)`
        const [result] = await connection.execute(statement, [item.questionContent, answer, subsectionId, index])
        console.log(result);
        return result
    }

    async getSectionsByCourseId(courseId) {
        const statement = `select * from sections where course_id = ?`
        const [result] = await connection.execute(statement, [courseId])
        //console.log(result);
        return result
    }
    async getCourseByCourseId(courseId) {
        console.log('courseId是', courseId);
        const statement = `select *  from courses where course_id = ?`
        const [result] = await connection.execute(statement, [courseId])
        //console.log(result[0]);
        return result[0]
    }
    async getSubsectionsBySectionId(sectionId) {
        try {
            const statement = `select * from subsections where section_id = ?`
            const [result] = await connection.execute(statement, [sectionId])
            console.log(result);
            return result
        } catch (error) {
            console.log(error);
        }
    }

    async updateCoverByCourseId(courseId, coverUrl) {

        try {
            console.log(coverUrl, courseId);
            const statement = `update courses set course_cover_url = ? where course_id = ?`
            const [result] = await connection.execute(statement, [coverUrl, courseId])
            console.log(result);
            return result
        } catch (error) {
            console.log(error);
        }
    }

    async updateVideoBysubsectionId(subsectionId, videoUrl) {
        try {
            const statement = `update subsections set subsection_video_url = ? where subsection_id = ?`
            const [result] = await connection.execute(statement, [videoUrl, subsectionId])
            return result
        } catch (error) {
            console.log(error);
        }
    }

    async updateFileBySubsectionId(subsectionId, fileUrl) {
        console.log(subsectionId, fileUrl);
        try {
            const statement = `update subsections set subsection_file_url = ? where subsection_id = ?`
            const [result] = await connection.execute(statement, [fileUrl, subsectionId])
            return result
        } catch (error) {
            console.log(error);
        }
    }

    async insertSection(item, index, courseId) {
        try {
            const statement = `insert into sections(section_name,section_order,course_id) values(?,?,?)`
            const [result] = await connection.execute(statement, [item, index, courseId])
            //console.log(result);
            return {
                sectionId: result.insertId,
                sectionName: item,
                sectionOrder: index,
                courseId: courseId
            }
        } catch (error) {
            console.log(error);
        }
    }

    async insertSubsection(item, index, sectionId) {
        const statement = `insert into subsections(subsection_name,subsection_order,section_id) values(?,?,?)`
        const [result] = await connection.execute(statement, [item, index, sectionId])
        return {
            subsectionId: result.insertId,
            subsectionName: item,
            subsectionOrder: index,
            sectionId
        }
    }

    async getLabels() {
        const statement = 'select kind_name from kinds '
        const [result] = await connection.execute(statement)
        console.log(result);
        return result
    }
    async getNewCourses() {
        const statement = `SELECT * FROM courses ORDER BY createAt DESC LIMIT 0,3;`
        const [result] = await connection.execute(statement)
        console.log(result);
        return result
    }
    async getCreatorInfo(id) {
        const statement = `select user_id,user_name,user_school,user_college,user_class,user_avatar_url,introduction from users where user_id = ?`
        const [result] = await connection.execute(statement, [id])
        console.log(result[0]);
        return result[0]
    }

    async getChoiceQuestions(subsectionId) {
        const statement = `select * from choicequestions where subsection_id = ?`
        const [result] = await connection.execute(statement, [subsectionId])
        return result
    }

    async getJudgeQuestions(subsectionId) {
        const statement = `select * from judgequestions where subsection_id = ?`
        const [result] = await connection.execute(statement, [subsectionId])
        return result
    }

    async createJoinCourse(courseId, userId) {
        try {
            const statement = 'insert into choosecourses(student_id, course_id) values(?,?)'
            const [result] = await connection.execute(statement, [userId, courseId])
            return result
        } catch (error) {
            console.log(error);
        }

    }

    async searchProcess(userId, subsectionId) {
        const statement = `select * from studyprocess where student_id = ? and subsection_id = ?`
        const [result] = await connection.execute(statement, [userId, subsectionId])
        //console.log('查询结果：',result);
        return result
    }

    async createStudyProcess(userId, subsectionId, process) {
        try {

            const { videoProcess, videoFinished, fileFinished, testFinished } = process
            const statement = `insert into studyprocess(student_id,subsection_id,video_process,video_finished,file_finished,test_finished) values(?,?,?,?,?,?)`
            const [result] = await connection.execute(statement, [userId, subsectionId, videoProcess, videoFinished, fileFinished, testFinished])
            console.log(result);
            return result

        } catch (error) {
            console.log(error);
        }
    }

    async updateProcess(userId, subsectionId, process) {
        try {
            const { videoProcess, videoFinished, fileFinished, testFinished } = process
            const statement = `update studyprocess set video_process = ?,video_finished = ?, file_finished = ?, test_finished = ? where student_id = ? and subsection_id = ?`
            const [result] = await connection.execute(statement, [videoProcess, videoFinished, fileFinished, testFinished, userId, subsectionId])
            return result
        } catch (error) {
            console.log(error);
        }
    }

    async createChoiceAnswer(answers, studentId, subsectionId) {

        for (let i = 0; i < answers.length; i++) {
            //console.log('这是第'+i+'次插入选择答案',answers[i].answer, answers.length);
            const searchStatement = `select * from choiceanswers where question_id = ?`
            const [result] = await connection.execute(searchStatement, [answers[i].questionId])
            if (result.length === 0) {
                const statement = `insert into choiceanswers(student_id,subsection_id,student_answer,question_id) values(?,?,?,?)`
                await connection.execute(statement, [studentId, subsectionId, answers[i].answer, answers[i].questionId])
            }


        }
    }

    async createJudgeAnswer(answers, studentId, subsectionId) {
        for (let i = 0; i < answers.length; i++) {
            //console.log('这是第'+i+'次插入判断答案',answers[i].answer);
            const searchStatement = `select * from judgeanswers where question_id = ?`
            const [result] = await connection.execute(searchStatement, [answers[i].questionId])
            if (result.length === 0) {
                const statement = `insert into judgeanswers(student_id,subsection_id,student_answer,question_id) values(?,?,?,?)`
                await connection.execute(statement, [studentId, subsectionId, answers[i].answer, answers[i].questionId])
            }

        }
    }

    // 获取选课信息
    async getChoiceCourseInfo(courseId, userId) {
        const statement = `select * from choosecourses where student_id = ? and course_id = ?`
        const [result] = await connection.execute(statement, [userId, courseId])
        console.log(result);
        return result
    }

    // 根据获取用户id获取选课课程
    async getcoursesByUserid(userId) {
        const statement = `select * from choosecourses where student_id = ? `
        const [result] = await connection.execute(statement, [userId])
        return result
    }
    // 根据创建者id获取课程
    async getcoursesByCreatorId(userId) {
        const statement = `select * from courses where course_creator = ?`
        const [result] = await connection.execute(statement, [userId])
        return result
    }
    // 获取选择题答案
    async getChoiceAnswer(questionId) {
        const statement = `select * from choiceanswers where question_id = ?`
        const [result] = await connection.execute(statement, [questionId])
        console.log(result);
        return result[0]
    }

    async getJudegeAnswer(questionId) {
        const statement = `select * from judgeanswers where question_id = ?`
        const [result] = await connection.execute(statement, [questionId])
        return result[0]
    }

    //创建评论 
    async createComment(commentContent, subsectionId, courseId, userId, parentCommentId,userName) {

        if (parentCommentId) {
            const statement = `
                insert into comments(comment_content,user_id,subsection_id,course_id,parent_comment_id, state,user_name)
                values(?,?,?,?,?,?,?)
            `
            const [result] = await connection.execute(statement, [commentContent, userId, subsectionId, courseId, parentCommentId,0,userName])
            return result
        } else {
            const statement = `
                insert into comments(comment_content,user_id,subsection_id,course_id, state,user_name)
                values(?,?,?,?,?,?)
            `
            const [result] = await connection.execute(statement, [commentContent, userId, subsectionId, courseId,0,userName])
            return result
        }


    }
    // 根据小节id获取评论
    async getCommentsBySubsesctionId(subsectionId){
        const statement = `select * from comments where subsection_id = ?`
        const [result] = await connection.execute(statement, [subsectionId])
        return result
    }

    // 根据课程id获取评论
    async getAllCommentsByCourseId(courseId){
        const statement = `select * from comments where course_id = ?`
        const  [result] = await connection.execute(statement, [courseId])
        return result
    }

    // 获取学生选择题答案
    async getStudentChoiceAnswer(questionId, studentId){
        const statement = `select student_answer from choiceanswers where student_id = ? and question_id = ?`
        const [result] = await connection.execute(statement,[studentId, questionId])
        return result[0]
    }
    // 获取学生判断题答案
    async getStudentJudgeAnswer(questionId, studentId){
        const statement = `select student_answer from judgeanswers where student_id = ? and question_id = ?`
        const [result] = await connection.execute(statement,[studentId, questionId])
        return result[0]
    }
    // 更新评论状态
    async updataCommentState(commentId){
        const statement = 'update comments set state = ? where commment_id = ?'
        const result = await connection.execute(statement,[1,commentId])
        return result
    }

    // 创建课程预警
    async createWarning(warning){
        const statement = 'insert into warnings(courseId, studentId,state, courseName) values(?,?,?,?)'
        const [result] = await connection.execute(statement,[warning.courseId, warning.studentId, 0, warning.courseName])
        return result
    }

    // 获取课程预警
    async getWarning(userId){
        const statement = 'select * from warnings where studentId = ? and state = ?'
        const [result] = await connection.execute(statement,[userId,0])
        return result
    }
    // 更新课程预警state
    async updateWarningState(userId){
        const statement = 'update warnings set state = ? where studentId = ?'
        const [result] = await connection.execute(statement,[1,userId])
        return result
    }
    // 保存分享
    async createShare(userId, userName, courseId, title, content){
        const statement = 'insert into shares(title,content,authorId,authorName,courseId) values(?,?,?,?,?)'
        const [result] = await connection.execute(statement, [title,content,userId,userName,courseId])
        return result

    }
    // 获取分享
    async getShares(courseId){
        const statement = 'select * from shares where courseId = ?'
        const [result] = await connection.execute(statement, [courseId])
        return result 
    }

}
module.exports = new CourseService()