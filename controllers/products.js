const mongoose = require('mongoose');
const Product = require('../models/products');


exports.get_product_by_id =  (req, res, next) => {
	const id = req.params.productId;
	Product.findById(id)
	.select('name price _id productImage')
	.exec()
	.then(doc => {
		console.log(doc);
		if (doc) {
			res.status(200).json({
				products: doc,
				request : {
					type : 'GET',
					description: 'Get all products',
					url : 'http://localhost:2400/products/'
				}
			});
		} else {
			res.status(404).json('No valid entry found for provided product ID')
		}
		
	})
	.catch(err => {
		console.log((err));
		res.status(500).json({err: err})
	})
}

exports.create_product = async (req, res, next) => {
	console.log(req.file)
	
  const imagePath = path.join('uploads/');
  
  const fileUpload = new Resize(imagePath);
  
  if (!req.file) {
    res.status(401).json({error: 'Please provide an image'});
  }
  
  const filename = await fileUpload.save(req.file.buffer);
  
  
const product = new Product({
	_id: new mongoose.Types.ObjectId(),
	name: req.body.name,
	price: req.body.price,
	productImage: 'uploads/' + filename
});
	product
	   .save()
	   .then(result => {
	   		console.log(result)
			res.status(201).json({
			message: 'Created Porduct Successfully',
			createdProduct: {
				id : result._id,
				name: result.name,
				price: result.price,
				productImage : result.productImage,
				request : {
					type : 'GET',
					url : 'http://localhost:2400/products/' + result._id
				} 

			}
		})
	})
	.catch(err => {
		console.log(err);cd 
		res.status(500).json({
			error: err
		})
	})
}


exports.get_all_products = (req, res, next) => {
	
	Product.find()
	//.select('name price_id productImage')
	.exec()
	.then(docs => {
		const response = {
			count: docs.length,
			products: docs.map(doc => {
				return	{
					_id : doc._id,
					name : doc.name,
					price : doc.price,
					productImage : doc.productImage,
					request: {
						type : 'GET',
						url : 'http://localhost:2400/products/' + doc._id
					}
				}
			})
		}

		res.status(200).json(response);
	})
	.catch(err => {
		console.log(err)
		res.status(500).json(err)

	})

}

exports.patch_product_by_id = (req, res, next) => {
	const id = req.params.productId;
	const updateOps = {};
	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value
	}
	Product.update({ _id : id}, { $set: updateOps})
	.exec()
	.then(result => {
		res.status(200).json({
			message: 'Product updated Successfully',
			request: {
				type : 'GET',
				url : 'http://localhost:2400/products/' + id
			}
		})
	})
	.catch(err => {
		console.log(err)
		res.status(500).json({
			error: err
		})
	});

}


exports.delete_product = (req, res, next) => {
	const id = req.params.productId;
	console.log(id);
	Product.deleteOne({ _id : id })
	.exec()
	.then(result => {
		res.status(200).json({
			message: 'Product deleted',
			request: {
				type: 'POST',
				url: 'http://localhost:2400/products/',
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