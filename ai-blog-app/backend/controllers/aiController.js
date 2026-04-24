const Groq = require('groq-sdk');

// Debug: confirm key is loaded
if (!process.env.GROQ_API_KEY) {
  console.error('❌ GROQ_API_KEY is missing from .env!');
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const callGroq = async (prompt) => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
      temperature: 0.7,
      max_tokens: 1024,
    });
    return completion.choices[0]?.message?.content || '';
  } catch (err) {
    console.error('Groq API error:', err);
    throw err;
  }
};

// @POST /api/ai/generate-title
const generateTitle = async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ message: 'Topic is required' });

    const prompt = `Generate 5 compelling, SEO-friendly blog post titles for the topic: "${topic}". 
    Return only the titles as a numbered list (1. title, 2. title...). Make them engaging and click-worthy.`;

    const text = await callGroq(prompt);
    const titles = text.split('\n')
      .filter(line => line.match(/^\d+[\.\)]/))
      .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim())
      .filter(Boolean);

    res.json({ titles: titles.length ? titles : [text.trim()] });
  } catch (err) {
    console.error('AI generate-title error:', err);
    res.status(500).json({ message: 'AI Error: ' + (err.message || 'Unknown error') });
  }
};

// @POST /api/ai/generate-content
const generateContent = async (req, res) => {
  try {
    const { title, keywords, tone } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const prompt = `Write a well-structured, engaging blog post with the title: "${title}".
    ${keywords ? `Include these keywords: ${keywords}.` : ''}
    ${tone ? `Writing tone: ${tone}.` : 'Tone: professional and informative.'}
    
    Format the blog post with:
    - An engaging introduction
    - Clear section headings (use ## for headings)
    - Well-organized paragraphs
    - A strong conclusion
    
    Make it SEO-friendly, informative, and approximately 600-800 words.`;

    const text = await callGroq(prompt);
    res.json({ content: text });
  } catch (err) {
    console.error('AI generate-content error:', err);
    res.status(500).json({ message: 'AI Error: ' + (err.message || 'Unknown error') });
  }
};

// @POST /api/ai/generate-summary
const generateSummary = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Content is required' });

    const prompt = `Write a concise, engaging meta description/summary for the following blog content. 
    Keep it under 160 characters and make it SEO-friendly.
    Return ONLY the summary text, nothing else.
    
    Content: ${content.substring(0, 2000)}`;

    const text = await callGroq(prompt);
    res.json({ summary: text.trim() });
  } catch (err) {
    console.error('AI generate-summary error:', err);
    res.status(500).json({ message: 'AI Error: ' + (err.message || 'Unknown error') });
  }
};

// @POST /api/ai/generate-tags
const generateTags = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const prompt = `Generate 8-10 relevant tags/keywords for a blog post titled "${title}".
    ${content ? `Content snippet: ${content.substring(0, 500)}` : ''}
    
    Return ONLY the tags as a comma-separated list on one line. No numbers, no descriptions, no extra text.
    Example format: technology, programming, web development, javascript`;

    const text = await callGroq(prompt);
    const tags = text
      .replace(/\n/g, ',')
      .split(',')
      .map(t => t.trim().toLowerCase().replace(/^[-*•]\s*/, ''))
      .filter(t => t && t.length < 40);

    res.json({ tags });
  } catch (err) {
    console.error('AI generate-tags error:', err);
    res.status(500).json({ message: 'AI Error: ' + (err.message || 'Unknown error') });
  }
};

// @POST /api/ai/improve-grammar
const improveGrammar = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Text is required' });

    const prompt = `Improve the grammar, clarity, and readability of the following text. 
    Fix any grammatical errors, improve sentence structure, and enhance readability while keeping the original meaning and tone intact.
    Return ONLY the improved text, nothing else.
    
    Text: ${text}`;

    const improved = await callGroq(prompt);
    res.json({ improved: improved.trim() });
  } catch (err) {
    console.error('AI improve-grammar error:', err);
    res.status(500).json({ message: 'AI Error: ' + (err.message || 'Unknown error') });
  }
};

// @POST /api/ai/seo-headlines
const seoHeadlines = async (req, res) => {
  try {
    const { topic, keyword } = req.body;
    if (!topic) return res.status(400).json({ message: 'Topic is required' });

    const prompt = `Generate 5 SEO-optimized headlines for a blog about "${topic}".
    ${keyword ? `Primary keyword: ${keyword}` : ''}
    
    Rules:
    - Include numbers where appropriate (e.g., "10 Ways to...")
    - Use power words
    - Keep under 65 characters
    - Naturally include the keyword
    
    Return as a numbered list only.`;

    const text = await callGroq(prompt);
    const headlines = text.split('\n')
      .filter(line => line.match(/^\d+[\.\)]/))
      .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim())
      .filter(Boolean);

    res.json({ headlines: headlines.length ? headlines : [text.trim()] });
  } catch (err) {
    console.error('AI seo-headlines error:', err);
    res.status(500).json({ message: 'AI Error: ' + (err.message || 'Unknown error') });
  }
};

// @POST /api/ai/suggest-intro
const suggestIntro = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const prompt = `Write 3 different engaging introductory paragraphs for a blog post titled "${title}".
    Each intro should be 2-3 sentences, hook the reader, and introduce the topic.
    Label them clearly: Option 1:, Option 2:, Option 3:`;

    const text = await callGroq(prompt);
    res.json({ intros: text.trim() });
  } catch (err) {
    console.error('AI suggest-intro error:', err);
    res.status(500).json({ message: 'AI Error: ' + (err.message || 'Unknown error') });
  }
};

module.exports = { generateTitle, generateContent, generateSummary, generateTags, improveGrammar, seoHeadlines, suggestIntro };
