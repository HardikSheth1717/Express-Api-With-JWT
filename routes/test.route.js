const { authJwt } = require('../middleware');
const testController = require('../controllers/test.controller');

module.exports = (app) => {
    app.use((request, response, next) => {
        response.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });

    app.get('/api/test/all', testController.allAccess);

    app.get('/api/test/user', [ authJwt.verifyToken ], testController.userBoard);

    app.get('/api/test/mod', [ authJwt.verifyToken, authJwt.isModerator ], testController.moderatorBoard);
    
    app.get('/api/test/admin', [ authJwt.verifyToken, authJwt.isAdmin ], testController.adminBoard);
}