const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/user');
const asyncHandler = require('../middleware/async');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {

  res.status(200).json(res.advancedResult);
});

// @desc    Get a single user
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Create user
// @route   POST /api/admin/create
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {

    const user = await User.create(req.body);

    res.status(201).json({
        success: true,
        data: user
    });
});

// @desc    Update user
// @route   PUT /api/admin/update/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Delete user
// @route   Delete /api/admin/delete/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        data: {}
    });
});