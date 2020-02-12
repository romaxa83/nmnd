const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/bootcamp');
const geocoder = require('../utils/geocoder');
const asyncHandler = require('../middleware/async');

// @desc    Get all bootcamps
// @route   GET /api/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    // let query;
    // // Copy req.query
    // const reqQuery = { ...req.query };
    //
    // // удаляем параметр select и sort,чтоб они не попали с данным для фильтрации фильтрации
    // const removeFields = ['select', 'sort', 'page', 'limit'];
    // removeFields.forEach(param => delete reqQuery[param]);
    //
    // // create query string
    // // получаем query - параметры для фильтрации
    // let queryStr = JSON.stringify(reqQuery);
    // // если приходи в таком ввиде(averageCost[lte]=100) то к lte добавляем символ '$'
    // // т.к. mongo нужно передать $lte
    // // @see https://docs.mongodb.com/manual/reference/operator/query/lte/
    // queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    //
    // query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');
    //
    // // указываем те поля которые нужно вернуть
    // // если был запрос по типу '?select=name,description'
    // if(req.query.select){
    //     const fields = req.query.select.split(',').join(' ');
    //     query = query.select(fields);
    // }
    //
    // // сортируем
    // if(req.query.sort){
    //     const sortBy = req.query.sort.split(',').join(' ');
    //     query = query.sort(sortBy);
    // } else {
    //     query = query.sort('-createdAt');
    // }
    //
    // // Pagination
    // const page = parseInt(req.query.page, 10) || 1;
    // const limit = parseInt(req.query.limit, 10) || 10;
    // const startIndex = (page - 1) * limit;
    // const endIndex = page * limit;
    // const total = await Bootcamp.countDocuments();
    //
    // query = query.skip(startIndex).limit(limit);
    //
    // const bootcamps = await query;
    //
    // // Pagination result
    // const pagination = {};
    //
    // if(endIndex < total){
    //     pagination.next = {
    //         page: page + 1,
    //         limit
    //     };
    // }
    //
    // if(startIndex > 0){
    //     pagination.prev = {
    //         page: page - 1,
    //         limit
    //     };
    // }
    //
    // res.status(200).json({
    //     success: true,
    //     count: bootcamps.length,
    //     pagination,
    //     data: bootcamps
    // })

    // закоментированое выше вынесено в мидлевар advancedResult
    res.status(200).json(res.advancedResult);
});

// @desc    Get one bootcamp
// @route   GET /api/bootcamp/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id);

    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: bootcamp
    })
});

// @desc    Create bootcamp
// @route   POST /api/bootcamp
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {

    //Add user to req.body
    req.body.user = req.user.id;

    // если пользователь не admin,то он может добавить только один лагерь
    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });
    if(publishedBootcamp && req.user.role !== 'admin') {
        return next(new ErrorResponse(`The user with ID ${req.user.id} has already published a bootcamp`, 400));
    }

    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
        success: true,
        data: bootcamp
    })
});

// @desc    Update bootcamp
// @route   PUT /api/bootcamp/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {

    let bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    // проверяем что редактирует собственик данной записи (тот кто опубликовал) или админ
    // приводим id пользователя к строке т.к. это обьект
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this bootcamp`, 401));
    }

    bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: bootcamp
    })
});

// @desc    Delete bootcamp
// @route   DELETE /api/bootcamp/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {

    // первый пример закоментирован т.к. на нем не срабатывает мидлевар при удалении (
    // для срабатывания триггера 'remove' , нужно использовать метод remove)

    // const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    // проверяем что удалять собственик данной записи (тот кто опубликовал) или админ
    // приводим id пользователя к строке т.к. это обьект
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this bootcamp`, 401));
    }

    bootcamp.remove();

    res.status(200).json({
        success: true,
        data: {}
    })
});

// @desc    Get bootcamps within a radius
// @route   GET /api/bootcamps/radius/:zipcode/:distance
// @access  Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963;

    // @see https://docs.mongodb.com/manual/reference/operator/query/centerSphere/
    // получение данных от конкретной точки (определяеться по долготе/широте) в определеном радиусе
    const bootcamps = await Bootcamp.find({
        location: {$geoWithin: { $centerSphere: [ [ lng, lat ], radius ] }}
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });
});

// @desc    Upload photo for bootcamp
// @route   PUT /api/bootcamp/:id/photo
// @access  Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    // проверяем что загрузить фото может собственик данной записи (тот кто опубликовал) или админ
    // приводим id пользователя к строке т.к. это обьект
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to upload photo this bootcamp`, 401));
    }

    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const file = req.files.file;

    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 400));
    }
    // check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400));
    }

    //create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err) {
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

        res.status(200).json({
            success: true,
            data: file.name
        })
    });
});