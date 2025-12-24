var express = require('express');
var router = express.Router();

const scanController = require('../controllers/scanController');

/*router.get('/', scanController.init);*/
router.post('/', scanController.scan);

module.exports = router;