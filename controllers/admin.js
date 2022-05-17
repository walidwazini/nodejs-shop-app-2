const mongodb = require('mongodb')
const Product = require('../models/product');
const User = require('../models/user')

const ObjectId = mongodb.ObjectId

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product({
    title: title,
    description: description,
    imageUrl: imageUrl,
    price: price,
    userId: req.user._id
  })

  product
    .save()
    .then(result => {
      // console.log(`Succesfully added ${title} !`);
      User.findById(product.userId)
        .then(admin => {
          // console.log(admin)
          const adminId = `${admin._id.toString().slice(0, 3)}...${admin._id.toString().slice(-3)}`
          console.log(`Admin ${admin.name} (${adminId}) succesfully added ${title}`)
        })
        .catch(err => console.log(err))
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }

      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.findById(prodId)
    .then(product => {
      product.title = updatedTitle
      product.price = updatedPrice
      product.imageUrl = updatedImageUrl
      product.description = updatedDesc
      return product.save()
    })
    .then(result => {
      User.findById(req.user._id)
        .then(admin => {
          const adminId = `${admin._id.toString().slice(0, 3)}...${admin._id.toString().slice(-3)}`
          console.log(`${updatedTitle}(${prodId}) details succesfully updated by ${admin.name}(${adminId})`);
        })
        .catch(err => console.log(err))
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products => {
      // console.log(products)
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  console.log(req.body)
  Product.findByIdAndRemove(prodId)
    .then(result => {
      res.redirect('/admin/products');
    })
    .then(() => {
    })
    .catch(err => console.log(err));
};
