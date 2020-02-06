const {Router} = require('express');
const router = Router();
const {
    register,
    login,
    getMe
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

module.exports = router;