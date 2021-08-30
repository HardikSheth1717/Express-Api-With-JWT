const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('../config/auth.config');
const User = require('../models/user');
const Role = require('../models/role.model');
const UserSession = require('../models/usersession.model');

class AuthController {
    static userModel = new User();

    constructor() { }

    static signup = (request, response, next) => {
        const postedData = request.body;

        const roleModel = new Role();

        return roleModel.getRoleList().then(roles => {
            const role = roles.data.filter(x => x.Id === postedData.roleId);

            if (role[0].RoleName !== "Admin" && role[0].RoleName !== "User" && role[0].RoleName !== "Moderator") {
                return roleModel.getRoleByName("User").then(userRoles => {
                    roleId = userRoles.data[0].Id;

                    return this.userModel
                        .saveUser(
                            postedData.id,
                            postedData.firstName,
                            postedData.lastName,
                            postedData.age,
                            postedData.gender,
                            postedData.userName,
                            postedData.roleId,
                            postedData.password
                        ).then(data => {
                            return response.json(data);
                        }).catch(error => {
                            return response.json({
                                "status": false,
                                "id": 0
                            });
                        });
                })
                    .catch(error => {
                        return response.json({
                            "status": false,
                            "error": `Something went wrong. ${error.message}`
                        });
                    })
            } else {
                return this.userModel
                    .saveUser(
                        postedData.id,
                        postedData.firstName,
                        postedData.lastName,
                        postedData.age,
                        postedData.gender,
                        postedData.userName,
                        postedData.roleId,
                        postedData.password
                    ).then(data => {
                        return response.json(data);
                    }).catch(error => {
                        return response.json({
                            "status": false,
                            "id": 0
                        });
                    });
            }
        })
            .catch(error => {
                return response.json({
                    "status": false,
                    "error": `Something went wrong. ${error.message}`
                });
            })
    };

    static signin = (request, response, next) => {
        const postedData = request.body;

        return this.userModel.getUserByUserName(postedData.userName).then(users => {
            if (users.status && users.data.length > 0) {
                const user = users.data[0];

                const passwordIsValid = bcrypt.compareSync(postedData.password, user.Password);

                if (!passwordIsValid) {
                    return response.status(404).send({
                        status: false,
                        data: "Invalid username / password!"
                    });
                }

                const token = jwt.sign({ id: user.Id }, config.secret, {
                    expiresIn: config.jwtAccessTokenValidity
                });

                const authorities = [];

                const roleModel = new Role();

                return roleModel.getRoleDetails(user.RoleId).then(roles => {
                    const role = roles.data[0];
                    authorities.push(`ROLE_${role.RoleName}`);

                    const userSession = new UserSession();

                    return userSession.saveUserSession(0, user.Id).then(session => {
                        const sessionData = session.status ? session.data[0] : [];

                        return response.status(200).send({
                            status: true,
                            data: [{
                                id: user.Id,
                                firstName: user.FirstName,
                                lastName: user.LastName,
                                role: authorities,
                                accessToken: token,
                                refreshToken: sessionData.refreshToken,
                                expiryTime: sessionData.expiryTime
                            }]
                        });
                    }).catch(error => {
                        return response.json({
                            "status": false,
                            "error": `Something went wrong. ${error.message}`
                        });
                    })
                }).catch(error => {
                    return response.json({
                        "status": false,
                        "error": `Something went wrong. ${error.message}`
                    });
                })

            } else {
                return response.status(404).send({
                    status: false,
                    data: "User not found!"
                });
            }
        }).catch(error => {
            return response.json({
                "status": false,
                "error": `Something went wrong1. ${error.message}`
            });
        });
    };

    static renewAccessToken = (request, response, next) => {
        const refreshToken = request.body.refreshToken;
        const userSession = new UserSession();

        return userSession.getUserSessionByToken(refreshToken).then(tokens => {
            const tokenDetails = tokens.status ? tokens.data : [];

            if (tokenDetails.length > 0) {
                return userSession.checkRefreshTokenExpiry(tokenDetails[0].ExpiryTime).then(tokenExpired => {
                    if (!tokenExpired){
                        const newAccessToken = jwt.sign({ id: tokenDetails[0].UserId }, config.secret, {
                            expiresIn: config.jwtAccessTokenValidity
                        });

                        return response.status(200).send({
                            status: true,
                            data: {
                                accessToken: newAccessToken,
                                refreshToken: refreshToken
                            }
                        });
                    } else {
                        return userSession.deleteUserSession(tokenDetails[0].Id).then(deletedSession => {
                            return response.status(403).send({
                                status: false,
                                data: "Refresh token was expired. Please make a new signin request"
                            });
                        }).catch(error => {
                            return response.json({
                                "status": false,
                                "error": `Something went wrong. ${error.message}`
                            });
                        })
                    }
                }).catch(error => {
                    return response.json({
                        "status": false,
                        "error": `Something went wrong. ${error.message}`
                    });
                })
            } else {
                return response.status(404).send({
                    status: false,
                    data: tokenDetails.error
                });
            }
        }).catch(error => {
            return response.json({
                "status": false,
                "error": `Something went wrong. ${error.message}`
            });
        });
    };
}

module.exports = AuthController;