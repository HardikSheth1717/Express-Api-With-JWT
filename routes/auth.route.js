const { verifySignup } = require('../middleware');
const authController = require('../controllers/auth.controller');

module.exports = (app) => {
    app.use((request, response, next) => {
        response.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });

    app.post("/api/auth/signup", [ verifySignup.checkDuplicateUserName ], authController.signup);

    app.post('/api/auth/signin', authController.signin);

    app.post('/api/auth/renewaccesstoken', authController.renewAccessToken);
}