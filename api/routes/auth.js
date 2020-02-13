const {Router} = require('express');
const router = Router();
const {
    register,
    login,
    getMe,
    forgotPassword
} = require('../controllers/auth');

// подключаем роут для проверки авторизации
const { protect } = require('../middleware/auth');

router
    .route('/register')
    .post(register);

router
    .route('/login')
    .post(login);

router.get('/me', protect, getMe);

router.post('/forgot-password', forgotPassword);

module.exports = router;