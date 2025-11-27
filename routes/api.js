const express = require('express');
const router = express.Router();
const { Like, Comment } = require('../models');
const { ensureLoggedIn, ensureAdmin } = require('../utils/authMiddleware');

// toggle like
router.post('/posts/:id/like', ensureLoggedIn, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.session.user.id;

    const existing = await Like.findOne({ where: { postId, userId } });
    if (existing) {
      await existing.destroy();
      return res.json({ ok: true, liked: false });
    } else {
      await Like.create({ postId, userId });
      return res.json({ ok: true, liked: true });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false });
  }
});

// admin delete comment
router.delete('/comments/:id', ensureLoggedIn, ensureAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const c = await Comment.findByPk(id);
    if (!c) return res.status(404).json({ ok: false });
    await c.destroy();
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false });
  }
});

module.exports = router;
