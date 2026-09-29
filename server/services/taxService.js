const db = require('../config/db');

/**
 * Indian GST Tax Calculation Service
 * Supports Intra-state (CGST + SGST) vs Inter-state (IGST) split.
 * Prices in B2C cosmetics retail are GST-inclusive.
 */
class TaxService {
  getGstConfig() {
    try {
      const row = db.prepare("SELECT value FROM settings WHERE key = 'gst_config'").get();
      if (row && row.value) {
        return JSON.parse(row.value);
      }
    } catch (e) {}
    return {
      gstin: '07AAAAA0000A1Z5',
      state: 'Haryana',
      default_gst_rate: 18,
      is_inclusive: true
    };
  }

  /**
   * Calculate GST for an order with list of items
   */
  calculateOrderTax(items = [], customerState = 'Haryana', discountAmount = 0) {
    const config = this.getGstConfig();
    const originState = (config.state || config.registeredState || 'Haryana').trim().toLowerCase();
    const destState = (customerState || 'Haryana').trim().toLowerCase();
    const isInterState = originState !== destState;

    let subtotal = 0;
    for (const item of items) {
      subtotal += (item.price * (item.quantity || 1));
    }

    const effectiveTotal = Math.max(0, subtotal - discountAmount);
    const avgRate = items.length > 0 ? (items[0].gstRate || config.default_gst_rate || 18) : 18;

    // Inclusive GST Tax Base Calculation: Base = Amount / (1 + Rate/100)
    const taxableAmount = Math.round((effectiveTotal / (1 + (avgRate / 100))) * 100) / 100;
    const totalTax = Math.round((effectiveTotal - taxableAmount) * 100) / 100;

    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;

    if (!isInterState) {
      cgstAmount = Math.round((totalTax / 2) * 100) / 100;
      sgstAmount = Math.round((totalTax - cgstAmount) * 100) / 100;
    } else {
      igstAmount = totalTax;
    }

    return {
      subtotal: effectiveTotal,
      taxableAmount,
      totalTax,
      isInterState,
      isIntraState: !isInterState,
      gstRate: avgRate,
      cgstRate: !isInterState ? avgRate / 2 : 0,
      cgstAmount,
      sgstRate: !isInterState ? avgRate / 2 : 0,
      sgstAmount,
      igstRate: isInterState ? avgRate : 0,
      igstAmount,
      hsnCode: '330499'
    };
  }

  calculateGST(subtotalAfterDiscount, customerState = 'Haryana', customGstRate = 18.0) {
    return this.calculateOrderTax(
      [{ price: subtotalAfterDiscount, quantity: 1, gstRate: customGstRate }],
      customerState,
      0
    );
  }
}

module.exports = new TaxService();
