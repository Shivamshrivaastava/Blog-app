import { Link } from 'react-router-dom';
import { FiHeart, FiClock, FiUser, FiTag } from 'react-icons/fi';

export default function BlogCard({ blog }) {
  const date = new Date(blog.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
      {blog.coverImage && (
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      )}
      <div className="p-5">
        {/* Category */}
        <span className="inline-block px-2 py-1 text-xs font-semibold bg-indigo-50 text-indigo-600 rounded-full mb-2">
          {blog.category}
        </span>

        {/* Title */}
        <Link to={`/blog/${blog._id}`}>
          <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {blog.title}
          </h2>
        </Link>

        {/* Summary */}
        {blog.summary && (
          <p className="text-gray-500 text-sm mb-3 line-clamp-2">{blog.summary}</p>
        )}

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {blog.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full flex items-center gap-1">
                <FiTag className="text-xs" />{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FiUser className="text-xs" />
            <span className="font-medium text-gray-700">{blog.author?.name || 'Unknown'}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <FiClock className="text-xs" /> {blog.readTime}m
            </span>
            <span className="flex items-center gap-1">
              <FiHeart className="text-xs" /> {blog.likes?.length || 0}
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-1">{date}</p>
      </div>
    </div>
  );
}
