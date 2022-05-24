const connection = require('../app/database')
const courseService = require('../service/course.service')
//const {md5password} = require('../utils/password-handler')

class UserService {
    // 创建用户
    async create(user) {
        let insertResult = ''
        console.log(user);
        const { userKind, username, password, email } = user
        // 加密密码

        if (userKind === 'student') {
            const { school, college, intro, stuClass } = user
            const statement =
                `insert into users(user_name,
                                   user_password,
                                   user_identity,
                                   user_school,
                                   user_college,
                                   user_class,
                                   user_email,
                                   introduction)
                values(?,?,?,?,?,?,?,?)`
            const result = await connection.execute(statement, [username, password, 0, school, college, stuClass, email, intro])
            insertResult = result[0]
        } else if (userKind === 'teacher') {
            const { school, college, intro } = user
            const statement = `
                insert into users(
                    user_name,
                    user_password,
                    user_identity,
                    user_school,
                    user_college,
                    user_email,
                    introduction)
                values(?,?,?,?,?,?,?)
            `
            const result = await connection.execute(statement, [username, secretPassword, 1, school, college, email, intro])
            insertResult = result[0]
        } else if (userKind === 'admin') {
            const statement = `insert into users(user_name,user_password,user_identity,user_email) values(?,?,?,?)`
            const result = await connection.execute(statement, [username, secretPassword, 2, email])
            insertResult = result[0]
        }
        if (insertResult.affectedRows) {
            return "注册成功！"
        } else {
            return "注册失败！"
        }

    }
    // 用户名是否存在
    async userIsLogin(name) {
        const statement = `select user_name from users where user_name = ?`
        const [result] = await connection.execute(statement, [name])
        //console.log(name, result[0]);
        if (result[0] && result[0].user_name === name) {
            //console.log('存在');
            return true
        }
        return false
    }
    // 邮箱地址是否存在
    async emailIsLogin(email) {
        const statement = `select user_email from users where user_email = ?`
        const [result] = await connection.execute(statement, [email])
        //console.log(result[0]);
        if (result[0] && result[0].user_email === email) {
            return true
        }
        return false
    }

    async inviteCodeIsCurrent(inviteCode) {
        const statement = `select invite_code from users where user_identity = 3`
        const [result] = await connection.execute(statement)
        //console.log('邀请码',result[0]);
        if (result[0].invite_code === inviteCode) {
            return true
        }
        return false
    }

    async updateAvatarUrlById(userId, avatarUrl) {
        try {
            const statement = `update users set user_avator_url = ? where user_id = ?`;
            const [result] = await connection.execute(statement, [avatarUrl, userId])
            return result
        } catch (error) {
            console.log(error);
        }

    }
    async getStudentByCourseId(courseId) {
        try {
            const statement = `
                select 
                    user_id,
                    user_name,
                    user_school,
                    user_college, 
                    user_class, 
                    user_email 
                    from users 
                        where (
                            select student_id 
                            from choosecourses 
                            where course_id = ? AND choosecourses.student_id=users.user_id);`
            const [result] = await connection.execute(statement, [courseId])
            return result
        } catch (error) {
            console.log(error);
        }
    }

    async getUserInfoByUserId(userId) {
        try {
            const statement = `select 
                user_id,
                user_name,
                user_school,
                user_college, 
                user_class, 
                user_email,
                user_avatar_url,
                introduction 
              from users where user_id = ?`

            const [result] = await connection.execute(statement, [userId])
            return result[0]

        } catch (error) {
            console.log(error);
        }
    }

    async getNewMessages(userId){
        try {
            const userStatement = 'select commment_id from comments where user_id = ?'
            const [commentIds] = await connection.execute(userStatement,[userId])
            const result = []
            for(let i = 0; i < commentIds.length; i++){
                const commentStatement = 'select * from comments where parent_comment_id = ? and state = 0'
                const [newMes] =  await connection.execute(commentStatement,[commentIds[i].commment_id])
                if(newMes.length != 0){
                    result.push(...newMes)
                }
            }
            console.log(result);
            for(let i = 0; i < result.length; i++){
                const userStatement = `select user_id, user_avatar_url, user_name, createAt from users where user_id = ?`
                const [userMes] = await connection.execute(userStatement,[result[i].user_id])
                result[i].userMes = userMes[0]
            }
            return result

        } catch (error) {
            console.log(error);
        }
    }


}
module.exports = new UserService()