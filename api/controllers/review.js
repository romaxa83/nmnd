const ErrorResponse = require('../utils/errorResponse');
const Review = require('../models/review');
const Bootcamp = require('../models/bootcamp');
const asyncHandler = require('../middleware/async');

// @desc    Get all reviews
// @route   GET /api/reviews
// @route   GET /api/bootcamps/:bootcampId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {

    if(req.params.bootcampId) {
        const reviews = await Review.find({ bootcamp: req.params.bootcampId});

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        })
    } else {
        res.status(200).json(res.advancedResult)
    }
});

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {

    const review = await Review.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if(!review){
        return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: review
    })
});

// @desc    Add review
// @route   POST /api/bootcamp/:bootcampId/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {

    // пишем в данное поле id лагеря , т.к. в модели используем bootcamp
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.bootcampId}`, 404));
    }

    const review = await Review.create(req.body);

    res.status(201).json({
        success: true,
        data: review
    })
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {

    let review = await Review.findById(req.params.id);

    if(!review){
        return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update a review ${req.params.id}`, 401));
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: review
    })
});

// @desc    Delete review
// @route   DELETE /api/review/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {

    const review = await Review.findById(req.params.id);

    if(!review){
        return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete a review ${req.params.id}`, 401));
    }

    await review.remove();

    res.status(201).json({
        success: true,
        data: {}
    })
});