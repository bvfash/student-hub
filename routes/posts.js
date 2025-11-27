const express = require('express');
const router = express.Router();
const { Post, User, Comment } = require('../models');
const { ensureLoggedIn } = require('../utils/authMiddleware');

// List posts
router.get('/posts', async (req, res) => {
  const posts = await Post.findAll({
    include: [{ model: User, as: 'author' }, { model: User, as: 'Likers' }, { model: Comment }],
    order: [['createdAt', 'DESC']]
  });
  const postsWithCounts = posts.map(p => ({
    id: p.id,
    title: p.title,
    content: p.content,
    imageUrl: p.imageUrl,
    createdAt: p.createdAt,
    author: p.author,
    likesCount: p.Likers ? p.Likers.length : 0,
    commentsCount: p.Comments ? p.Comments.length : 0
  }));
  res.render('index', { posts: postsWithCounts });
});

// Post detail
router.get('/posts/:id', async (req, res) => {
  const post = await Post.findByPk(req.params.id, {
    include: [
      { model: User, as: 'author' },
      { model: User, as: 'Likers' },
      { model: Comment, include: [{ model: User, as: 'user' }] }
    ]
  });
  if (!post) return res.redirect('/posts');
  const likedByUser = req.session.user ? post.Likers.some(u => u.id === req.session.user.id) : false;
  res.render('post', { post, likesCount: post.Likers.length, comments: post.Comments, likedByUser });
});

// Add comment
router.post('/posts/:id/comments', ensureLoggedIn, async (req, res) => {
  const { text } = req.body;
  if (!text || text.trim() === '') {
    req.flash('error', 'Comment cannot be empty.');
    return res.redirect(`/posts/${req.params.id}`);
  }
  await Comment.create({ text, postId: req.params.id, userId: req.session.user.id });
  req.flash('success', 'Comment added.');
  res.redirect(`/posts/${req.params.id}`);
});

module.exports = router;
