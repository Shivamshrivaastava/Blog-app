const express = require('express');
const router = express.Router();
const {
  generateTitle, generateContent, generateSummary,
  generateTags, improveGrammar, seoHeadlines, suggestIntro
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate-title', protect, generateTitle);
router.post('/generate-content', protect, generateContent);
router.post('/generate-summary', protect, generateSummary);
router.post('/generate-tags', protect, generateTags);
router.post('/improve-grammar', protect, improveGrammar);
router.post('/seo-headlines', protect, seoHeadlines);
router.post('/suggest-intro', protect, suggestIntro);

module.exports = router;
