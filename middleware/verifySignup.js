const authQuery = require('../data/auth.query');
const validator = require('../validators/validator');

checkDuplicateUserName = (request, response, next) => {
    const userName = request.body.userName;

    const errors = validator.StringValidator("userName", userName, true, "text", 5, 45);

    if (errors.length > 0) {
        return response.status(200).send({
            status: false,
            error: errors
        });
    }
    else {
        return authQuery.getDataByUserName(userName).then(users => {
            if (users && users.length > 0) {
                return response.status(400).send({
                    status: false,
                    data: "Username is already registered."
                });
            } else {
                next();
                return;
            }
        }).catch(error => {
            return response.status(200).send({
                status: false,
                data: `Something went wrong. - ${error}`
            });
        })
    }
}

const verifySignup = {
    checkDuplicateUserName: checkDuplicateUserName
};

module.exports = verifySignup;