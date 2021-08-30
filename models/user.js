const bcrypt = require('bcryptjs');

const UserQuery = require('../data/userquery');
const validator = require('../validators/validator');

class User {
    constructor() {
        this.userQuery = new UserQuery();
    }

    getUserList = async () => {
        const list = await this.userQuery.getUserList();
        return {
            status: true,
            data: list
        }
    }

    getUserDetails = async (id) => {
        const errors = validator.NumberValidator("id", id, true);

        if (errors.length > 0) {
            return {
                status: false,
                error: errors
            }
        } 
        else {
            const list = await this.userQuery.getUserDetails(id);

            return {
                status: true,
                data: list
            }
        }
    }

    getUserByUserName = async (userName) => {
        const errors = validator.StringValidator("userName", userName, true, "text", 5, 45);

        if (errors.length > 0) {
            return {
                status: false,
                error: errors
            }
        } 
        else {
            const list = await this.userQuery.getUserByUserName(userName);

            return {
                status: true,
                data: list
            }
        }
    }

    saveUser = async (id, firstName, lastName, age, gender, userName, roleId, password) => {
        let errors = [];
        const errors1 = validator.StringValidator("firstName", firstName, true, "text", 3, 50);
        const errors2 = validator.StringValidator("lastName", lastName, true, "text", 3, 50);
        const errors3 = validator.NumberValidator("age", age, true);
        const errors4 = validator.StringValidator("gender", gender, true, "text", 4, 6);
        const errors5 = validator.StringValidator("userName", userName, true, "text", 5, 45);
        const errors6 = validator.NumberValidator("roleId", roleId, true);
        const errors7 = validator.StringValidator("password", password, true, "text", 8, 20);

        errors = [...errors1, ...errors2, ...errors3, ...errors4, ...errors5, ...errors6, ...errors7];

        if (errors.length > 0) {
            return {
                status: false,
                error: errors
            }
        } 
        else {
            const newId = await this.userQuery.saveUser(
                id, firstName, lastName, age, gender, userName, roleId, bcrypt.hashSync(password, 8));

            return {
                status: true,
                data: [{
                    id: newId,
                    firstName: firstName,
                    lastName: lastName,
                    age: age,
                    gender: gender,
                    userName: userName,
                    roleId: roleId
                }]
            }
        }
    }

    deleteUser = async (id) => {
        const errors = validator.NumberValidator("id", id, true);

        if (errors.length > 0) {
            return {
                status: false,
                error: errors
            }
        } 
        else {
            const deleteId = await this.userQuery.deleteUser(id);

            return {
                status: true,
                data: deleteId
            }
        }
    }
}

module.exports = User;