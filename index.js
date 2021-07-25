
//importing the express library/framework
const express = require('express');
const mongoose = require('mongoose');
//const bodyParser = require('body-parser');
const passport = require('passport');
//require expre session 
const expressSession = require('express-session')({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
});


const dotenv = require("dotenv");

dotenv.config();

//instantiating express in constant app
const app = express();

//import employee route
const employeeRoutes = require('./routes/employeeRoute');
const registerRoutes = require('./routes/registerRoutes');
const loginRoutes = require('./routes/loginRoutes');

//reg model
const Registration = require('./models/Registration')



//db connection
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true,
    useFindAndModify:false
});

mongoose.connection
  .on('open', () => {
    console.log('Mongoose connection open');
  })
  .once('error', (err) => {
    console.log(`Connection error: ${err.message}`);
  });

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session())

passport.use(Registration.createStrategy());
passport.serializeUser(Registration.serializeUser());
passport.deserializeUser(Registration.deserializeUser());
//configurations- setting pug as templete engine
app.set('view engine', 'pug');
app.set('views', './views');

//custom middleware
app.use((req, res, next) => {
  console.log('a new request received aat ' + Date.now());
  next();
});

// middleware for serving static files(css,js,images)
app.use(express.static('public'));
app.use('/public/images', express.static(__dirname + '/public/images'));

//instantiting employee route
app.use('/employee', employeeRoutes);
//app.use('/', homeRoutes);
app.use('/register', registerRoutes);
app.use('/login', loginRoutes);



//orders route
app.get('/createOrders', (req, res) => {
  res.render('createOrders', { title: 'create Order' });
});

//path parameters -used to specify the exact route

//incase a route doesnt exist
app.get('*', (req, res) => {
  res.send('the route specified doesnt exist');
});

// logout
app.post('/logout', (req, res) => {
  if (req.session) {
      req.session.destroy((err)=> {
          if (err) {
              console.log(err)
          } else {
              return res.redirect('/login');
          }
      })
  }
})



//server to run at port 3000
app.listen(8000, () => console.log('listening on port 3000'));

