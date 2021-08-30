const Role = require('../models/role.model');

class RoleController {
    static roleModel = new Role();

    constructor() { }

    static getRoleList = (request, response, next) => {
        return this.roleModel.getRoleList().then(data => {
            response.json(data);
            return response.end();
        });
    }

    static getRoleDetails = (request, response, next) => {
        const roleId = parseInt(request.params.id);

        return this.roleModel.getRoleDetails(roleId).then(data => {
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

    static saveRole = (request, response, next) => {
        const postedData = request.body;

        return this.roleModel
            .saveRole(
                postedData.id,
                postedData.roleName
            ).then(data => {
                return response.json(data);
            }).catch(error => {
                return response.json({
                    "status": false,
                    "id": 0
                });
            });
    }

    static deleteRole = (request, response, next) => {
        const roleId = parseInt(request.params.id);

        return this.roleModel.deleteRole(roleId).then(data => {
            return response.json(data);
        });
    }
}

module.exports = RoleController;