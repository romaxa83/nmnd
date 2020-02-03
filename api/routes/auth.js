const {Router} = require('express');
const router = Router();
const {
    register
} = require('../controllers/auth');

router
    .route('/register')
    .post(register);

module.exports = router;