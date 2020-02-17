const ErrorResponse = require('../utils/errorResponse');
const Course = require('../models/course');
const Bootcamp = require('../models/bootcamp');
const asyncHandler = require('../middleware/async');

// @desc    Get all courses
// @route   GET /api/course
// @route   GET /api/bootcamps/:bootcampId/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
    // let query;
    // // контроллер обрабатывает два пути (все курса и все курса по конкретному лагерю)
    // if(req.params.bootcampId){
    //     query = Course.find({ bootcamp: req.params.bootcampId});
    // } else {
    //     // populate связывает с bootcamp (если нужны все данные первый пример, если выборочные - втрой пример)
    //     // query = Course.find().populate('bootcamp');
    //     query = Course.find().populate({
    //         path: 'bootcamp',
    //         select: 'name description'
    //     });
    // }
    //
    // const courses = await query;
    //
    // res.status(200).json({
    //     success: true,
    //     count: courses.length,
    //     data: courses
    // })

    if(req.params.bootcampId) {
        const courses = await Course.find({ bootcamp: req.params.bootcampId});

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        })
    } else {
        res.status(200).json(res.advancedResult)
    }
});

// @desc    Get one course
// @route   GET /api/course/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {

    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if(!course){
        return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: course
    })
});

// @desc    Add course
// @route   POST /api/bootcamp/:bootcampId/course
// @access  Private
exports.addCourse = asyncHandler(async (req, res, next) => {

    // пишем в данное поле id лагеря , т.к. в модели используем bootcamp
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.bootcampId}`, 404));
    }

    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a course to bootcamp ${req.params.bootcampId}`, 401));
    }

    const course = await Course.create(req.body);

    res.status(201).json({
        success: true,
        data: course
    })
});

// @desc    Update course
// @route   PUT /api/course/:id
// @access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {

    let course = await Course.findById(req.params.id);

    if(!course){
        return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }

    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update a course ${req.params.id}`, 401));
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(201).json({
        success: true,
        data: course
    })
});

// @desc    Delete course
// @route   DELETE /api/course/:id
// @access  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {

    const course = await Course.findById(req.params.id);

    if(!course){
        return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }

    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete a course ${req.params.id}`, 401));
    }

    await course.remove();

    res.status(201).json({
        success: true,
        data: {}
    })
});