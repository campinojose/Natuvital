const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/product.controller');
const auth = require('../middlewares/auth.middleware');


router.get('/', auth, productCtrl.getAll);
router.get('/:id', auth, productCtrl.getOne);
router.post('/', auth, productCtrl.create);
router.put('/:id', auth, productCtrl.update);
router.delete('/:id', auth, productCtrl.remove);


module.exports = router;

