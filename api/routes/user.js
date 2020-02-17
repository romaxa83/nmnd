const {Router} = require('express');
const router = Router({mergeParams: true});
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/user');

const User = require('../models/user');

const advancedResult = require('../middleware/advancedResult');
const { protect, authorize } = require('../middleware/auth');

// мидлевары будут преминены на все роуты
router.use(protect);
router.use(authorize('admin'));

router.route('/')
    .get(advancedResult(User), getUsers)
    .post(createUser);

router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;