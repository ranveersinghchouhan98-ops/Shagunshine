require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const jwt = require('jsonwebtoken');
const db = require('../config/db');

async function testPos() {
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ 
      email: process.env.ADMIN_EMAIL || 'admin@shagunshine.com', 
      password: process.env.ADMIN_PASSWORD || 'TestAdmin123!' 
    })
  const loginData = await loginRes.json();
  const token = loginData.token;

  const prod = db.prepare("SELECT * FROM products WHERE sku = 'SS-FK-001'").get();
  const initialStock = prod.stock_quantity;
  console.log('Testing POS sale for:', prod.name, '| Initial Stock:', initialStock);

  const res = await fetch('http://localhost:5000/api/orders/pos-sale', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
      customerName: 'Test Walk-in Customer',
      customerPhone: '9876543210',
      customerState: 'Haryana',
      paymentMethod: 'Cash',
      cashTendered: 500,
      changeReturned: 350,
      discountAmount: 0,
      items: [{
        productId: prod.id,
        name: prod.name,
        sku: prod.sku,
        price: 150,
        quantity: 1
      }]
    })
  });

  const data = await res.json();
  console.log('API Response:', data);
  console.log('Order Number:', data.order?.order_number);
  console.log('Invoice Number:', data.order?.invoice_number);
  console.log('Payment Status:', data.order?.payment_status);
  console.log('Order Status:', data.order?.order_status);

  const updatedProd = db.prepare("SELECT stock_quantity FROM products WHERE id = ?").get(prod.id);
  console.log('Updated Stock:', updatedProd.stock_quantity);

  if (updatedProd.stock_quantity !== initialStock - 1) {
    throw new Error('Stock was not decremented properly!');
  }

  // Clean up test order and restore stock
  if (data.order?.id) {
    db.prepare('DELETE FROM order_items WHERE order_id = ?').run(data.order.id);
    db.prepare('DELETE FROM orders WHERE id = ?').run(data.order.id);
    db.prepare('UPDATE products SET stock_quantity = ? WHERE id = ?').run(initialStock, prod.id);
    console.log('✅ PASS: POS Retail Sale end-to-end verified & clean up done!');
  }
}

testPos().catch((err) => {
  console.error('POS test failed:', err);
  process.exit(1);
});
