const {Router} = require('express');
const router = Router();
const {
    register,
    login,
    logout,
    getMe,
    forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword
} = require('../controllers/auth');

// подключаем роут для проверки авторизации
const { protect } = require('../middleware/auth');

router
    .route('/register')
    .post(register);

router
    .route('/login')
    .post(login);

router.get('/logout', protect, logout);

router.get('/me', protect, getMe);

router.post('/forgot-password', forgotPassword);

router.put('/reset-password/:resetToken', resetPassword);
router.put('/update-details', protect, updateDetails);
router.put('/update-password', protect, updatePassword);

module.exports = router;