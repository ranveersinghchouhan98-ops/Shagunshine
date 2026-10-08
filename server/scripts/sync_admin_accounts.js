const db = require('../config/db');
const bcrypt = require('bcryptjs');

const rawPassword = process.env.ADMIN_PASSWORD || process.argv[2];
if (!rawPassword) {
  console.error('ERROR: ADMIN_PASSWORD environment variable or argument is required.');
  process.exit(1);
}
const hashedPassword = bcrypt.hashSync(rawPassword, 10);

// Ensure primary super admin
const existingPrimary = db.prepare("SELECT id FROM users WHERE email = 'shagunshine887@gmail.com'").get();
if (!existingPrimary) {
  db.prepare(`
    INSERT INTO users (id, name, email, password, phone, role, avatar, is_blocked)
    VALUES (?, ?, ?, ?, ?, 'super_admin', ?, 0)
  `).run(
    'usr_super_admin_001',
    'Shagun Shine Super Admin',
    'shagunshine887@gmail.com',
    hashedPassword,
    '+91 9876543210',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  );
  console.log('Inserted shagunshine887@gmail.com account.');
} else {
  db.prepare(`
    UPDATE users SET password = ?, role = 'super_admin', is_blocked = 0 WHERE email = 'shagunshine887@gmail.com'
  `).run(hashedPassword);
  console.log('Updated shagunshine887@gmail.com account.');
}

// Also insert/update admin@shagunshine.com
const existingAlias = db.prepare("SELECT id FROM users WHERE email = 'admin@shagunshine.com'").get();
if (!existingAlias) {
  db.prepare(`
    INSERT INTO users (id, name, email, password, phone, role, avatar, is_blocked)
    VALUES (?, ?, ?, ?, ?, 'super_admin', ?, 0)
  `).run(
    'usr_admin_alias_002',
    'Admin Portal',
    'admin@shagunshine.com',
    hashedPassword,
    '+91 9876543210',
    'https://api.dicebear.com/7.x/initials/svg?seed=Admin&backgroundColor=8B1E3B,C5A049&textColor=ffffff'
  );
  console.log('Inserted admin@shagunshine.com alias account.');
} else {
  db.prepare(`
    UPDATE users SET password = ?, role = 'super_admin', is_blocked = 0 WHERE email = 'admin@shagunshine.com'
  `).run(hashedPassword);
  console.log('Updated admin@shagunshine.com alias account.');
}

const users = db.prepare("SELECT id, name, email, role, is_blocked FROM users WHERE role IN ('admin', 'super_admin')").all();
console.log('\nVerified Admin Users in DB:');
console.table(users);
