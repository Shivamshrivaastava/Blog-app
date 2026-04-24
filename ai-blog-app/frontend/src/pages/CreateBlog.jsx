import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import AIAssistant from '../components/AIAssistant';
import { FiSave, FiSend } from 'react-icons/fi';

const CATEGORIES = ['General', 'Technology', 'Science', 'Health', 'Business', 'Lifestyle', 'Travel', 'Food', 'Education', 'Entertainment', 'Sports', 'Other'];

export default function CreateBlog() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', content: '', summary: '', tags: '', category: 'General', coverImage: '', status: 'draft',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAIInsert = (text, feature) => {
    if (feature === 'generate-content' || feature === 'improve-grammar') {
      setForm(f => ({ ...f, content: text }));
    } else if (feature === 'generate-summary') {
      setForm(f => ({ ...f, summary: text }));
    } else if (feature === 'generate-tags') {
      setForm(f => ({ ...f, tags: Array.isArray(text) ? text.join(', ') : text }));
    } else if (feature === 'generate-title' || feature === 'seo-headlines') {
      setForm(f => ({ ...f, title: text }));
    }
    toast.success('AI content inserted!');
  };

  const handleSubmit = async (status) => {
    if (!form.title || !form.content) {
      toast.error('Title and content are required');
      return;
    }
    setLoading(true);
    try {
      const tagsArr = form.tags.split(',').map(t => t.trim()).filter(Boolean);
      const { data } = await API.post('/blogs', { ...form, tags: tagsArr, status });
      toast.success(status === 'published' ? 'Blog published! 🎉' : 'Draft saved!');
      navigate(`/blog/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Blog</h1>

      <AIAssistant title={form.title} content={form.content} onInsert={handleAIInsert} />

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter a compelling blog title..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        {/* Category & Cover */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
            <select name="category" value={form.category} onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Cover Image URL</label>
            <input
              name="coverImage"
              value={form.coverImage}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </div>

        {/* Summary */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Summary / Meta Description</label>
          <input
            name="summary"
            value={form.summary}
            onChange={handleChange}
            placeholder="Brief description (auto-generated with AI or write manually)..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Tags (comma-separated)</label>
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="react, javascript, tutorial..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Content * (Markdown supported)</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={18}
            placeholder="Write your blog content here... Use ## for headings, **bold**, *italic*"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-y"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-2">
          <button
            onClick={() => handleSubmit('draft')}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition disabled:opacity-50"
          >
            <FiSave /> Save Draft
          </button>
          <button
            onClick={() => handleSubmit('published')}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            <FiSend /> {loading ? 'Publishing...' : 'Publish Blog'}
          </button>
        </div>
      </div>
    </div>
  );
}
