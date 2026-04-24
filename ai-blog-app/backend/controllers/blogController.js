const Blog = require('../models/Blog');
const Comment = require('../models/Comment');

// @GET /api/blogs  - public
const getBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 9, category, search, tag } = req.query;
    const filter = { status: 'published' };
    if (category && category !== 'All') filter.category = category;
    if (tag) filter.tags = tag;
    if (search) filter.$text = { $search: search };

    const total = await Blog.countDocuments(filter);
    const blogs = await Blog.find(filter)
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ blogs, total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/blogs/trending
const getTrendingBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'published' })
      .populate('author', 'name avatar')
      .sort({ views: -1, likes: -1 })
      .limit(5);
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/blogs/my  - protected
const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id })
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/blogs/:id
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name avatar bio');
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    blog.views += 1;
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/blogs  - protected
const createBlog = async (req, res) => {
  try {
    const { title, content, summary, tags, category, status, coverImage } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Title and content are required' });

    const blog = await Blog.create({
      title, content, summary, tags, category, status, coverImage,
      author: req.user._id,
    });
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/blogs/:id  - protected
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    if (blog.author.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    const { title, content, summary, tags, category, status, coverImage } = req.body;
    if (title) blog.title = title;
    if (content) blog.content = content;
    if (summary !== undefined) blog.summary = summary;
    if (tags) blog.tags = tags;
    if (category) blog.category = category;
    if (status) blog.status = status;
    if (coverImage !== undefined) blog.coverImage = coverImage;

    const updated = await blog.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/blogs/:id  - protected
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });

    await blog.deleteOne();
    await Comment.deleteMany({ blog: req.params.id });
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/blogs/:id/like  - protected
const toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const idx = blog.likes.indexOf(req.user._id);
    if (idx === -1) {
      blog.likes.push(req.user._id);
    } else {
      blog.likes.splice(idx, 1);
    }
    await blog.save();
    res.json({ likes: blog.likes.length, liked: idx === -1 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getBlogs, getTrendingBlogs, getMyBlogs, getBlogById, createBlog, updateBlog, deleteBlog, toggleLike };
