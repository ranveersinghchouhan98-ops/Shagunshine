const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { verifyToken, hasRole } = require('../middleware/auth');
const sanitizeHtml = require('sanitize-html');

// @route   GET /api/banners (Public - active only)
router.get('/', (req, res) => {
  try {
    const banners = db.prepare('SELECT * FROM banners WHERE is_active = 1 ORDER BY position ASC, created_at DESC').all();
    res.json({ success: true, banners });
  } catch (error) {
    console.error('Fetch banners error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching banners.' });
  }
});

// @route   GET /api/banners/all (Admin - all)
router.get('/all', verifyToken, hasRole(['admin']), (req, res) => {
  try {
    const banners = db.prepare('SELECT * FROM banners ORDER BY position ASC, created_at DESC').all();
    res.json({ success: true, banners });
  } catch (error) {
    console.error('Fetch admin banners error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching banners.' });
  }
});

const sanitizeBannerLink = (link) => {
  if (!link || typeof link !== 'string') return '/shop';
  const trimmed = link.trim();
  if (/^(javascript|data|vbscript):/i.test(trimmed)) {
    return '/shop';
  }
  if (trimmed.startsWith('/') || trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
    return trimmed;
  }
  return `/${trimmed}`;
};

// @route   POST /api/banners (Admin)
router.post('/', verifyToken, hasRole(['admin', 'super_admin']), (req, res) => {
  try {
    const { title, subtitle, tagline, cta_text, cta_link, image, badge, banner_type = 'hero', position = 1, is_active = 1 } = req.body;
    if (!title || !image) {
      return res.status(400).json({ success: false, message: 'Title and image URL are required.' });
    }

    const cleanTitle = sanitizeHtml(title, { allowedTags: [], allowedAttributes: {} }).trim();
    const cleanSubtitle = subtitle ? sanitizeHtml(subtitle, { allowedTags: [], allowedAttributes: {} }).trim() : '';
    const cleanTagline = tagline ? sanitizeHtml(tagline, { allowedTags: [], allowedAttributes: {} }).trim() : '';
    const cleanCtaText = cta_text ? sanitizeHtml(cta_text, { allowedTags: [], allowedAttributes: {} }).trim() : 'Shop Now';
    const cleanBadge = badge ? sanitizeHtml(badge, { allowedTags: [], allowedAttributes: {} }).trim() : '';

    const safeCtaLink = sanitizeBannerLink(cta_link);
    const safeImage = sanitizeBannerLink(image);

    const id = 'bnr_' + uuidv4().substring(0, 8);
    db.prepare(`
      INSERT INTO banners (id, title, subtitle, tagline, cta_text, cta_link, image, badge, banner_type, position, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, cleanTitle, cleanSubtitle, cleanTagline, cleanCtaText, safeCtaLink, safeImage, cleanBadge, banner_type, Number(position), is_active ? 1 : 0);

    const banner = db.prepare('SELECT * FROM banners WHERE id = ?').get(id);
    res.status(201).json({ success: true, message: 'Banner created successfully.', banner });
  } catch (error) {
    console.error('Create banner error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error creating banner.' });
  }
});

// @route   PUT /api/banners/:id (Admin)
router.put('/:id', verifyToken, hasRole(['admin', 'super_admin']), (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, tagline, cta_text, cta_link, image, badge, banner_type, position, is_active } = req.body;

    const cleanTitle = title !== undefined ? sanitizeHtml(title, { allowedTags: [], allowedAttributes: {} }).trim() : null;
    const cleanSubtitle = subtitle !== undefined ? sanitizeHtml(subtitle, { allowedTags: [], allowedAttributes: {} }).trim() : null;
    const cleanTagline = tagline !== undefined ? sanitizeHtml(tagline, { allowedTags: [], allowedAttributes: {} }).trim() : null;
    const cleanCtaText = cta_text !== undefined ? sanitizeHtml(cta_text, { allowedTags: [], allowedAttributes: {} }).trim() : null;
    const cleanBadge = badge !== undefined ? sanitizeHtml(badge, { allowedTags: [], allowedAttributes: {} }).trim() : null;

    const safeCtaLink = cta_link !== undefined ? sanitizeBannerLink(cta_link) : null;
    const safeImage = image !== undefined ? sanitizeBannerLink(image) : null;

    db.prepare(`
      UPDATE banners SET
        title = COALESCE(?, title),
        subtitle = COALESCE(?, subtitle),
        tagline = COALESCE(?, tagline),
        cta_text = COALESCE(?, cta_text),
        cta_link = COALESCE(?, cta_link),
        image = COALESCE(?, image),
        badge = COALESCE(?, badge),
        banner_type = COALESCE(?, banner_type),
        position = COALESCE(?, position),
        is_active = COALESCE(?, is_active)
      WHERE id = ?
    `).run(cleanTitle, cleanSubtitle, cleanTagline, cleanCtaText, safeCtaLink, safeImage, cleanBadge, banner_type, position !== undefined ? Number(position) : null, is_active !== undefined ? (is_active ? 1 : 0) : null, id);

    const banner = db.prepare('SELECT * FROM banners WHERE id = ?').get(id);
    res.json({ success: true, message: 'Banner updated successfully.', banner });
  } catch (error) {
    console.error('Update banner error:', error);
    res.status(500).json({ success: false, message: 'Server error updating banner.' });
  }
});

// @route   DELETE /api/banners/:id (Admin)
router.delete('/:id', verifyToken, hasRole(['admin']), (req, res) => {
  try {
    db.prepare('DELETE FROM banners WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Banner removed successfully.' });
  } catch (error) {
    console.error('Delete banner error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting banner.' });
  }
});

module.exports = router;
