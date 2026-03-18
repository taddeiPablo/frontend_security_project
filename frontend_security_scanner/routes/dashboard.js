var express = require('express');
var router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const requireAuth = require("../middlewares/authGuard");

/* GET dashboard */
router.get('/', requireAuth, dashboardController.getDashboard);
router.get('/scans', requireAuth, dashboardController.getListScan);
router.get('/plans', requireAuth, dashboardController.getPlans);

module.exports = router;