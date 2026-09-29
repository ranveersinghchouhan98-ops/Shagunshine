const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { verifyToken, hasRole } = require('../middleware/auth');

// Format category
const formatCat = (cat) => ({
  ...cat,
  subcategories: typeof cat.subcategories === 'string' ? JSON.parse(cat.subcategories || '[]') : cat.subcategories || []
});

// @route   GET /api/categories
// @desc    Get all categories with product counts
router.get('/', (req, res) => {
  try {
    const categories = db.prepare(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.status = 'active'
      WHERE c.is_active = 1
      GROUP BY c.id
      ORDER BY c.created_at ASC
    `).all();

    res.json({
      success: true,
      categories: categories.map(formatCat)
    });
  } catch (error) {
    console.error('Fetch categories error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching categories.' });
  }
});

// @route   GET /api/categories/all (Admin - includes inactive)
router.get('/all', verifyToken, hasRole(['admin', 'product_manager']), (req, res) => {
  try {
    const categories = db.prepare(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id
      ORDER BY c.created_at ASC
    `).all();

    res.json({
      success: true,
      categories: categories.map(formatCat)
    });
  } catch (error) {
    console.error('Fetch admin categories error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching categories.' });
  }
});

// @route   POST /api/categories (Admin / Product Manager)
router.post('/', verifyToken, hasRole(['admin', 'product_manager']), (req, res) => {
  try {
    const { name, description, image, subcategories = [], is_active = 1 } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = 'cat_' + uuidv4().substring(0, 8);

    db.prepare(`
      INSERT INTO categories (id, name, slug, description, image, subcategories, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, name, slug, description || '',
      image || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
      JSON.stringify(Array.isArray(subcategories) ? subcategories : []),
      is_active ? 1 : 0
    );

    const created = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    res.status(201).json({ success: true, message: 'Category created successfully.', category: formatCat(created) });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error creating category.' });
  }
});

// @route   PUT /api/categories/:id (Admin / Product Manager)
router.put('/:id', verifyToken, hasRole(['admin', 'product_manager']), (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, subcategories, is_active } = req.body;

    const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    let slug = existing.slug;
    if (name && name !== existing.name) {
      slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    db.prepare(`
      UPDATE categories SET
        name = COALESCE(?, name),
        slug = ?,
        description = COALESCE(?, description),
        image = COALESCE(?, image),
        subcategories = COALESCE(?, subcategories),
        is_active = COALESCE(?, is_active)
      WHERE id = ?
    `).run(
      name, slug, description, image,
      subcategories ? JSON.stringify(subcategories) : null,
      is_active !== undefined ? (is_active ? 1 : 0) : null,
      id
    );

    const updated = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    res.json({ success: true, message: 'Category updated successfully.', category: formatCat(updated) });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ success: false, message: 'Server error updating category.' });
  }
});

// @route   DELETE /api/categories/:id (Admin only)
router.delete('/:id', verifyToken, hasRole(['admin']), (req, res) => {
  try {
    const { id } = req.params;
    const count = db.prepare('SELECT COUNT(*) as count FROM products WHERE category_id = ?').get(id).count;
    if (count > 0) {
      return res.status(400).json({ success: false, message: `Cannot delete category: contains ${count} products. Reassign or delete products first.` });
    }

    db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    res.json({ success: true, message: 'Category deleted successfully.' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting category.' });
  }
});

module.exports = router;
