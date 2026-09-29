const db = require('./db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

function seedDatabase() {
  console.log('Seeding Shagun Shine Cosmetics database...');

  // Check if already seeded
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount > 0) {
    console.log('Database already contains records. Skipping seed.');
    return;
  }

  const superAdminPassword = bcrypt.hashSync('@ShagunShinecosmetics887', 10);
  const customerPassword = bcrypt.hashSync('Customer@123', 10);

  // 1. Seed Single Super Admin User
  const adminId = 'usr_super_admin_001';
  const customerId1 = 'usr_cust_101';
  const customerId2 = 'usr_cust_102';

  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, password, phone, role, avatar)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertUser.run(
    adminId,
    'Shagun Shine Super Admin',
    'shagunshine887@gmail.com',
    superAdminPassword,
    '+91 9876543210',
    'admin',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  );

  // Seed Addresses for customer 1
  const insertAddress = db.prepare(`
    INSERT INTO addresses (id, user_id, full_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertAddress.run(
    'addr_001',
    customerId1,
    'Ananya Patel',
    '+91 9988776655',
    'Flat 402, Royal Palms Residency',
    'Near Lotus Boulevard, Sector 18',
    'Mumbai',
    'Maharashtra',
    '400050',
    'India',
    1
  );

  // 2. Seed Categories
  const categories = [
    {
      id: 'cat_skincare',
      name: 'Skincare',
      slug: 'skincare',
      description: 'Luminous serums, nourishing creams, and revitalizing elixirs infused with gold dust and botanical extracts.',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
      subcategories: JSON.stringify(['Serums & Elixirs', 'Moisturizers & Creams', 'Cleansers & Toners', 'Face Masks & Peels', 'Sun Protection'])
    },
    {
      id: 'cat_makeup',
      name: 'Makeup',
      slug: 'makeup',
      description: 'High-pigment, velvety smooth luxury cosmetics designed to enhance your natural radiant glow.',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
      subcategories: JSON.stringify(['Lipsticks & Lip Oils', 'Foundations & Concealers', 'Highlighters & Blushes', 'Eyeshadows & Liners', 'Setting Sprays'])
    },
    {
      id: 'cat_haircare',
      name: 'Haircare',
      slug: 'haircare',
      description: 'Strengthening botanical hair rituals, Ayurvedic oils, and shine-boosting hair masks.',
      image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&auto=format&fit=crop&q=80',
      subcategories: JSON.stringify(['Hair Oils & Serums', 'Shampoos & Conditioners', 'Hair Spa Masks', 'Scalp Care'])
    },
    {
      id: 'cat_fragrances',
      name: 'Fragrances',
      slug: 'fragrances',
      description: 'Mesmerizing perfumes and artisanal attars blended with royal oud, Kashmiri saffron, and Damascene rose.',
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
      subcategories: JSON.stringify(['Eau De Parfum', 'Luxury Attar & Oils', 'Body Mists', 'Travel Minis'])
    },
    {
      id: 'cat_combos',
      name: 'Combos & Gift Sets',
      slug: 'combos-gift-sets',
      description: 'Curated royal beauty boxes and celebration gift sets encased in velvet gold-foiled packaging.',
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80',
      subcategories: JSON.stringify(['Bridal Glow Kits', 'Daily Radiance Sets', 'Luxury Fragrance Duos', 'Festive Gift Hampers'])
    }
  ];

  const insertCat = db.prepare(`
    INSERT INTO categories (id, name, slug, description, image, subcategories)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  categories.forEach(cat => {
    insertCat.run(cat.id, cat.name, cat.slug, cat.description, cat.image, cat.subcategories);
  });

  // 3. Seed 20 Realistic Luxury Products
  const products = [
    // Skincare
    {
      id: 'prod_001',
      name: '24K Gold Radiant Youth Elixir Serum',
      slug: '24k-gold-radiant-youth-elixir-serum',
      sku: 'SS-SK-001',
      category_id: 'cat_skincare',
      subcategory: 'Serums & Elixirs',
      price: 2499,
      discount_price: 1899,
      stock_quantity: 45,
      description: 'An opulent anti-aging facial elixir infused with pure 24K gold flakes, Kashmiri Saffron, and concentrated Hyaluronic Acid. Instantly restores skin luminosity, boosts collagen synthesis, and smooths fine lines with a non-greasy satin finish.',
      short_description: 'Pure 24K gold infused radiance serum with Kashmiri Saffron and Hyaluronic Acid.',
      ingredients: 'Aqua, 24K Pure Gold Flakes, Crocus Sativus (Saffron) Extract, Sodium Hyaluronate, Niacinamide (5%), Rosa Damascena Flower Water, Centella Asiatica, Peptides Complex, Glycerin, Phenoxyethanol.',
      how_to_use: 'Dispense 3-4 drops onto cleansed palms. Gently press into face, neck, and décolletage in upward circular motions. Use morning and night prior to your moisturizer.',
      skin_type: 'All Skin Types',
      benefits: JSON.stringify(['Instant Golden Glow', 'Deep Cellular Hydration', 'Collagen Boost & Plumping', 'Cruelty Free & Paraben Free']),
      shades: JSON.stringify([]),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1608248597359-59836378c66e?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800&auto=format&fit=crop&q=80'
      ]),
      status: 'active',
      is_featured: 1,
      is_best_seller: 1,
      is_new_arrival: 0,
      rating: 4.9,
      reviews_count: 86
    },
    {
      id: 'prod_002',
      name: 'Kumkumadi Royal Glow Miracle Night Cream',
      slug: 'kumkumadi-royal-glow-miracle-night-cream',
      sku: 'SS-SK-002',
      category_id: 'cat_skincare',
      subcategory: 'Moisturizers & Creams',
      price: 1999,
      discount_price: 1499,
      stock_quantity: 38,
      description: 'An ultra-nourishing night repair cream crafted with traditional Ayurvedic Kumkumadi oil, Sandalwood, and Lotus petal extract. Works overnight to fade pigmentation, deeply revitalize parched skin, and unveil a lit-from-within glow by morning.',
      short_description: 'Intense overnight repair cream with authentic Kumkumadi Tailam and Sandalwood.',
      ingredients: 'Kumkumadi Thailam, Santalum Album (Sandalwood) Extract, Nelumbo Nucifera (Lotus) Extract, Shea Butter, Sweet Almond Oil, Aloe Barbadensis Leaf Juice, Tocopherol (Vitamin E), Licorice Root Extract.',
      how_to_use: 'Warm a pearl-sized amount between fingertips and massage gently into face and neck in upward strokes until fully absorbed before retiring to bed.',
      skin_type: 'Dry to Normal',
      benefits: JSON.stringify(['Fades Dark Spots & Hyperpigmentation', 'Intense Overnight Repair', 'Sandalwood Calming Aroma', 'Dermatologist Tested']),
      shades: JSON.stringify([]),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80'
      ]),
      status: 'active',
      is_featured: 1,
      is_best_seller: 1,
      is_new_arrival: 0,
      rating: 4.8,
      reviews_count: 64
    },
    {
      id: 'prod_003',
      name: 'Rose & Pearl Luminous Gentle Gel Cleanser',
      slug: 'rose-and-pearl-luminous-gentle-gel-cleanser',
      sku: 'SS-SK-003',
      category_id: 'cat_skincare',
      subcategory: 'Cleansers & Toners',
      price: 1199,
      discount_price: 899,
      stock_quantity: 50,
      description: 'A sulfate-free hydrating facial cleanser with micro-pearl essence and steam-distilled Kannauj Rose Water. Dissolves impurities and makeup without stripping essential skin moisture.',
      short_description: 'Gentle pH-balanced gel cleanser with Kannauj Rose Water and micro-pearl brightness.',
      ingredients: 'Rosa Damascena Distillate, Pearl Protein Extract, Coco Glucoside, Vegetable Glycerin, Panthenol (Pro-Vitamin B5), Chamomile Flower Extract, Citric Acid.',
      how_to_use: 'Massage 1-2 pumps onto damp face for 60 seconds, then rinse thoroughly with lukewarm water.',
      skin_type: 'All Skin Types',
      benefits: JSON.stringify(['Sulfate & Paraben Free', 'Non-Drying Mild Formula', 'Instantly Refreshes Dull Skin']),
      shades: JSON.stringify([]),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1556228722-d0b73c7fc366?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80'
      ]),
      status: 'active',
      is_featured: 0,
      is_best_seller: 0,
      is_new_arrival: 1,
      rating: 4.7,
      reviews_count: 32
    },
    {
      id: 'prod_004',
      name: 'Dewy Velvet SPF 50+ PA++++ Sun Fluid',
      slug: 'dewy-velvet-spf-50-sun-fluid',
      sku: 'SS-SK-004',
      category_id: 'cat_skincare',
      subcategory: 'Sun Protection',
      price: 1499,
      discount_price: 1199,
      stock_quantity: 62,
      description: 'Ultra-lightweight invisible sun serum providing broad-spectrum UV and blue-light defense. Leaves zero white cast and creates a velvety luminous primer base under makeup.',
      short_description: 'Weightless sunscreen fluid with zero white cast and radiant glass-skin finish.',
      ingredients: 'Zinc Oxide, Tinosorb M, Niacinamide, Centella Asiatica, Green Tea Extract, Hyaluronic Acid, Vitamin E.',
      how_to_use: 'Apply generously to face and exposed areas 15 minutes before sun exposure. Reapply every 3 hours when outdoors.',
      skin_type: 'All Skin Types',
      benefits: JSON.stringify(['Broad Spectrum SPF 50+ PA++++', 'Zero White Cast', 'Blue Light Protection', 'Non-Comedogenic']),
      shades: JSON.stringify([]),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80'
      ]),
      status: 'active',
      is_featured: 1,
      is_best_seller: 1,
      is_new_arrival: 0,
      rating: 4.9,
      reviews_count: 94
    },
    // Makeup
    {
      id: 'prod_005',
      name: 'Shagun Royal Silk Matte Velvet Lipstick',
      slug: 'shagun-royal-silk-matte-velvet-lipstick',
      sku: 'SS-MK-001',
      category_id: 'cat_makeup',
      subcategory: 'Lipsticks & Lip Oils',
      price: 1299,
      discount_price: 999,
      stock_quantity: 80,
      description: 'A weightless, intensely pigmented liquid velvet lipstick that glides on like silk and sets into a non-drying, 12-hour transfer-resistant matte finish. Enriched with Argan Oil and Vitamin E.',
      short_description: '12-hour transfer-proof luxury matte lipstick enriched with nourishing Argan oil.',
      ingredients: 'Isododecane, Dimethicone, Trimethylsiloxysilicate, Argania Spinosa Kernel Oil, Tocopheryl Acetate, CI 77491, CI 15850, CI 77891.',
      how_to_use: 'Define the contour of your lips with the precision applicator tip, then fill in the center in a single smooth stroke. Allow 60 seconds to set.',
      skin_type: 'All Skin Types',
      benefits: JSON.stringify(['12-Hour Long Stay', 'Zero Smudge & Transfer Resistant', 'Comfortable Non-Cracking Formula']),
      shades: JSON.stringify([
        { name: '01 Royal Sindoor Red', hex: '#8B1E3B' },
        { name: '02 Gulab Blush Nude', hex: '#D57991' },
        { name: '03 Malabar Spice Berry', hex: '#6B172E' },
        { name: '04 Saffron Caramel', hex: '#A65B36' },
        { name: '05 Jaipur Velvet Rose', hex: '#B02A4C' }
      ]),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80'
      ]),
      status: 'active',
      is_featured: 1,
      is_best_seller: 1,
      is_new_arrival: 0,
      rating: 4.9,
      reviews_count: 142
    },
    {
      id: 'prod_006',
      name: 'Gilded Aura Baked Glow Highlighter',
      slug: 'gilded-aura-baked-glow-highlighter',
      sku: 'SS-MK-002',
      category_id: 'cat_makeup',
      subcategory: 'Highlighters & Blushes',
      price: 1599,
      discount_price: 1299,
      stock_quantity: 42,
      description: 'An ultra-refined baked highlighter infused with micro-milled champagne pearls. Melts into skin for an ethereal, glass-skin radiance with no chunky glitter.',
      short_description: 'Micro-milled baked highlighter providing multidimensional champagne brilliance.',
      ingredients: 'Mica, Talc, Squalane, Jojoba Seed Oil, Caprylic/Capric Triglyceride, Phenoxyethanol, CI 77891, CI 77491.',
      how_to_use: 'Dust lightly across cheekbones, brow bones, the bridge of the nose, and cupid\'s bow with a tapered fan brush.',
      skin_type: 'All Skin Types',
      benefits: JSON.stringify(['Glass-Skin Wet Look', 'Zero Fallout', 'Blends Seamlessly']),
      shades: JSON.stringify([
        { name: 'Champagne Gilt', hex: '#E5C378' },
        { name: 'Rose Gold Shimmer', hex: '#E29FB0' },
        { name: 'Bronze Goddess', hex: '#C5A049' }
      ]),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80'
      ]),
      status: 'active',
      is_featured: 1,
      is_best_seller: 0,
      is_new_arrival: 1,
      rating: 4.8,
      reviews_count: 58
    },
    {
      id: 'prod_007',
      name: 'Flawless Luminous Serum Foundation SPF 25',
      slug: 'flawless-luminous-serum-foundation',
      sku: 'SS-MK-003',
      category_id: 'cat_makeup',
      subcategory: 'Foundations & Concealers',
      price: 2199,
      discount_price: 1699,
      stock_quantity: 55,
      description: 'A breathable medium-to-full buildable coverage foundation infused with 2% Hyaluronic Acid and Saffron extract. Gives a radiant second-skin finish lasting up to 16 hours.',
      short_description: 'Hydrating serum foundation with buildable coverage and 16-hour dewy wear.',
      ingredients: 'Water, Cyclopentasiloxane, Titanium Dioxide, Dimethicone, Saffron Extract, Hyaluronic Acid, Niacinamide, Glycerin, Iron Oxides.',
      how_to_use: 'Pump 1-2 drops and blend outwards with a damp beauty sponge or buffer brush for seamless, streak-free coverage.',
      skin_type: 'All Skin Types',
      benefits: JSON.stringify(['16-Hour Radiance', 'SPF 25 Sun Protection', 'Buildable Medium-Full Coverage']),
      shades: JSON.stringify([
        { name: '01 Ivory Warmth', hex: '#F9E4D4' },
        { name: '02 Almond Beige', hex: '#ECC4A8' },
        { name: '03 Honey Gold', hex: '#D8A47F' },
        { name: '04 Warm Caramel', hex: '#B88258' },
        { name: '05 Rich Espresso', hex: '#8B5A36' }
      ]),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80'
      ]),
      status: 'active',
      is_featured: 1,
      is_best_seller: 1,
      is_new_arrival: 0,
      rating: 4.7,
      reviews_count: 73
    },
    {
      id: 'prod_008',
      name: 'Maharani Eyeshadow Palette 18 Regal Shades',
      slug: 'maharani-eyeshadow-palette-18-shades',
      sku: 'SS-MK-004',
      category_id: 'cat_makeup',
      subcategory: 'Eyeshadows & Liners',
      price: 2799,
      discount_price: 2199,
      stock_quantity: 25,
      description: 'An imperial collection of 18 rich jewel-toned velvets, foil chromes, and smooth warm matte shades. Designed for festive Indian weddings and glamorous evening looks.',
      short_description: '18 high-impact regal hues spanning rich gold foils, jewel burgundy, and warm neutrals.',
      ingredients: 'Mica, Synthetic Fluorphlogopite, Dimethicone, Zinc Stearate, Polyethylene, CI 77891, CI 77491, CI 77499, CI 77742.',
      how_to_use: 'Blend matte shades into the crease for transition and tap metallic foil shades onto center lid with fingertip or wet brush.',
      skin_type: 'All Skin Types',
      benefits: JSON.stringify(['Intense Color Payoff in 1 Swipe', 'Velvety Smooth Texture', 'Zero Creasing']),
      shades: JSON.stringify([]),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=800&auto=format&fit=crop&q=80'
      ]),
      status: 'active',
      is_featured: 1,
      is_best_seller: 0,
      is_new_arrival: 1,
      rating: 5.0,
      reviews_count: 41
    },
    // Haircare
    {
      id: 'prod_009',
      name: 'Bhringraj & Red Onion Royal Hair Growth Elixir',
      slug: 'bhringraj-red-onion-royal-hair-growth-elixir',
      sku: 'SS-HC-001',
      category_id: 'cat_haircare',
      subcategory: 'Hair Oils & Serums',
      price: 1399,
      discount_price: 1099,
      stock_quantity: 60,
      description: 'A potent cold-pressed Ayurvedic botanical oil infused with authentic Bhringraj, Red Onion Seed Extract, Rosemary, and Amla. Promotes rapid follicle stimulation, stops hair thinning, and imparts mirror-like shine.',
      short_description: 'Cold-pressed Ayurvedic growth oil with Bhringraj, Red Onion, and Rosemary extract.',
      ingredients: 'Cold Pressed Sesame Oil, Bhringraj (Eclipta Alba), Allium Cepa (Red Onion) Oil, Rosemary Essential Oil, Phyllanthus Emblica (Amla), Brahmi, Vitamin E.',
      how_to_use: 'Apply directly to scalp using dropper tip. Massage for 10 minutes. Leave on for at least 2 hours or overnight before washing.',
      skin_type: 'All Hair Types',
      benefits: JSON.stringify(['Reduces Hair Fall up to 80%', 'Boosts Follicle Density', 'Non-Sticky & Easily Washable']),
      shades: JSON.stringify([]),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1608248597359-59836378c66e?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&auto=format&fit=crop&q=80'
      ]),
      status: 'active',
      is_featured: 1,
      is_best_seller: 1,
      is_new_arrival: 0,
      rating: 4.8,
      reviews_count: 110
    },
    {
      id: 'prod_010',
      name: 'Silk & Saffron Intense Moisture Hair Spa Mask',
      slug: 'silk-saffron-intense-moisture-hair-spa-mask',
      sku: 'SS-HC-002',
      category_id: 'cat_haircare',
      subcategory: 'Hair Spa Masks',
      price: 1699,
      discount_price: 1299,
      stock_quantity: 35,
      description: 'A deeply restorative hair conditioning treatment enriched with Hydrolyzed Silk Protein, Shea Butter, and pure Saffron essence. Rescues dry, damaged, chemically treated strands and restores salon softness.',
      short_description: 'Deep repair hair treatment with Hydrolyzed Silk Protein and Shea Butter.',
      ingredients: 'Aqua, Cetearyl Alcohol, Hydrolyzed Silk Protein, Butyrospermum Parkii (Shea) Butter, Argan Oil, Saffron Extract, Behentrimonium Chloride, Panthenol.',
      how_to_use: 'After shampooing, apply generously from mid-lengths to ends. Leave for 8-10 minutes, then rinse with cold water.',
      skin_type: 'Dry & Frizzy Hair',
      benefits: JSON.stringify(['Tames Frizz & Flyaways', 'Deep Cuticle Repair', 'Silky Salon Smooth Finish']),
      shades: JSON.stringify([]),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80'
      ]),
      status: 'active',
      is_featured: 0,
      is_best_seller: 0,
      is_new_arrival: 1,
      rating: 4.7,
      reviews_count: 29
    },
    // Fragrances
    {
      id: 'prod_011',
      name: 'Noor-e-Gulab Eau De Parfum 100ml',
      slug: 'noor-e-gulab-eau-de-parfum',
      sku: 'SS-FR-001',
      category_id: 'cat_fragrances',
      subcategory: 'Eau De Parfum',
      price: 3499,
      discount_price: 2799,
      stock_quantity: 30,
      description: 'A timeless, intoxicating floral-woody masterpiece crafted with harvest-fresh Damask Roses, French Vanilla, and velvety Amber wood. Projects royal elegance and lingers for over 14 hours.',
      short_description: 'Royal Damask Rose and warm amber wood luxury perfume with 14+ hours longevity.',
      ingredients: 'Alcohol Denat., Parfum (Fragrance), Aqua, Rosa Damascena Flower Oil, Amber, Benzyl Salicylate, Linalool, Citronellol, Geraniol.',
      how_to_use: 'Spritz on pulse points — collarbones, inner wrists, and behind ears. Do not rub.',
      skin_type: 'All Skin Types',
      benefits: JSON.stringify(['14+ Hour Sillage', 'Handcrafted Luxury Glass Bottle with Gold Cap', 'Artisanal Perfumery']),
      shades: JSON.stringify([]),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80'
      ]),
      status: 'active',
      is_featured: 1,
      is_best_seller: 1,
      is_new_arrival: 0,
      rating: 5.0,
      reviews_count: 67
    },
    {
      id: 'prod_012',
      name: 'Oud Royale Concentrated Artisanal Attar 12ml',
      slug: 'oud-royale-concentrated-artisanal-attar',
      sku: 'SS-FR-002',
      category_id: 'cat_fragrances',
      subcategory: 'Luxury Attar & Oils',
      price: 2899,
      discount_price: 2299,
      stock_quantity: 18,
      description: 'An alcohol-free 100% pure perfume oil distilled with aged Cambodian Agarwood (Oud), Kashmiri Saffron, and dark Musk. Encased in a hand-cut crystal flacon.',
      short_description: 'Alcohol-free 100% pure oud perfume oil in a hand-cut crystal flacon.',
      ingredients: 'Pure Aquilaria Agallocha (Oud) Oil, Saffron Essential Oil, White Amber Resin, Sandalwood Base.',
      how_to_use: 'Apply a drop using the glass rod to your inner wrists and neck.',
      skin_type: 'All Skin Types',
      benefits: JSON.stringify(['100% Alcohol-Free Pure Attar', 'Lasts Over 24 Hours', 'Crystal Flacon Bottle']),
      shades: JSON.stringify([]),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80'
      ]),
      status: 'active',
      is_featured: 1,
      is_best_seller: 0,
      is_new_arrival: 1,
      rating: 4.9,
      reviews_count: 45
    },
    // Combos & Gift Sets
    {
      id: 'prod_013',
      name: 'The Imperial Bridal Radiance Box (Set of 5)',
      slug: 'the-imperial-bridal-radiance-box',
      sku: 'SS-CB-001',
      category_id: 'cat_combos',
      subcategory: 'Bridal Glow Kits',
      price: 6999,
      discount_price: 5499,
      stock_quantity: 15,
      description: 'The crowning bridal beauty ritual. Includes our 24K Gold Youth Elixir (30ml), Kumkumadi Night Cream (50g), Royal Silk Lipstick in Sindoor Red, Noor-e-Gulab Perfume (50ml), and a Rose Quartz Gua Sha.',
      short_description: 'Curated 5-piece royal bridal collection in velvet gold-embossed keepsake trunk.',
      ingredients: 'Complete skincare & makeup ensemble with genuine Ayurvedic & botanical actives.',
      how_to_use: 'Follow the included 21-day Bridal Radiance Booklet for step-by-step beauty protocol.',
      skin_type: 'All Skin Types',
      benefits: JSON.stringify(['Complete 5-Piece Full Size Ritual', 'Velvet Gold Keepsake Box', 'Save ₹2,500 vs individual products']),
      shades: JSON.stringify([]),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'
      ]),
      status: 'active',
      is_featured: 1,
      is_best_seller: 1,
      is_new_arrival: 0,
      rating: 5.0,
      reviews_count: 52
    },
    {
      id: 'prod_014',
      name: 'Daily Glow Trio (Cleanser + Serum + SPF)',
      slug: 'daily-glow-trio-routine-set',
      sku: 'SS-CB-002',
      category_id: 'cat_combos',
      subcategory: 'Daily Radiance Sets',
      price: 4199,
      discount_price: 3299,
      stock_quantity: 40,
      description: 'Your effortless 3-step morning skincare routine: Rose & Pearl Cleanser (150ml), 24K Gold Radiant Serum (30ml), and Dewy Velvet SPF 50 Sunscreen (50g).',
      short_description: 'Essential 3-step morning glow regime: Cleanse, Treat, and Protect.',
      ingredients: 'Detailed on individual product packaging.',
      how_to_use: 'Step 1: Cleanse with Rose gel. Step 2: Apply 3 drops of Gold Serum. Step 3: Seal with Dewy Sun Fluid.',
      skin_type: 'All Skin Types',
      benefits: JSON.stringify(['3-Step Complete Routine', 'Save ₹700', 'Suitable for daily everyday wear']),
      shades: JSON.stringify([]),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80'
      ]),
      status: 'active',
      is_featured: 1,
      is_best_seller: 1,
      is_new_arrival: 0,
      rating: 4.9,
      reviews_count: 88
    },
    {
      id: 'prod_015',
      name: 'Rose Gold Hydrating Lip Glaze Oil',
      slug: 'rose-gold-hydrating-lip-glaze-oil',
      sku: 'SS-MK-005',
      category_id: 'cat_makeup',
      subcategory: 'Lipsticks & Lip Oils',
      price: 899,
      discount_price: 699,
      stock_quantity: 75,
      description: 'A non-sticky, glass-shine peptide lip oil infused with fine rose gold micro-pearls, Jojoba Oil, and Raspberry Seed extract for instantly plumped, juicy lips.',
      short_description: 'Plumping peptide lip glaze with rose gold shimmer and deep moisture.',
      ingredients: 'Polybutene, Jojoba Seed Oil, Rubus Idaeus (Raspberry) Seed Oil, Tripeptide-1, Mica, Tocopherol.',
      how_to_use: 'Glide onto bare lips or layer over your favorite Shagun Silk lipstick for an ultra-glossy diamond shine.',
      skin_type: 'All Skin Types',
      benefits: JSON.stringify(['Glass-Like Mirror Shine', 'Zero Stickiness', 'Instant Lip Plumping Effect']),
      shades: JSON.stringify([
        { name: 'Crystal Rose Glow', hex: '#F6E0E6' },
        { name: 'Golden Honey Glaze', hex: '#ECDDB3' }
      ]),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80'
      ]),
      status: 'active',
      is_featured: 0,
      is_best_seller: 1,
      is_new_arrival: 1,
      rating: 4.8,
      reviews_count: 36
    },
    {
      id: 'prod_016',
      name: 'Niacinamide & Zinc Clarity Refining Serum',
      slug: 'niacinamide-zinc-clarity-serum',
      sku: 'SS-SK-005',
      category_id: 'cat_skincare',
      subcategory: 'Serums & Elixirs',
      price: 1399,
      discount_price: 999,
      stock_quantity: 6, // Low stock demo!
      description: 'A targeted clarifying serum packed with 10% pure Niacinamide, 1% Zinc PCA, and Holy Basil (Tulsi) extract to minimize enlarged pores, control excess oil, and reduce acne redness.',
      short_description: '10% Niacinamide + 1% Zinc PCA for pore refinement and oil control.',
      ingredients: 'Aqua, Niacinamide (10%), Zinc PCA (1%), Ocimum Sanctum (Tulsi) Extract, Hyaluronic Acid, Allantoin.',
      how_to_use: 'Apply 2-3 drops over entire face morning and evening after cleansing.',
      skin_type: 'Oily & Acne-Prone',
      benefits: JSON.stringify(['Shrinks Open Pores', 'Balances Sebum Production', 'Fades Blemish Marks']),
      shades: JSON.stringify([]),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800&auto=format&fit=crop&q=80'
      ]),
      status: 'active',
      is_featured: 0,
      is_best_seller: 1,
      is_new_arrival: 0,
      rating: 4.7,
      reviews_count: 61
    },
    {
      id: 'prod_017',
      name: 'Velvet Petal Cream Blush & Cheek Tint',
      slug: 'velvet-petal-cream-blush-cheek-tint',
      sku: 'SS-MK-006',
      category_id: 'cat_makeup',
      subcategory: 'Highlighters & Blushes',
      price: 1099,
      discount_price: 849,
      stock_quantity: 4, // Low stock demo!
      description: 'A weightless cream-to-powder blush infused with Rose Petal wax and Vitamin E. Blends like butter to provide a natural dewy flush of color on cheeks and lips.',
      short_description: 'Buttery cream-to-powder blush with natural radiant dewy finish.',
      ingredients: 'Caprylic Triglyceride, Candelilla Wax, Rose Wax, Tocopherol, CI 77891, CI 15850.',
      how_to_use: 'Tap lightly with fingertips onto the apples of your cheeks and blend upwards toward the hairline.',
      skin_type: 'All Skin Types',
      benefits: JSON.stringify(['Dewy Pinch-of-Color Glow', 'Multi-use for Cheeks & Lips', 'Easy Fingertip Blend']),
      shades: JSON.stringify([
        { name: 'Gulabi Dew', hex: '#D57991' },
        { name: 'Terracotta Charm', hex: '#CC4163' },
        { name: 'Peachy Sunrise', hex: '#EEA4B4' }
      ]),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'
      ]),
      status: 'active',
      is_featured: 0,
      is_best_seller: 0,
      is_new_arrival: 1,
      rating: 4.9,
      reviews_count: 48
    },
    {
      id: 'prod_018',
      name: 'Kashmiri Saffron Hydrating Face Mist 100ml',
      slug: 'kashmiri-saffron-hydrating-face-mist',
      sku: 'SS-SK-006',
      category_id: 'cat_skincare',
      subcategory: 'Cleansers & Toners',
      price: 999,
      discount_price: 749,
      stock_quantity: 50,
      description: 'A cooling, aromatic facial mist distilled with pure saffron strands, Vetiver root, and Aloe vera. Recharges tired skin on-the-go and locks in hydration.',
      short_description: 'Instant pick-me-up facial mist infused with Kashmiri saffron and vetiver.',
      ingredients: 'Saffron Distillate, Vetiver Water, Aloe Vera Juice, Glycerin, Sodium Benzoate.',
      how_to_use: 'Hold bottle 8 inches from face, close eyes, and mist generously throughout the day.',
      skin_type: 'All Skin Types',
      benefits: JSON.stringify(['Instant Refreshment', 'Sets Makeup with Dewy Glow', 'Calms Inflamed Skin']),
      shades: JSON.stringify([]),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1556228722-d0b73c7fc366?w=800&auto=format&fit=crop&q=80'
      ]),
      status: 'active',
      is_featured: 0,
      is_best_seller: 0,
      is_new_arrival: 1,
      rating: 4.6,
      reviews_count: 24
    }
  ];

  const insertProd = db.prepare(`
    INSERT INTO products (
      id, name, slug, sku, category_id, subcategory, price, discount_price, stock_quantity,
      description, short_description, ingredients, how_to_use, skin_type, benefits, shades,
      images, status, is_featured, is_best_seller, is_new_arrival, rating, reviews_count
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?
    )
  `);

  products.forEach(p => {
    insertProd.run(
      p.id, p.name, p.slug, p.sku, p.category_id, p.subcategory, p.price, p.discount_price, p.stock_quantity,
      p.description, p.short_description, p.ingredients, p.how_to_use, p.skin_type, p.benefits, p.shades,
      p.images, p.status, p.is_featured, p.is_best_seller, p.is_new_arrival, p.rating, p.reviews_count
    );
  });

  // 4. Seed Coupons
  const coupons = [
    {
      id: 'cpn_001',
      code: 'SHINE20',
      discount_type: 'percentage',
      discount_value: 20,
      min_spend: 1499,
      max_discount: 800,
      usage_limit: 500,
      times_used: 48,
      expiry_date: '2027-12-31',
      is_active: 1
    },
    {
      id: 'cpn_002',
      code: 'GLOW500',
      discount_type: 'flat',
      discount_value: 500,
      min_spend: 2499,
      max_discount: 500,
      usage_limit: 200,
      times_used: 19,
      expiry_date: '2027-12-31',
      is_active: 1
    },
    {
      id: 'cpn_003',
      code: 'WELCOME10',
      discount_type: 'percentage',
      discount_value: 10,
      min_spend: 999,
      max_discount: 300,
      usage_limit: 1000,
      times_used: 120,
      expiry_date: '2027-12-31',
      is_active: 1
    }
  ];

  const insertCoupon = db.prepare(`
    INSERT INTO coupons (id, code, discount_type, discount_value, min_spend, max_discount, usage_limit, times_used, expiry_date, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  coupons.forEach(c => {
    insertCoupon.run(c.id, c.code, c.discount_type, c.discount_value, c.min_spend, c.max_discount, c.usage_limit, c.times_used, c.expiry_date, c.is_active);
  });

  // 5. Seed Reviews
  const reviews = [
    {
      id: 'rev_001',
      product_id: 'prod_001',
      user_id: customerId1,
      author_name: 'Ananya Patel',
      author_email: 'ananya@example.com',
      rating: 5,
      title: 'Miraculous gold serum! Worth every penny!',
      comment: 'I have been using this 24K Gold Youth Elixir for 3 weeks and the difference in my skin texture and radiance is unbelievable! It absorbs effortlessly without stickiness. My foundation sits so smoothly over it!',
      status: 'approved'
    },
    {
      id: 'rev_002',
      product_id: 'prod_001',
      user_id: customerId2,
      author_name: 'Meera Kapoor',
      author_email: 'meera@example.com',
      rating: 5,
      title: 'Pure luxury in a bottle',
      comment: 'The packaging looks like high-end French luxury cosmetics. The saffron aroma is so gentle and soothing. Highly recommended for bridal preparation!',
      status: 'approved'
    },
    {
      id: 'rev_003',
      product_id: 'prod_005',
      user_id: customerId1,
      author_name: 'Rhea Sengupta',
      author_email: 'rhea@example.com',
      rating: 5,
      title: 'Sindoor Red is the ultimate bridal shade!',
      comment: 'Stayed on throughout an entire 6-hour family function with snacks and dinner without feathering. Does not dry out lips like other matte lipsticks!',
      status: 'approved'
    },
    {
      id: 'rev_004',
      product_id: 'prod_011',
      user_id: customerId2,
      author_name: 'Kavita Joshi',
      author_email: 'kavita@example.com',
      rating: 5,
      title: 'Enchanting and long lasting',
      comment: 'Noor-e-Gulab smells like a royal Mughal garden. Received compliments from everyone at my office. Will definitely repurchase.',
      status: 'approved'
    },
    {
      id: 'rev_005',
      product_id: 'prod_002',
      user_id: null,
      author_name: 'Pooja Nair',
      author_email: 'pooja.nair@example.com',
      rating: 4,
      title: 'Deeply moisturizing night cream',
      comment: 'Very rich and hydrating. Woke up with plump skin. Perfect for dry winter months.',
      status: 'approved'
    }
  ];

  const insertReview = db.prepare(`
    INSERT INTO reviews (id, product_id, user_id, author_name, author_email, rating, title, comment, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  reviews.forEach(r => {
    insertReview.run(r.id, r.product_id, r.user_id, r.author_name, r.author_email, r.rating, r.title, r.comment, r.status);
  });

  // 6. Seed Banners
  const banners = [
    {
      id: 'bnr_001',
      title: 'The Golden Radiance Collection',
      subtitle: 'Unlock Luminous, Lit-From-Within Beauty with 24K Pure Gold & Ayurvedic Actives',
      tagline: 'FESTIVE LUXURY EDIT',
      cta_text: 'Explore The Collection',
      cta_link: '/shop?category=skincare',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&auto=format&fit=crop&q=85',
      badge: 'FLAT 20% OFF WITH CODE: SHINE20',
      banner_type: 'hero',
      position: 1,
      is_active: 1
    },
    {
      id: 'bnr_002',
      title: 'Royal Bridal & Celebration Hampers',
      subtitle: 'Gift the glow of opulence. Curated heirloom beauty trunks encased in velvet gold foiling.',
      tagline: 'NEW ARRIVALS',
      cta_text: 'Discover Gift Sets',
      cta_link: '/shop?category=combos-gift-sets',
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1600&auto=format&fit=crop&q=85',
      badge: 'COMPLIMENTARY LUXURY GIFT WRAPPING',
      banner_type: 'hero',
      position: 2,
      is_active: 1
    },
    {
      id: 'bnr_003',
      title: 'Noor-e-Gulab Artisanal Perfumery',
      subtitle: 'Hand-blended with royal Kannauj Damask Roses, Kashmiri Saffron, and pure Ambergris.',
      tagline: 'TIMELESS LUXURY',
      cta_text: 'Shop Fragrances',
      cta_link: '/shop?category=fragrances',
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1600&auto=format&fit=crop&q=85',
      badge: 'LIMITED HANDCRAFTED BATCH',
      banner_type: 'hero',
      position: 3,
      is_active: 1
    }
  ];

  const insertBanner = db.prepare(`
    INSERT INTO banners (id, title, subtitle, tagline, cta_text, cta_link, image, badge, banner_type, position, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  banners.forEach(b => {
    insertBanner.run(b.id, b.title, b.subtitle, b.tagline, b.cta_text, b.cta_link, b.image, b.badge, b.banner_type, b.position, b.is_active);
  });

  // 7. Seed Sample Orders for Admin Analytics Demo
  const sampleOrders = [
    {
      id: 'ord_1001',
      order_number: 'SS-2026-8901',
      user_id: customerId1,
      customer_name: 'Ananya Patel',
      customer_email: 'ananya@example.com',
      customer_phone: '+91 9988776655',
      shipping_address: JSON.stringify({
        fullName: 'Ananya Patel',
        phone: '+91 9988776655',
        addressLine1: 'Flat 402, Royal Palms Residency',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400050',
        country: 'India'
      }),
      payment_method: 'UPI',
      payment_status: 'Paid',
      order_status: 'Delivered',
      subtotal: 3398,
      discount_amount: 679.6,
      coupon_code: 'SHINE20',
      shipping_fee: 0,
      total_amount: 2718.4,
      tracking_number: 'DELHIVERY-98124982',
      carrier: 'Delhivery Express',
      estimated_delivery: '2026-09-27',
      items: [
        { product_id: 'prod_001', product_name: '24K Gold Radiant Youth Elixir Serum', product_image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80', sku: 'SS-SK-001', price: 1899, quantity: 1, total_price: 1899 },
        { product_id: 'prod_002', product_name: 'Kumkumadi Royal Glow Miracle Night Cream', product_image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80', sku: 'SS-SK-002', price: 1499, quantity: 1, total_price: 1499 }
      ]
    },
    {
      id: 'ord_1002',
      order_number: 'SS-2026-8902',
      user_id: customerId2,
      customer_name: 'Meera Kapoor',
      customer_email: 'meera@example.com',
      customer_phone: '+91 9123456780',
      shipping_address: JSON.stringify({
        fullName: 'Meera Kapoor',
        phone: '+91 9123456780',
        addressLine1: 'B-14, Green Glen Layout, Bellandur',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560103',
        country: 'India'
      }),
      payment_method: 'CARD',
      payment_status: 'Paid',
      order_status: 'Shipped',
      subtotal: 5499,
      discount_amount: 500,
      coupon_code: 'GLOW500',
      shipping_fee: 0,
      total_amount: 4999,
      tracking_number: 'BLUEDART-84729103',
      carrier: 'Blue Dart Luxury Air',
      estimated_delivery: '2026-09-30',
      items: [
        { product_id: 'prod_013', product_name: 'The Imperial Bridal Radiance Box (Set of 5)', product_image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80', sku: 'SS-CB-001', price: 5499, quantity: 1, total_price: 5499 }
      ]
    },
    {
      id: 'ord_1003',
      order_number: 'SS-2026-8903',
      user_id: customerId1,
      customer_name: 'Ananya Patel',
      customer_email: 'ananya@example.com',
      customer_phone: '+91 9988776655',
      shipping_address: JSON.stringify({
        fullName: 'Ananya Patel',
        phone: '+91 9988776655',
        addressLine1: 'Flat 402, Royal Palms Residency',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400050',
        country: 'India'
      }),
      payment_method: 'COD',
      payment_status: 'Pending',
      order_status: 'Packed',
      subtotal: 2298,
      discount_amount: 0,
      coupon_code: null,
      shipping_fee: 0,
      total_amount: 2298,
      tracking_number: 'DELHIVERY-77123490',
      carrier: 'Delhivery Express',
      estimated_delivery: '2026-10-02',
      items: [
        { product_id: 'prod_005', product_name: 'Shagun Royal Silk Matte Velvet Lipstick', product_image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80', sku: 'SS-MK-001', price: 999, quantity: 1, selected_shade: '01 Royal Sindoor Red', total_price: 999 },
        { product_id: 'prod_006', product_name: 'Gilded Aura Baked Glow Highlighter', product_image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=80', sku: 'SS-MK-002', price: 1299, quantity: 1, selected_shade: 'Champagne Gilt', total_price: 1299 }
      ]
    }
  ];

  const insertOrder = db.prepare(`
    INSERT INTO orders (
      id, order_number, user_id, customer_name, customer_email, customer_phone,
      shipping_address, payment_method, payment_status, order_status,
      subtotal, discount_amount, coupon_code, shipping_fee, total_amount,
      tracking_number, carrier, estimated_delivery
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?
    )
  `);

  const insertOrderItem = db.prepare(`
    INSERT INTO order_items (id, order_id, product_id, product_name, product_image, sku, price, quantity, selected_shade, total_price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  sampleOrders.forEach(ord => {
    insertOrder.run(
      ord.id, ord.order_number, ord.user_id, ord.customer_name, ord.customer_email, ord.customer_phone,
      ord.shipping_address, ord.payment_method, ord.payment_status, ord.order_status,
      ord.subtotal, ord.discount_amount, ord.coupon_code, ord.shipping_fee, ord.total_amount,
      ord.tracking_number, ord.carrier, ord.estimated_delivery
    );

    ord.items.forEach(item => {
      insertOrderItem.run(
        uuidv4(), ord.id, item.product_id, item.product_name, item.product_image, item.sku,
        item.price, item.quantity, item.selected_shade || null, item.total_price
      );
    });
  });

  console.log('Database seeded successfully with users, categories, 18 luxury products, coupons, reviews, banners, and sample orders!');
}

seedDatabase();

module.exports = seedDatabase;
