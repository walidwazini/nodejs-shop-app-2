const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart  // {items : []} 
    this._id = id
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .findOne({ _id: new ObjectId(userId) })
      .then(user => {
        console.log(user);
        return user;
      })
      .catch(err => {
        console.log(err);
      });
  }

  getCart() {
    const db = getDb()
    const productIds = this.cart.items.map(i => {
      return i.productId
    })
    return db
      .collection('products')
      .find({
        _id: { $in: productIds }
      })
      .toArray()
      .then(products => {  // get array of products..
        return products.map(p => {
          return {  // ..transfrom into object
            ...p, quantity: this.cart.items.find(i => {
              return i.productId.toString() === p._id.toString()
            }).quantity
          }
        })
      })
      .catch(err => console.log(err))
  }

  addToCart(product) {
    // check certain item already exist or not..
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString()
    })

    let newQuantity = 1
    const updatedCartItems = [...this.cart.items]

    if (cartProductIndex >= 0) {   // current product already in the cart 
      newQuantity = this.cart.items[cartProductIndex].quantity + 1
      updatedCartItems[cartProductIndex].quantity = newQuantity
    }
    else {
      // current product not in the cart yet before ...
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        title: product.title,
        quantity: newQuantity
      })
    }

    const updatedCart = { items: updatedCartItems }
    const db = getDb()

    return db.
      collection('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      )
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString()
    })
    const db = getDb()
    return db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        // updated cart to have all items except the deleted one..
        { $set: { cart: { items: updatedCartItems } } }
      )

  }


}

module.exports = User;