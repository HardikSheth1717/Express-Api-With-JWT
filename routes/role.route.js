const express = require('express');

const roleController = require('../controllers/role.controller');

const router = express.Router();

router.get('/roles', roleController.getRoleList);

router.get('/roledetail/:id', roleController.getRoleDetails);

router.post('/saverole', roleController.saveRole);

router.delete('/deleterole/:id', roleController.deleteRole);

module.exports = router;