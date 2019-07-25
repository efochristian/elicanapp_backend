const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const orderControllers = require('../controllers/orders')

router.get('/', checkAuth, orderControllers.get_all_oders)

router.get('/:orderId', checkAuth, orderControllers.get_order_by_id)

router.post('/', checkAuth, orderControllers.create_order)

router.delete('/:orderId', checkAuth, orderControllers.delete_order)

module.exports = router;
