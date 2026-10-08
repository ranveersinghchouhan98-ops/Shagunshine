const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { verifyToken, hasRole, optionalToken, requirePermission } = require('../middleware/auth');
const auditService = require('../services/auditService');
const webhookService = require('../services/webhookService');

// Helper to sanitize product object and protect sensitive cost price
const formatProduct = (p, isAuthorizedStaff = false) => {
  if (!p) return null;
  const productObj = {
    ...p,
    benefits: typeof p.benefits === 'string' ? JSON.parse(p.benefits || '[]') : p.benefits || [],
    shades: typeof p.shades === 'string' ? JSON.parse(p.shades || '[]') : p.shades || [],
    images: typeof p.images === 'string' ? JSON.parse(p.images || '[]') : p.images || []
  };

  // If not authorized staff, strip cost_price
  if (!isAuthorizedStaff) {
    delete productObj.cost_price;
  }

  // Attach variants if any
  const variants = db.prepare('SELECT * FROM product_variants WHERE product_id = ?').all(p.id);
  productObj.variants = variants.map(v => ({
    ...v,
    attributes: typeof v.attributes === 'string' ? JSON.parse(v.attributes || '{}') : v.attributes || {}
  }));

  return productObj;
};

// Check if requester has staff access to view cost prices
const isStaffUser = (req) => {
  return req.user && ['admin', 'super_admin', 'product_manager'].includes(req.user.role);
};

// @route   GET /api/products/search/suggestions
// @desc    Live autocomplete product search suggestions
router.get('/search/suggestions', (req, res) => {
  try {
    const q = req.query.q || '';
    const cleanQ = String(q).trim().substring(0, 80);
    if (!cleanQ) {
      return res.json({ success: true, suggestions: [] });
    }

    const escapedTerm = cleanQ.replace(/[%_\\]/g, '\\$&');
    const searchTerm = `%${escapedTerm}%`;
    const products = db.prepare(`
      SELECT p.id, p.name, p.slug, p.price, p.discount_price, p.images, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE (p.name LIKE ? ESCAPE '\\' OR p.description LIKE ? ESCAPE '\\' OR p.subcategory LIKE ? ESCAPE '\\' OR c.name LIKE ? ESCAPE '\\')
      AND p.status = 'active'
      LIMIT 6
    `).all(searchTerm, searchTerm, searchTerm, searchTerm);

    const formatted = products.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      discount_price: p.discount_price,
      category_name: p.category_name,
      image: JSON.parse(p.images || '[]')[0] || ''
    }));

    res.json({ success: true, suggestions: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching suggestions.' });
  }
});

// @route   GET /api/products
// @desc    Get all products with filters, sorting, and pagination
router.get('/', optionalToken, (req, res) => {
  try {
    const {
      category,
      subcategory,
      minPrice,
      maxPrice,
      skinType,
      featured,
      bestSeller,
      newArrival,
      search,
      sort,
      status,
      limit = 50,
      page = 1
    } = req.query;

    const safeLimit = Math.min(Math.max(1, parseInt(limit) || 50), 100);
    const safePage = Math.max(1, parseInt(page) || 1);

    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    // Filter by status (public sees only 'active' by default)
    if (status) {
      query += ` AND p.status = ?`;
      params.push(status);
    } else if (!isStaffUser(req)) {
      query += ` AND p.status = 'active'`;
    }

    if (category) {
      query += ` AND (c.slug = ? OR c.id = ?)`;
      params.push(category, category);
    }

    if (subcategory) {
      query += ` AND p.subcategory = ?`;
      params.push(subcategory);
    }

    if (skinType && skinType !== 'All') {
      const cleanSkinType = String(skinType).trim().substring(0, 50).replace(/[%_\\]/g, '\\$&');
      query += ` AND (p.skin_type LIKE ? ESCAPE '\\' OR p.skin_type = 'All Skin Types')`;
      params.push(`%${cleanSkinType}%`);
    }

    if (minPrice && !isNaN(Number(minPrice))) {
      query += ` AND COALESCE(p.discount_price, p.price) >= ?`;
      params.push(Math.max(0, Number(minPrice)));
    }

    if (maxPrice && !isNaN(Number(maxPrice))) {
      query += ` AND COALESCE(p.discount_price, p.price) <= ?`;
      params.push(Math.max(0, Number(maxPrice)));
    }

    if (featured === 'true' || featured === '1') {
      query += ` AND p.is_featured = 1`;
    }

    if (bestSeller === 'true' || bestSeller === '1') {
      query += ` AND p.is_best_seller = 1`;
    }

    if (newArrival === 'true' || newArrival === '1') {
      query += ` AND p.is_new_arrival = 1`;
    }

    if (search) {
      const cleanSearch = String(search).trim().substring(0, 100);
      const escapedSearch = cleanSearch.replace(/[%_\\]/g, '\\$&');
      query += ` AND (p.name LIKE ? ESCAPE '\\' OR p.description LIKE ? ESCAPE '\\' OR p.sku LIKE ? ESCAPE '\\' OR p.hsn_code LIKE ? ESCAPE '\\')`;
      const term = `%${escapedSearch}%`;
      params.push(term, term, term, term);
    }

    // Sorting
    switch (sort) {
      case 'price_asc':
        query += ` ORDER BY COALESCE(p.discount_price, p.price) ASC`;
        break;
      case 'price_desc':
        query += ` ORDER BY COALESCE(p.discount_price, p.price) DESC`;
        break;
      case 'rating':
        query += ` ORDER BY p.rating DESC`;
        break;
      case 'newest':
        query += ` ORDER BY p.created_at DESC`;
        break;
      default:
        query += ` ORDER BY p.is_best_seller DESC, p.created_at DESC`;
    }

    const offset = (safePage - 1) * safeLimit;
    query += ` LIMIT ? OFFSET ?`;
    params.push(safeLimit, offset);

    const products = db.prepare(query).all(...params);

    const countQuery = `SELECT COUNT(*) as total FROM products WHERE status = 'active'`;
    const totalCount = db.prepare(countQuery).get().total;

    const authorized = isStaffUser(req);
    res.json({
      success: true,
      products: products.map(p => formatProduct(p, authorized)),
      total: totalCount,
      page: Number(page),
      totalPages: Math.ceil(totalCount / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching products.' });
  }
});

// @route   GET /api/products/:slugOrId
// @desc    Get single product by slug or id
router.get('/:slugOrId', optionalToken, (req, res) => {
  try {
    const { slugOrId } = req.params;
    const product = db.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ? OR p.id = ?
    `).get(slugOrId, slugOrId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const authorized = isStaffUser(req);

    // Get approved customer reviews (mask PII: do not leak author_email)
    const reviews = db.prepare(`
      SELECT r.id, r.product_id, r.user_id, r.author_name, r.rating, r.title, r.comment, r.status, r.is_verified_purchase, r.created_at, u.avatar as user_avatar
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ? AND r.status = 'approved'
      ORDER BY r.created_at DESC
    `).all(product.id);

    // Get related products from same category
    const relatedProducts = db.prepare(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = ? AND p.id != ? AND p.status = 'active'
      LIMIT 4
    `).all(product.category_id, product.id);

    res.json({
      success: true,
      product: formatProduct(product, authorized),
      reviews,
      relatedProducts: relatedProducts.map(p => formatProduct(p, authorized))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching product detail.' });
  }
});

// @route   POST /api/products (Admin / Product Manager)
router.post('/', verifyToken, requirePermission('manage_products'), (req, res) => {
  try {
    const {
      name,
      sku,
      category_id,
      subcategory,
      price,
      mrp,
      discount_price,
      cost_price,
      gst_rate = 18,
      hsn_code = '330499',
      batch_number,
      mfg_date,
      exp_date,
      warnings,
      storage_instructions,
      stock_quantity = 0,
      description,
      short_description,
      ingredients,
      how_to_use,
      skin_type,
      benefits = [],
      shades = [],
      images = [],
      status = 'active',
      is_featured = 0,
      is_best_seller = 0,
      is_new_arrival = 1
    } = req.body;

    if (!name || !sku || !category_id || price === undefined) {
      return res.status(400).json({ success: false, message: 'Name, SKU, category, and price are required.' });
    }

    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let slug = baseSlug;
    let counter = 1;
    while (db.prepare('SELECT id FROM products WHERE slug = ?').get(slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    const productId = 'prod_' + uuidv4().substring(0, 8);
    const finalMrp = mrp !== undefined ? Number(mrp) : Number(price);

    db.prepare(`
      INSERT INTO products (
        id, name, slug, sku, category_id, subcategory, price, mrp, discount_price, cost_price,
        gst_rate, hsn_code, batch_number, mfg_date, exp_date, warnings, storage_instructions,
        stock_quantity, description, short_description, ingredients, how_to_use, skin_type,
        benefits, shades, images, status, is_featured, is_best_seller, is_new_arrival
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?
      )
    `).run(
      productId, name, slug, sku, category_id, subcategory || '', Number(price), finalMrp,
      discount_price ? Number(discount_price) : null, cost_price ? Number(cost_price) : null,
      Number(gst_rate || 18), hsn_code || '330499', batch_number || null, mfg_date || null, exp_date || null,
      warnings || '', storage_instructions || 'Store in a cool, dry place away from direct sunlight.',
      Number(stock_quantity || 0), description || '', short_description || '', ingredients || '', how_to_use || '',
      skin_type || 'All Skin Types',
      JSON.stringify(Array.isArray(benefits) ? benefits : []),
      JSON.stringify(Array.isArray(shades) ? shades : []),
      JSON.stringify(Array.isArray(images) && images.length ? images : ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80']),
      status, is_featured ? 1 : 0, is_best_seller ? 1 : 0, is_new_arrival ? 1 : 0
    );

    // Record initial inventory log if stock > 0
    if (Number(stock_quantity) > 0) {
      db.prepare(`
        INSERT INTO inventory_logs (
          id, product_id, change_type, quantity_change, previous_stock, new_stock, reason, user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(uuidv4(), productId, 'INITIAL', Number(stock_quantity), 0, Number(stock_quantity), 'Initial stock setup', req.user.id);
    }

    auditService.log({
      userId: req.user.id,
      userEmail: req.user.email,
      userRole: req.user.role,
      action: 'CREATE_PRODUCT',
      entityType: 'product',
      entityId: productId,
      details: { name, sku, price, stock_quantity },
      ipAddress: req.ip
    });

    const created = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);

    // Trigger webhook event for downstream & AI
    webhookService.trigger('product.created', {
      id: created.id,
      sku: created.sku,
      name: created.name,
      price: created.price,
      mrp: created.mrp,
      stock_quantity: created.stock_quantity
    });

    res.status(201).json({ success: true, message: 'Product created successfully!', product: formatProduct(created, true) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error creating product.' });
  }
});

// @route   PUT /api/products/:id
router.put('/:id', verifyToken, requirePermission('manage_products'), (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const {
      name,
      sku,
      category_id,
      subcategory,
      mrp,
      price,
      discount_price,
      cost_price,
      gst_rate,
      hsn_code,
      batch_number,
      mfg_date,
      exp_date,
      warnings,
      storage_instructions,
      stock_quantity,
      description,
      short_description,
      ingredients,
      how_to_use,
      skin_type,
      benefits,
      shades,
      images,
      status,
      is_featured,
      is_best_seller,
      is_new_arrival
    } = req.body;

    // Track stock change if stock_quantity changed
    if (stock_quantity !== undefined && Number(stock_quantity) !== existing.stock_quantity) {
      const diff = Number(stock_quantity) - existing.stock_quantity;
      db.prepare(`
        INSERT INTO inventory_logs (
          id, product_id, change_type, quantity_change, previous_stock, new_stock, reason, user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        uuidv4(),
        id,
        'ADJUSTMENT',
        diff,
        existing.stock_quantity,
        Number(stock_quantity),
        'Direct update in product manager',
        req.user.id
      );

      // Trigger stock update webhook
      webhookService.trigger('stock.updated', {
        id,
        sku: sku || existing.sku,
        previous_stock: existing.stock_quantity,
        new_stock: Number(stock_quantity),
        source: 'admin_update'
      });
    }

    db.prepare(`
      UPDATE products SET
        name = COALESCE(?, name),
        sku = COALESCE(?, sku),
        category_id = COALESCE(?, category_id),
        subcategory = COALESCE(?, subcategory),
        price = COALESCE(?, price),
        mrp = COALESCE(?, mrp),
        discount_price = ?,
        cost_price = ?,
        gst_rate = COALESCE(?, gst_rate),
        hsn_code = COALESCE(?, hsn_code),
        batch_number = COALESCE(?, batch_number),
        mfg_date = COALESCE(?, mfg_date),
        exp_date = COALESCE(?, exp_date),
        warnings = COALESCE(?, warnings),
        storage_instructions = COALESCE(?, storage_instructions),
        stock_quantity = COALESCE(?, stock_quantity),
        description = COALESCE(?, description),
        short_description = COALESCE(?, short_description),
        ingredients = COALESCE(?, ingredients),
        how_to_use = COALESCE(?, how_to_use),
        skin_type = COALESCE(?, skin_type),
        benefits = COALESCE(?, benefits),
        shades = COALESCE(?, shades),
        images = COALESCE(?, images),
        status = COALESCE(?, status),
        is_featured = COALESCE(?, is_featured),
        is_best_seller = COALESCE(?, is_best_seller),
        is_new_arrival = COALESCE(?, is_new_arrival),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      name,
      sku,
      category_id,
      subcategory,
      price !== undefined ? Number(price) : null,
      mrp !== undefined ? Number(mrp) : null,
      discount_price !== undefined ? (discount_price ? Number(discount_price) : null) : existing.discount_price,
      cost_price !== undefined ? (cost_price ? Number(cost_price) : null) : existing.cost_price,
      gst_rate !== undefined ? Number(gst_rate) : null,
      hsn_code,
      batch_number,
      mfg_date,
      exp_date,
      warnings,
      storage_instructions,
      stock_quantity !== undefined ? Number(stock_quantity) : null,
      description,
      short_description,
      ingredients,
      how_to_use,
      skin_type,
      benefits ? JSON.stringify(benefits) : null,
      shades ? JSON.stringify(shades) : null,
      images ? JSON.stringify(images) : null,
      status,
      is_featured !== undefined ? (is_featured ? 1 : 0) : null,
      is_best_seller !== undefined ? (is_best_seller ? 1 : 0) : null,
      is_new_arrival !== undefined ? (is_new_arrival ? 1 : 0) : null,
      id
    );

    auditService.log({
      userId: req.user.id,
      userEmail: req.user.email,
      userRole: req.user.role,
      action: 'UPDATE_PRODUCT',
      entityType: 'product',
      entityId: id,
      details: { name, sku, price, stock_quantity },
      ipAddress: req.ip
    });

    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(id);

    // Trigger webhook event
    webhookService.trigger('product.updated', {
      id: updated.id,
      sku: updated.sku,
      name: updated.name,
      price: updated.price,
      mrp: updated.mrp,
      stock_quantity: updated.stock_quantity
    });

    res.json({ success: true, message: 'Product updated successfully!', product: formatProduct(updated, true) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating product.' });
  }
});

// @route   POST /api/products/:id/adjust-stock
// @desc    Adjust product stock with audit trail
router.post('/:id/adjust-stock', verifyToken, requirePermission('manage_inventory'), (req, res) => {
  try {
    const { id } = req.params;
    const { quantityChange, reason = 'Manual Stock Adjustment', variantId } = req.body;

    if (quantityChange === undefined || isNaN(Number(quantityChange))) {
      return res.status(400).json({ success: false, message: 'quantityChange is required.' });
    }

    const change = Number(quantityChange);
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const prevStock = existing.stock_quantity;
    const newStock = Math.max(0, prevStock + change);
    const changeType = change > 0 ? 'RESTOCK' : (change < 0 ? 'DAMAGED' : 'ADJUSTMENT');

    db.prepare(`
      UPDATE products SET
        stock_quantity = ?,
        status = CASE WHEN ? <= 0 THEN 'out_of_stock' ELSE 'active' END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(newStock, newStock, id);

    db.prepare(`
      INSERT INTO inventory_logs (
        id, product_id, variant_id, change_type, quantity_change, previous_stock, new_stock, reason, user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(uuidv4(), id, variantId || null, changeType, change, prevStock, newStock, reason, req.user.id);

    auditService.log({
      userId: req.user.id,
      userEmail: req.user.email,
      userRole: req.user.role,
      action: 'ADJUST_STOCK',
      entityType: 'product',
      entityId: id,
      details: { previousStock: prevStock, newStock, change, reason },
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: `Stock adjusted by ${change > 0 ? '+' : ''}${change}. Current stock: ${newStock}`,
      newStock
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/products/:id/inventory-logs
// @desc    Get stock history for a product
router.get('/:id/inventory-logs', verifyToken, requirePermission('view_products'), (req, res) => {
  try {
    const { id } = req.params;
    const logs = db.prepare(`
      SELECT il.*, u.name as user_name
      FROM inventory_logs il
      LEFT JOIN users u ON il.user_id = u.id
      WHERE il.product_id = ?
      ORDER BY il.created_at DESC
      LIMIT 100
    `).all(id);

    res.json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/products/:id (Admin only)
router.delete('/:id', verifyToken, hasRole(['admin', 'super_admin']), (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT name FROM products WHERE id = ?').get(id);
    db.prepare('DELETE FROM products WHERE id = ?').run(id);

    auditService.log({
      userId: req.user.id,
      userEmail: req.user.email,
      userRole: req.user.role,
      action: 'DELETE_PRODUCT',
      entityType: 'product',
      entityId: id,
      details: { name: existing?.name },
      ipAddress: req.ip
    });

    res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting product.' });
  }
});

module.exports = router;
