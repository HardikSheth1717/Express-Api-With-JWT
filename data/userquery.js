const sqlfunctions = require('../helpers/sqlfunctions');

class UserQuery {
    constructor() {
    }

    getUserList = async () => {
        return await sqlfunctions.Get({
            table: "users",
            columns: ['*']
        });
    }

    getUserDetails = async (id) => {
        return await sqlfunctions.GetById({
            table: "users",
            columns: ['*'],
            keyName: "Id",
            keyValue: id
        });
    }

    getUserByUserName = async (userName) => {
        return await sqlfunctions.Get({
            table: "users",
            columns: ['*'],
            where: {
                UserName: userName
            }
        });
    }

    saveUser = async (id, firstName, lastName, age, gender, userName, roleId, password) => {
        if (parseInt(id) === 0) {
            return await sqlfunctions.Create({
                table: "users",
                data: {
                    FirstName: firstName,
                    LastName: lastName,
                    Age: age,
                    Gender: gender,
                    UserName: userName,
                    RoleId: roleId,
                    Password: password
                }
            });
        } else {
            return await sqlfunctions.Update({
                table: "users",
                data: {
                    FirstName: firstName,
                    LastName: lastName,
                    Age: age,
                    Gender: gender,
                    UserName: userName,
                    RoleId: roleId
                },
                keyName: "Id",
                keyValue: id
            });
        }
    }

    deleteUser = async (id) => {
        return await sqlfunctions.Delete({
            table: "users",
            keyName: "Id",
            keyValue: id
        });
    }
}

module.exports = UserQuery;