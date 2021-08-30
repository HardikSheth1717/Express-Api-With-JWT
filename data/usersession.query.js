const sqlfunctions = require('../helpers/sqlfunctions');

class UserSessionQuery {
    constructor() {
    }

    getUserSessionList = async () => {
        return await sqlfunctions.Get({
            table: "usersession",
            columns: ['*']
        });
    }

    getUserSessionDetails = async (id) => {
        return await sqlfunctions.GetById({
            table: "usersession",
            columns: ['*'],
            keyName: "Id",
            keyValue: id
        });
    }

    getUserSessionByToken = async (refreshToken) => {
        return await sqlfunctions.Get({
            table: "usersession",
            columns: ['*'],
            where: {
                RefreshToken: refreshToken
            }
        });
    }

    saveUserSession = async (id, userId, refreshToken, expiryTime) => {
        if (parseInt(id) === 0) {
            return await sqlfunctions.Create({
                table: "usersession",
                data: {
                    UserId: userId,
                    RefreshToken: refreshToken,
                    ExpiryTime: expiryTime
                }
            });
        } else {
            return await sqlfunctions.Update({
                table: "usersession",
                data: {
                    UserId: userId,
                    RefreshToken: refreshToken,
                    ExpiryTime: expiryTime
                },
                keyName: "Id",
                keyValue: id
            });
        }
    }

    deleteUserSession = async (id) => {
        return await sqlfunctions.Delete({
            table: "usersession",
            keyName: "Id",
            keyValue: id
        });
    }
}

module.exports = UserSessionQuery;