const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');
const Resize = require('../middleware/Resize');
const productControllers = require('../controllers/products')

const upload = multer({ 
	//storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5
	}
})

router.get('/:productId', productControllers.get_product_by_id)

router.post('/', checkAuth, upload.single('productImage'), productControllers.create_product)

router.patch('/:productId', checkAuth, productControllers.patch_product_by_id)

router.delete('/:productId', checkAuth, productControllers.delete_product)

router.get('/', productControllers.get_all_products)


module.exports = router;
