var express = require('express');
var router = express.Router();
// por el momento no usamos estos middlewares ya que es un mvp
//const demoLimiter = require('../middlewares/demoLimiter');
//const pdfLimiter = require('../middlewares/pdfLimiter');
const scanController = require('../controllers/scanController');

router.post('/', scanController.scan);
router.post('/demoScan', scanController.demoScan);
router.get('/demo/pdf', scanController.downloadDemoPdf);

module.exports = router;