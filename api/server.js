const path = require('path');
const express = require('express');
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
// Sanitize data (for nosql - injection)
app.use(mongoSanitize());

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