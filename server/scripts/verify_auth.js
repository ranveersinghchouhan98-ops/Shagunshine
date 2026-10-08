const db = require('../config/db');
const bcrypt = require('bcryptjs');

const user = db.prepare("SELECT * FROM users WHERE email = 'shagunshine887@gmail.com'").get();
console.log('👤 Super Admin Account Verification:');
console.log('   - Exists:', !!user);
if (user) {
  const passwordToVerify = process.argv[2] || process.env.ADMIN_PASSWORD || 'AdminPass2026!';
  const match = bcrypt.compareSync(passwordToVerify, user.password);
  console.log('   - Password Verified:', match);
  console.log('   - Role:', user.role);
  console.log('   - Email:', user.email);
}
