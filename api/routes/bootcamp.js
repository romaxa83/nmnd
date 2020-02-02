const {Router} = require('express');
const router = Router();
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius
} = require('../controllers/bootcamp');

// Include other resource routers
const courseRouter = require('./course');
// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);


router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router
    .route('/')
    .get(getBootcamps)
    .post(createBootcamp);

router
    .route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

module.exports = router;