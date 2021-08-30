const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();

router.get('/users', userController.getUserList);

router.get('/userdetail/:id', userController.getUserDetails);

router.post('/saveuser', userController.saveUser);

router.delete('/deleteuser/:id', userController.deleteUser);

module.exports = router;