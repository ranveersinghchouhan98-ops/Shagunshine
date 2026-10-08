const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const sanitizeHtml = require('sanitize-html');
const db = require('../config/db');
const { verifyToken, optionalToken, hasRole } = require('../middleware/auth');

// @route   POST /api/reviews
// @desc    Customer submits a review for a product
router.post('/', optionalToken, (req, res) => {
  try {
    const { productId, rating, title, comment, authorName, authorEmail } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Product ID, rating (1-5), and review text are required.' });
    }

    const product = db.prepare('SELECT id FROM products WHERE id = ?').get(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const userId = req.user ? req.user.id : null;

    // Prevent duplicate reviews on the same product by the same user
    if (userId) {
      const existingReview = db.prepare('SELECT id FROM reviews WHERE product_id = ? AND user_id = ?').get(productId, userId);
      if (existingReview) {
        return res.status(400).json({ success: false, message: 'You have already submitted a review for this product.' });
      }
    }

    const cleanName = sanitizeHtml(req.user ? req.user.name : (authorName || 'Verified Buyer'), { allowedTags: [], allowedAttributes: {} }).trim().substring(0, 60);
    const cleanEmail = sanitizeHtml(req.user ? req.user.email : (authorEmail || ''), { allowedTags: [], allowedAttributes: {} }).trim().toLowerCase().substring(0, 100);
    const cleanTitle = sanitizeHtml(title || '', { allowedTags: [], allowedAttributes: {} }).trim().substring(0, 120);
    const cleanComment = sanitizeHtml(comment || '', { allowedTags: [], allowedAttributes: {} }).trim().substring(0, 2000);

    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    // Check duplicate by email if guest
    if (!userId && cleanEmail) {
      const existingReview = db.prepare('SELECT id FROM reviews WHERE product_id = ? AND author_email = ?').get(productId, cleanEmail);
      if (existingReview) {
        return res.status(400).json({ success: false, message: 'A review for this product has already been submitted with this email.' });
      }
    }

    const validRating = Math.min(5, Math.max(1, Math.round(Number(rating) || 5)));
    const reviewId = 'rev_' + uuidv4().substring(0, 8);

    db.prepare(`
      INSERT INTO reviews (id, product_id, user_id, author_name, author_email, rating, title, comment, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'approved')
    `).run(reviewId, productId, userId, cleanName, cleanEmail, validRating, cleanTitle, cleanComment);

    // Recalculate product rating and review count
    const stats = db.prepare(`
      SELECT AVG(rating) as avg_rating, COUNT(*) as count
      FROM reviews
      WHERE product_id = ? AND status = 'approved'
    `).get(productId);

    db.prepare(`
      UPDATE products SET
        rating = ROUND(?, 1),
        reviews_count = ?
      WHERE id = ?
    `).run(stats.avg_rating || 5.0, stats.count || 0, productId);

    const created = db.prepare('SELECT * FROM reviews WHERE id = ?').get(reviewId);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been submitted.',
      review: created
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({ success: false, message: 'Server error submitting review.' });
  }
});

// @route   GET /api/reviews/admin/all (Admin / Product Manager)
// @desc    Get all reviews for moderation
router.get('/admin/all', verifyToken, hasRole(['admin', 'product_manager']), (req, res) => {
  try {
    const { status, search } = req.query;
    let query = `
      SELECT r.*, p.name as product_name, p.slug as product_slug, p.images as product_images
      FROM reviews r
      JOIN products p ON r.product_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'All') {
      query += ` AND r.status = ?`;
      params.push(status);
    }

    if (search) {
      const cleanSearch = String(search).trim().substring(0, 80).replace(/[%_\\]/g, '\\$&');
      query += ` AND (r.author_name LIKE ? ESCAPE '\\' OR r.comment LIKE ? ESCAPE '\\' OR p.name LIKE ? ESCAPE '\\')`;
      const term = `%${cleanSearch}%`;
      params.push(term, term, term);
    }

    query += ` ORDER BY r.created_at DESC`;

    const reviews = db.prepare(query).all(...params);
    const formatted = reviews.map(r => ({
      ...r,
      product_image: JSON.parse(r.product_images || '[]')[0] || ''
    }));

    res.json({ success: true, reviews: formatted });
  } catch (error) {
    console.error('Fetch admin reviews error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching reviews.' });
  }
});

// @route   PUT /api/reviews/:id/status (Admin / Product Manager)
// @desc    Approve or reject a review
router.put('/:id/status', verifyToken, hasRole(['admin', 'product_manager']), (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved', 'rejected', 'pending'

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Allowed values: approved, rejected, pending.' });
    }

    const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    db.prepare('UPDATE reviews SET status = ? WHERE id = ?').run(status, id);

    // Update product rating
    const stats = db.prepare(`
      SELECT AVG(rating) as avg_rating, COUNT(*) as count
      FROM reviews
      WHERE product_id = ? AND status = 'approved'
    `).get(review.product_id);

    db.prepare(`
      UPDATE products SET
        rating = COALESCE(ROUND(?, 1), 5.0),
        reviews_count = ?
      WHERE id = ?
    `).run(stats.avg_rating, stats.count, review.product_id);

    res.json({ success: true, message: `Review status changed to ${status}.` });
  } catch (error) {
    console.error('Update review status error:', error);
    res.status(500).json({ success: false, message: 'Server error updating review status.' });
  }
});

// @route   DELETE /api/reviews/:id (Admin only)
router.delete('/:id', verifyToken, hasRole(['admin']), (req, res) => {
  try {
    const { id } = req.params;
    const review = db.prepare('SELECT product_id FROM reviews WHERE id = ?').get(id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    db.prepare('DELETE FROM reviews WHERE id = ?').run(id);

    const stats = db.prepare(`
      SELECT AVG(rating) as avg_rating, COUNT(*) as count
      FROM reviews
      WHERE product_id = ? AND status = 'approved'
    `).get(review.product_id);

    db.prepare(`
      UPDATE products SET
        rating = COALESCE(ROUND(?, 1), 5.0),
        reviews_count = ?
      WHERE id = ?
    `).run(stats.avg_rating, stats.count, review.product_id);

    res.json({ success: true, message: 'Review deleted successfully.' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting review.' });
  }
});

module.exports = router;
