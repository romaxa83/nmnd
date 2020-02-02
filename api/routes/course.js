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

router
    .route('/')
    .get(advancedResult(Course, {
        path: 'bootcamp',
        select: 'name description'
    }), getCourses)
    .post(addCourse);

router
    .route('/:id')
    .get(getCourse)
    .put(updateCourse)
    .delete(deleteCourse);

module.exports = router;