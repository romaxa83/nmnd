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

    // Check if password matches
    const isMatch = user.matchPassword(password);

    if(!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
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
    const resetUrl = `${req.protocol}://${req.get('host')}/api/reset-password/${resetToken}`;

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
