const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const {xss} = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

//Load env vars
dotenv.config({path:'./config/config.env'});

//connect to database
connectDB();

//route files
const massages = require('./routes/massages'); 
const auth = require('./routes/auth');
const appointments = require('./routes/appointments');
const paymentRoutes = require('./routes/payment');
const reviewRoutes = require('./routes/review');

const app = express();


app.use(express.json());

//cookie parser
app.use(cookieParser());

//sanitize data
app.use(mongoSanitize());

//set security headers
app.use(helmet());

//prevent XSS attacks
app.use(xss());


//rate limiting
const limiter = rateLimit({
    windowsMs : 10*60*1000, //10 mins
    max : 50
});
app.use(limiter);

//prevent http param pollutions
app.use(hpp());

//Enable CORS
app.use(cors());


app.use('/api/v1/massages', massages); 
app.use('/api/v1/auth', auth);
app.use('/api/v1/appointments', appointments);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/massages/:massageId/reviews', reviewRoutes);

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, 'mode on port ', PORT));

//handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    //close server & exit process
    server.close(()=>process.exit(1));
});