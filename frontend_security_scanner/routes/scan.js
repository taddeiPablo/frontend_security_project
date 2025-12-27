var express = require('express');
var router = express.Router();
const demoLimiter = require('../middlewares/demoLimiter');
const pdfLimiter = require('../middlewares/pdfLimiter');
const scanController = require('../controllers/scanController');

router.post('/', scanController.scan);
router.post('/demoScan', demoLimiter, scanController.demoScan);
router.get('/demo/pdf', pdfLimiter, scanController.downloadDemoPdf);

module.exports = router;