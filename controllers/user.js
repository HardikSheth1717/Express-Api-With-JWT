const User = require('../models/user');

class UserController {
    static userModel = new User();

    constructor() { }

    static getUserList = (request, response, next) => {
        return this.userModel.getUserList().then(data => {
            response.json(data);
            return response.end();
        });
    }

    static getUserDetails = (request, response, next) => {
        const userId = parseInt(request.params.id);

        return this.userModel.getUserDetails(userId).then(data => {
            if (data.status) {
                return response.json({
                    status: true,
                    data: data.data.length > 0 ? data.data : []
                });
            } else {
                return response.json(data);
            }
        });
    }

    static saveUser = (request, response, next) => {
        const postedData = request.body;

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

    static deleteUser = (request, response, next) => {
        const userId = parseInt(request.params.id);

        return this.userModel.deleteUser(userId).then(data => {
            return response.json(data);
        });
    }
}

module.exports = UserController;