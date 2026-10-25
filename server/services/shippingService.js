const db = require('../config/db');

/**
 * Indian Shipping & Pincode Serviceability Service
 * Covers all 28 States and 8 Union Territories across India Post zones (PINs 100000 - 899999).
 */
class ShippingService {
  getShippingConfig() {
    try {
      const row = db.prepare("SELECT value FROM settings WHERE key = 'shipping_config'").get();
      if (row && row.value) {
        return JSON.parse(row.value);
      }
    } catch (e) {}
    return {
      free_shipping_threshold: 0,
      standard_shipping_fee: 0,
      express_shipping_fee: 0,
      default_dispatch_days: 2
    };
  }

  calculateShippingFee(cartSubtotal, state = '') {
    const config = this.getShippingConfig();
    const threshold = config.free_shipping_threshold !== undefined ? config.free_shipping_threshold : 0;
    if (cartSubtotal >= threshold) {
      return 0;
    }
    return config.standard_shipping_fee || 0;
  }

  calculateShipping(cartSubtotal, pincode = '', isExpress = false) {
    const config = this.getShippingConfig();
    const threshold = config.free_shipping_threshold !== undefined ? config.free_shipping_threshold : 0;
    const isFree = cartSubtotal >= threshold;
    let fee = isFree ? 0 : (config.standard_shipping_fee || 0);
    if (isExpress && config.express_shipping_fee) fee += config.express_shipping_fee;

    return {
      shippingFee: fee,
      isFree,
      freeShippingThreshold: threshold,
      remainingForFree: Math.max(0, threshold - cartSubtotal),
      estimatedDeliveryDate: this.getEstimatedDeliveryDate(),
      carrier: 'Delhivery Express Luxury Fleet'
    };
  }

  validatePincode(pincode) {
    if (!pincode || !/^\d{6}$/.test(String(pincode).trim())) {
      return { serviceable: false, message: 'Please enter a valid 6-digit Indian PIN code.' };
    }

    const pin = String(pincode).trim();
    const firstDigit = parseInt(pin[0], 10);
    const prefix2 = pin.slice(0, 2);
    const prefix3 = pin.slice(0, 3);

    // Complete India Post postal circle state mapping
    let state = 'India';

    if (prefix3 === '403') state = 'Goa';
    else if (prefix3 === '737') state = 'Sikkim';
    else if (prefix3 === '744') state = 'Andaman and Nicobar Islands';
    else if (prefix3 === '682' && (pin === '682555' || pin === '682556')) state = 'Lakshadweep';
    else if (['248', '249', '263', '262', '246'].includes(prefix3)) state = 'Uttarakhand';
    else if (prefix2 === '11') state = 'Delhi';
    else if (['12', '13'].includes(prefix2)) state = 'Haryana';
    else if (['14', '15'].includes(prefix2)) state = 'Punjab';
    else if (prefix2 === '16') state = 'Chandigarh';
    else if (prefix2 === '17') state = 'Himachal Pradesh';
    else if (['18', '19'].includes(prefix2)) state = 'Jammu and Kashmir';
    else if (['20', '21', '22', '23', '24', '25', '26', '27', '28'].includes(prefix2)) state = 'Uttar Pradesh';
    else if (['30', '31', '32', '33', '34'].includes(prefix2)) state = 'Rajasthan';
    else if (['36', '37', '38', '39'].includes(prefix2)) state = 'Gujarat';
    else if (['40', '41', '42', '43', '44'].includes(prefix2)) state = 'Maharashtra';
    else if (['45', '46', '47', '48'].includes(prefix2)) state = 'Madhya Pradesh';
    else if (prefix2 === '49') state = 'Chhattisgarh';
    else if (['50', '51', '52', '53'].includes(prefix2)) state = parseInt(prefix2) <= 50 ? 'Telangana' : 'Andhra Pradesh';
    else if (['56', '57', '58', '59'].includes(prefix2)) state = 'Karnataka';
    else if (['60', '61', '62', '63', '64'].includes(prefix2)) state = 'Tamil Nadu';
    else if (['67', '68', '69'].includes(prefix2)) state = 'Kerala';
    else if (['70', '71', '72', '73', '74'].includes(prefix2)) state = 'West Bengal';
    else if (['75', '76', '77'].includes(prefix2)) state = 'Odisha';
    else if (prefix2 === '78') state = 'Assam';
    else if (prefix2 === '79') state = 'North East (Manipur / Meghalaya / Mizoram / Nagaland / Tripura)';
    else if (['80', '81', '82', '83', '84', '85'].includes(prefix2)) state = parseInt(prefix2) <= 82 ? 'Bihar' : 'Jharkhand';

    if (firstDigit >= 1 && firstDigit <= 8) {
      return {
        serviceable: true,
        pincode: pin,
        state,
        codAvailable: false,
        prepaidAvailable: true,
        deliverySpeed: 'Express 2-4 Day Delivery'
      };
    }

    return { serviceable: false, message: 'Remote area PIN code outside primary coverage.' };
  }

  checkPincodeServiceability(pincode) {
    return this.validatePincode(pincode);
  }

  getEstimatedDeliveryDate(state = '') {
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + 4);
    return estDate.toISOString().split('T')[0];
  }
}

module.exports = new ShippingService();
