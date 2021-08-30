const sqlfunctions = require('../helpers/sqlfunctions');

class AuthQuery {
    constructor() {
    }

    static getDataByUserName = async (userName) => {
        return await sqlfunctions.Get({
            table: "users",
            columns: ['*'],
            where: {
                UserName: userName
            }
        });
    }

    static checkUserRole = async (id) => {
        return await sqlfunctions.Execute(`
            SELECT R.RoleName
            FROM users U
            INNER JOIN roles R ON U.RoleId = R.Id
            WHERE U.Id = ?
        `, [id]);
    }
}

module.exports = AuthQuery;