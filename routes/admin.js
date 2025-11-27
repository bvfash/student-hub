const express = require('express');
const router = express.Router();
const { Post, Comment } = require('../models');
const { ensureLoggedIn, ensureAdmin } = require('../utils/authMiddleware');

router.get('/', ensureLoggedIn, ensureAdmin, async (req, res) => {
  const posts = await Post.findAll({ order: [['createdAt', 'DESC']] });
  res.render('dashboard', { posts });
});

router.post('/posts', ensureLoggedIn, ensureAdmin, async (req, res) => {
  const { title, content, imageUrl } = req.body;
  if (!title || !content) {
    req.flash('error', 'Title and content are required.');
    return res.redirect('/admin');
  }
  await Post.create({ title, content, imageUrl, authorId: req.session.user.id });
  req.flash('success', 'Post created.');
  res.redirect('/admin');
});

router.delete('/posts/:id', ensureLoggedIn, ensureAdmin, async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (post) await post.destroy();
  req.flash('success', 'Post deleted.');
  res.redirect('/admin');
});

router.delete('/comments/:id', ensureLoggedIn, ensureAdmin, async (req, res) => {
  const comment = await Comment.findByPk(req.params.id);
  if (comment) await comment.destroy();
  req.flash('success', 'Comment deleted.');
  res.redirect('/admin');
});

module.exports = router;
