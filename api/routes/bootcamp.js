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
const { protect, authorize } = require('../middleware/auth');

// Include other resource routers
const courseRouter = require('./course');
const reviewRouter = require('./review');
// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

router
    .route('/')
    .get(advancedResult(Bootcamp, 'courses'), getBootcamps)
    .post(protect, authorize('publisher', 'admin'), createBootcamp);

router
    .route('/:id')
    .get(getBootcamp)
    .put(protect, authorize('publisher', 'admin'), updateBootcamp)
    .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

module.exports = router;