const db = require('../config/db');

/**
 * Official Shiprocket API Logistics Service
 * Docs: https://apidocs.shiprocket.in/
 */
class ShiprocketService {
  constructor() {
    this.baseUrl = 'https://apiv2.shiprocket.in/v1/external';
    this.token = process.env.SHIPROCKET_TOKEN || null;
    this.tokenExpiry = null;
    this.defaultPickupLocation = 'work'; // Primary verified location in Shiprocket
  }

  /**
   * Authenticate and retrieve active JWT token
   */
  async getAuthToken() {
    // Return existing token if valid
    if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    const email = process.env.SHIPROCKET_API_EMAIL;
    const password = process.env.SHIPROCKET_API_PASSWORD;

    if (!email || !password) {
      throw new Error('Shiprocket credentials missing: SHIPROCKET_API_EMAIL and SHIPROCKET_API_PASSWORD must be configured in environment.');
    }

    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (data && data.token) {
        this.token = data.token;
        // Shiprocket tokens last ~10 days, cache for 7 days
        this.tokenExpiry = Date.now() + (7 * 24 * 60 * 60 * 1000);
        return this.token;
      } else {
        console.error('[Shiprocket Auth Error]:', data);
        throw new Error(data.message || 'Shiprocket authentication failed.');
      }
    } catch (err) {
      console.error('[Shiprocket Connection Error]:', err.message);
      throw err;
    }
  }

  /**
   * Automatically create an order in Shiprocket
   * @param {Object} order Formatted order object from DB
   * @param {Array} items Order line items
   */
  async createShipmentOrder(order, items = []) {
    try {
      const token = await this.getAuthToken();

      let shippingAddr = {};
      try {
        shippingAddr = typeof order.shipping_address === 'string'
          ? JSON.parse(order.shipping_address)
          : (order.shipping_address || {});
      } catch (e) {
        shippingAddr = {};
      }

      // Name splitting
      const fullName = (order.customer_name || 'Valued Customer').trim();
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0] || 'Customer';
      const lastName = nameParts.slice(1).join(' ') || 'Shagun';

      // Clean phone number (strip +91 if present for Shiprocket 10-digit requirement)
      let phone = String(order.customer_phone || '').replace(/\D/g, '');
      if (phone.length === 12 && phone.startsWith('91')) {
        phone = phone.substring(2);
      }
      if (phone.length < 10) phone = '9999999999';

      // Build Shiprocket line items
      const orderItems = items.map((item, idx) => ({
        name: item.product_name || item.name || 'Shagun Shine Beauty Item',
        sku: item.sku || `SS-SKU-${idx + 1}`,
        units: Number(item.quantity || 1),
        selling_price: Number(item.price || 0),
        discount: 0,
        tax: Number(item.tax || 0),
        hsn: '330499'
      }));

      // Calculate approximate volumetric dimensions for cosmetics parcel
      const totalUnits = items.reduce((acc, it) => acc + Number(it.quantity || 1), 0);
      const parcelWeightKg = Math.max(0.3, Math.min(5, totalUnits * 0.25)); // 250g per cosmetic item

      const isCod = order.payment_method && order.payment_method.toUpperCase() === 'COD';

      const payload = {
        order_id: String(order.order_number),
        order_date: new Date(order.created_at || Date.now()).toISOString().slice(0, 19).replace('T', ' '),
        pickup_location: this.defaultPickupLocation,
        channel_id: '',
        comment: isCod ? 'Cash On Delivery - Shagun Shine Express' : 'Prepaid 100% - Ship via Express Luxury Courier',
        billing_customer_name: firstName,
        billing_last_name: lastName,
        billing_address: shippingAddr.address_line1 || shippingAddr.street || shippingAddr.addressLine1 || 'Main Street',
        billing_address_2: shippingAddr.address_line2 || shippingAddr.landmark || shippingAddr.addressLine2 || '',
        billing_city: shippingAddr.city || 'Indore',
        billing_pincode: String(shippingAddr.postal_code || shippingAddr.pincode || shippingAddr.postalCode || '452001'),
        billing_state: shippingAddr.state || 'Madhya Pradesh',
        billing_country: 'India',
        billing_email: order.customer_email || 'orders@shagunshinecosmetics.in',
        billing_phone: phone,
        shipping_is_billing: true,
        order_items: orderItems,
        payment_method: isCod ? 'COD' : 'Prepaid',
        shipping_charges: Number(order.shipping_fee || 0),
        giftwrap_charges: 0,
        transaction_charges: 0,
        total_discount: Number(order.discount_amount || 0),
        sub_total: Number(order.subtotal || order.total_amount),
        length: 15,
        breadth: 12,
        height: 8,
        weight: parcelWeightKg
      };

      console.log(`🚀 Dispatching Order #${order.order_number} to Shiprocket...`);

      const response = await fetch(`${this.baseUrl}/orders/create/adhoc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.order_id) {
        console.log(`✓ Shiprocket Order Created! ID: ${result.order_id}, Shipment ID: ${result.shipment_id}`);

        // Update database with real Shiprocket tracking reference
        const shiprocketOrderId = String(result.order_id);
        const shipmentId = String(result.shipment_id || '');
        const awbCode = result.awb_code ? String(result.awb_code) : null;
        const courierName = result.courier_name || 'Shiprocket Express Fleet';

        db.prepare(`
          UPDATE orders SET
            shiprocket_order_id = ?,
            shiprocket_shipment_id = ?,
            shiprocket_awb_code = COALESCE(?, shiprocket_awb_code),
            shiprocket_sync_status = 'synced',
            shiprocket_synced_at = CURRENT_TIMESTAMP,
            carrier = COALESCE(?, carrier),
            tracking_number = COALESCE(?, tracking_number)
          WHERE id = ? OR order_number = ?
        `).run(
          shiprocketOrderId,
          shipmentId,
          awbCode,
          courierName,
          awbCode || `SR-${result.order_id}`,
          order.id,
          order.order_number
        );

        return {
          success: true,
          shiprocketOrderId,
          shipmentId,
          awbCode,
          courierName,
          raw: result
        };
      } else {
        console.error('[Shiprocket Order Creation Failed]:', result);
        db.prepare(`
          UPDATE orders SET
            shiprocket_sync_status = 'failed'
          WHERE id = ? OR order_number = ?
        `).run(order.id, order.order_number);

        return {
          success: false,
          message: result.message || 'Shiprocket order creation rejected.',
          errors: result.errors
        };
      }
    } catch (error) {
      console.error('[Shiprocket Exception]:', error);
      try {
        db.prepare(`
          UPDATE orders SET shiprocket_sync_status = 'failed' WHERE id = ? OR order_number = ?
        `).run(order.id, order.order_number);
      } catch (e) {}

      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Track an AWB or Order through Shiprocket
   */
  async trackOrder(awbCode) {
    if (!awbCode) return null;
    try {
      const token = await this.getAuthToken();
      const response = await fetch(`${this.baseUrl}/courier/track/awb/${awbCode}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return await response.json();
    } catch (err) {
      console.error('Shiprocket track error:', err.message);
      return null;
    }
  }
}

module.exports = new ShiprocketService();
