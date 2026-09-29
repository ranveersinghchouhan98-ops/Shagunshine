const db = require('../config/db');
const bcrypt = require('bcryptjs');

console.log('🧹 Executing Complete Admin Panel & Transactional Data Purge...\n');

try {
  const superAdminPassword = bcrypt.hashSync('@ShagunShinecosmetics887', 10);

  const purgeTx = db.transaction(() => {
    // 1. Wipe all orders, order items & returns
    db.exec('DELETE FROM order_items;');
    db.exec('DELETE FROM orders;');
    db.exec('DELETE FROM returns;');

    // 2. Wipe coupon usages & reset coupon counters
    db.exec('DELETE FROM coupon_usages;');
    db.exec('UPDATE coupons SET times_used = 0;');

    // 3. Wipe all inventory logs & reset stock to clean 50 units
    db.exec('DELETE FROM inventory_logs;');
    db.exec("UPDATE products SET stock_quantity = 50, status = 'active';");

    // 4. Wipe all customer accounts and saved addresses
    db.exec("DELETE FROM addresses;");
    db.exec("DELETE FROM users;");

    // 5. Wipe newsletter subscribers & password reset tokens
    try { db.exec('DELETE FROM newsletter_subscribers;'); } catch (e) {}
    try { db.exec('DELETE FROM password_resets;'); } catch (e) {}

    // 6. Wipe all customer reviews
    try { db.exec('DELETE FROM reviews;'); } catch (e) {}

    // 7. Wipe all audit logs
    db.exec('DELETE FROM audit_logs;');

    // 8. Re-insert single clean Super Admin
    const insertAdmin = db.prepare(`
      INSERT INTO users (id, name, email, password, phone, role, avatar, is_blocked)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0)
    `);

    insertAdmin.run(
      'usr_super_admin_001',
      'Shagun Shine Super Admin',
      'shagunshine887@gmail.com',
      superAdminPassword,
      '+91 9876543210',
      'admin',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    );
  });

  purgeTx();

  console.log('✅ COMPLETE PURGE FINISHED SUCCESSFULLY!\n');
  console.log('📊 Current Clean Admin Panel Status:');
  console.log(`   - Orders: ${db.prepare('SELECT COUNT(*) as c FROM orders').get().c}`);
  console.log(`   - Return Requests: ${db.prepare('SELECT COUNT(*) as c FROM returns').get().c}`);
  console.log(`   - Customer Accounts: ${db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'customer'").get().c}`);
  console.log(`   - Customer Reviews: ${db.prepare('SELECT COUNT(*) as c FROM reviews').get().c}`);
  console.log(`   - Audit Trail Logs: ${db.prepare('SELECT COUNT(*) as c FROM audit_logs').get().c}`);
  console.log(`   - Inventory Logs: ${db.prepare('SELECT COUNT(*) as c FROM inventory_logs').get().c}`);
  console.log(`   - Super Admin: 1 (${db.prepare("SELECT email FROM users WHERE role = 'admin'").get().email})`);
  console.log(`   - Product Formulations: ${db.prepare('SELECT COUNT(*) as c FROM products').get().c} (Catalog Preserved, Stock = 50)`);
  console.log(`   - Categories: ${db.prepare('SELECT COUNT(*) as c FROM categories').get().c} (Preserved)\n`);
} catch (error) {
  console.error('❌ Purge error:', error.message);
  process.exit(1);
}
