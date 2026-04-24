import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';
import toast from 'react-hot-toast';
import { FiHeart, FiEdit2, FiTrash2, FiArrowLeft, FiClock, FiTag, FiEye } from 'react-icons/fi';

export default function BlogDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    API.get(`/blogs/${id}`)
      .then(r => {
        setBlog(r.data);
        setLikesCount(r.data.likes?.length || 0);
        if (user) setLiked(r.data.likes?.includes(user._id));
      })
      .catch(() => toast.error('Blog not found'))
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleLike = async () => {
    if (!user) { toast.error('Login to like'); return; }
    try {
      const { data } = await API.put(`/blogs/${id}/like`);
      setLiked(data.liked);
      setLikesCount(data.likes);
    } catch { toast.error('Failed to like'); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this blog?')) return;
    try {
      await API.delete(`/blogs/${id}`);
      toast.success('Blog deleted');
      navigate('/dashboard');
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-10 animate-pulse">
      <div className="h-8 bg-gray-100 rounded mb-4 w-3/4" />
      <div className="h-4 bg-gray-100 rounded mb-2 w-1/2" />
      <div className="h-64 bg-gray-100 rounded mt-6" />
    </div>
  );

  if (!blog) return (
    <div className="text-center py-20 text-gray-400">
      <p>Blog not found.</p>
      <Link to="/" className="text-indigo-600 mt-2 inline-block">Go Home</Link>
    </div>
  );

  const isAuthor = user?._id === blog.author?._id;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back */}
      <Link to="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 mb-6">
        <FiArrowLeft /> Back to Blogs
      </Link>

      {/* Cover */}
      {blog.coverImage && (
        <img src={blog.coverImage} alt={blog.title} className="w-full h-64 object-cover rounded-2xl mb-6 shadow" />
      )}

      {/* Meta */}
      <div className="flex flex-wrap gap-2 items-center mb-3">
        <span className="bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full">{blog.category}</span>
        {blog.tags?.map(tag => (
          <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
            <FiTag className="text-xs" />{tag}
          </span>
        ))}
      </div>

      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{blog.title}</h1>

      {blog.summary && (
        <p className="text-lg text-gray-500 mb-4 italic border-l-4 border-indigo-300 pl-4">{blog.summary}</p>
      )}

      {/* Author row */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {blog.author?.avatar ? (
            <img src={blog.author.avatar} className="w-10 h-10 rounded-full object-cover" alt="" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              {blog.author?.name?.[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900 text-sm">{blog.author?.name}</p>
            <p className="text-xs text-gray-400">
              {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1"><FiClock /> {blog.readTime} min read</span>
          <span className="flex items-center gap-1"><FiEye /> {blog.views}</span>
          {isAuthor && (
            <div className="flex gap-2">
              <Link to={`/edit/${blog._id}`} className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                <FiEdit2 />
              </Link>
              <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
                <FiTrash2 />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        className="blog-content text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{
          __html: blog.content
            .replace(/^### (.+)$/gm, '<h3>$1</h3>')
            .replace(/^## (.+)$/gm, '<h2>$1</h2>')
            .replace(/^# (.+)$/gm, '<h1>$1</h1>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/^(.+)$/, '<p>$1</p>')
        }}
      />

      {/* Like Button */}
      <div className="mt-8 flex items-center gap-3">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition
            ${liked ? 'bg-red-50 text-red-500 border border-red-200' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-red-200 hover:text-red-500'}`}
        >
          <FiHeart className={liked ? 'fill-red-400 text-red-400' : ''} />
          {liked ? 'Liked' : 'Like'} · {likesCount}
        </button>
      </div>

      {/* Comments */}
      <CommentSection blogId={id} />
    </div>
  );
}
