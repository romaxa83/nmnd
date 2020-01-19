const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const homeRoutes = require('./routes/home');
const blogRoutes = require('./routes/blog');

app.use('/', homeRoutes);
app.use('/api/blog', blogRoutes);

async function start()
{
    try {

        // запускаем приложение
        app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    } catch (err) {
        console.log(err);
    }

}
start();