const connection = require('../app/database')

class FileService {
    async createAvatar(filename, mimetype, size, userId) {
        const statement = `INSERT INTO avatar(filename,mimetype,size,user_id)  VALUES(?,?,?,?)`;
        const [result] = await connection.execute(statement, [filename, mimetype, size, userId]);
        return result;
    }
    async getAvatarByUserId(userId) {
        const statement = `select * from avatar where user_id = ?`
        const [result] = await connection.execute(statement, [userId])
        return result[0]
    }
    async getCoverByCourserId(courseId) {
        const statement = `select * from covers where course_id = ?`
        const [result] = await connection.execute(statement, [courseId])
        return result[0]
    }
    async getVideoBySubsectionId(subsectionId){
        const statement = `select * from videos where subsection_id = ?`
        const [result] = await connection.execute(statement, [subsectionId])
        return result[0]    
    }
    async getFileBysubsectionId(subsectionId){
        const statement = `select * from files where subsection_id = ?`
        const [result] = await connection.execute(statement, [subsectionId])
        console.log(result[0]);
        return result[0] 
    }
    async createFile(filename, mimetype, size, userId, momentId) {
        try {
            const statement = `INSERT INTO file(filename,mimetype,size,user_id,moment_id)  VALUES(?,?,?,?,?)`;
            const [result] = await connection.execute(statement, [filename, mimetype, size, userId, momentId]);
            return result;
        } catch (error) {
            console.log(error);
        }

    }
    async getFileByFilename(filename) {
        try {
            const statement = `select * from file where filename = ?`
            const [result] = await connection.execute(statement, [filename])
            return result[0]
        } catch (error) {
            console.log(error);
        }
    }

    

    async createCover(filename,mimetype,size,courseid) {
        try {
            const statement = `insert into covers(filename,mimetype,size,course_id) values(?,?,?,?)`
            const [result] = await connection.execute(statement,[filename,mimetype,size,courseid])
            return result
        } catch (error) {
            console.log(error);
        }
    }

    async createVideo(filename, mimetype, size, subsectionId) {
        try {
            const statement = `insert into videos(filename,mimetype,size,subsection_id) values(?,?,?,?)`
            const [result] = await connection.execute(statement,[filename,mimetype,size,subsectionId])
            return result
        } catch (error) {
            console.log(error);
        }
    }
    async createFile(filename, mimetype, size, subsectionId){
        try {
            const statement = `insert into files(filename,mimetype,size,subsection_id) values(?,?,?,?)`
            const [result] = await connection.execute(statement,[filename,mimetype,size,subsectionId])
            return result
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports = new FileService()