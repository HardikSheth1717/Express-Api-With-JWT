const { v4: uuidv4 } = require('uuid');

const UserSessionQuery = require('../data/usersession.query');
const validator = require('../validators/validator');
const authConfig = require('../config/auth.config');

class UserSession {
    constructor() {
        this.usersessionQuery = new UserSessionQuery();
    }

    getUserSessionList = async () => {
        const list = await this.usersessionQuery.getUserSessionList();
        return {
            status: true,
            data: list
        }
    }

    getUserSessionDetails = async (id) => {
        const errors = validator.NumberValidator("id", id, true);

        if (errors.length > 0) {
            return {
                status: false,
                error: errors
            }
        }
        else {
            const list = await this.usersessionQuery.getUserSessionDetails(id);

            return {
                status: true,
                data: list
            }
        }
    }

    getUserSessionByToken = async (refreshToken) => {
        const errors = validator.StringValidator("refreshToken", refreshToken, true, "text", 10, 100);

        if (errors.length > 0) {
            return {
                status: false,
                error: errors
            }
        }
        else {
            const list = await this.usersessionQuery.getUserSessionByToken(refreshToken);

            return {
                status: true,
                data: list
            }
        }
    }

    saveUserSession = async (id, userId) => {
        const errors = validator.NumberValidator("userId", userId, true);

        if (errors.length > 0) {
            return {
                status: false,
                error: errors
            }
        }
        else {
            const refreshToken = uuidv4();
            let expiryTime = new Date();

            expiryTime.setSeconds(new Date().getSeconds() + authConfig.jwtRefreshTokenValidity);

            const newId = await this.usersessionQuery.saveUserSession(
                id, userId, refreshToken, expiryTime.getTime());

            return {
                status: true,
                data: [{
                    id: newId,
                    userId: userId,
                    refreshToken: refreshToken,
                    expiryTime: new Date(expiryTime.getTime())
                }]
            }
        }
    }

    deleteUserSession = async (id) => {
        const errors = validator.NumberValidator("id", id, true);

        if (errors.length > 0) {
            return {
                status: false,
                error: errors
            }
        }
        else {
            const deleteId = await this.usersessionQuery.deleteUserSession(id);

            return {
                status: true,
                data: deleteId
            }
        }
    }

    checkRefreshTokenExpiry = async (tokenExpiryTime) => {
        return new Date(tokenExpiryTime) < new Date();
    }
}

module.exports = UserSession;