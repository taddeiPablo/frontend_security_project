var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const redirectIfAuth = require('../middlewares/redirectIfAuth');

/* GET users listing. */
router.get('/login',redirectIfAuth,  userController.getLogin);
router.get('/register',redirectIfAuth, userController.getRegister);

module.exports = router;
