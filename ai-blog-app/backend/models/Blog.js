const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 200,
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  summary: {
    type: String,
    default: '',
    maxlength: 500,
  },
  coverImage: {
    type: String,
    default: '',
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  category: {
    type: String,
    default: 'General',
    enum: ['General', 'Technology', 'Science', 'Health', 'Business', 'Lifestyle', 'Travel', 'Food', 'Education', 'Entertainment', 'Sports', 'Politics', 'Other'],
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views: { type: Number, default: 0 },
  readTime: { type: Number, default: 1 },
}, { timestamps: true });

// Auto-calculate read time before saving
blogSchema.pre('save', function (next) {
  const words = this.content.split(/\s+/).length;
  this.readTime = Math.max(1, Math.ceil(words / 200));
  next();
});

blogSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Blog', blogSchema);
