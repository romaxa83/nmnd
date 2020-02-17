const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/user');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');

// @desc    Register user
// @route   GET /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {

    const { name, email, password, role } = req.body;

    // Create user
    const user = await User.create({
        name, email, password, role
    });

    sendTokenResponse(user, 200, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body;

    // Validate email & password
    if(!email || !password){
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check for user (к паролю добавляем '+' , т.к. он указан в модели как не выбираемый,а так мы его получим)
    const user = await User.findOne({ email }).select('+password');
    if(!user){
        return next(new ErrorResponse('Invalid credentials', 401));
    }
    // Check if password matches (!!! не отрабатывает)
    const isMatch = await user.matchPassword(password);

    console.log('M' + isMatch);

    if(!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
});

// @desc    Logout user and clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {

    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Update user details
// @route   PUT /api/auth/update-details
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {

    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {


    const user = await User.findById(req.user.id).select('+password');

    // checkPassword
    if(!(await user.matchPassword(req.body.currentPassword))){
        return next(new ErrorResponse('Password is incorrect', 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if(!user) {
        return next(new ErrorResponse('There is not user with that email', 404));
    }

    //Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

    const message = `You are receving this email because you has requested the reset of a 
    password. Please make a PUT request to: n\n\ ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message
        });

        res.status(200).json({
            success: true,
            data: 'Email sent'
        });
    } catch (err) {

        console.log(err);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave: false});

        return next(new ErrorResponse('Email could not be sent', 500));
    }
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {

    // получаем хэш токена,т.к. в бд ма сохраняем хешированый токен
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if(!user){
        return next(new ErrorResponse('Invalid token', 400));
    }

    // set new password
    user.password = req.body.password;
    console.log('NEW PASS' + req.body.password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
});

// Get token(jwt) from model, create cookie and send response
const sendTokenResponse = (user, statusCode, response) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        // 30days
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    // добавляем настройки для https для продакта
    if(process.env.NODE_ENV === 'production'){
        options.secure = true;
    }

    response
        .status(statusCode)
        .cookie('token', token, options)
        .json({ success: true, token });
};
