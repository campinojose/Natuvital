const express = require('express');
const router = express.Router();
const saleCtrl = require('../controllers/sale.controller');

router.post('/', saleCtrl.create);
router.get('/', saleCtrl.getAll);
router.get('/totales', saleCtrl.totals);

module.exports = router;
