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
const { protect } = require('../middleware/auth');

router
    .route('/')
    .get(advancedResult(Course, {
        path: 'bootcamp',
        select: 'name description'
    }), getCourses)
    .post(protect, addCourse);

router
    .route('/:id')
    .get(getCourse)
    .put(protect, updateCourse)
    .delete(protect, deleteCourse);

module.exports = router;