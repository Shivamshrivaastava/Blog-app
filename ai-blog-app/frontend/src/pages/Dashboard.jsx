import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiHeart, FiClock } from 'react-icons/fi';

export default function Dashboard() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    API.get('/blogs/my')
      .then(r => setBlogs(r.data))
      .catch(() => toast.error('Failed to load blogs'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog?')) return;
    try {
      await API.delete(`/blogs/${id}`);
      setBlogs(prev => prev.filter(b => b._id !== id));
      toast.success('Blog deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const filtered = filter === 'all' ? blogs : blogs.filter(b => b.status === filter);

  const stats = {
    total: blogs.length,
    published: blogs.filter(b => b.status === 'published').length,
    drafts: blogs.filter(b => b.status === 'draft').length,
    likes: blogs.reduce((acc, b) => acc + (b.likes?.length || 0), 0),
    views: blogs.reduce((acc, b) => acc + (b.views || 0), 0),
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back, {user?.name}!</p>
        </div>
        <Link to="/create" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-indigo-700 transition">
          <FiPlus /> New Blog
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Total Blogs', value: stats.total, color: 'indigo' },
          { label: 'Published', value: stats.published, color: 'green' },
          { label: 'Drafts', value: stats.drafts, color: 'yellow' },
          { label: 'Total Likes', value: stats.likes, color: 'red' },
          { label: 'Total Views', value: stats.views, color: 'blue' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {['all', 'published', 'draft'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-sm px-4 py-1.5 rounded-full font-medium transition capitalize
              ${filter === f ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Blogs Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse border border-gray-100">
              <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg mb-3">No blogs yet!</p>
          <Link to="/create" className="text-indigo-600 font-medium">Create your first blog →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(blog => (
            <div key={blog._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between group hover:shadow-md transition">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link to={`/blog/${blog._id}`} className="font-semibold text-gray-900 hover:text-indigo-600 truncate max-w-xs">
                    {blog.title}
                  </Link>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                    ${blog.status === 'published' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                    {blog.status}
                  </span>
                  <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{blog.category}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400 mt-1.5">
                  <span className="flex items-center gap-1"><FiClock /> {blog.readTime}m read</span>
                  <span className="flex items-center gap-1"><FiEye /> {blog.views} views</span>
                  <span className="flex items-center gap-1"><FiHeart /> {blog.likes?.length} likes</span>
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Link to={`/edit/${blog._id}`} className="text-indigo-500 hover:text-indigo-700 p-1.5 rounded-lg hover:bg-indigo-50">
                  <FiEdit2 />
                </Link>
                <button onClick={() => handleDelete(blog._id)} className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50">
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
