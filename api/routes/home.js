const {Router} = require('express');
const router = Router();

router.get('/', (req, res, next) => {
    res.status(200).json({success: true, msg: 'hellos'});
});

module.exports = router;