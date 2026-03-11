var express = require('express');
var router = express.Router();

const scanController = require('../controllers/scanController');

router.post('/', scanController.scan);
router.post('/demoScan', scanController.demoScan);
router.get('/demo/report', scanController.renderDemoReport);
module.exports = router;