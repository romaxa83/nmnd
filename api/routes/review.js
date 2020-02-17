const {Router} = require('express');
const router = Router({mergeParams: true});
const {
    getReviews,
    getReview,
    addReview,
    updateReview,
    deleteReview
} = require('../controllers/review');

const Review = require('../models/review');

const advancedResult = require('../middleware/advancedResult');
const { protect, authorize } = require('../middleware/auth');


router.route('/')
    .get(advancedResult(Review, {
        path: 'bootcamp',
        select: 'name description'
    }), getReviews)
    .post(protect, authorize('user', 'admin'), addReview);

router.route('/:id')
    .get(getReview)
    .put(protect, authorize('user', 'admin'), updateReview)
    .delete(protect, authorize('user', 'admin'), deleteReview);

module.exports = router;