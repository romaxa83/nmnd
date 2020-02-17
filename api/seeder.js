// загрузка фейковых данных
const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

dotenv.config({path: './config/config.env'});

const Bootcamp = require('./models/bootcamp');
const Course = require('./models/course');
const User = require('./models/user');
const Review = require('./models/review');

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify:false,
    useUnifiedTopology: true
});

// read JSON file
const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

const courses = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);

const users = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);

const reviews = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8')
);

//import into db
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        console.log('Bootcamps data imported...'.green.inverse);

        await Course.create(courses);
        console.log('Courses data imported...'.green.inverse);

        await User.create(users);
        console.log('Users data imported...'.green.inverse);

        await Review.create(reviews);
        console.log('Reviews data imported...'.green.inverse);

        process.exit();
    } catch (err) {
        console.error(err);
    }
};

//delete data
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        console.log('Bootcamps data destroyed...'.red.inverse);

        await Course.deleteMany();
        console.log('Courses data destroyed...'.red.inverse);

        await User.deleteMany();
        console.log('Users data destroyed...'.red.inverse);

        await Review.deleteMany();
        console.log('Reviews data destroyed...'.red.inverse);

        process.exit();
    } catch (err) {
        console.error(err);
    }
};

// привызове передаем аргумент '-i' чтоб загрузить данные,
// или '-d' если нужно их удалить
if(process.argv[2] === '-i'){
    importData();
} else if (process.argv[2] === '-d'){
    deleteData();
}