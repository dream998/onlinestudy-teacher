const connection = require('../app/database')

class AuthService{
    async getpasswordByEmail(email,password){
        const statement = `select user_password from users where user_email = ?`
        const [result] = await connection.execute(statement,[email])
        if(result[0].user_password === password){
            return true
        }
        return false
    }

    async getpasswordByUsername(username,password){
        const statement = `select user_password from users where user_name = ?`
        const [result] = await connection.execute(statement,[username])
        if(result[0].user_password === password){
            return true
        }
        return false
    }

    async getUserMessageByUsername(username){
        const statement = `select * from users where user_name = ?`
        const [result] = await connection.execute(statement,[username])
        return result[0]
    }
}
module.exports = new AuthService()
