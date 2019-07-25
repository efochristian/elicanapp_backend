
const mongoose = require('mongoose');
const Order = require('../models/order');
const Products = require('../models/products');

exports.get_all_oders =  (req, res, next) => {

	Order.find()
		.select('product quantity _id')
		.populate('product', 'name price')
		.exec()
		.then(doc => {
			res.status(200).json({
				count: doc.length,
				orders: doc.map(doc => {
					return {
						_id: doc._id,
						product: doc.product,
						quantity: doc.quantity,
						request: {
							type: 'GET',
							url: 'http://localhost:2400/orders/' + doc._id
						}
					}
				})
			})
		})
		.catch(err => {
			res.status(500).json({
				error : err
			})
		})

}

exports.create_order =  (req, res, next) => {

	Order.findById(req.body.productId)
		.then(product => {

			if(!product) {
				return res.status(404).json({
					message: 'Product not found'
				})
			}

			const order = new Order({
		          _id: mongoose.Types.ObjectId(),
				  quantity: req.body.quantity,
				  product: req.body.productId
	});
	
	return order
		.save()
		.then(result => {
			console.log(result);
			res.status(201).json({
				message : 'Order stored',
				createdOrder: {
					id : result._id,
					product : result.product,
					quantity : result.quantity
				},
				request: {
					type: 'GET',
					url: 'http://localhost:2400/orders/' + result._id
				}
			});
	      })
		})
	
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})

}

exports.delete_order = (req, res, next) => {
	Order.deleteOne({ _id : req.params.orderId})
	.exec()
	.then(result => {
		res.status(200).json({
			message: 'Order deleted',
			request: {
				type: 'POST',
				url: 'http://localhost:2400/orders/',
				body: { name: 'String', price: 'Number'}
			}
		})
	})
	.catch(err => {
		console.log(err)
		res.status(500).json({
			error : err
		})
	})

}

exports.get_order_by_id = (req, res, next) => {

	Order.findById(req.params.orderId)
	    .select('product quantity _id')
		.populate('product', 'name price')
		.exec()
		.then(order => {
			if(!order){
				res.status(404).json({
					message: 'Order not found'
				})
			}
			res.status(200).json({
				order : order,
				request: {
					type: 'GET',
					url : 'http://localhost:2400/orders'
				}
			})
		})
		.catch(err => {
			res.status(500).json({
				error : err
			})
		})
}

