const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user-controller');

router.post('/signup', userCtrl.signup);//valid
router.post('/login', userCtrl.login);//valid

module.exports = router;