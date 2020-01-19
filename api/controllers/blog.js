// @desc    Get all posts
// @route   GET /api/blog
// @access  Public
exports.getPosts = (req, res, next) => {
    res.status(200).json({success:true, msg: 'All posts'});
};

// @desc    Get one post
// @route   GET /api/post/:id
// @access  Public
exports.getPost = (req, res, next) => {
    res.status(200).json({success:true, msg: `Show post by id - ${req.params.id}`});
};

// @desc    Create post
// @route   POST /api/post
// @access  Private
exports.createPost = (req, res, next) => {
    res.status(200).json({success:true, msg: `Create post by id - ${req.params.id}`});
};

// @desc    Update post
// @route   PUT /api/post/:id
// @access  Private
exports.updatePost = (req, res, next) => {
    res.status(200).json({success:true, msg: `Update post by id - ${req.params.id}`});
};

// @desc    Delete post
// @route   DELETE /api/post/:id
// @access  Private
exports.deletePost = (req, res, next) => {
    res.status(200).json({success:true, msg: `Delete post by id - ${req.params.id}`});
};