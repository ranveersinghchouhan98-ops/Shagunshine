const db = require('../config/db');

const gstConfig = {
  gstin: '23AAAAA0000A1Z5',
  state: 'Madhya Pradesh',
  city: 'Indore',
  registeredState: 'Madhya Pradesh',
  registeredCity: 'Indore',
  default_gst_rate: 18,
  is_inclusive: true
};

db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('gst_config', ?)").run(JSON.stringify(gstConfig));

const storeConfig = {
  storeName: 'Shagun Shine Cosmetics',
  address: 'Shop No. 12, Main Market, Indore, Madhya Pradesh - 452001',
  city: 'Indore',
  state: 'Madhya Pradesh',
  pincode: '452001',
  phone: '+91 98765 43210',
  email: 'shagunshine887@gmail.com',
  gstin: '23AAAAA0000A1Z5'
};
db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('store_profile', ?)").run(JSON.stringify(storeConfig));

console.log('Successfully updated settings to Indore, Madhya Pradesh!');
