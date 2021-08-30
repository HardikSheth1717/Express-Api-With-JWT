const jwt = require('jsonwebtoken');

const config = require('../config/auth.config');
const authQuery = require('../data/auth.query');
const validator = require('../validators/validator');

const { TokenExpiredError } = jwt;

const catchTokenException = (error, response) => {
    if (error instanceof TokenExpiredError){
        response.status(401).send({
           status: false,
           data: "Unauthorized! Access token was expired!"
        });
    } else {
        return response.status(401).send({
            status: false,
            data: "Unauthorized!"
        });
    }
};

verifyToken = (request, response, next) => {
    const token = request.headers["x-access-token"];

    if (!token) {
        return response.status(403).send({
            status: false,
            data: "Token not provided!"
        });
    }

    jwt.verify(token,config.secret, (error, decoded) => {
        if (error) {
            return catchTokenException(error, response);
        }

        request.userId = decoded.id;
        next();
    })
};

isAdmin = (request, response, next) => {
    const userId = request.userId;

    const errors = validator.NumberValidator("userId", userId, true);

    if (errors.length > 0) {
        return response.status(200).send({
            status: false,
            error: errors
        })
    }
    else {
        return authQuery.checkUserRole(userId).then(users => {
            if (users && users.length > 0) {
                if (users[0].RoleName === "Admin") {
                    next();
                    return;
                }

                return response.status(403).send({
                    status: false,
                    data: "Require Admin role."
                });
            } else {
                return response.status(403).send({
                    status: false,
                    data: "Require Admin role."
                });
            }
        }).catch(error => {
            return response.status(200).send({
                status: false,
                data: `Something went wrong. - ${error}`
            });
        })
    }
};

isModerator = (request, response, next) => {
    const userId = request.userId;

    const errors = validator.NumberValidator("userId", userId, true);

    if (errors.length > 0) {
        return response.status(200).send({
            status: false,
            error: errors
        })
    }
    else {
        return authQuery.checkUserRole(userId).then(users => {
            console.log(users);
            if (users && users.length > 0) {
                if (users[0].RoleName === "Moderator") {
                    next();
                    return;
                }

                return response.status(403).send({
                    status: false,
                    data: "Require Moderator role."
                });
            } else {
                return response.status(403).send({
                    status: false,
                    data: "Require Moderator role."
                });
            }
        }).catch(error => {
            return response.status(200).send({
                status: false,
                data: `Something went wrong. - ${error}`
            });
        })
    }
};

isModeratorOrAdmin = (request, response, next) => {
    const userId = request.userId;

    const errors = validator.NumberValidator("userId", userId, true);

    if (errors.length > 0) {
        return response.status(200).send({
            status: false,
            error: errors
        })
    }
    else {
        return authQuery.checkUserRole(userId).then(users => {
            if (users && users.length > 0) {
                if (users[0].RoleName === "Admin" || users[0].RoleName === "Moderator") {
                    next();
                    return;
                }

                return response.status(403).send({
                    status: false,
                    data: "Require Moderator or Admin role."
                });
            } else {
                return response.status(403).send({
                    status: false,
                    data: "Require Moderator or Admin role."
                });
            }
        }).catch(error => {
            return response.status(200).send({
                status: false,
                data: `Something went wrong. - ${error}`
            });
        })
    }
};

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isModerator: isModerator,
    isModeratorOrAdmin: isModeratorOrAdmin
};

module.exports = authJwt;