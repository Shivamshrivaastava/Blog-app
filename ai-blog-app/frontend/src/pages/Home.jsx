import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import BlogCard from '../components/BlogCard';
import { useAuth } from '../context/AuthContext';
import { FiSearch, FiTrendingUp, FiPenTool } from 'react-icons/fi';

const CATEGORIES = ['All', 'Technology', 'Science', 'Health', 'Business', 'Lifestyle', 'Travel', 'Food', 'Education', 'Entertainment', 'Sports', 'Other'];

export default function Home() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    API.get('/blogs/trending').then(r => setTrending(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 9, category });
    if (search) params.append('search', search);
    API.get(`/blogs?${params}`)
      .then(r => {
        setBlogs(r.data.blogs);
        setTotalPages(r.data.pages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, category, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Write Smarter with <span className="text-yellow-300">AI</span>
          </h1>
          <p className="text-lg text-indigo-100 mb-8">
            A modern blog platform powered by Gemini AI. Generate titles, content, summaries, and more.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            {user ? (
              <Link to="/create" className="bg-white text-indigo-600 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition flex items-center gap-2">
                <FiPenTool /> Write New Blog
              </Link>
            ) : (
              <>
                <Link to="/register" className="bg-white text-indigo-600 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition flex items-center gap-2">
                  <FiPenTool /> Start Writing Free
                </Link>
                <Link to="/login" className="border-2 border-white text-white font-bold px-6 py-3 rounded-xl hover:bg-white hover:text-indigo-600 transition">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Trending */}
      {trending.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 mt-10">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
            <FiTrendingUp className="text-indigo-600" /> Trending Blogs
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {trending.map(b => (
              <Link key={b._id} to={`/blog/${b._id}`}
                className="min-w-[220px] bg-white rounded-xl border border-gray-100 shadow-sm p-3 hover:shadow-md transition flex-shrink-0">
                <span className="text-xs text-indigo-600 font-semibold">{b.category}</span>
                <h3 className="text-sm font-bold text-gray-800 mt-1 line-clamp-2">{b.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{b.views} views</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="max-w-6xl mx-auto px-4 mt-10">
        <form onSubmit={handleSearch} className="flex gap-2 mb-5">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search blogs..."
              className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
            />
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition">
            Search
          </button>
        </form>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {CATEGORIES.map(cat => (
            <button key={cat}
              onClick={() => { setCategory(cat); setPage(1); }}
              className={`text-sm px-4 py-1.5 rounded-full font-medium whitespace-nowrap transition
                ${category === cat ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 animate-pulse">
                <div className="h-40 bg-gray-100 rounded-lg mb-3" />
                <div className="h-4 bg-gray-100 rounded mb-2" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <FiSearch className="text-5xl mx-auto mb-4 opacity-30" />
            <p className="text-lg">No blogs found. Try a different search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map(blog => <BlogCard key={blog._id} blog={blog} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10 pb-10">
            {[...Array(totalPages)].map((_, i) => (
              <button key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition
                  ${page === i + 1 ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
