const {Router} = require('express');
const router = Router({ mergeParams: true});
const {
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/course');

const Course = require('../models/course');
// подключаем мидлевар для продвинутого результата (пагинаци,сортировка,выборка полей)
const advancedResult = require('../middleware/advancedResult');

// подключаем роут для проверки авторизации
const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(advancedResult(Course, {
        path: 'bootcamp',
        select: 'name description'
    }), getCourses)
    .post(protect, authorize('publisher', 'admin'), addCourse);

router
    .route('/:id')
    .get(getCourse)
    .put(protect, authorize('publisher', 'admin'), updateCourse)
    .delete(protect, authorize('publisher', 'admin'), deleteCourse);

module.exports = router;