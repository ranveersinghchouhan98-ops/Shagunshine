const db = require('../config/db');
const bcrypt = require('bcryptjs');

const rawPassword = process.env.ADMIN_PASSWORD || process.argv[2];
if (!rawPassword) {
  console.error('ERROR: ADMIN_PASSWORD environment variable or argument is required.');
  process.exit(1);
}
const email = process.env.ADMIN_EMAIL || 'shagunshine887@gmail.com';
const hashedPassword = bcrypt.hashSync(rawPassword, 10);

console.log('👑 Configuring single Super Admin account...');

const updateAdminTx = db.transaction(() => {
  // Delete all existing staff/admin accounts
  db.exec("DELETE FROM users WHERE role != 'customer';");

  // Insert single Super Admin
  const stmt = db.prepare(`
    INSERT INTO users (id, name, email, password, phone, role, avatar)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    'usr_super_admin_001',
    'Shagun Shine Super Admin',
    email,
    hashedPassword,
    '+91 9876543210',
    'admin',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  );
});

updateAdminTx();

const admins = db.prepare('SELECT id, name, email, role FROM users').all();
console.log('✅ Single Super Admin configured successfully!\n');
console.table(admins);
