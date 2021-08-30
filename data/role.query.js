const sqlfunctions = require('../helpers/sqlfunctions');

class RoleQuery {
    constructor() {
    }

    getRoleList = async () => {
        return await sqlfunctions.Get({
            table: "roles",
            columns: ['*']
        });
    }

    getRoleDetails = async (id) => {
        return await sqlfunctions.GetById({
            table: "roles",
            columns: ['*'],
            keyName: "Id",
            keyValue: id
        });
    }

    getRoleByName = async (name) => {
        return await sqlfunctions.GetById({
            table: "roles",
            columns: ['*'],
            keyName: "RoleName",
            keyValue: name
        });
    }

    saveRole = async (id, roleName) => {
        if (parseInt(id) === 0) {
            return await sqlfunctions.Create({
                table: "roles",
                data: {
                    RoleName: roleName
                }
            });
        } else {
            return await sqlfunctions.Update({
                table: "roles",
                data: {
                    RoleName: roleName
                },
                keyName: "Id",
                keyValue: id
            });
        }
    }

    deleteRole = async (id) => {
        return await sqlfunctions.Delete({
            table: "roles",
            keyName: "Id",
            keyValue: id
        });
    }
}

module.exports = RoleQuery;