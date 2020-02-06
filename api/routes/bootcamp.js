const {Router} = require('express');
const router = Router();
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload
} = require('../controllers/bootcamp');

const Bootcamp = require('../models/bootcamp');
// подключаем мидлевар для продвинутого результата (пагинаци,сортировка,выборка полей)
const advancedResult = require('../middleware/advancedResult');

// подключаем роут для проверки авторизации
const { protect } = require('../middleware/auth');

// Include other resource routers
const courseRouter = require('./course');
// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/:id/photo').put(protect, bootcampPhotoUpload);

router
    .route('/')
    .get(advancedResult(Bootcamp, 'courses'), getBootcamps)
    .post(protect, createBootcamp);

router
    .route('/:id')
    .get(getBootcamp)
    .put(protect, updateBootcamp)
    .delete(protect, deleteBootcamp);

module.exports = router;