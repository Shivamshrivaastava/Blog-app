const express = require('express');
const router = express.Router();
const {
  getBlogs, getTrendingBlogs, getMyBlogs, getBlogById,
  createBlog, updateBlog, deleteBlog, toggleLike
} = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getBlogs);
router.get('/trending', getTrendingBlogs);
router.get('/my', protect, getMyBlogs);
router.get('/:id', getBlogById);
router.post('/', protect, createBlog);
router.put('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);
router.put('/:id/like', protect, toggleLike);

module.exports = router;
