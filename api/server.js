const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const connectDB = require('./config/db');
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
//-----------------------------------------
//Body parser
app.use(express.json());
//------------------------------------------
// Dev Logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
//------------------------------------------
app.use('/', homeRoutes);
app.use('/api/bootcamp', bootcampRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/post', postRoutes);

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