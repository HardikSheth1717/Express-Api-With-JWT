const RoleQuery = require('../data/role.query');
const validator = require('../validators/validator');

class Role {
    constructor() {
        this.roleQuery = new RoleQuery();
    }

    getRoleList = async () => {
        const list = await this.roleQuery.getRoleList();
        return {
            status: true,
            data: list
        }
    }

    getRoleDetails = async (id) => {
        const errors = validator.NumberValidator("id", id, true);

        if (errors.length > 0) {
            return {
                status: false,
                error: errors
            }
        } 
        else {
            const list = await this.roleQuery.getRoleDetails(id);

            return {
                status: true,
                data: list
            }
        }
    }

    getRoleByName = async (name) => {
        const errors = validator.StringValidator("name", name, true, "text", 2, 45);

        if (errors.length > 0) {
            return {
                status: false,
                error: errors
            }
        } 
        else {
            const list = await this.roleQuery.getRoleByName(name);

            return {
                status: true,
                data: list
            }
        }
    }

    saveRole = async (id, roleName) => {
        const errors = validator.StringValidator("roleName", roleName, true, "text", 2, 45);

        if (errors.length > 0) {
            return {
                status: false,
                error: errors
            }
        } 
        else {
            const newId = await this.roleQuery.saveRole(id, roleName);

            return {
                status: true,
                data: [{
                    id: newId,
                    roleName: roleName
                }]
            }
        }
    }

    deleteRole = async (id) => {
        const errors = validator.NumberValidator("id", id, true);

        if (errors.length > 0) {
            return {
                status: false,
                error: errors
            }
        } 
        else {
            const deleteId = await this.roleQuery.deleteRole(id);

            return {
                status: true,
                data: deleteId
            }
        }
    }
}

module.exports = Role;