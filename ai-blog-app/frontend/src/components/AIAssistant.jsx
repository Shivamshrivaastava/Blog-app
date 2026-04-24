import { useState } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { FiZap, FiChevronDown, FiChevronUp, FiCopy, FiCheck } from 'react-icons/fi';

const AIFeatureButton = ({ label, onClick, loading, feature, activeFeature }) => (
  <button
    onClick={onClick}
    disabled={loading && activeFeature === feature}
    className={`text-sm px-3 py-1.5 rounded-lg border font-medium transition flex items-center gap-1
      ${activeFeature === feature && loading
        ? 'bg-indigo-50 border-indigo-300 text-indigo-600'
        : 'border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50'
      }`}
  >
    {activeFeature === feature && loading ? (
      <span className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
    ) : (
      <FiZap className="text-xs" />
    )}
    {label}
  </button>
);

export default function AIAssistant({ title, content, onInsert }) {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState('');
  const [resultList, setResultList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState('');
  const [copied, setCopied] = useState(false);
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [keywords, setKeywords] = useState('');

  const run = async (feature, payload) => {
    setLoading(true);
    setActiveFeature(feature);
    setResult('');
    setResultList([]);
    try {
      const { data } = await API.post(`/ai/${feature}`, payload);
      if (data.titles) setResultList(data.titles);
      else if (data.tags) setResultList(data.tags);
      else if (data.headlines) setResultList(data.headlines);
      else if (data.content) setResult(data.content);
      else if (data.summary) setResult(data.summary);
      else if (data.improved) setResult(data.improved);
      else if (data.intros) setResult(data.intros);
      toast.success('AI result ready!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI request failed');
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-indigo-200 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 mb-5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-indigo-700"
      >
        <span className="flex items-center gap-2"><FiZap /> AI Writing Assistant</span>
        {open ? <FiChevronUp /> : <FiChevronDown />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3">
          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="Topic / Keyword"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
            />
            <input
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
              placeholder="Focus keywords (comma separated)"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
            />
            <select
              value={tone}
              onChange={e => setTone(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual & Friendly</option>
              <option value="technical">Technical</option>
              <option value="persuasive">Persuasive</option>
              <option value="educational">Educational</option>
            </select>
          </div>

          {/* Feature Buttons */}
          <div className="flex flex-wrap gap-2">
            <AIFeatureButton label="Generate Titles" feature="generate-title" loading={loading} activeFeature={activeFeature}
              onClick={() => run('generate-title', { topic: topic || title || 'blog writing' })} />
            <AIFeatureButton label="Generate Content" feature="generate-content" loading={loading} activeFeature={activeFeature}
              onClick={() => run('generate-content', { title: title || topic, keywords, tone })} />
            <AIFeatureButton label="Auto Summary" feature="generate-summary" loading={loading} activeFeature={activeFeature}
              onClick={() => run('generate-summary', { content: content || 'Please add content first' })} />
            <AIFeatureButton label="Generate Tags" feature="generate-tags" loading={loading} activeFeature={activeFeature}
              onClick={() => run('generate-tags', { title: title || topic, content })} />
            <AIFeatureButton label="Improve Grammar" feature="improve-grammar" loading={loading} activeFeature={activeFeature}
              onClick={() => run('improve-grammar', { text: content?.substring(0, 2000) || 'No content yet' })} />
            <AIFeatureButton label="SEO Headlines" feature="seo-headlines" loading={loading} activeFeature={activeFeature}
              onClick={() => run('seo-headlines', { topic: topic || title, keyword: keywords.split(',')[0] })} />
            <AIFeatureButton label="Intro Ideas" feature="suggest-intro" loading={loading} activeFeature={activeFeature}
              onClick={() => run('suggest-intro', { title: title || topic })} />
          </div>

          {/* Results */}
          {resultList.length > 0 && (
            <div className="mt-2 bg-white rounded-lg border border-indigo-100 p-3 space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">AI Suggestions</p>
              {resultList.map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-2 group">
                  <p className="text-sm text-gray-700 flex-1">{item}</p>
                  <button onClick={() => { copyText(item); onInsert && onInsert(item, activeFeature); }}
                    className="text-indigo-500 hover:text-indigo-700 opacity-0 group-hover:opacity-100 transition text-xs flex items-center gap-1">
                    <FiCopy /> Use
                  </button>
                </div>
              ))}
            </div>
          )}

          {result && (
            <div className="mt-2 bg-white rounded-lg border border-indigo-100 p-3">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">AI Result</p>
                <div className="flex gap-2">
                  <button onClick={() => copyText(result)} className="text-xs text-indigo-500 hover:text-indigo-700 flex items-center gap-1">
                    {copied ? <FiCheck /> : <FiCopy />} Copy
                  </button>
                  {onInsert && (
                    <button onClick={() => onInsert(result, activeFeature)} className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700">
                      Insert
                    </button>
                  )}
                </div>
              </div>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{result}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
