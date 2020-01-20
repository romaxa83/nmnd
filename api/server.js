const express = require('express');
const app = express();
const mongoose = require('mongoose');

const morgan = require('morgan');

const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || `mongodb://localhost:27017/node_api`;
const version = process.version;

const homeRoutes = require('./routes/home');
const blogRoutes = require('./routes/blog');

//------------------------------------------
// Dev Logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
//------------------------------------------
app.use('/', homeRoutes);
app.use('/api/blog', blogRoutes);

async function start()
{
    try {

        // подключаемся к базе данных
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true
        });

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