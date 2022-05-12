const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

let _db

const password = ''
const database = 'shop'
const mongodbUrl = `mongodb+srv://walid-nodejs:${password}@cluster0.swsls.mongodb.net/${database}?retryWrites=true&w=majority`

const mongoConnect = (callback) => {
  MongoClient.connect(mongodbUrl)
    .then(client => {
      console.log(`Connected to ${database} database!`)
      _db = client.db()
      callback(client)
    })
    .catch(err => {
      console.log(err)
      throw err
    })
}

const getDb = () => {
  if (_db) {
    return _db
  }
  throw 'No database found!'
}

// module.exports = mongoConnect
exports.mongoConnect = mongoConnect
exports.getDb = getDb