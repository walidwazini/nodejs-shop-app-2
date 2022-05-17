const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const errorController = require('./controllers/error');
const User = require('./models/user')

const password = ''
const database = 'shop'
const mongodbUrl =
  `mongodb+srv://walid-nodejs:${password}@cluster0.swsls.mongodb.net/${database}?retryWrites=true&w=majority`

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('6282966e6e0ce8b4d47972c3')
    .then(user => {
      req.user = user
      next()
      // console.log(`${user} is now online`)
    })
    .catch(err => console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(mongodbUrl)
  .then(async (result) => {
    const loginUser = await User.findOne()
      .then(user => {
        if (!user) {
          const user = new User({
            name: 'Walid',
            email: 'walid@email.com',
            cart: {
              items: []
            }
          })
          user.save()
        }
        return user
      })
      .catch(err => console.log(err))
    app.listen(3000)
    const userId = `${loginUser._id.toString().slice(0, 3)}...${loginUser._id.toString().slice(-3)}`
    console.log(`ID (${userId}) is now connnected to database.`)
  })
  .catch(err => console.log(err))

