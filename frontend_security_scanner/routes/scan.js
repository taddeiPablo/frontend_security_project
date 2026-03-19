var express = require('express');
var router = express.Router();

const scanController = require('../controllers/scanController');

router.post('/premium', scanController.scan);
router.post('/demoScan', scanController.demoScan);
//router.get('/demo/report', scanController.renderDemoReport);
router.get('/premium/report', scanController.renderPremiumReport);
router.delete('/:id', scanController.delete_Scan);
router.get('/:id', scanController.show_Scan);

module.exports = router;