// routes/posts.js
const express = require('express');
const router = express.Router();
const Post = require('../models/post'); // adjust path if needed

// GET /posts - list all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 });
    res.render('index', { posts }); // index.ejs expects "posts"
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).send('Server error');
  }
});

// GET /posts/:id - single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send('Post not found');
    res.render('post', { post }); // post.ejs expects "post"
  } catch (err) {
    console.error('Error fetching post:', err);
    res.status(500).send('Server error');
  }
});

// POST /posts - quick create (for testing/seeding via HTTP)
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;
    const created = await Post.create({ title, content });
    res.redirect(`/posts/${created._id}`);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).send('Server error');
  }
});

// POST /posts/:id/comments - add comment
router.post('/:id/comments', async (req, res) => {
  try {
    const { author, content } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send('Post not found');
    post.comments.push({ author, content });
    await post.save();
    res.redirect(`/posts/${post._id}`);
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
