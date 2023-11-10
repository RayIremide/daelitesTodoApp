const express = require('express');
const mongoDB = require('./Database/connect.db')
const rateLimit = require("express-rate-limit");
const methodOverride = require('method-override');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const path =require('path')

const router = require('./Router/userRoute')
const viewRouter= require('./Views/viewRouter')
const cookieParser = require('cookie-parser');


const app = express();

app.use(cookieParser());
app.use(methodOverride('_method'));

const PORT = process.env.PORT


// Connecting to mongoDB server
mongoDB.connectToMongoDB()

// Rate Limit
const limiter = rateLimit({
	windowMs: 0.5 * 60 * 1000, // 15 minutes
	max: 4, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})


// Apply the rate limiting middleware to all requests
app.use(limiter)

app.use(morgan('dev'));
app.use(express.json()) 
app.use(express.urlencoded({ extended: true })); 


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'Views'));
app.use('/todo', viewRouter)

// home route
app.get('/', (req, res) => {
    return res.status(200).json({ message: 'success', status: true })
})

app.use('/api',router.userRouter)



// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
      data: null,
      error: 'Server Error'
  })
})



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

