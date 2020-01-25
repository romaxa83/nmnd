const Post = require('../models/post');

// @desc    Get all posts
// @route   GET /api/blog
// @access  Public
exports.getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find();

        res.status(200).json({
            success: true,
            count: posts.length,
            data: post
        })
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.errmsg
        })
    }
};

// @desc    Get one post
// @route   GET /api/post/:id
// @access  Public
exports.getPost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(400).json({success:false});
        }

        res.status(200).json({
            success: true,
            data: post
        })
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.errmsg
        })
    }
};

// @desc    Create post
// @route   POST /api/post
// @access  Private
exports.createPost = async (req, res, next) => {
    try {
        const post = await Post.create(req.body);

        res.status(201).json({
            success: true,
            data: post
        })
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.errmsg
        })
    }
};

// @desc    Update post
// @route   PUT /api/post/:id
// @access  Private
exports.updatePost = async (req, res, next) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if(!post){
            return res.status(400).json({success:false});
        }

        res.status(200).json({
            success: true,
            data: post
        })
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.errmsg
        })
    }
};

// @desc    Delete post
// @route   DELETE /api/post/:id
// @access  Private
exports.deletePost = async (req, res, next) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);

        if(!post){
            return res.status(400).json({success:false});
        }

        res.status(200).json({
            success: true,
            data: {}
        })
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.errmsg
        })
    }
};