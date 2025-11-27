const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  author: { type: String, default: 'Anonymous' },
  content: { type: String, required: true }
}, { timestamps: true });

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, default: '' },
  comments: { type: [CommentSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
