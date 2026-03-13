var express = require('express');
var router = express.Router();
//const requireAuth = require("../middlewares/authGuard");
const redirectIfAuth = require('../middlewares/redirectIfAuth');

/* GET users listing. */
router.get('/login',redirectIfAuth,  function(req, res, next) {
  res.render('forms/login');
});

router.get('/register',redirectIfAuth, function(req, res, next) {
  res.render('forms/register');
});

/*router.get('/dashboard', requireAuth, function(req, res, next) {
  res.render('dashboard/scan');
});*/

module.exports = router;
