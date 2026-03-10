var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/Sign-In', function(req, res, next) {
  res.render('forms/login');
});

router.get('/Sign-Up', function(req, res, next) {
  res.render('forms/register');
});

router.get('/dashboard', function(req, res, next) {
  res.render('dashboard/scan');
});

module.exports = router;
