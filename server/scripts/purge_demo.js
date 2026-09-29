const db = require('../config/db');

console.log('🧹 Purging demo data from Shagun Shine Cosmetics database...\n');

try {
  const purgeTx = db.transaction(() => {
    // 1. Delete all order items & orders
    db.exec('DELETE FROM order_items;');
    db.exec('DELETE FROM orders;');

    // 2. Delete return requests
    db.exec('DELETE FROM returns;');

    // 3. Delete coupon usages & reset times_used
    db.exec('DELETE FROM coupon_usages;');
    db.exec('UPDATE coupons SET times_used = 0;');

    // 4. Delete inventory logs & reset product stocks to active 50 units
    db.exec('DELETE FROM inventory_logs;');
    db.exec("UPDATE products SET stock_quantity = 50, status = 'active';");

    // 5. Delete demo customer users & saved addresses
    db.exec("DELETE FROM addresses WHERE user_id IN (SELECT id FROM users WHERE role = 'customer');");
    db.exec("DELETE FROM users WHERE role = 'customer';");

    // 6. Clear audit logs and record clean initialization log
    db.exec('DELETE FROM audit_logs;');
    const stmt = db.prepare(`
      INSERT INTO audit_logs (user_name, user_email, user_role, action, entity_type, entity_id, details, ip_address, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `);
    stmt.run(
      'System Administrator',
      'admin@shagunshine.com',
      'super_admin',
      'PRODUCTION_INITIALIZE_PURGE',
      'system',
      'database',
      JSON.stringify({ message: 'Pristine Database Cleaned & Prepared for Live Client Handover' }),
      '127.0.0.1'
    );
  });

  purgeTx();

  const ordersCount = db.prepare('SELECT COUNT(*) as c FROM orders').get().c;
  const customersCount = db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'customer'").get().c;
  const staffCount = db.prepare("SELECT COUNT(*) as c FROM users WHERE role != 'customer'").get().c;
  const productsCount = db.prepare('SELECT COUNT(*) as c FROM products').get().c;
  const categoriesCount = db.prepare('SELECT COUNT(*) as c FROM categories').get().c;
  const couponsCount = db.prepare('SELECT COUNT(*) as c FROM coupons').get().c;

  console.log('✅ DEMO DATA PURGED SUCCESSFULLY!\n');
  console.log('📊 Database Status:');
  console.log(`   - Orders: ${ordersCount} (Clean 0)`);
  console.log(`   - Customer Accounts: ${customersCount} (Clean 0)`);
  console.log(`   - Staff & Admin Logins: ${staffCount} (Preserved)`);
  console.log(`   - Product Catalog: ${productsCount} Formulations (Preserved & Reset to 50 stock)`);
  console.log(`   - Categories: ${categoriesCount} (Preserved)`);
  console.log(`   - Active Coupons: ${couponsCount} (Times used reset to 0)\n`);
} catch (error) {
  console.error('❌ Failed to purge demo data:', error.message);
  process.exit(1);
}
