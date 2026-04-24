import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { FiSend, FiTrash2, FiMessageCircle } from 'react-icons/fi';

export default function CommentSection({ blogId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get(`/comments/${blogId}`).then(r => setComments(r.data)).catch(() => {});
  }, [blogId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      const { data } = await API.post(`/comments/${blogId}`, { text });
      setComments(prev => [data, ...prev]);
      setText('');
      toast.success('Comment added!');
    } catch {
      toast.error('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/comments/${id}`);
      setComments(prev => prev.filter(c => c._id !== id));
      toast.success('Comment deleted');
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
        <FiMessageCircle className="text-indigo-600" />
        Comments ({comments.length})
      </h3>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={3}
            placeholder="Share your thoughts..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={loading || !text.trim()}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              <FiSend /> {loading ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <p className="text-sm text-gray-500 mb-6 p-3 bg-gray-50 rounded-lg">
          <a href="/login" className="text-indigo-600 font-medium">Login</a> to leave a comment.
        </p>
      )}

      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-6">No comments yet. Be the first!</p>
        )}
        {comments.map(comment => (
          <div key={comment._id} className="bg-gray-50 rounded-xl px-4 py-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                {comment.user?.avatar ? (
                  <img src={comment.user.avatar} className="w-7 h-7 rounded-full object-cover" alt="" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                    {comment.user?.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-semibold text-gray-800">{comment.user?.name}</span>
                <span className="text-xs text-gray-400">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              {(user?._id === comment.user?._id || user?.role === 'admin') && (
                <button onClick={() => handleDelete(comment._id)} className="text-red-400 hover:text-red-600">
                  <FiTrash2 className="text-sm" />
                </button>
              )}
            </div>
            <p className="text-gray-700 text-sm">{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
