const path = require('path');
const express = require('express');
//------FOR SECURITY-----------------
const helmet = require('helmet');
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
//----------------------------------
const cookieParser = require('cookie-parser');
const app = express();
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const connectDB = require('./config/db');
const fileUpload = require('express-fileupload');
const errorHandler = require('./middleware/error');

const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || `mongodb://localhost:27017/node_api`;
const version = process.version;

const homeRoutes = require('./routes/home');
const postRoutes = require('./routes/post');
const bootcampRoutes = require('./routes/bootcamp');
const courseRoutes = require('./routes/course');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const reviewsRoutes = require('./routes/review');
//-----------------------------------------
// Body parser
app.use(express.json());
// Cookie parser
app.use(cookieParser());
//------------------------------------------
// Dev Logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
//FileUpload
app.use(fileUpload());

//----------------------------------------
//---- FOR SECURITY ----------------------
// Sanitize data (for nosql - injection)
app.use(mongoSanitize());
// Set security headers
app.use(helmet());
// Prevent XSS attacks
app.use(xssClean());
// Rate limit
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100 // кол-во запросов за время указаное выше
});
app.use(limiter);
// Prevent http param pollution
app.use(hpp());
// Enable CORS
app.use(cors());
//--------------------------------------

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
//------------------------------------------
app.use('/', homeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bootcamp', bootcampRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/post', postRoutes);
app.use('/api/admin/users', userRoutes);

// важно подключить его после роутов
app.use(errorHandler);

async function start()
{
    try {

        connectDB();

        // запускаем приложение
        app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
            console.log(`You use node - ${version}`);
    });

    } catch (err) {
        console.log(err);
    }

}
start();