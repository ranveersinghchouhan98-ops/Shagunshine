export const MOCK_CATEGORIES = [
  {
    id: 'cat_skincare',
    name: 'Skincare',
    slug: 'skincare',
    description: 'Luminous serums, nourishing creams, and revitalizing elixirs infused with botanical extracts and botanical extracts.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
    subcategories: ['Serums & Treatments', 'Moisturizers & Creams', 'Cleansers & Toners', 'Face Masks & Peels', 'Sun Protection']
  },
  {
    id: 'cat_makeup',
    name: 'Makeup',
    slug: 'makeup',
    description: 'High-pigment, velvety smooth luxury cosmetics designed to enhance your natural radiant glow.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    subcategories: ['Lipsticks & Lip Oils', 'Foundations & Concealers', 'Highlighters & Blushes', 'Eyeshadows & Liners', 'Setting Sprays']
  },
  {
    id: 'cat_haircare',
    name: 'Haircare',
    slug: 'haircare',
    description: 'Strengthening botanical hair rituals, Ayurvedic oils, and shine-boosting hair masks.',
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&auto=format&fit=crop&q=80',
    subcategories: ['Hair Oils & Serums', 'Shampoos & Conditioners', 'Hair Spa Masks', 'Scalp Care']
  },
  {
    id: 'cat_fragrances',
    name: 'Fragrances',
    slug: 'fragrances',
    description: 'Mesmerizing perfumes and artisanal attars blended with royal oud, Kashmiri saffron, and Damascene rose.',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
    subcategories: ['Eau De Parfum', 'Luxury Attar & Oils', 'Body Mists', 'Travel Minis']
  },
  {
    id: 'cat_combos',
    name: 'Combos & Gift Sets',
    slug: 'combos-gift-sets',
    description: 'Curated royal beauty boxes and celebration gift sets encased in velvet gold-foiled packaging.',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80',
    subcategories: ['Bridal Glow Kits', 'Daily Radiance Sets', 'Luxury Fragrance Duos', 'Festive Gift Hampers']
  }
];

export const MOCK_BANNERS = [
  {
    id: 'bnr_001',
    title: 'The Golden Radiance Collection',
    subtitle: 'Unlock Luminous, Lit-From-Within Beauty with Kashmiri Saffron & Ayurvedic Actives',
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

export const MOCK_PRODUCTS = [
  {
    id: 'prod_001',
    name: 'Radiant Saffron Youth Glow Serum',
    slug: 'radiant-saffron-youth-glow-serum',
    sku: 'SS-SK-001',
    category_id: 'cat_skincare',
    subcategory: 'Serums & Treatments',
    price: 2499,
    discount_price: 1899,
    stock_quantity: 45,
    description: 'An opulent anti-aging facial serum infused with pure Botanical Extracts, Kashmiri Saffron, and concentrated Hyaluronic Acid. Instantly restores skin luminosity, boosts collagen synthesis, and smooths fine lines with a non-greasy satin finish.',
    short_description: 'Pure Saffron Radiance infused radiance serum with Kashmiri Saffron and Hyaluronic Acid.',
    ingredients: 'Aqua, Pure Saffron Extracts, Crocus Sativus (Saffron) Extract, Sodium Hyaluronate, Niacinamide (5%), Rosa Damascena Flower Water, Centella Asiatica, Peptides Complex, Glycerin, Phenoxyethanol.',
    how_to_use: 'Dispense 3-4 drops onto cleansed palms. Gently press into face, neck, and décolletage in upward circular motions. Use morning and night prior to your moisturizer.',
    skin_type: 'All Skin Types',
    benefits: ['Instant Golden Glow', 'Deep Cellular Hydration', 'Collagen Boost & Plumping', 'Cruelty Free & Paraben Free'],
    shades: [],
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608248597359-59836378c66e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800&auto=format&fit=crop&q=80'
    ],
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
    benefits: ['Fades Dark Spots & Hyperpigmentation', 'Intense Overnight Repair', 'Sandalwood Calming Aroma', 'Dermatologist Tested'],
    shades: [],
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80'
    ],
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
    benefits: ['Sulfate & Paraben Free', 'Non-Drying Mild Formula', 'Instantly Refreshes Dull Skin'],
    shades: [],
    images: [
      'https://images.unsplash.com/photo-1556228722-d0b73c7fc366?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80'
    ],
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
    benefits: ['Broad Spectrum SPF 50+ PA++++', 'Zero White Cast', 'Blue Light Protection', 'Non-Comedogenic'],
    shades: [],
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    is_featured: 1,
    is_best_seller: 1,
    is_new_arrival: 0,
    rating: 4.9,
    reviews_count: 94
  },
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
    benefits: ['12-Hour Long Stay', 'Zero Smudge & Transfer Resistant', 'Comfortable Non-Cracking Formula'],
    shades: [
      { name: '01 Royal Sindoor Red', hex: '#8B1E3B' },
      { name: '02 Gulab Blush Nude', hex: '#D57991' },
      { name: '03 Malabar Spice Berry', hex: '#6B172E' },
      { name: '04 Saffron Caramel', hex: '#A65B36' },
      { name: '05 Jaipur Velvet Rose', hex: '#B02A4C' }
    ],
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80'
    ],
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
    benefits: ['Glass-Skin Wet Look', 'Zero Fallout', 'Blends Seamlessly'],
    shades: [
      { name: 'Champagne Gilt', hex: '#E5C378' },
      { name: 'Rose Gold Shimmer', hex: '#E29FB0' },
      { name: 'Bronze Goddess', hex: '#C5A049' }
    ],
    images: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80'
    ],
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
    benefits: ['16-Hour Radiance', 'SPF 25 Sun Protection', 'Buildable Medium-Full Coverage'],
    shades: [
      { name: '01 Ivory Warmth', hex: '#F9E4D4' },
      { name: '02 Almond Beige', hex: '#ECC4A8' },
      { name: '03 Honey Gold', hex: '#D8A47F' },
      { name: '04 Warm Caramel', hex: '#B88258' },
      { name: '05 Rich Espresso', hex: '#8B5A36' }
    ],
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80'
    ],
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
    benefits: ['Intense Color Payoff in 1 Swipe', 'Velvety Smooth Texture', 'Zero Creasing'],
    shades: [],
    images: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    is_featured: 1,
    is_best_seller: 0,
    is_new_arrival: 1,
    rating: 5.0,
    reviews_count: 41
  },
  {
    id: 'prod_009',
    name: 'Bhringraj & Red Onion Royal Hair Growth Serum',
    slug: 'bhringraj-red-onion-royal-hair-growth-serum',
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
    benefits: ['Reduces Hair Fall up to 80%', 'Boosts Follicle Density', 'Non-Sticky & Easily Washable'],
    shades: [],
    images: [
      'https://images.unsplash.com/photo-1608248597359-59836378c66e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&auto=format&fit=crop&q=80'
    ],
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
    benefits: ['Tames Frizz & Flyaways', 'Deep Cuticle Repair', 'Silky Salon Smooth Finish'],
    shades: [],
    images: [
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 1,
    rating: 4.7,
    reviews_count: 29
  },
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
    benefits: ['14+ Hour Sillage', 'Handcrafted Luxury Glass Bottle with Gold Cap', 'Artisanal Perfumery'],
    shades: [],
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80'
    ],
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
    benefits: ['100% Alcohol-Free Pure Attar', 'Lasts Over 24 Hours', 'Crystal Flacon Bottle'],
    shades: [],
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    is_featured: 1,
    is_best_seller: 0,
    is_new_arrival: 1,
    rating: 4.9,
    reviews_count: 45
  },
  {
    id: 'prod_fk_001',
    name: 'ENGAGE Vibes Perfume Set for Women (4 x Luxury Mood Fragrances)',
    slug: 'engage-vibes-perfume-set-for-women-4-x-luxury-mood-fragrances-1',
    sku: 'SS-FK-001',
    category_id: 'cat_combos',
    subcategory: 'Gift Sets & Minis',
    mrp: 550,
    price: 550,
    discount_price: 220,
    stock_quantity: 50,
    description: 'ENGAGE Vibes Perfume Set for Women features four captivating fragrances crafted for every mood and infinite allure. Long-lasting, refreshing, and beautifully boxed for daily wear or gifting.',
    short_description: 'Luxury 4-in-1 perfume gift set for women featuring versatile, long-lasting fragrances.',
    ingredients: 'Fine Fragrance Oils, Ethyl Alcohol, Aqua, Fixatives.',
    how_to_use: 'Spray directly onto pulse points—wrists, neck, and behind ears—from a distance of 15cm.',
    skin_type: 'All Skin Types',
    benefits: ["4 Distinct Signature Moods", "All-Day Long Lasting Sillage", "Pocket & Travel Friendly", "Ideal Luxury Gift Box"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_01.webp'
    ],
    status: 'active',
    is_featured: 1,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.7,
    reviews_count: 13
  },
  {
    id: 'prod_fk_002',
    name: 'Pure Sense Freesia & Musk Luxury Deodorant Body Spray (150ml)',
    slug: 'pure-sense-freesia-musk-luxury-deodorant-body-spray-150ml-2',
    sku: 'SS-FK-002',
    category_id: 'cat_fragrances',
    subcategory: 'Deodorants & Body Sprays',
    mrp: 375,
    price: 375,
    discount_price: 150,
    stock_quantity: 50,
    description: 'Pure Sense Freesia & Musk Deodorant delivers elegance in every spray. Formulated with vegetable-origin alcohol and free of phthalates and aluminium, it provides naturally luxurious freshness for even-toned underarms.',
    short_description: 'Aluminium-free & phthalate-free natural deodorant with fresh Freesia and sensual Musk.',
    ingredients: 'Vegetable Origin Alcohol, Natural Freesia Extract, White Musk Essence, Glycerin.',
    how_to_use: 'Shake well before use. Hold 15cm away from clean underarms and torso and spray generously.',
    skin_type: 'All Skin Types',
    benefits: ["Aluminium & Phthalate Free", "Naturally Luxurious All-Day Freshness", "Gentle on Sensitive Underarms", "Non-Staining Fine Mist"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_02.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 1,
    is_new_arrival: 0,
    rating: 4.8,
    reviews_count: 16
  },
  {
    id: 'prod_fk_003',
    name: 'Pure Sense Shimmer Collection Body Mist (Golden Hour & Silver Star 100ml)',
    slug: 'pure-sense-shimmer-collection-body-mist-golden-hour-silver-star-100ml-3',
    sku: 'SS-FK-003',
    category_id: 'cat_skincare',
    subcategory: 'Body Mists & Shimmers',
    mrp: 499,
    price: 499,
    discount_price: 200,
    stock_quantity: 50,
    description: 'Pure Sense Shimmer Collection brings a celestial glow to your skin. Featuring micro-fine shimmer pearls in Golden Hour and Silver Star variants that catch the light while enveloping you in an irresistible aroma.',
    short_description: 'Illuminating hair & body shimmer mist infused with fine radiant pearls.',
    ingredients: 'Ultra-Fine Shimmer Mica, Aloe Vera Juice, Botanical Extracts, Parfum.',
    how_to_use: 'Shake vigorously to activate shimmer pearls. Spritz all over collarbones, arms, and hair for an instant luminous gleam.',
    skin_type: 'All Skin Types',
    benefits: ["Subtle Sun-Kissed / Starlight Glow", "Non-Sticky Lightweight Mist", "Hydrating Botanicals", "Safe for Hair & Body"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_03.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 1,
    rating: 4.8,
    reviews_count: 19
  },
  {
    id: 'prod_fk_004',
    name: 'KillerX Unleash The Storm Gas-Free Deodorant Body Spray (150ml)',
    slug: 'killerx-unleash-the-storm-gas-free-deodorant-body-spray-150ml-4',
    sku: 'SS-FK-004',
    category_id: 'cat_fragrances',
    subcategory: 'Deodorants & Body Sprays',
    mrp: 299,
    price: 299,
    discount_price: 120,
    stock_quantity: 50,
    description: 'KillerX Gas-Free Deodorant Body Spray unleashes raw masculine energy. Featuring marine, storm, and wave notes with 0% gas for 100% concentrated, long-lasting performance.',
    short_description: 'Zero gas masculine body spray delivering intense marine fresh performance.',
    ingredients: 'Concentrated Perfume Oil, Denatured Ethyl Alcohol, Odor Absorbing Actives.',
    how_to_use: 'Spray across chest, underarms, and pulse points from 15cm distance after morning showers.',
    skin_type: 'All Skin Types',
    benefits: ["0% Gas Concentrated Formula", "Lasts 24+ Hours", "Cooling Marine & Fresh Woody Scent", "Prevents Sweat Odor"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_04.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 1,
    is_new_arrival: 0,
    rating: 4.9,
    reviews_count: 22
  },
  {
    id: 'prod_fk_005',
    name: 'XXX Rated Intense Body Spray (Spizy, Wild Oud, Supreme 150ml)',
    slug: 'xxx-rated-intense-body-spray-spizy-wild-oud-supreme-150ml-5',
    sku: 'SS-FK-005',
    category_id: 'cat_fragrances',
    subcategory: 'Deodorants & Body Sprays',
    mrp: 399,
    price: 399,
    discount_price: 160,
    stock_quantity: 50,
    description: 'XXX Rated Intense Deodorant Body Spray offers provocative allure with bold notes of Spizy, Wild Oud, and Supreme. Engineered to keep you daring, fresh, and unforgettable throughout the day.',
    short_description: 'Intense spicy and woody body spray with bold masculine notes.',
    ingredients: 'Wild Oud Wood Essences, Oriental Spices, Amber, Denatured Alcohol.',
    how_to_use: 'Hold can upright and spray all over torso and clothing from 15cm away.',
    skin_type: 'All Skin Types',
    benefits: ["Bold Oud & Spice Sillage", "Instant Odor Neutralizer", "High Projection", "Long Lasting Scent Trail"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_05.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 1,
    rating: 4.6,
    reviews_count: 25
  },
  {
    id: 'prod_fk_006',
    name: 'XXX Rated Fresh Body Spray (Aquax & Iconic 150ml)',
    slug: 'xxx-rated-fresh-body-spray-aquax-iconic-150ml-6',
    sku: 'SS-FK-006',
    category_id: 'cat_fragrances',
    subcategory: 'Deodorants & Body Sprays',
    mrp: 399,
    price: 399,
    discount_price: 160,
    stock_quantity: 50,
    description: 'XXX Rated Aquax & Iconic Body Spray delivers irresistible all-day freshness. Cool aquatic undertones mixed with crisp modern citrus keep you charged from sunrise to sunset.',
    short_description: 'Crisp aquatic and energetic daily body spray for active men.',
    ingredients: 'Marine Aquatic Notes, Bergamot, White Musk, Ethyl Alcohol.',
    how_to_use: 'Spritz generously onto neck, chest, and arms before gym, work, or evenings out.',
    skin_type: 'All Skin Types',
    benefits: ["Ultra Refreshing Aquatic Kick", "Active Odor Control", "Non-Irritating Formula", "Crisp Masculine Finish"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_06.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.7,
    reviews_count: 28
  },
  {
    id: 'prod_fk_007',
    name: 'Just Herbs Long-Lasting Body Spray (Salt & Sand / Floral Fiesta 150ml)',
    slug: 'just-herbs-long-lasting-body-spray-salt-sand-floral-fiesta-150ml-7',
    sku: 'SS-FK-007',
    category_id: 'cat_fragrances',
    subcategory: 'Deodorants & Body Sprays',
    mrp: 325,
    price: 325,
    discount_price: 130,
    stock_quantity: 50,
    description: 'Just Herbs Pure Fragrances for Him & Her combine natural elegance with long-lasting deodorant performance. Available in breezy Salt & Sand and romantic Floral Fiesta.',
    short_description: 'Ayurvedic inspired long-lasting body spray with natural aromatic essences.',
    ingredients: 'Natural Botanical Essences, Sea Minerals, Floral Distillates, Pure Grain Alcohol.',
    how_to_use: 'Spray across chest and body for instant revitalizing botanical freshness.',
    skin_type: 'All Skin Types',
    benefits: ["Pure Clean Fragrance", "Gender Neutral Options", "Gentle on Skin", "Non-Overpowering Sophistication"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_07.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.8,
    reviews_count: 31
  },
  {
    id: 'prod_fk_008',
    name: 'Blackstone Men\'s Grooming Deodorant & Body Spray (200ml)',
    slug: 'blackstone-men-s-grooming-deodorant-body-spray-200ml-8',
    sku: 'SS-FK-008',
    category_id: 'cat_fragrances',
    subcategory: 'Deodorants & Body Sprays',
    mrp: 399,
    price: 399,
    discount_price: 160,
    stock_quantity: 50,
    description: 'Blackstone Men\'s Grooming All-Day Odor Protection Deodorant Spray. 100% Aluminium and Paraben Free with invigorating notes of Sea + Surf, Ocean Blue, and Warm Sandalwood.',
    short_description: 'Clean grooming deodorant with aluminium-free all-day odor protection.',
    ingredients: 'Sandalwood Extract, Sea Salt Minerals, Cedarwood, Skin Conditioning Agents.',
    how_to_use: 'Shake can, spray on underarms and torso after bathing.',
    skin_type: 'All Skin Types',
    benefits: ["Aluminium & Paraben Free", "Oversized 200ml Can", "Rich Sandalwood & Ocean Crispness", "24-Hour Active Odor Shield"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_08.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 1,
    rating: 4.8,
    reviews_count: 34
  },
  {
    id: 'prod_fk_009',
    name: 'Seris Graffiti Lush & Rouge Pour Femme Luxury Body Spray (150ml)',
    slug: 'seris-graffiti-lush-rouge-pour-femme-luxury-body-spray-150ml-9',
    sku: 'SS-FK-009',
    category_id: 'cat_fragrances',
    subcategory: 'Deodorants & Body Sprays',
    mrp: 399,
    price: 399,
    discount_price: 160,
    stock_quantity: 50,
    description: 'Seris Graffiti Lush & Rouge Pour Femme is a bold, artistic, and unforgettable body spray tailored for modern women who love vibrant berry and sensual floral expressions.',
    short_description: 'Artistic French-inspired luxury floral-fruity deodorant for women.',
    ingredients: 'Red Berries, Rose Petals, Vanilla Bean, Ethyl Alcohol.',
    how_to_use: 'Spritz liberally onto wrists, neckline, and upper body.',
    skin_type: 'All Skin Types',
    benefits: ["Chic French Perfumery Vibe", "All-Day Romantic Sillage", "Featherlight Non-Sticky Mist", "Gentle on Clothes"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_09.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 1,
    rating: 4.9,
    reviews_count: 37
  },
  {
    id: 'prod_fk_010',
    name: 'Seris Graffiti Charm & Flash Pour Homme Luxury Body Spray (150ml)',
    slug: 'seris-graffiti-charm-flash-pour-homme-luxury-body-spray-150ml-10',
    sku: 'SS-FK-010',
    category_id: 'cat_fragrances',
    subcategory: 'Deodorants & Body Sprays',
    mrp: 399,
    price: 399,
    discount_price: 160,
    stock_quantity: 50,
    description: 'Seris Graffiti Charm & Flash Pour Homme combines timeless elegance with contemporary masculine allure. Refreshing citrus top notes give way to deep spicy amber accents.',
    short_description: 'Premium deodorant body spray for men with sophisticated citrus-amber notes.',
    ingredients: 'Citrus Zest, Cardamom, Amberwood, Vetiver, Perfume Alcohol.',
    how_to_use: 'Spray onto clean chest, shoulders, and underarms.',
    skin_type: 'All Skin Types',
    benefits: ["High Longevity", "Executive Office & Evening Wear", "Instant Odor Neutralization", "Premium Aerosol Diffusion"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_10.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.6,
    reviews_count: 40
  },
  {
    id: 'prod_fk_011',
    name: 'Seris Graffiti Luxury Deodorant Body Spray Collection (150ml)',
    slug: 'seris-graffiti-luxury-deodorant-body-spray-collection-150ml-11',
    sku: 'SS-FK-011',
    category_id: 'cat_fragrances',
    subcategory: 'Deodorants & Body Sprays',
    mrp: 399,
    price: 399,
    discount_price: 160,
    stock_quantity: 50,
    description: 'Experience the full expression of French perfumery with Seris Graffiti Luxury Deodorant Spray. Richly scented with high fragrance oil concentration for maximum longevity.',
    short_description: 'High concentration luxury deodorant spray with long projection.',
    ingredients: 'Premium Fragrance Concentrates, Denatured Ethanol, Moisturizing Emollients.',
    how_to_use: 'Hold 15cm from skin and mist generously.',
    skin_type: 'All Skin Types',
    benefits: ["High Fragrance Oil Concentration", "Zero White Residue", "Scent Trails Last for Hours", "Skin-Safe Formulation"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_11.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.7,
    reviews_count: 43
  },
  {
    id: 'prod_fk_012',
    name: 'XXX Rated Legend Eau De Parfum For Men (100ml)',
    slug: 'xxx-rated-legend-eau-de-parfum-for-men-100ml-12',
    sku: 'SS-FK-012',
    category_id: 'cat_fragrances',
    subcategory: 'Eau De Parfum',
    mrp: 2499,
    price: 2499,
    discount_price: 1000,
    stock_quantity: 50,
    description: 'XXX Rated Legend Eau De Parfum is an iconic masculine scent crafted for commanding presence. Opens with bold leather and dark woods, drying down to an intoxicating magnetic amber finish.',
    short_description: 'Commanding Eau De Parfum with rich leather, smoky woods, and amber.',
    ingredients: 'Leather Accord, Dark Cedarwood, Tonka Bean, French Perfume Essence.',
    how_to_use: 'Apply 2-3 sprays to collarbones, inner wrists, and behind ears.',
    skin_type: 'All Skin Types',
    benefits: ["Concentrated Eau De Parfum Strength", "8-12 Hour Sillage", "Heavyweight Glass Flacon", "Signature Evening Fragrance"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_12.webp'
    ],
    status: 'active',
    is_featured: 1,
    is_best_seller: 1,
    is_new_arrival: 0,
    rating: 4.8,
    reviews_count: 46
  },
  {
    id: 'prod_fk_013',
    name: 'XXX Rated Softly Eau De Parfum For Women (100ml)',
    slug: 'xxx-rated-softly-eau-de-parfum-for-women-100ml-13',
    sku: 'SS-FK-013',
    category_id: 'cat_fragrances',
    subcategory: 'Eau De Parfum',
    mrp: 2499,
    price: 2499,
    discount_price: 1000,
    stock_quantity: 50,
    description: 'XXX Rated Softly Eau De Parfum invites you to indulge in seductive charm. A delicate symphony of soft velvety florals, sweet almond, and warm white musk that caresses the senses.',
    short_description: 'Velvety floral-musk Eau De Parfum with sweet almond and white blossoms.',
    ingredients: 'White Jasmine, Sweet Almond Milk, Heliotrope, Sensual Musk.',
    how_to_use: 'Spritz behind neck, on wrists, and hair ends.',
    skin_type: 'All Skin Types',
    benefits: ["Intimate & Romantic Projection", "All-Day Gentle Lingering Aroma", "Crafted with Fine European Oils", "Sensual Feminine Appeal"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_13.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.8,
    reviews_count: 49
  },
  {
    id: 'prod_fk_014',
    name: 'XXX Rated Whisky Eau De Parfum (100ml)',
    slug: 'xxx-rated-whisky-eau-de-parfum-100ml-14',
    sku: 'SS-FK-014',
    category_id: 'cat_fragrances',
    subcategory: 'Eau De Parfum',
    mrp: 2499,
    price: 2499,
    discount_price: 1000,
    stock_quantity: 50,
    description: 'XXX Rated Whisky Eau De Parfum captures the mature warmth of aged oak barrels, roasted spices, and rich caramel vanilla. A distinguished fragrance for the connoisseur.',
    short_description: 'Rich boozy and smoky woody Eau De Parfum with barrel-aged bourbon notes.',
    ingredients: 'Aged Oakwood, Bourbon Accord, Spiced Vanilla, Warm Tobacco.',
    how_to_use: 'Spray onto inner wrists and base of throat.',
    skin_type: 'All Skin Types',
    benefits: ["Intense Boozy Gourmand Character", "Exceptional Cold-Weather Performance", "Opulent Heavy Bottle", "Head-Turning Scent"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_14.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 1,
    rating: 4.9,
    reviews_count: 52
  },
  {
    id: 'prod_fk_015',
    name: 'Kelyn Ultimate Amber Eau De Parfum (100ml)',
    slug: 'kelyn-ultimate-amber-eau-de-parfum-100ml-15',
    sku: 'SS-FK-015',
    category_id: 'cat_fragrances',
    subcategory: 'Eau De Parfum',
    mrp: 1499,
    price: 1499,
    discount_price: 600,
    stock_quantity: 50,
    description: 'Kelyn Ultimate Amber Eau De Parfum is a radiant essence of resplendent warmth. Radiant amber crystals intertwine with delicate saffron and balsamic woods for supreme sophistication.',
    short_description: 'Opulent amber and saffron Eau De Parfum with balsamic wood warmth.',
    ingredients: 'Golden Amber, Kashmiri Saffron, Guaiac Wood, Benzoin Resin.',
    how_to_use: 'Mist lightly over pulse points and fabric for an enduring aura.',
    skin_type: 'All Skin Types',
    benefits: ["Pure Amber Glow Sillage", "Over 10 Hours of Longevity", "Unisex Luxury Profile", "Hypoallergenic Perfume Base"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_15.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 1,
    is_new_arrival: 0,
    rating: 4.6,
    reviews_count: 10
  },
  {
    id: 'prod_fk_016',
    name: 'Kelyn Rosy Oud Eau De Parfum (100ml)',
    slug: 'kelyn-rosy-oud-eau-de-parfum-100ml-16',
    sku: 'SS-FK-016',
    category_id: 'cat_fragrances',
    subcategory: 'Eau De Parfum',
    mrp: 1499,
    price: 1499,
    discount_price: 600,
    stock_quantity: 50,
    description: 'Kelyn Rosy Oud Eau De Parfum is the scent of eternal allure. The delicate velvety petals of Taif rose unite with smoky royal agarwood in an aristocratic Middle Eastern blend.',
    short_description: 'Aristocratic Taif Rose and deep Agarwood (Oud) Eau De Parfum.',
    ingredients: 'Taif Rose Oil, Cambodian Agarwood (Oud), Pink Pepper, Patchouli.',
    how_to_use: 'Spray onto neck and wrists for a mesmerizing presence.',
    skin_type: 'All Skin Types',
    benefits: ["Regal Rose-Oud Harmony", "Enchanting Lingering Projection", "Handcrafted Fragrance Formulation", "Great for Special Occasions"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_16.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.7,
    reviews_count: 13
  },
  {
    id: 'prod_fk_017',
    name: 'Der Duft Valade Haute Parfumerie Eau De Parfum (100ml)',
    slug: 'der-duft-valade-haute-parfumerie-eau-de-parfum-100ml-17',
    sku: 'SS-FK-017',
    category_id: 'cat_fragrances',
    subcategory: 'Eau De Parfum',
    mrp: 9500,
    price: 9500,
    discount_price: 3800,
    stock_quantity: 50,
    description: 'Der Duft Valade is an ultra-exclusive niche perfume masterpiece formulated with rare raw absolutes. Features complex balsamic resins, rare florals, and precious woods crafted for the true luxury elite.',
    short_description: 'Exclusive niche artisanal Eau De Parfum with precious rare absolutes.',
    ingredients: 'Rare Floral Absolutes, Frankincense, Sandalwood Mysore, Precious Resins.',
    how_to_use: 'Apply sparingly to pulse points; a single spritz radiates for hours.',
    skin_type: 'All Skin Types',
    benefits: ["Ultra-Niche Formulation", "14+ Hours Unrivaled Longevity", "Master Perfumer Signature", "Collector's Luxury Packaging"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_17.webp'
    ],
    status: 'active',
    is_featured: 1,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.8,
    reviews_count: 16
  },
  {
    id: 'prod_fk_018',
    name: 'Der Duft Rebanni Artisanal Eau De Parfum (50ml)',
    slug: 'der-duft-rebanni-artisanal-eau-de-parfum-50ml-18',
    sku: 'SS-FK-018',
    category_id: 'cat_fragrances',
    subcategory: 'Eau De Parfum',
    mrp: 7900,
    price: 7900,
    discount_price: 3160,
    stock_quantity: 50,
    description: 'Der Duft Rebanni represents the pinnacle of artisanal perfumery. An enigmatic blend of exotic smoky botanicals and warm leather, radiating supreme confidence and mystery.',
    short_description: 'Bespoke German artisanal Eau De Parfum with dark smoky leather notes.',
    ingredients: 'Birch Tar, Italian Leather, Smoked Vetiver, Iris Root.',
    how_to_use: 'Mist across pulse points and collar.',
    skin_type: 'All Skin Types',
    benefits: ["Bespoke European Olfactory Profile", "Deep & Mysterious Sillage", "Hand-Bottled Precision", "Elite Performance"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_18.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.8,
    reviews_count: 19
  },
  {
    id: 'prod_fk_019',
    name: 'Insight Black Eau De Fabric Perfume For Men (100ml)',
    slug: 'insight-black-eau-de-fabric-perfume-for-men-100ml-19',
    sku: 'SS-FK-019',
    category_id: 'cat_fragrances',
    subcategory: 'Fabric & Apparel Perfumes',
    mrp: 330,
    price: 330,
    discount_price: 130,
    stock_quantity: 50,
    description: 'Insight Black Eau De Fabric Perfume is specially formulated to bond with clothing fibers without staining. Releases continuous bursts of crisp, magnetic freshness every time you move.',
    short_description: 'Fabric-safe apparel perfume for men delivering continuous garment freshness.',
    ingredients: 'Fiber-Binding Aroma Microcapsules, Cedar, Citrus, Non-Staining Base.',
    how_to_use: 'Spray directly onto clothes from 20cm away before wearing.',
    skin_type: 'All Skin Types',
    benefits: ["100% Non-Staining on Fabrics", "Motion-Activated Scent Release", "Lasts All Day on Clothes", "Ideal for Suits & Daily Wear"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_19.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.9,
    reviews_count: 22
  },
  {
    id: 'prod_fk_020',
    name: 'Kelyn Ultimate Amber Reserve Eau De Parfum (100ml)',
    slug: 'kelyn-ultimate-amber-reserve-eau-de-parfum-100ml-20',
    sku: 'SS-FK-020',
    category_id: 'cat_fragrances',
    subcategory: 'Eau De Parfum',
    mrp: 1499,
    price: 1499,
    discount_price: 600,
    stock_quantity: 50,
    description: 'Kelyn Ultimate Amber Reserve brings forth deeply macerated amber resin enhanced with madagascar vanilla and cedarwood. Warm, welcoming, and endlessly captivating.',
    short_description: 'Reserve edition concentrated amber and bourbon vanilla perfume.',
    ingredients: 'Macerated Amber, Madagascar Bourbon Vanilla, Virginia Cedar.',
    how_to_use: 'Spray across chest, neck, and behind ears.',
    skin_type: 'All Skin Types',
    benefits: ["Deep Macerated Longevity", "Rich Golden Aura", "Skin & Fabric Safe", "Compliment Magnet"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_20.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.6,
    reviews_count: 25
  },
  {
    id: 'prod_fk_021',
    name: 'Beast-X Emperor Eau De Parfum (50ml)',
    slug: 'beast-x-emperor-eau-de-parfum-50ml-21',
    sku: 'SS-FK-021',
    category_id: 'cat_fragrances',
    subcategory: 'Eau De Parfum',
    mrp: 499,
    price: 499,
    discount_price: 200,
    stock_quantity: 50,
    description: 'Beast-X Emperor Eau De Parfum is crowned with fiery pink peppercorn, sharp Italian bergamot, and smoky vetiver. An aggressive, charismatic signature for modern leaders.',
    short_description: 'High-impact masculine Eau De Parfum with bergamot and vetiver.',
    ingredients: 'Italian Bergamot, Pink Peppercorn, Haitian Vetiver, Iso E Super.',
    how_to_use: 'Apply to throat, wrists, and shoulders.',
    skin_type: 'All Skin Types',
    benefits: ["High Beast-Mode Projection", "Crisp Masculine Spark", "Compact Travel Friendly 50ml", "Long Lasting Drydown"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_21.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 1,
    rating: 4.7,
    reviews_count: 28
  },
  {
    id: 'prod_fk_022',
    name: 'Pollo Currency of Scent Luxury Eau De Parfum (100ml)',
    slug: 'pollo-currency-of-scent-luxury-eau-de-parfum-100ml-22',
    sku: 'SS-FK-022',
    category_id: 'cat_fragrances',
    subcategory: 'Eau De Parfum',
    mrp: 799,
    price: 799,
    discount_price: 320,
    stock_quantity: 50,
    description: 'Pollo Currency of Scent brings luxury in every note. An international fragrance blend combining aromatic lavender, fresh cardamom, and creamy sandalwood.',
    short_description: 'International luxury aromatic fougère Eau De Parfum.',
    ingredients: 'French Lavender, Cardamom, Sandalwood, Tonka Bean.',
    how_to_use: 'Spray 2-3 times on pulse points after dressing.',
    skin_type: 'All Skin Types',
    benefits: ["Refined Executive Profile", "Smooth Non-Intrusive Sillage", "Versatile All-Season Wear", "Heavy Glass Bottle"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_22.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.8,
    reviews_count: 31
  },
  {
    id: 'prod_fk_023',
    name: 'Kelyn Men Cooler Intense Eau De Toilette (100ml)',
    slug: 'kelyn-men-cooler-intense-eau-de-toilette-100ml-23',
    sku: 'SS-FK-023',
    category_id: 'cat_fragrances',
    subcategory: 'Eau De Toilette',
    mrp: 599,
    price: 599,
    discount_price: 240,
    stock_quantity: 50,
    description: 'Kelyn Men Cooler Intense is your signature scent of refreshing confidence. Frosted mint, sharp eucalyptus, and zesty grapefruit combine with driftwood for an invigorating blast.',
    short_description: 'Ultra-cooling aquatic and minty fragrance for active lifestyle.',
    ingredients: 'Frosted Spearmint, Eucalyptus Oil, Pink Grapefruit, Driftwood Accord.',
    how_to_use: 'Spritz generously after morning routine or post-workout.',
    skin_type: 'All Skin Types',
    benefits: ["Instant Cooling Sensation", "Sweat & Heat Resistant", "Energizing Awakening Aroma", "Daily Wear Hero"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_23.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.8,
    reviews_count: 34
  },
  {
    id: 'prod_fk_024',
    name: 'Wanwan Anti-Dandruff Flake-Free Hair Shampoo (Thailand Edition 300ml)',
    slug: 'wanwan-anti-dandruff-flake-free-hair-shampoo-thailand-edition-300ml-24',
    sku: 'SS-FK-024',
    category_id: 'cat_haircare',
    subcategory: 'Shampoos & Conditioners',
    mrp: 899,
    price: 899,
    discount_price: 360,
    stock_quantity: 50,
    description: 'Wanwan Thailand Edition Anti-Dandruff Shampoo delivers a healthy, flake-free scalp and silky smooth hair. Formulated with botanical zinc pyrithione and soothing aloe vera to eliminate itching and flakes without stripping natural oils.',
    short_description: 'Flake-free scalp care shampoo powered by soothing Thai botanicals.',
    ingredients: 'Zinc Pyrithione, Aloe Vera Leaf Juice, Tea Tree Essential Oil, Provitamin B5.',
    how_to_use: 'Massage into wet scalp, work into a rich lather, leave for 2 minutes, and rinse thoroughly.',
    skin_type: 'All Skin Types',
    benefits: ["100% Flake-Free Scalp", "Relieves Scalp Itchiness & Redness", "Sulfate-Safe Gentle Cleansing", "Leaves Hair Soft & Manageable"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_24.webp'
    ],
    status: 'active',
    is_featured: 1,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.9,
    reviews_count: 37
  },
  {
    id: 'prod_fk_025',
    name: 'Wanwan Damage Control Argan Oil Shampoo (Thailand Edition 300ml)',
    slug: 'wanwan-damage-control-argan-oil-shampoo-thailand-edition-300ml-25',
    sku: 'SS-FK-025',
    category_id: 'cat_haircare',
    subcategory: 'Shampoos & Conditioners',
    mrp: 899,
    price: 899,
    discount_price: 360,
    stock_quantity: 50,
    description: 'Wanwan Thailand Edition Damage Control Shampoo is enriched with pure Moroccan Argan Oil and Hydrolyzed Keratin. Restores damaged cuticle fibers, seals split ends, and delivers salon-smooth shine.',
    short_description: 'Restorative shampoo with pure Argan Oil and Hydrolyzed Keratin for damaged hair.',
    ingredients: 'Moroccan Argan Oil, Hydrolyzed Keratin, Sweet Almond Oil, Vitamin E.',
    how_to_use: 'Apply to wet hair, lather gently from roots to ends, and rinse clean. Follow with conditioner.',
    skin_type: 'All Skin Types',
    benefits: ["Repairs Heat & Color Damage", "Seals Cuticles Against Frizz", "Intense Moisture & Luster", "Prevents Hair Breakage"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_25.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.6,
    reviews_count: 40
  },
  {
    id: 'prod_fk_026',
    name: 'Wanwan Barrier Repair + Hydration Gentle Face Wash (5 Ceramides 150ml)',
    slug: 'wanwan-barrier-repair-hydration-gentle-face-wash-5-ceramides-150ml-26',
    sku: 'SS-FK-026',
    category_id: 'cat_skincare',
    subcategory: 'Face Wash & Cleansers',
    mrp: 399,
    price: 399,
    discount_price: 160,
    stock_quantity: 50,
    description: 'Wanwan Barrier Repair + Hydration Gentle Face Wash is packed with 5 Essential Ceramides and Japanese Hyaluronic Acid. Gently cleanses impurities while reinforcing the moisture barrier, keeping skin plump and dewy.',
    short_description: 'Moisture-barrier repairing gentle face wash with 5 ceramides and hyaluronic acid.',
    ingredients: 'Ceramide NP, Ceramide AP, Ceramide EOP, Hyaluronic Acid, Oat Extract.',
    how_to_use: 'Pump a small amount onto damp hands, massage gently in circular motions for 60 seconds, and rinse with lukewarm water.',
    skin_type: 'All Skin Types',
    benefits: ["Strengthens Skin Moisture Barrier", "Zero Post-Wash Tightness", "Gentle for Sensitive & Compromised Skin", "pH Balanced (5.5)"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_26.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 1,
    is_new_arrival: 0,
    rating: 4.7,
    reviews_count: 43
  },
  {
    id: 'prod_fk_027',
    name: 'Winyfred Hydra Glow BB Serum Foundation (Korean Formulation 30ml)',
    slug: 'winyfred-hydra-glow-bb-serum-foundation-korean-formulation-30ml-27',
    sku: 'SS-FK-027',
    category_id: 'cat_makeup',
    subcategory: 'Foundation & BB Creams',
    mrp: 1299,
    price: 1299,
    discount_price: 520,
    stock_quantity: 50,
    description: 'Winyfred Hydra Glow BB Serum combines skincare hydration with sheer luminous coverage. Infused with Korean Centella Asiatica and Niacinamide, it blurs blemishes and imparts a natural glass-skin radiance.',
    short_description: 'Korean glass-skin BB serum offering weightless hydration and flawless radiant coverage.',
    ingredients: 'Centella Asiatica, Niacinamide (3%), Hyaluronic Acid, Mineral Pigments.',
    how_to_use: 'Dispense 2-3 drops onto fingertips or beauty sponge and blend evenly outward from the center of the face.',
    skin_type: 'All Skin Types',
    benefits: ["Featherlight Serum Texture", "Korean Glass-Skin Finish", "Blurs Redness & Uneven Tone", "Doesn't Clog Pores"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_27.webp'
    ],
    status: 'active',
    is_featured: 1,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.8,
    reviews_count: 46
  },
  {
    id: 'prod_fk_028',
    name: 'Winyfred Hydra Glow CC Serum Color Corrector (Korean Formulation 30ml)',
    slug: 'winyfred-hydra-glow-cc-serum-color-corrector-korean-formulation-30ml-28',
    sku: 'SS-FK-028',
    category_id: 'cat_makeup',
    subcategory: 'Foundation & BB Creams',
    mrp: 1299,
    price: 1299,
    discount_price: 520,
    stock_quantity: 50,
    description: 'Winyfred Hydra Glow CC Serum uses micro-encapsulated color adapt technology to neutralize dullness and redness upon contact. Leaves skin looking vibrant, even-toned, and naturally perfected.',
    short_description: 'Korean smart color-correcting CC serum for illuminated, even complexion.',
    ingredients: 'Color-Adapting Pigment Beads, Rice Ferment Filtrate, Adenosine, Vitamin E.',
    how_to_use: 'Apply a dime-sized amount to cleansed face; massage until capsules release and blend into your skin tone.',
    skin_type: 'All Skin Types',
    benefits: ["Adapts to Natural Skin Tone", "Cancels Redness & Sallowness", "Deep Hydration Infusion", "Natural Dewy Glow"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_28.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 1,
    rating: 4.8,
    reviews_count: 49
  },
  {
    id: 'prod_fk_029',
    name: 'Winyfred Korean Glass Skin Glow Facial Kit (Complete 5-Step Treatment)',
    slug: 'winyfred-korean-glass-skin-glow-facial-kit-complete-5-step-treatment-29',
    sku: 'SS-FK-029',
    category_id: 'cat_combos',
    subcategory: 'Facial Kits & Combos',
    mrp: 2400,
    price: 2400,
    discount_price: 960,
    stock_quantity: 50,
    description: 'Achieve the coveted Korean glass skin at home with Winyfred\'s 5-Step Professional Facial Kit. Includes Cleanser, Exfoliating Scrub, Nourishing Massage Cream, Radiant Glow Pack, and Glow Lock Serum.',
    short_description: 'Luxury 5-step Korean aesthetic clinic facial kit for luminous translucent glow.',
    ingredients: 'Korean Rice Water, Galactomyces Ferment, Niacinamide, Pearl Powder.',
    how_to_use: 'Follow steps 1 through 5 sequentially according to the inside instructions for a monthly skin revival.',
    skin_type: 'All Skin Types',
    benefits: ["Salon-Grade Glass Skin Result", "Removes Dead Skin & Dullness", "Intense Hydration Boost", "Visible Glow in 45 Minutes"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_29.webp'
    ],
    status: 'active',
    is_featured: 1,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.9,
    reviews_count: 52
  },
  {
    id: 'prod_fk_030',
    name: 'Winyfred Gentle Breakage Control Hair Serum (Korean Formulation 100ml)',
    slug: 'winyfred-gentle-breakage-control-hair-serum-korean-formulation-100ml-30',
    sku: 'SS-FK-030',
    category_id: 'cat_haircare',
    subcategory: 'Hair Serums & Treatments',
    mrp: 599,
    price: 599,
    discount_price: 240,
    stock_quantity: 50,
    description: 'Winyfred Breakage Control Hair Serum penetrates deep into weakened hair fibers to fortify strands from within. Contains fermented camellia oil and silk amino acids to tame flyaways and shield against thermal styling.',
    short_description: 'Korean anti-breakage hair serum with fermented camellia oil and silk amino acids.',
    ingredients: 'Fermented Camellia Japonica Oil, Silk Amino Acids, Vitamin B5, Plant Squalane.',
    how_to_use: 'Apply 1-2 pumps to damp mid-lengths and ends before blow-drying, or onto dry hair for gloss.',
    skin_type: 'All Skin Types',
    benefits: ["Reduces Hair Breakage by 92%", "Heat Protection up to 230\u00b0C", "Silky Gloss Without Greasiness", "Tames Frizz in High Humidity"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_30.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 1,
    rating: 4.6,
    reviews_count: 10
  },
  {
    id: 'prod_fk_031',
    name: 'Der Duft Bouncy Smooth Shine & Soft Hair Care (German Formulation 100ml)',
    slug: 'der-duft-bouncy-smooth-shine-soft-hair-care-german-formulation-100ml-31',
    sku: 'SS-FK-031',
    category_id: 'cat_haircare',
    subcategory: 'Hair Serums & Treatments',
    mrp: 499,
    price: 499,
    discount_price: 200,
    stock_quantity: 50,
    description: 'Der Duft Bouncy Smooth hair serum is engineered with precision German formulation. Packed with cold-pressed Avocado Oil and Extra Virgin Olive Oil to deliver instant mirror-like shine and velvety softness.',
    short_description: 'German engineered bouncy smooth shine serum with Avocado and Olive oils.',
    ingredients: 'Persea Gratissima (Avocado) Oil, Olea Europaea (Olive) Fruit Oil, Vitamin E, Dimethiconol.',
    how_to_use: 'Rub 2-3 drops between palms and run through mid-lengths to ends of dry or damp hair.',
    skin_type: 'All Skin Types',
    benefits: ["Mirror-Like Weightless Shine", "Restores Hair Elasticity & Bounce", "Deeply Conditions Dry Split Ends", "Pleasant Subtle Fragrance"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_31.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.7,
    reviews_count: 13
  },
  {
    id: 'prod_fk_032',
    name: 'Winyfred Sunscreen Shield SPF 50 PA++++ (Korean Luxury Protection 50g)',
    slug: 'winyfred-sunscreen-shield-spf-50-pa-korean-luxury-protection-50g-32',
    sku: 'SS-FK-032',
    category_id: 'cat_skincare',
    subcategory: 'Sun Care & SPF',
    mrp: 599,
    price: 599,
    discount_price: 240,
    stock_quantity: 50,
    description: 'Winyfred Sunscreen Shield offers maximum broad-spectrum UV protection with an ultra-light, zero-white-cast Korean gel texture. Resists tanning, photo-aging, and blue light exposure.',
    short_description: 'Korean luxury SPF 50 PA++++ sun shield gel with zero white cast.',
    ingredients: 'Cica Extract, Hyaluronic Acid, Tinosorb S, Uvinul A Plus, Niacinamide.',
    how_to_use: 'Apply generously to face, neck, and exposed skin 15 minutes before stepping out. Reapply every 3-4 hours.',
    skin_type: 'All Skin Types',
    benefits: ["Broad Spectrum SPF 50 PA++++", "Zero White Cast & Invisible Finish", "Sweat & Water Resistant", "Hydrating Dewy Touch"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_32.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 1,
    is_new_arrival: 0,
    rating: 4.8,
    reviews_count: 16
  },
  {
    id: 'prod_fk_033',
    name: 'Wanwan Wake Up To Glow-Up Retinol & Azelaic Night Mask (Thailand Edition 50g)',
    slug: 'wanwan-wake-up-to-glow-up-retinol-azelaic-night-mask-thailand-edition-50g-33',
    sku: 'SS-FK-033',
    category_id: 'cat_skincare',
    subcategory: 'Face Masks & Peels',
    mrp: 699,
    price: 699,
    discount_price: 280,
    stock_quantity: 50,
    description: 'Wanwan Wake Up To Glow-Up Overnight Mask works while you sleep. Encapsulated Retinol accelerates cell turnover while Azelaic Acid calms redness and fades stubborn blemishes, waking you up to refined glass skin.',
    short_description: 'Potent overnight resurfacing mask with encapsulated Retinol and Azelaic Acid.',
    ingredients: 'Encapsulated Retinol (0.5%), Azelaic Acid (5%), Niacinamide, Hyaluronic Acid.',
    how_to_use: 'Smooth an even layer over cleansed face at night as the final step of your skincare regimen. Rinse in the morning.',
    skin_type: 'All Skin Types',
    benefits: ["Fades Pigmentation & Acne Marks", "Smooths Fine Lines & Texture", "Deep Hydration Infusion", "Wake Up to Youthful Radiant Skin"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_33.webp'
    ],
    status: 'active',
    is_featured: 1,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.8,
    reviews_count: 19
  },
  {
    id: 'prod_fk_034',
    name: 'Winyfred Alpha Arbutin & Orange Peel Sandalwood Facial Glow Pack (100g)',
    slug: 'winyfred-alpha-arbutin-orange-peel-sandalwood-facial-glow-pack-100g-34',
    sku: 'SS-FK-034',
    category_id: 'cat_skincare',
    subcategory: 'Face Masks & Peels',
    mrp: 799,
    price: 799,
    discount_price: 320,
    stock_quantity: 50,
    description: 'Winyfred Luxury Skin Transformation Pack combines Alpha Arbutin with Pure Sandalwood and Orange Peel extracts. Visibly brightens uneven tone, purifies pores, and imparts a bridal luminescence.',
    short_description: 'Skin transformation glow pack with Alpha Arbutin, Sandalwood, and Orange Peel.',
    ingredients: 'Alpha Arbutin, Pure Santalum Album (Sandalwood) Powder, Citrus Aurantium Dulcis (Orange) Peel, Kaolin Clay.',
    how_to_use: 'Apply an even layer to cleansed face. Allow to dry for 15-20 minutes, then rinse off with warm water while massaging gently.',
    skin_type: 'All Skin Types',
    benefits: ["Instant Radiant Golden Glow", "Clarifies Blemishes & Dark Spots", "Soothes Sunburn & Inflammation", "Tightens Open Pores"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_34.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.9,
    reviews_count: 22
  },
  {
    id: 'prod_fk_035',
    name: 'Der Duft Brightening & Hydrating Luxury Face Wash (150ml)',
    slug: 'der-duft-brightening-hydrating-luxury-face-wash-150ml-35',
    sku: 'SS-FK-035',
    category_id: 'cat_skincare',
    subcategory: 'Face Wash & Cleansers',
    mrp: 499,
    price: 499,
    discount_price: 200,
    stock_quantity: 50,
    description: 'Der Duft Brightening & Hydrating Luxury Face Wash purifies skin by effortlessly melting makeup, excess oil, and pollution particles without disrupting the acid mantle. Leaves skin luminous and velvety soft.',
    short_description: 'Luxury German skincare face wash removing makeup, dirt, and clogged sebum.',
    ingredients: 'German Chamomile Extract, Niacinamide, Provitamin B5, Mild Amino Acid Surfactants.',
    how_to_use: 'Lather a small pump between wet palms. Gently massage face for 60 seconds and wash off thoroughly.',
    skin_type: 'All Skin Types',
    benefits: ["Prevents Clogged Pores & Blackheads", "Dissolves Waterproof Makeup & Dirt", "Leaves Skin Fresh & Plump", "Non-Stripping Gentle Formula"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_35.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.6,
    reviews_count: 25
  },
  {
    id: 'prod_fk_036',
    name: 'Winyfred Amino Acid Complex Beta-Glucan & Lactic Acid Toner (150ml)',
    slug: 'winyfred-amino-acid-complex-beta-glucan-lactic-acid-toner-150ml-36',
    sku: 'SS-FK-036',
    category_id: 'cat_skincare',
    subcategory: 'Toners & Mists',
    mrp: 499,
    price: 499,
    discount_price: 200,
    stock_quantity: 50,
    description: 'Winyfred Amino Acid Complex Toner rebalances skin pH while gently sweeping away dead cells with mild Lactic Acid. High-potency Beta-Glucan delivers 20% more moisture retention than standard hyaluronic acid.',
    short_description: 'Balancing & exfoliating toner with Amino Acids, Beta-Glucan, and Lactic Acid.',
    ingredients: '17 Amino Acid Complex, Beta-Glucan, Lactic Acid (AHA 2%), Centella Asiatica.',
    how_to_use: 'Soak a cotton pad or pat directly onto clean skin with hands morning and evening.',
    skin_type: 'All Skin Types',
    benefits: ["Gently Micro-Exfoliates Skin", "20% More Hydration Than Hyaluronic Acid", "Tightens Enlarged Pores", "Preps Skin for Serums"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_36.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.7,
    reviews_count: 28
  },
  {
    id: 'prod_fk_037',
    name: 'Winyfred Anti-Acne Plump Skin Serum (Salicylic & Hyaluronic Acid 30ml)',
    slug: 'winyfred-anti-acne-plump-skin-serum-salicylic-hyaluronic-acid-30ml-37',
    sku: 'SS-FK-037',
    category_id: 'cat_skincare',
    subcategory: 'Serums & Treatments',
    mrp: 799,
    price: 799,
    discount_price: 320,
    stock_quantity: 50,
    description: 'Winyfred Anti-Acne Plump Skin Serum delivers the optimal harmony of Salicylic Acid for deep pore clearance and Multi-Molecular Hyaluronic Acid for bounce and hydration. Clears breakouts while preserving bounce.',
    short_description: 'Dual-action anti-acne clarifying and plumping serum with Salicylic and Hyaluronic acids.',
    ingredients: 'Salicylic Acid (BHA 2%), Sodium Hyaluronate, Zinc PCA, Tea Tree Hydrosol.',
    how_to_use: 'Apply 3-4 drops directly to cleansed face, focusing on acne-prone zones. Follow with moisturizer.',
    skin_type: 'All Skin Types',
    benefits: ["De-clogs Pores & Kills Acne Bacteria", "Reduces Redness & Swelling", "Plumps Fine Lines With Moisture", "Non-Drying Oil Free Texture"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_37.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 1,
    rating: 4.8,
    reviews_count: 31
  },
  {
    id: 'prod_fk_038',
    name: 'Martyn France Professional Argan Shampoo (Sulfate & Paraben Free 300ml)',
    slug: 'martyn-france-professional-argan-shampoo-sulfate-paraben-free-300ml-38',
    sku: 'SS-FK-038',
    category_id: 'cat_haircare',
    subcategory: 'Shampoos & Conditioners',
    mrp: 799,
    price: 799,
    discount_price: 320,
    stock_quantity: 50,
    description: 'Martyn France Formulation Professional Argan Shampoo is a salon-grade restorative cleanser. Specially designed for dry, chemically treated, and damaged hair to restore moisture balance and vitality.',
    short_description: 'French salon formula argan shampoo for damaged and dry hair recovery.',
    ingredients: 'Organic Argania Spinosa Kernel Oil, Hydrolyzed Wheat Protein, Keratin, Sulfate-Free Cleansers.',
    how_to_use: 'Lather generously onto wet hair, massaging into scalp. Rinse thoroughly with cool water.',
    skin_type: 'All Skin Types',
    benefits: ["100% Sulfate & Paraben Free", "Color Safe & Keratin Safe", "Deep Moisture for Brittle Hair", "French Salon Performance"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_38.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.8,
    reviews_count: 34
  },
  {
    id: 'prod_fk_039',
    name: 'Pattaya Queen Ultra Gentle Foaming Cleanser (Vitamin C & Kojic Acid 150ml)',
    slug: 'pattaya-queen-ultra-gentle-foaming-cleanser-vitamin-c-kojic-acid-150ml-39',
    sku: 'SS-FK-039',
    category_id: 'cat_skincare',
    subcategory: 'Face Wash & Cleansers',
    mrp: 799,
    price: 799,
    discount_price: 320,
    stock_quantity: 50,
    description: 'Pattaya Queen Ultra Gentle Foaming Cleanser features an airy cloud texture enriched with Vitamin C and Kojic Acid to wash away dullness and accelerate luminous skin brightness.',
    short_description: 'Brightening foaming cleanser with Vitamin C and Kojic Acid for luminous skin.',
    ingredients: 'Ascorbyl Glucoside (Vitamin C), Kojic Acid, Papaya Fruit Extract, Coconut Surfactants.',
    how_to_use: 'Pump 1-2 puffs of rich foam onto hands, massage across face, and wash with water.',
    skin_type: 'All Skin Types',
    benefits: ["Fades Sun Tan & Dark Blemishes", "Soft Airy Cloud Foam", "Instant Radiance After Wash", "Soap Free Formulation"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_39.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.9,
    reviews_count: 37
  },
  {
    id: 'prod_fk_040',
    name: 'Pattaya Queen Ultra Gentle Milk Protein Foaming Cleanser (150ml)',
    slug: 'pattaya-queen-ultra-gentle-milk-protein-foaming-cleanser-150ml-40',
    sku: 'SS-FK-040',
    category_id: 'cat_skincare',
    subcategory: 'Face Wash & Cleansers',
    mrp: 799,
    price: 799,
    discount_price: 320,
    stock_quantity: 50,
    description: 'Pattaya Queen Milk Protein Foaming Cleanser envelops your skin in nutrient-rich milk lipids and ceramides. Nourishes compromised barriers while gently cleaning away daily grime.',
    short_description: 'Ultra-gentle soothing milk protein foaming wash for soft baby-like skin.',
    ingredients: 'Hydrolyzed Milk Protein, Sweet Almond Milk, Niacinamide, Vitamin E.',
    how_to_use: 'Massage foam onto damp face in circular motions; rinse thoroughly.',
    skin_type: 'All Skin Types',
    benefits: ["Intensely Nourishes Dry Skin", "Maintains Skin Elasticity", "Calms Irritation & Flaking", "Decadent Creamy Cloud Foam"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_40.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.6,
    reviews_count: 40
  },
  {
    id: 'prod_fk_041',
    name: 'Wanwan Brightening & Cooling Luxury Body Lotion (Thailand Edition 300ml)',
    slug: 'wanwan-brightening-cooling-luxury-body-lotion-thailand-edition-300ml-41',
    sku: 'SS-FK-041',
    category_id: 'cat_skincare',
    subcategory: 'Body Care & Lotions',
    mrp: 1499,
    price: 1499,
    discount_price: 600,
    stock_quantity: 50,
    description: 'Wanwan Brightening & Cooling Body Lotion treats your body to refreshing Thai luxury. Absorbs instantly with a soothing cooling sensation while Vitamin B3 and glutathione visibly brighten skin tone.',
    short_description: 'Lightweight cooling body lotion with Glutathione and Niacinamide.',
    ingredients: 'Glutathione, Niacinamide (5%), Menthol Cooling Beads, Aloe Vera, Shea Butter.',
    how_to_use: 'Apply lavishly over clean body, especially after showering, concentrating on arms and legs.',
    skin_type: 'All Skin Types',
    benefits: ["Instant Refreshing Cooling Effect", "Deep 24-Hour Hydration", "Non-Sticky Non-Greasy Texture", "Fades Uneven Body Tan"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_41.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.7,
    reviews_count: 43
  },
  {
    id: 'prod_fk_042',
    name: 'Der Duft 222 One Haute Parfumerie Eau De Parfum (100ml)',
    slug: 'der-duft-222-one-haute-parfumerie-eau-de-parfum-100ml-42',
    sku: 'SS-FK-042',
    category_id: 'cat_fragrances',
    subcategory: 'Eau De Parfum',
    mrp: 9000,
    price: 9000,
    discount_price: 3600,
    stock_quantity: 50,
    description: 'Der Duft 222 One is the crown jewel of high perfumery. An opulent olfactory statement crafted with ambergris, black orchid, and aged patchouli for the true connoisseur of luxury.',
    short_description: 'High-luxury niche Eau De Parfum with black orchid, ambergris, and patchouli.',
    ingredients: 'Natural Ambergris Accord, Black Orchid Extract, Aged Indonesian Patchouli, Fine Alcohol.',
    how_to_use: 'Spritz 1-2 times onto pulse points; allow fragrance to settle naturally.',
    skin_type: 'All Skin Types',
    benefits: ["Prestigious Niche Masterpiece", "Extraordinary 16+ Hour Projection", "Exquisite Heavyweight Flacon", "Unmatched Sillage Trail"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_42.webp'
    ],
    status: 'active',
    is_featured: 1,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.8,
    reviews_count: 46
  },
  {
    id: 'prod_fk_043',
    name: 'Der Duft Rebanni Masterpiece Eau De Parfum (100ml)',
    slug: 'der-duft-rebanni-masterpiece-eau-de-parfum-100ml-43',
    sku: 'SS-FK-043',
    category_id: 'cat_fragrances',
    subcategory: 'Eau De Parfum',
    mrp: 9000,
    price: 9000,
    discount_price: 3600,
    stock_quantity: 50,
    description: 'Der Duft Rebanni Masterpiece in an exclusive 100ml flacon. A deeply mysterious synthesis of smoky birch tar, Tuscan leather, and powdered iris root tailored for unforgettable evenings.',
    short_description: 'Masterpiece 100ml edition of smoky leather and Tuscan iris.',
    ingredients: 'Tuscan Leather, Smoked Birch, Iris Butter, Dark Amber, Precious Resins.',
    how_to_use: 'Apply to chest, wrists, and collar for a captivating presence.',
    skin_type: 'All Skin Types',
    benefits: ["Grand 100ml Luxury Bottle", "Dark & Magnetic Silhouette", "Elite European Perfumery", "Immense Scent Trail"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_43.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.8,
    reviews_count: 49
  },
  {
    id: 'prod_fk_044',
    name: 'Blom Cucumber Herbal Luxury Face & Body Scrub (200g)',
    slug: 'blom-cucumber-herbal-luxury-face-body-scrub-200g-44',
    sku: 'SS-FK-044',
    category_id: 'cat_skincare',
    subcategory: 'Scrubs & Exfoliators',
    mrp: 120,
    price: 120,
    discount_price: 48,
    stock_quantity: 50,
    description: 'Blom Cucumber Herbal Luxury Scrub gently buffs away dead skin cells and rough patches with micro-exfoliating walnut granules and cool fresh cucumber extract. Leaves skin baby soft and invigorated.',
    short_description: 'Cooling cucumber face and body scrub with herbal extracts.',
    ingredients: 'Cucumis Sativus (Cucumber) Fruit Extract, Walnut Shell Granules, Mint, Glycerin.',
    how_to_use: 'Massage onto damp skin in circular motions for 2-3 minutes; rinse with warm water. Use twice weekly.',
    skin_type: 'All Skin Types',
    benefits: ["Gently Buffs Away Dead Cells", "Instant Cooling & Calming", "Restores Baby-Soft Smoothness", "Great for Face, Arms & Legs"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_44.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.9,
    reviews_count: 52
  },
  {
    id: 'prod_fk_045',
    name: 'Viavirid Organic Rose Water Pure Hydrating Mist (200ml)',
    slug: 'viavirid-organic-rose-water-pure-hydrating-mist-200ml-45',
    sku: 'SS-FK-045',
    category_id: 'cat_skincare',
    subcategory: 'Toners & Mists',
    mrp: 399,
    price: 399,
    discount_price: 160,
    stock_quantity: 50,
    description: 'Viavirid Organic Rose Water is steam-distilled from freshly handpicked damask roses. 100% pure and alcohol-free, it balances natural skin pH, tightens pores, and provides an immediate surge of floral hydration.',
    short_description: '100% pure steam-distilled organic damask rose hydrosol.',
    ingredients: '100% Pure Steam Distilled Rosa Damascena (Rose) Flower Water.',
    how_to_use: 'Spritz directly onto face anytime during the day or use as a soothing toner before moisturizer.',
    skin_type: 'All Skin Types',
    benefits: ["100% Pure Organic Hydrosol", "Balances Natural Skin pH", "Instant Refreshing Pick-Me-Up", "Alcohol-Free & Chemical-Free"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_45.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.6,
    reviews_count: 10
  },
  {
    id: 'prod_fk_046',
    name: 'Der Duft Airbrush Finish Luminous Liquid Foundation (35ml)',
    slug: 'der-duft-airbrush-finish-luminous-liquid-foundation-35ml-46',
    sku: 'SS-FK-046',
    category_id: 'cat_makeup',
    subcategory: 'Foundation & BB Creams',
    mrp: 1599,
    price: 1599,
    discount_price: 640,
    stock_quantity: 50,
    description: 'Der Duft Airbrush Finish Foundation delivers high-definition coverage with a weightless, breathable texture. Infused with light-reflecting micro-pigments that create an immaculate airbrushed glow.',
    short_description: 'High-definition airbrush finish foundation with luminous long-wear coverage.',
    ingredients: 'Hyaluronic Acid, Vitamin E, Silicone Elastomers, Treated Mineral Pigments.',
    how_to_use: 'Shake well. Dot onto forehead, cheeks, and chin. Buff outwards using a dense foundation brush or damp sponge.',
    skin_type: 'All Skin Types',
    benefits: ["Airbrushed Flawless Finish", "Medium to Full Buildable Coverage", "16-Hour Transfer Resistant Wear", "Non-Comedogenic & Breathable"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_46.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 1,
    is_new_arrival: 0,
    rating: 4.7,
    reviews_count: 13
  },
  {
    id: 'prod_fk_047',
    name: 'Epilation Collagen & Tea Tree Soothing Body Wash (France Formulation 425ml)',
    slug: 'epilation-collagen-tea-tree-soothing-body-wash-france-formulation-425ml-47',
    sku: 'SS-FK-047',
    category_id: 'cat_skincare',
    subcategory: 'Body Wash & Shower Gels',
    mrp: 1299,
    price: 1299,
    discount_price: 520,
    stock_quantity: 50,
    description: 'Epilation Collagen & Tea Tree Body Wash is specially formulated to soothe skin and prevent post-hair-removal irritation. Pure tea tree oil purifies pores while marine collagen firms and hydrates.',
    short_description: 'Post-epilation soothing body wash with Tea Tree and Marine Collagen.',
    ingredients: 'Australian Tea Tree Oil, Marine Collagen, Witch Hazel, Aloe Vera.',
    how_to_use: 'Pour onto wet loofah, work into rich lather across entire body, and rinse off thoroughly.',
    skin_type: 'All Skin Types',
    benefits: ["Prevents Ingrown Hairs & Bumps", "Deep Antibacterial Cleanse", "Restores Firmness & Moisture", "Generous 425ml Family Size"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_47.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.8,
    reviews_count: 16
  },
  {
    id: 'prod_fk_048',
    name: 'Epilation All-Rounder Head-to-Toe Black Oat Body Wash (425ml)',
    slug: 'epilation-all-rounder-head-to-toe-black-oat-body-wash-425ml-48',
    sku: 'SS-FK-048',
    category_id: 'cat_skincare',
    subcategory: 'Body Wash & Shower Gels',
    mrp: 1299,
    price: 1299,
    discount_price: 520,
    stock_quantity: 50,
    description: 'Epilation All-Rounder Head-to-Toe Body Wash is enriched with Black Oat Extract and Plant Lecithin. Provides intense lipid replenishment for dry, irritated skin from scalp down to toes.',
    short_description: 'All-rounder deep cleansing head-to-toe wash with Black Oat and Lecithin.',
    ingredients: 'Avena Strigosa (Black Oat) Seed Extract, Lecithin, Provitamin B5, Gentle Surfactants.',
    how_to_use: 'Use in the shower to wash hair, face, and body in one luxurious cleansing step.',
    skin_type: 'All Skin Types',
    benefits: ["Universal Head-to-Toe Care", "Repairs Lipid Moisture Film", "Calms Itchiness & Dry Flakes", "Gentle for Sensitive Skin"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_48.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.8,
    reviews_count: 19
  },
  {
    id: 'prod_fk_049',
    name: 'Winyfred Aloe Vera & Ginseng Keratin Silky Hair Shampoo (300ml)',
    slug: 'winyfred-aloe-vera-ginseng-keratin-silky-hair-shampoo-300ml-49',
    sku: 'SS-FK-049',
    category_id: 'cat_haircare',
    subcategory: 'Shampoos & Conditioners',
    mrp: 599,
    price: 599,
    discount_price: 240,
    stock_quantity: 50,
    description: 'Winyfred Korean Formulation Keratin Silky Hair Shampoo blends rejuvenating Korean Ginseng with cooling Aloe Vera. Restores smooth mirror shine and structural strength to limp, frizzy strands.',
    short_description: 'Korean herbal shampoo with Keratin, Ginseng, and Aloe Vera for silky hair.',
    ingredients: 'Panax Ginseng Root Extract, Aloe Vera, Hydrolyzed Keratin, Panthenol.',
    how_to_use: 'Apply to wet hair, lather from scalp to tips, leave for 60 seconds, and rinse.',
    skin_type: 'All Skin Types',
    benefits: ["Revitalizes Dull Limp Hair", "Infuses Mirror-Like Silky Shine", "Sulfate-Safe Gentle Cleanse", "Deep Scalp Nourishment"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_49.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.9,
    reviews_count: 22
  },
  {
    id: 'prod_fk_050',
    name: 'Winyfred Argan & Shea Butter Anti Hair Fall Thicker Hair Shampoo (300ml)',
    slug: 'winyfred-argan-shea-butter-anti-hair-fall-thicker-hair-shampoo-300ml-50',
    sku: 'SS-FK-050',
    category_id: 'cat_haircare',
    subcategory: 'Shampoos & Conditioners',
    mrp: 599,
    price: 599,
    discount_price: 240,
    stock_quantity: 50,
    description: 'Winyfred Anti Hair Fall Shampoo pairs raw African Shea Butter with Moroccan Argan Oil. Coats individual hair shafts to reduce breakage during brushing and foster noticeably thicker, denser volume.',
    short_description: 'Anti hair fall thickening shampoo with Argan Oil and Shea Butter.',
    ingredients: 'Butyrospermum Parkii (Shea) Butter, Argan Oil, Biotin, Plant Keratin.',
    how_to_use: 'Massage thoroughly into scalp and hair; rinse thoroughly.',
    skin_type: 'All Skin Types',
    benefits: ["Reduces Hair Fall due to Breakage", "Boosts Noticeable Hair Density", "Intense Moisture for Dry Scalps", "Rich Creamy Lather"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_50.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.6,
    reviews_count: 25
  },
  {
    id: 'prod_fk_051',
    name: 'Winyfred Avocado & Coconut Longer Stronger Hair Shampoo (300ml)',
    slug: 'winyfred-avocado-coconut-longer-stronger-hair-shampoo-300ml-51',
    sku: 'SS-FK-051',
    category_id: 'cat_haircare',
    subcategory: 'Shampoos & Conditioners',
    mrp: 599,
    price: 599,
    discount_price: 240,
    stock_quantity: 50,
    description: 'Winyfred Longer Stronger Shampoo harnesses the lipid-rich goodness of Avocado and pure virgin Coconut. Fortifies hair tensile strength, preventing snapped ends to support maximum healthy hair length.',
    short_description: 'Fortifying shampoo with Avocado and Coconut for longer, stronger locks.',
    ingredients: 'Persea Gratissima (Avocado) Fruit Extract, Cocos Nucifera (Coconut) Oil, Biotinyl Tripeptide.',
    how_to_use: 'Wash hair 2-3 times weekly with this rich formula.',
    skin_type: 'All Skin Types',
    benefits: ["Fortifies Strands for Maximum Length", "Prevents Split Ends & Snapping", "Hydrates Without Weighing Hair Down", "Subtle Tropical Coconut Fragrance"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_51.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.7,
    reviews_count: 28
  },
  {
    id: 'prod_fk_052',
    name: 'Wanwan De-Tan Pure Whitening Milk & Rice Extract Cream (100g)',
    slug: 'wanwan-de-tan-pure-whitening-milk-rice-extract-cream-100g-52',
    sku: 'SS-FK-052',
    category_id: 'cat_skincare',
    subcategory: 'Face Masks & Peels',
    mrp: 899,
    price: 899,
    discount_price: 360,
    stock_quantity: 50,
    description: 'Wanwan De-Tan Cream is an intensive brightening mask powered by Japanese Rice Water and nutrient-rich Milk Extract. Dissolves sun-induced tanning and restores a crystal-clear radiant complexion.',
    short_description: 'Intensive de-tan face pack with pure Milk and Rice Extract.',
    ingredients: 'Rice Bran Water, Hydrolyzed Milk Protein, Kojic Dipalmitate, Niacinamide, Kaolin.',
    how_to_use: 'Apply generously over tanned face and neck. Leave for 15 minutes and wipe off with a wet sponge.',
    skin_type: 'All Skin Types',
    benefits: ["Reverses Stubborn Sun Tan in 15 Min", "Even Out Skin Tone & Texture", "Leaves Skin Velvety Soft", "Gentle Non-Bleach Formula"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_52.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 1,
    is_new_arrival: 0,
    rating: 4.8,
    reviews_count: 31
  },
  {
    id: 'prod_fk_053',
    name: 'Der Duft Fresh Kiwi & Exfoliating Acid Foaming Face Wash (150ml)',
    slug: 'der-duft-fresh-kiwi-exfoliating-acid-foaming-face-wash-150ml-53',
    sku: 'SS-FK-053',
    category_id: 'cat_skincare',
    subcategory: 'Face Wash & Cleansers',
    mrp: 750,
    price: 750,
    discount_price: 300,
    stock_quantity: 50,
    description: 'Der Duft Fresh Kiwi Foaming Face Wash delivers an instant energy recharge for your face. Natural Kiwi enzymes and fruit acids gently buff away dulling impurities, leaving skin energized and vibrant.',
    short_description: 'Energizing fruit-acid foaming cleanser with pure Kiwi Extract.',
    ingredients: 'Actinidia Chinensis (Kiwi) Fruit Extract, Glycolic Acid, Malic Acid, Vitamin C.',
    how_to_use: 'Pump foam onto face, massage in upward circles, and splash with cool water.',
    skin_type: 'All Skin Types',
    benefits: ["Instant Morning Face Recharge", "Fruit Acid Gentle Micro-Peeling", "Unclogs Pores & Revives Glow", "Invigorating Natural Kiwi Aroma"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_53.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.8,
    reviews_count: 34
  },
  {
    id: 'prod_fk_054',
    name: 'Wanwan Vitamin-C Sea Buckthorn Glow Facial Kit (6-Step Salon Treatment)',
    slug: 'wanwan-vitamin-c-sea-buckthorn-glow-facial-kit-6-step-salon-treatment-54',
    sku: 'SS-FK-054',
    category_id: 'cat_combos',
    subcategory: 'Facial Kits & Combos',
    mrp: 2400,
    price: 2400,
    discount_price: 960,
    stock_quantity: 50,
    description: 'Wanwan Vitamin-C Facial Kit delivers radiant, clinic-grade skin renewal. Infused with potent Sea Buckthorn berry oil and pure Vitamin C to combat sun damage, hyperpigmentation, and fatigue.',
    short_description: 'Complete 6-step salon facial kit powered by Sea Buckthorn and Vitamin C.',
    ingredients: 'Sea Buckthorn Berry Oil, Ethyl Ascorbic Acid, Kojic Acid, Papaya Fruit Extract.',
    how_to_use: 'Follow steps 1 (Cleanser) through 6 (Brightening Serum) for an at-home luxury spa session.',
    skin_type: 'All Skin Types',
    benefits: ["Comprehensive 6-Step Treatment", "Fades Dark Spots & Hyperpigmentation", "Boosts Natural Collagen Synthesis", "Luminous Youthful Radiance"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_54.webp'
    ],
    status: 'active',
    is_featured: 1,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.9,
    reviews_count: 37
  },
  {
    id: 'prod_fk_055',
    name: 'Winyfred Korean Glass Skin Glow Gel & Scrub Facial Kit',
    slug: 'winyfred-korean-glass-skin-glow-gel-scrub-facial-kit-55',
    sku: 'SS-FK-055',
    category_id: 'cat_combos',
    subcategory: 'Facial Kits & Combos',
    mrp: 2400,
    price: 2400,
    discount_price: 960,
    stock_quantity: 50,
    description: 'Winyfred Korean Glass Skin Kit combines micro-fine exfoliating scrub with translucent radiance gel. Revitalizes cellular renewal for mirror-smooth glass skin reflecting light effortlessly.',
    short_description: 'Korean aesthetic clinic glass skin scrub and glow gel treatment kit.',
    ingredients: 'Rice Ferment Filtrate, Niacinamide, Polyhydroxy Acids (PHA), Centella Asiatica.',
    how_to_use: 'Use once every 3-4 weeks for complete skin resurfacing and glass glow.',
    skin_type: 'All Skin Types',
    benefits: ["Effortless At-Home Korean Glass Skin", "Zero Harsh Physical Abrasives", "Intense Hydrating Quench", "Immediate Photo-Ready Finish"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_55.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 1,
    rating: 4.6,
    reviews_count: 40
  },
  {
    id: 'prod_fk_056',
    name: 'Der Duft Instant Radiant Glow Professional Facial Kit',
    slug: 'der-duft-instant-radiant-glow-professional-facial-kit-56',
    sku: 'SS-FK-056',
    category_id: 'cat_combos',
    subcategory: 'Facial Kits & Combos',
    mrp: 2400,
    price: 2400,
    discount_price: 960,
    stock_quantity: 50,
    description: 'Der Duft Instant Glow Professional Kit is formulated for high-profile red carpet events. Instantly illuminates tired skin, tightening contours and bestowing an undeniable youthful aura.',
    short_description: 'German professional instant glow facial treatment for event-ready radiance.',
    ingredients: 'Peptide Complex, Squalane, Hyaluronic Acid, Marine Botanicals, Vitamin E.',
    how_to_use: 'Apply the steps sequentially prior to celebrations or special events.',
    skin_type: 'All Skin Types',
    benefits: ["Instant Red-Carpet Radiance", "Firms & Plumps Sagging Skin", "Deeply Replenishes Moisture Depots", "Luxury Spa Experience"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_56.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.7,
    reviews_count: 43
  },
  {
    id: 'prod_fk_057',
    name: 'Wanwan Luxury Morning Glory Refreshing Body Wash (300ml)',
    slug: 'wanwan-luxury-morning-glory-refreshing-body-wash-300ml-57',
    sku: 'SS-FK-057',
    category_id: 'cat_skincare',
    subcategory: 'Body Wash & Shower Gels',
    mrp: 1100,
    price: 1100,
    discount_price: 440,
    stock_quantity: 50,
    description: 'Wanwan Morning Glory Body Wash is crafted with 95% natural-origin botanical cleansers. Envelops the shower in enchanting floral notes while cleansing away stress, leaving skin silky and supple.',
    short_description: '95% natural-origin luxury body wash with fresh Morning Glory botanical essences.',
    ingredients: 'Morning Glory Flower Extract, Botanical Cleansing Complex, Glycerin, Provitamin B5.',
    how_to_use: 'Massage onto damp skin using a sponge or hands; lather up and rinse off.',
    skin_type: 'All Skin Types',
    benefits: ["95% Natural-Origin Ingredients", "Sulfate-Free Gentle Foam", "Sensuous Floral Scent", "Prevents Post-Shower Dryness"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_57.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.8,
    reviews_count: 46
  },
  {
    id: 'prod_fk_058',
    name: 'Der Duft Lacto Hone & Lotus Blanc Concentrated Face Serum Ampoules (30ml)',
    slug: 'der-duft-lacto-hone-lotus-blanc-concentrated-face-serum-ampoules-30ml-58',
    sku: 'SS-FK-058',
    category_id: 'cat_skincare',
    subcategory: 'Serums & Treatments',
    mrp: 900,
    price: 900,
    discount_price: 360,
    stock_quantity: 50,
    description: 'Der Duft Lacto Hone & Lotus Blanc Serum Ampoules harness the restorative powers of fermented lactic cultures and sacred White Lotus extract. Renews skin texture, soothes blemishes, and enhances barrier defense.',
    short_description: 'Concentrated ampoule serum with Lacto-ferments and sacred White Lotus.',
    ingredients: 'Lactobacillus Ferment Lysate, Nelumbo Nucifera (White Lotus) Extract, Niacinamide, Hyaluronic Acid.',
    how_to_use: 'Dispense 3-4 drops onto clean fingertips and press gently into face and neck before night cream.',
    skin_type: 'All Skin Types',
    benefits: ["Restores Healthy Skin Microbiome", "Calms Redness & Irritation", "Improves Texture Uniformity", "Velvety Quick-Absorbing Finish"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_58.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.8,
    reviews_count: 49
  },
  {
    id: 'prod_fk_059',
    name: 'Wanwan Hydra Gel Hyaluronic Acid Overnight Sleeping Mask (100g)',
    slug: 'wanwan-hydra-gel-hyaluronic-acid-overnight-sleeping-mask-100g-59',
    sku: 'SS-FK-059',
    category_id: 'cat_skincare',
    subcategory: 'Face Masks & Peels',
    mrp: 2000,
    price: 2000,
    discount_price: 800,
    stock_quantity: 50,
    description: 'Wanwan Hydra Gel Hyaluronic Acid Sleeping Mask acts as an intensive moisture reservoir through the night. Its memory-gel formula locks in hydration, preventing trans-epidermal water loss for pillow-soft skin.',
    short_description: 'Water-locking overnight memory gel mask with Multi-Molecular Hyaluronic Acid.',
    ingredients: 'Hydrolyzed Hyaluronic Acid, Tremella Fuciformis (Snow Mushroom), Ceramide Complex, Betaine.',
    how_to_use: 'Apply generously as the final step of nighttime skincare. Sleep and rinse off in the morning.',
    skin_type: 'All Skin Types',
    benefits: ["Overnight Deep Moisture Quench", "Pillow-Proof Quick Absorbing Gel", "Prevents Trans-Epidermal Water Loss", "Wake Up to Bouncy Plump Skin"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_59.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.9,
    reviews_count: 52
  },
  {
    id: 'prod_fk_060',
    name: 'Wanwan Luxury Rinse-Off Hair Conditioner (Thailand Edition 300ml)',
    slug: 'wanwan-luxury-rinse-off-hair-conditioner-thailand-edition-300ml-60',
    sku: 'SS-FK-060',
    category_id: 'cat_haircare',
    subcategory: 'Shampoos & Conditioners',
    mrp: 1600,
    price: 1600,
    discount_price: 640,
    stock_quantity: 50,
    description: 'Wanwan Luxury Rinse-Off Conditioner envelopes stressed hair cuticles in restorative amino acids and botanical butters. Melts away tangles effortlessly and seals in weightless, glossy hydration.',
    short_description: 'Ultra-slip detangling and cuticle-sealing conditioner with botanical butters.',
    ingredients: 'Shea Butter, Hydrolyzed Silk, Behentrimonium Methosulfate, Cetearyl Alcohol, Panthenol.',
    how_to_use: 'After shampooing, apply from mid-lengths to ends. Leave on for 2-3 minutes, then rinse cleanly.',
    skin_type: 'All Skin Types',
    benefits: ["Instant Pain-Free Detangling", "Smooths Flyaways & Rough Ends", "Weightless Volumizing Finish", "Heat & Humidity Protection"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_60.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.6,
    reviews_count: 10
  },
  {
    id: 'prod_fk_061',
    name: 'Wanwan Complete Hair Care Balance Shampoo (Thailand Edition 300ml)',
    slug: 'wanwan-complete-hair-care-balance-shampoo-thailand-edition-300ml-61',
    sku: 'SS-FK-061',
    category_id: 'cat_haircare',
    subcategory: 'Shampoos & Conditioners',
    mrp: 1600,
    price: 1600,
    discount_price: 640,
    stock_quantity: 50,
    description: 'Wanwan Complete Balance Shampoo provides all-round protection for every hair type. Purifies the scalp without over-drying, leaving locks lightweight, voluminous, and wonderfully fragrant.',
    short_description: 'Universal daily balancing shampoo for all hair types.',
    ingredients: 'Mild Amino Surfactants, Aloe Extract, Provitamin B5, Botanical Floral Infusion.',
    how_to_use: 'Work into damp hair to create a gentle lather; rinse with lukewarm water.',
    skin_type: 'All Skin Types',
    benefits: ["Balanced Scalp Oil Production", "Safe for Daily Cleansing", "Featherlight Volume & Bounce", "Refreshing Citrus-Floral Scent"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_61.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.7,
    reviews_count: 13
  },
  {
    id: 'prod_fk_062',
    name: 'Wanwan Vitamin-C All-In-One Body Polish Bath Salt (350g)',
    slug: 'wanwan-vitamin-c-all-in-one-body-polish-bath-salt-350g-62',
    sku: 'SS-FK-062',
    category_id: 'cat_skincare',
    subcategory: 'Scrubs & Exfoliators',
    mrp: 1500,
    price: 1500,
    discount_price: 600,
    stock_quantity: 50,
    description: 'Wanwan Vitamin-C All-In-One Body Polish combines mineral-rich Himalayan and sea salts with invigorating Vitamin C and orange essential oils. Polishes away dead skin while revitalizing tired muscles in the bath.',
    short_description: 'Exfoliating and relaxing body polish bath salt with Vitamin C and mineral crystals.',
    ingredients: 'Dead Sea Salt, Pure Himalayan Pink Salt, Magnesium Sulfate, Ascorbic Acid, Sweet Orange Oil.',
    how_to_use: 'Massage onto damp body in the shower or dissolve 2-3 scoops into a warm bathtub for a restorative soak.',
    skin_type: 'All Skin Types',
    benefits: ["Exfoliates Rough Elbows, Knees & Heels", "Soothes Tired Aching Muscles", "Boosts Cellular Microcirculation", "Leaves Skin Velvety Soft"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_62.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.8,
    reviews_count: 16
  },
  {
    id: 'prod_fk_063',
    name: 'Winyfred Korean Hydra Glow BB Serum Special Edition (30ml)',
    slug: 'winyfred-korean-hydra-glow-bb-serum-special-edition-30ml-63',
    sku: 'SS-FK-063',
    category_id: 'cat_makeup',
    subcategory: 'Foundation & BB Creams',
    mrp: 1299,
    price: 1299,
    discount_price: 520,
    stock_quantity: 50,
    description: 'Winyfred Hydra Glow BB Serum Special Edition delivers second-skin natural perfecting coverage with Korean skin-nourishing active ingredients. Creates a luminous, healthy aura without caking or creasing.',
    short_description: 'Special edition Korean luminous BB serum with all-day weightless perfecting wear.',
    ingredients: 'Niacinamide, Hyaluronic Acid, Licorice Root Extract, Micronized Mineral Pigments.',
    how_to_use: 'Smooth over face using clean fingertips or a damp sponge for a fresh everyday glow.',
    skin_type: 'All Skin Types',
    benefits: ["Improves Skin Texture Over Time", "Seamless Blendable Coverage", "Hydrating Dewy Finish", "Never Settles into Fine Lines"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_63.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.8,
    reviews_count: 19
  },
  {
    id: 'prod_fk_064',
    name: 'Winyfred C-Glow Radiance Licorice & Niacinamide Day Cream (50g)',
    slug: 'winyfred-c-glow-radiance-licorice-niacinamide-day-cream-50g-64',
    sku: 'SS-FK-064',
    category_id: 'cat_skincare',
    subcategory: 'Moisturizers & Creams',
    mrp: 799,
    price: 799,
    discount_price: 320,
    stock_quantity: 50,
    description: 'Winyfred C-Glow Radiance Day Cream is packed with Licorice Root and concentrated Niacinamide. Visibly fades dark spots and sun pigmentation while locking in moisture with an elegant, non-greasy finish.',
    short_description: 'Brightening day cream with Licorice and Niacinamide for dark spot reduction.',
    ingredients: 'Glycyrrhiza Glabra (Licorice) Root Extract, Niacinamide (5%), Ethyl Ascorbic Acid, Ceramide NP.',
    how_to_use: 'Massage a small amount over face and neck every morning following your cleansing routine.',
    skin_type: 'All Skin Types',
    benefits: ["Visibly Reduces Pigmentation", "Evens Out Patchy Skin Tone", "All-Day Featherlight Moisture", "Satin Velvet Finish Under Makeup"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_64.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 1,
    is_new_arrival: 0,
    rating: 4.9,
    reviews_count: 22
  },
  {
    id: 'prod_fk_065',
    name: 'Der Duft Acne Solution Deep Pore Foaming Cleanser (150ml)',
    slug: 'der-duft-acne-solution-deep-pore-foaming-cleanser-150ml-65',
    sku: 'SS-FK-065',
    category_id: 'cat_skincare',
    subcategory: 'Face Wash & Cleansers',
    mrp: 499,
    price: 499,
    discount_price: 200,
    stock_quantity: 50,
    description: 'Der Duft Acne Solution Serum Foam Cleanser targets stubborn breakouts and congested pores. Infused with Salicylic Acid and Tea Tree extract to dissolve sebum plugs while calming angry redness.',
    short_description: 'Clinical acne solution foaming cleanser with Salicylic Acid and Tea Tree.',
    ingredients: 'Salicylic Acid (2%), Melaleuca Alternifolia (Tea Tree) Oil, Zinc PCA, Witch Hazel.',
    how_to_use: 'Use morning and evening. Lather foam gently on face, focus on T-zone, and rinse with cool water.',
    skin_type: 'All Skin Types',
    benefits: ["Clears Active Breakouts & Whiteheads", "Deep Pore Vacuum Action", "Regulates Excessive Sebum Shine", "Soothes Inflammatory Redness"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_65.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.6,
    reviews_count: 25
  },
  {
    id: 'prod_fk_066',
    name: 'Wanwan Let It Glow SuperGlow Vitamin C & Papaya Face Wash (150ml)',
    slug: 'wanwan-let-it-glow-superglow-vitamin-c-papaya-face-wash-150ml-66',
    sku: 'SS-FK-066',
    category_id: 'cat_skincare',
    subcategory: 'Face Wash & Cleansers',
    mrp: 399,
    price: 399,
    discount_price: 160,
    stock_quantity: 50,
    description: 'Wanwan Let It Glow SuperGlow Face Wash is an explosion of tropical brightness. Combines pure Vitamin C with Papaya fruit enzymes to wash away dead cell buildup and reveal fresh, radiant vitality.',
    short_description: 'SuperGlow face wash with Vitamin C and natural Papaya enzymes.',
    ingredients: 'Carica Papaya Fruit Extract, Sodium Ascorbyl Phosphate, Orange Oil, Glycerin.',
    how_to_use: 'Gently massage over wet face for 1 minute; rinse with water.',
    skin_type: 'All Skin Types',
    benefits: ["Natural Enzymatic Exfoliation", "Fades Tan & Revitalizes Dull Skin", "Maintains Natural Moisture Balance", "Refreshing Fruity Aroma"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_66.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.7,
    reviews_count: 28
  },
  {
    id: 'prod_fk_067',
    name: 'Der Duft Whitening & De-Pigmentation Serum Face Wash (150ml)',
    slug: 'der-duft-whitening-de-pigmentation-serum-face-wash-150ml-67',
    sku: 'SS-FK-067',
    category_id: 'cat_skincare',
    subcategory: 'Face Wash & Cleansers',
    mrp: 499,
    price: 499,
    discount_price: 200,
    stock_quantity: 50,
    description: 'Der Duft Whitening & De-Pigmentation Serum Face Wash targets stubborn dark spots, sun spots, and post-acne blemishes. Cleanses away dirt and environmental pollutants while actively brightening complexion.',
    short_description: 'Targeted de-pigmentation serum wash with Alpha Arbutin and Mulberry.',
    ingredients: 'Alpha Arbutin, Morus Alba (Mulberry) Root Extract, Kojic Acid, Niacinamide.',
    how_to_use: 'Dispense a small pump, lather on wet face, and rinse well.',
    skin_type: 'All Skin Types',
    benefits: ["Targets Hyperpigmentation & Freckles", "Removes Micro-Pollution Particles", "Enhances Overall Skin Clarity", "Gentle for Daily Use"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_67.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.8,
    reviews_count: 31
  },
  {
    id: 'prod_fk_068',
    name: 'Pure Derma Niacinamide & Salicylic Acid Body Acne Shower Gel (250ml)',
    slug: 'pure-derma-niacinamide-salicylic-acid-body-acne-shower-gel-250ml-68',
    sku: 'SS-FK-068',
    category_id: 'cat_skincare',
    subcategory: 'Body Wash & Shower Gels',
    mrp: 799,
    price: 799,
    discount_price: 320,
    stock_quantity: 50,
    description: 'Pure Derma Body Acne Shower Gel is specifically formulated for back acne (bacne), chest breakouts, and bumpy strawberry skin. Salicylic acid clears clogged follicles while Niacinamide heals marks.',
    short_description: 'Medicated body acne shower gel with Salicylic Acid and Niacinamide.',
    ingredients: 'Salicylic Acid (2%), Niacinamide (3%), Tea Tree Oil, Aloe Vera, Gentle Surfactants.',
    how_to_use: 'Apply to breakout-prone body areas in the shower. Leave on for 60 seconds before rinsing off.',
    skin_type: 'All Skin Types',
    benefits: ["Eliminates Bacne & Chest Breakouts", "Smooths Rough Strawberry Skin Bumps", "Fades Post-Acne Dark Marks on Body", "Non-Drying Purifying Gel"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_68.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.8,
    reviews_count: 34
  },
  {
    id: 'prod_fk_069',
    name: 'Pure Derma Glycolic & Kojic Acid De-Tan Face & Body Wash (250ml)',
    slug: 'pure-derma-glycolic-kojic-acid-de-tan-face-body-wash-250ml-69',
    sku: 'SS-FK-069',
    category_id: 'cat_skincare',
    subcategory: 'Body Wash & Shower Gels',
    mrp: 799,
    price: 799,
    discount_price: 320,
    stock_quantity: 50,
    description: 'Pure Derma De-Tan Face & Body Wash brings together Glycolic Acid and Kojic Acid to sweep away stubborn sun tan and dead layers across the body, restoring uniform brightness from head to toe.',
    short_description: 'Intensive de-tan face and body wash with Glycolic and Kojic Acid.',
    ingredients: 'Glycolic Acid (AHA 5%), Kojic Acid, Lactic Acid, Vitamin E, Glycerin.',
    how_to_use: 'Lather generously over wet face and body; rinse thoroughly.',
    skin_type: 'All Skin Types',
    benefits: ["Reverses Harsh Sun Tan", "Unifies Discolored Elbows, Knees & Neck", "Smooths Keratosis Pilaris", "Dual Action for Face & Body"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_69.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.9,
    reviews_count: 37
  },
  {
    id: 'prod_fk_070',
    name: 'Winyfred Kojic Acid & Pomegranate Baby Glow Foaming Face Wash (150ml)',
    slug: 'winyfred-kojic-acid-pomegranate-baby-glow-foaming-face-wash-150ml-70',
    sku: 'SS-FK-070',
    category_id: 'cat_skincare',
    subcategory: 'Face Wash & Cleansers',
    mrp: 750,
    price: 750,
    discount_price: 300,
    stock_quantity: 50,
    description: 'Winyfred Baby Glow Foaming Face Wash pairs Kojic Acid with antioxidant-rich Pomegranate extract. Restores translucent baby-soft smoothness, tightens pores, and protects against oxidative stress.',
    short_description: 'Korean baby glow foaming wash with Kojic Acid and Pomegranate.',
    ingredients: 'Punica Granatum (Pomegranate) Extract, Kojic Acid, Rice Water, Rose Hydrosol.',
    how_to_use: 'Pump 2 puffs of foam onto wet face, gently massage in small circles, and rinse off.',
    skin_type: 'All Skin Types',
    benefits: ["Gives Translucent Baby-Soft Glow", "Packed with Antioxidants", "Rich Luxurious Foam Cloud", "Soothes & Hydrates Dry Patches"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_70.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.6,
    reviews_count: 40
  },
  {
    id: 'prod_fk_071',
    name: 'Wanwan Thailand Edition Digital Complexion Liquid Foundation (35ml)',
    slug: 'wanwan-thailand-edition-digital-complexion-liquid-foundation-35ml-71',
    sku: 'SS-FK-071',
    category_id: 'cat_makeup',
    subcategory: 'Foundation & BB Creams',
    mrp: 799,
    price: 799,
    discount_price: 320,
    stock_quantity: 50,
    description: 'Wanwan Thailand Edition Digital Complexion Foundation delivers an HD filtered skin effect in real life. Blurs imperfections, balances tone, and stays matte through heat and humidity for 24 hours.',
    short_description: 'Digital complexion high-definition foundation with transfer-proof 24h wear.',
    ingredients: 'Silica Spheres, Niacinamide, Squalane, Treated Iron Oxides, SPF 20 Filters.',
    how_to_use: 'Dispense 1-2 pumps onto the back of your hand and blend across face with a brush or sponge.',
    skin_type: 'All Skin Types',
    benefits: ["HD Camera-Ready Filter Effect", "Resists High Heat & Sweat", "Customizable Medium-to-Full Coverage", "Breathable Lightweight Formula"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_71.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 1,
    rating: 4.7,
    reviews_count: 43
  },
  {
    id: 'prod_fk_072',
    name: 'Wanwan Thailand Edition All-Matte Invisible Pore Primer (30ml)',
    slug: 'wanwan-thailand-edition-all-matte-invisible-pore-primer-30ml-72',
    sku: 'SS-FK-072',
    category_id: 'cat_makeup',
    subcategory: 'Primers & Setting Sprays',
    mrp: 499,
    price: 499,
    discount_price: 200,
    stock_quantity: 50,
    description: 'Wanwan All-Matte Invisible Pore Primer forms an imperceptible velvet veil across the skin. Erases the look of enlarged pores, fine lines, and excess oil, creating the ultimate canvas for makeup.',
    short_description: 'Velvety invisible pore-filling and shine-control makeup primer.',
    ingredients: 'Dimethicone Crosspolymer, Silica, Vitamin E, Green Tea Extract.',
    how_to_use: 'Smooth a pea-sized amount over moisturized face, focusing on T-zone and pores before makeup.',
    skin_type: 'All Skin Types',
    benefits: ["Instantly Erases Pores & Fine Lines", "Controls T-Zone Shine for 12 Hours", "Extends Makeup Wear", "Velvety Cashmere Texture"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_72.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.8,
    reviews_count: 46
  },
  {
    id: 'prod_fk_073',
    name: 'Wanwan 99% Pure Natural Skin Soothing & Hydrating Gel (200g)',
    slug: 'wanwan-99-pure-natural-skin-soothing-hydrating-gel-200g-73',
    sku: 'SS-FK-073',
    category_id: 'cat_skincare',
    subcategory: 'Moisturizers & Creams',
    mrp: 399,
    price: 399,
    discount_price: 160,
    stock_quantity: 50,
    description: 'Wanwan 99% Pure Natural Soothing Gel is free from harmful preservatives and synthetic dyes. Delivers instant calming hydration for sunburns, shaving irritation, dry skin, and hair styling.',
    short_description: '99% pure multi-purpose natural soothing gel for face, body, and hair.',
    ingredients: '99% Pure Aloe Barbadensis Leaf Juice, Centella Asiatica, Allantoin, Carbomer.',
    how_to_use: 'Apply generously to face, body, or hair whenever soothing hydration is needed.',
    skin_type: 'All Skin Types',
    benefits: ["99% Pure Natural Botanical Actives", "Calms Sunburn & Shaving Rash", "Featherlight Oil-Free Hydration", "Multi-Use for Face, Body & Hair"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_73.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.8,
    reviews_count: 49
  },
  {
    id: 'prod_fk_074',
    name: 'Alpha HydroPure Niacinamide & Ceramide-3 Barrier Face Cleanser (150ml)',
    slug: 'alpha-hydropure-niacinamide-ceramide-3-barrier-face-cleanser-150ml-74',
    sku: 'SS-FK-074',
    category_id: 'cat_skincare',
    subcategory: 'Face Wash & Cleansers',
    mrp: 699,
    price: 699,
    discount_price: 280,
    stock_quantity: 50,
    description: 'Alpha HydroPure Barrier Cleanser delivers clinical cleansing purity. Formulated with 3% Niacinamide and bio-identical Ceramide-3 to clean away pollutants while reinforcing the skin lipid barrier.',
    short_description: 'Barrier-protecting clinical cleanser with 3% Niacinamide and Ceramide-3.',
    ingredients: 'Niacinamide (3%), Ceramide-3, Sodium Cocoyl Glycinate, Hyaluronic Acid.',
    how_to_use: 'Massage over wet face with gentle circular movements; rinse thoroughly.',
    skin_type: 'All Skin Types',
    benefits: ["Protects Natural Skin Barrier", "Zero Irritation or Tightness", "Gentle for Daily Morning & Night Use", "Dermatologist Approved"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_74.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.9,
    reviews_count: 52
  },
  {
    id: 'prod_fk_075',
    name: 'Winyfred Korean Formulation Day Cream with Vitamin C & Zinc (50g)',
    slug: 'winyfred-korean-formulation-day-cream-with-vitamin-c-zinc-50g-75',
    sku: 'SS-FK-075',
    category_id: 'cat_skincare',
    subcategory: 'Moisturizers & Creams',
    mrp: 799,
    price: 799,
    discount_price: 320,
    stock_quantity: 50,
    description: 'Winyfred Korean Day Cream infuses skin with stabilized Vitamin C and Zinc PCA. Defends against free radicals, tightens pores, and bestows a long-lasting luminous glow all day long.',
    short_description: 'Korean antioxidant day cream with Vitamin C, Zinc, and Hyaluronic Acid.',
    ingredients: 'Ascorbyl Tetraisopalmitate (Vitamin C), Zinc PCA, Sodium Hyaluronate, Squalane.',
    how_to_use: 'Apply to face and neck every morning after serum.',
    skin_type: 'All Skin Types',
    benefits: ["Defends Against Environmental Pollution", "Controls Excess Sebum & Shine", "Deep Daily Moisture", "Satin-Smooth Base for Makeup"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_75.webp'
    ],
    status: 'active',
    is_featured: 1,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.6,
    reviews_count: 10
  },
  {
    id: 'prod_fk_076',
    name: 'Winyfred Korean Formulation Night Cream (Retinol + Collagen 50g)',
    slug: 'winyfred-korean-formulation-night-cream-retinol-collagen-50g-76',
    sku: 'SS-FK-076',
    category_id: 'cat_skincare',
    subcategory: 'Moisturizers & Creams',
    mrp: 799,
    price: 799,
    discount_price: 320,
    stock_quantity: 50,
    description: 'Winyfred Korean Formulation Night Cream pairs Retinol with Hydrolyzed Vegan Collagen. Works through deep sleep cycles to boost skin elasticity, smooth stubborn wrinkles, and restore firm youthful bounce.',
    short_description: 'Age-defying Korean night cream with Retinol, Vegan Collagen, and Peptides.',
    ingredients: 'Retinol, Hydrolyzed Vegan Collagen, Matrixyl 3000 Peptides, Shea Butter.',
    how_to_use: 'Smooth a generous amount over face and neck at night before bed.',
    skin_type: 'All Skin Types',
    benefits: ["Stimulates Collagen Synthesis", "Visibly Plumps Wrinkles & Fine Lines", "Nourishes Deep Skin Depots", "Awaken to Firm, Bouncy Skin"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_76.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.7,
    reviews_count: 13
  },
  {
    id: 'prod_fk_077',
    name: 'Natural & Botanic Fresh Herb Keratin Biotin Strengthening Shampoo (300ml)',
    slug: 'natural-botanic-fresh-herb-keratin-biotin-strengthening-shampoo-300ml-77',
    sku: 'SS-FK-077',
    category_id: 'cat_haircare',
    subcategory: 'Shampoos & Conditioners',
    mrp: 799,
    price: 799,
    discount_price: 320,
    stock_quantity: 50,
    description: 'Natural & Botanic Fresh Herb Shampoo is powered by nutrient-rich Keratin, Biotin, and an Amino Acid Complex. Infuses essential building blocks into hair follicles for noticeably thicker, fuller, and resilient hair.',
    short_description: 'Botanical strengthening shampoo with Keratin, Biotin, and Amino Acid Complex.',
    ingredients: 'Biotin (Vitamin B7), Hydrolyzed Keratin, Rosemary Herb Extract, Saw Palmetto.',
    how_to_use: 'Apply onto wet hair and massage into scalp for 2 minutes before rinsing.',
    skin_type: 'All Skin Types',
    benefits: ["Energizes Weakened Hair Follicles", "Boosts Natural Hair Density", "Sulfate & Chemical Free", "Fresh Herbal Aromatherapy"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_77.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.8,
    reviews_count: 16
  },
  {
    id: 'prod_fk_078',
    name: 'Pattaya Flawless Glow Liquid Illuminator & Highlighter (Thailand Edition 30ml)',
    slug: 'pattaya-flawless-glow-liquid-illuminator-highlighter-thailand-edition-30ml-78',
    sku: 'SS-FK-078',
    category_id: 'cat_makeup',
    subcategory: 'Highlighters & Bronzers',
    mrp: 799,
    price: 799,
    discount_price: 320,
    stock_quantity: 50,
    description: 'Pattaya Flawless Glow Liquid Highlighter brings an ethereal tropical golden sheen to high points of the face and decolletage. Ultra-blendable formula melts into skin without accentuating texture.',
    short_description: 'Weightless liquid illuminator and highlighter for a blinding glass-skin sheen.',
    ingredients: 'Refined Golden Mica Pearls, Plant Squalane, Vitamin E, Rosehip Oil.',
    how_to_use: 'Tap onto cheekbones, brow bones, cupid\'s bow, and collarbones with fingertips or a sponge.',
    skin_type: 'All Skin Types',
    benefits: ["Ethereal Golden Glass Sheen", "Zero Glittery Clumping", "Can be Mixed with Foundation", "Lasts 12+ Hours"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_78.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 1,
    rating: 4.8,
    reviews_count: 19
  },
  {
    id: 'prod_fk_079',
    name: 'Winyfred Rice Water Hydration Vanilla Cashmere Body Lotion (48H Moisture 300ml)',
    slug: 'winyfred-rice-water-hydration-vanilla-cashmere-body-lotion-48h-moisture-300ml-79',
    sku: 'SS-FK-079',
    category_id: 'cat_skincare',
    subcategory: 'Body Care & Lotions',
    mrp: 499,
    price: 499,
    discount_price: 200,
    stock_quantity: 50,
    description: 'Winyfred Rice Water Body Lotion envelops skin in 48-hour continuous moisture and the comforting aroma of warm Vanilla Cashmere. Fermented Korean rice water and Vitamin B3 leave skin dewy and silky.',
    short_description: '48-hour moisture luxury body lotion with Korean Rice Water and Vanilla Cashmere.',
    ingredients: 'Fermented Rice Water, Niacinamide (Vitamin B3), Vanilla Planifolia Extract, Cashmere Protein.',
    how_to_use: 'Smooth all over body after bath or shower for all-day comfort and fragrance.',
    skin_type: 'All Skin Types',
    benefits: ["48-Hour Continuous Moisture Lock", "Intoxicating Warm Vanilla Cashmere Scent", "Dewy Korean Glass Finish for Body", "Fast Absorbing Non-Greasy"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_79.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 1,
    is_new_arrival: 0,
    rating: 4.9,
    reviews_count: 22
  },
  {
    id: 'prod_fk_080',
    name: 'Pattaya Thailand Edition Alpha Arbutin Anti-Dark Spot Sun Care (50ml)',
    slug: 'pattaya-thailand-edition-alpha-arbutin-anti-dark-spot-sun-care-50ml-80',
    sku: 'SS-FK-080',
    category_id: 'cat_skincare',
    subcategory: 'Sun Care & SPF',
    mrp: 799,
    price: 799,
    discount_price: 320,
    stock_quantity: 50,
    description: 'Pattaya Alpha Arbutin Sun Care combines high UV protection with active depigmentation therapy. Fights dark spots and sun damage at the cellular level while preventing new discoloration.',
    short_description: 'Targeted anti-dark spot sunscreen with Alpha Arbutin and SPF filters.',
    ingredients: 'Alpha Arbutin (2%), Zinc Oxide, Titanium Dioxide, Licorice Extract, Vitamin C.',
    how_to_use: 'Apply to face 15 minutes before sun exposure; reapply as needed.',
    skin_type: 'All Skin Types',
    benefits: ["Fights Existing Sun Damage & Melasma", "Broad Spectrum UVA/UVB Shield", "Lightweight Non-Oily Formulation", "Prevents Future Hyperpigmentation"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_80.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.6,
    reviews_count: 25
  },
  {
    id: 'prod_fk_081',
    name: 'Pattaya Queen Botanical Radiance Face Serum (Thailand Edition 30ml)',
    slug: 'pattaya-queen-botanical-radiance-face-serum-thailand-edition-30ml-81',
    sku: 'SS-FK-081',
    category_id: 'cat_skincare',
    subcategory: 'Serums & Treatments',
    mrp: 1099,
    price: 1099,
    discount_price: 440,
    stock_quantity: 50,
    description: 'Pattaya Queen Radiance Serum is enriched with genuine suspended gold leaf flakes and botanical peptides. Stimulates collagen synthesis, minimizes fine lines, and imparts a majestic royal glow.',
    short_description: 'Opulent 24K pure gold radiance elixir for firming and majestic glow.',
    ingredients: 'Pure Saffron Radiance Leaf Flakes, Copper Peptides, Saffron Extract, Hyaluronic Acid.',
    how_to_use: 'Warm 3 drops between palms and gently press into cleansed face and neck.',
    skin_type: 'All Skin Types',
    benefits: ["Pure 24K Genuine Gold Flakes", "Restores Firmness & Elasticity", "Instantly Transforms Dull Skin", "Opulent Royal Radiance"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_81.webp'
    ],
    status: 'active',
    is_featured: 1,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.7,
    reviews_count: 28
  },
  {
    id: 'prod_fk_082',
    name: 'Wanwan Thailand Edition SPF 50 PA++++ Insta-Brightening Sunscreen (50ml)',
    slug: 'wanwan-thailand-edition-spf-50-pa-insta-brightening-sunscreen-50ml-82',
    sku: 'SS-FK-082',
    category_id: 'cat_skincare',
    subcategory: 'Sun Care & SPF',
    mrp: 799,
    price: 799,
    discount_price: 320,
    stock_quantity: 50,
    description: 'Wanwan Thailand Edition Insta-Brightening Sunscreen delivers immediate skin tone elevation with SPF 50 PA++++ broad spectrum shield. Infused with Niacinamide to protect and illuminate simultaneously.',
    short_description: 'Insta-brightening sunscreen gel with SPF 50 PA++++ and Niacinamide.',
    ingredients: 'Niacinamide (4%), Hybrid UV Filters, Centella Asiatica, Vitamin E.',
    how_to_use: 'Smooth evenly across face and neck before stepping into daylight.',
    skin_type: 'All Skin Types',
    benefits: ["Immediate Radiant Brightening Touch", "Broad Spectrum SPF 50 PA++++", "Zero Sticky Residue", "Great Sun Protection for Hot Climates"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_82.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 1,
    is_new_arrival: 0,
    rating: 4.8,
    reviews_count: 31
  },
  {
    id: 'prod_fk_083',
    name: 'Surla France Niacinamide Sebum Balancing Mattifying Serum (30ml)',
    slug: 'surla-france-niacinamide-sebum-balancing-mattifying-serum-30ml-83',
    sku: 'SS-FK-083',
    category_id: 'cat_skincare',
    subcategory: 'Serums & Treatments',
    mrp: 699,
    price: 699,
    discount_price: 280,
    stock_quantity: 50,
    description: 'Surla France Formulation Sebum Balancing Serum is crafted to control excess oiliness, minimize open pores, and calm acne-prone skin with concentrated Niacinamide and Zinc PCA.',
    short_description: 'French formulation mattifying and sebum balancing serum with Niacinamide & Zinc.',
    ingredients: 'Niacinamide (10%), Zinc PCA (1%), French Thermal Spring Water, Hyaluronic Acid.',
    how_to_use: 'Dispense 3 drops onto clean face morning and evening before moisturizer.',
    skin_type: 'All Skin Types',
    benefits: ["Controls T-Zone Oil for 24 Hours", "Visibly Shrinks Enlarged Pores", "Calms Blemishes & Congestion", "Ultra-Lightweight Mattifying Texture"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_83.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.8,
    reviews_count: 34
  },
  {
    id: 'prod_fk_084',
    name: 'Wanwan Thailand Edition SPF 50 PA++++ Pore-Blur Smooth Sunscreen (50ml)',
    slug: 'wanwan-thailand-edition-spf-50-pa-pore-blur-smooth-sunscreen-50ml-84',
    sku: 'SS-FK-084',
    category_id: 'cat_skincare',
    subcategory: 'Sun Care & SPF',
    mrp: 799,
    price: 799,
    discount_price: 320,
    stock_quantity: 50,
    description: 'Wanwan Thailand Edition Pore-Blur Sunscreen combines supreme UV defense with the skin-smoothing benefits of a blurring primer. Keeps skin matte, smooth, and protected all day long.',
    short_description: 'Pore-blurring matte sunscreen with SPF 50 PA++++ and Hyaluronic Acid.',
    ingredients: 'Hybrid UV Filters, Hyaluronic Acid, Pore-Blurring Elastomers, Green Tea.',
    how_to_use: 'Apply generously to face as your final morning skincare step.',
    skin_type: 'All Skin Types',
    benefits: ["Blurs Pores like a Primer", "High Defense SPF 50 PA++++", "Sweat-Resistant Matte Finish", "Works Flawlessly Under Makeup"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_84.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 0,
    rating: 4.9,
    reviews_count: 37
  },
  {
    id: 'prod_fk_085',
    name: 'Winyfred 7-in-1 Total Care Vanilla Rice Water Cashmere Body Lotion (300ml)',
    slug: 'winyfred-7-in-1-total-care-vanilla-rice-water-cashmere-body-lotion-300ml-85',
    sku: 'SS-FK-085',
    category_id: 'cat_skincare',
    subcategory: 'Body Care & Lotions',
    mrp: 699,
    price: 699,
    discount_price: 280,
    stock_quantity: 50,
    description: 'Winyfred 7-in-1 Total Care Body Lotion delivers complete head-to-toe beauty care: 48h hydration, brightening, barrier repair, soothing, softening, elasticity, and fine fragrance in one luxurious lotion.',
    short_description: 'Korean 7-in-1 total care luxury body lotion with Vanilla, Rice Water, and Cashmere.',
    ingredients: 'Korean Rice Water, Cashmere Protein, Niacinamide, Shea Butter, Vanilla Extract.',
    how_to_use: 'Massage generously into clean skin after bathing.',
    skin_type: 'All Skin Types',
    benefits: ["7-in-1 Comprehensive Total Care", "48-Hour Deep Moisture", "Irresistible Vanilla Cashmere Aroma", "Leaves Skin Velvety Soft & Dewy"],
    shades: [],
    images: [
      '/products/fresh_kamal/page_85.webp'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 1,
    rating: 4.6,
    reviews_count: 40
  },

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
    description: 'The crowning bridal beauty ritual. Includes our Radiant Saffron Youth Serum (30ml), Kumkumadi Night Cream (50g), Royal Silk Lipstick in Sindoor Red, Noor-e-Gulab Perfume (50ml), and a Rose Quartz Gua Sha.',
    short_description: 'Curated 5-piece royal bridal collection in velvet gold-embossed keepsake trunk.',
    ingredients: 'Complete skincare & makeup ensemble with genuine Ayurvedic & botanical actives.',
    how_to_use: 'Follow the included 21-day Bridal Radiance Booklet for step-by-step beauty protocol.',
    skin_type: 'All Skin Types',
    benefits: ['Complete 5-Piece Full Size Ritual', 'Velvet Gold Keepsake Box', 'Save ₹2,500 vs individual products'],
    shades: [],
    images: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'
    ],
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
    description: 'Your effortless 3-step morning skincare routine: Rose & Pearl Cleanser (150ml), Radiant Saffron Serum (30ml), and Dewy Velvet SPF 50 Sunscreen (50g).',
    short_description: 'Essential 3-step morning glow regime: Cleanse, Treat, and Protect.',
    ingredients: 'Detailed on individual product packaging.',
    how_to_use: 'Step 1: Cleanse with Rose gel. Step 2: Apply 3 drops of Gold Serum. Step 3: Seal with Dewy Sun Fluid.',
    skin_type: 'All Skin Types',
    benefits: ['3-Step Complete Routine', 'Save ₹700', 'Suitable for daily everyday wear'],
    shades: [],
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80'
    ],
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
    benefits: ['Glass-Like Mirror Shine', 'Zero Stickiness', 'Instant Lip Plumping Effect'],
    shades: [
      { name: 'Crystal Rose Glow', hex: '#F6E0E6' },
      { name: 'Golden Honey Glaze', hex: '#ECDDB3' }
    ],
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80'
    ],
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
    subcategory: 'Serums & Treatments',
    price: 1399,
    discount_price: 999,
    stock_quantity: 6,
    description: 'A targeted clarifying serum packed with 10% pure Niacinamide, 1% Zinc PCA, and Holy Basil (Tulsi) extract to minimize enlarged pores, control excess oil, and reduce acne redness.',
    short_description: '10% Niacinamide + 1% Zinc PCA for pore refinement and oil control.',
    ingredients: 'Aqua, Niacinamide (10%), Zinc PCA (1%), Ocimum Sanctum (Tulsi) Extract, Hyaluronic Acid, Allantoin.',
    how_to_use: 'Apply 2-3 drops over entire face morning and evening after cleansing.',
    skin_type: 'Oily & Acne-Prone',
    benefits: ['Shrinks Open Pores', 'Balances Sebum Production', 'Fades Blemish Marks'],
    shades: [],
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800&auto=format&fit=crop&q=80'
    ],
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
    stock_quantity: 4,
    description: 'A weightless cream-to-powder blush infused with Rose Petal wax and Vitamin E. Blends like butter to provide a natural dewy flush of color on cheeks and lips.',
    short_description: 'Buttery cream-to-powder blush with natural radiant dewy finish.',
    ingredients: 'Caprylic Triglyceride, Candelilla Wax, Rose Wax, Tocopherol, CI 77891, CI 15850.',
    how_to_use: 'Tap lightly with fingertips onto the apples of your cheeks and blend upwards toward the hairline.',
    skin_type: 'All Skin Types',
    benefits: ['Dewy Pinch-of-Color Glow', 'Multi-use for Cheeks & Lips', 'Easy Fingertip Blend'],
    shades: [
      { name: 'Gulabi Dew', hex: '#D57991' },
      { name: 'Terracotta Charm', hex: '#CC4163' },
      { name: 'Peachy Sunrise', hex: '#EEA4B4' }
    ],
    images: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'
    ],
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
    benefits: ['Instant Refreshment', 'Sets Makeup with Dewy Glow', 'Calms Inflamed Skin'],
    shades: [],
    images: [
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556228722-d0b73c7fc366?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    is_featured: 0,
    is_best_seller: 0,
    is_new_arrival: 1,
    rating: 4.6,
    reviews_count: 24
  }
];

export const MOCK_REVIEWS = [
  {
    id: 'rev_001',
    product_id: 'prod_001',
    author_name: 'Ananya Patel',
    rating: 5,
    title: 'Miraculous gold serum! Worth every penny!',
    comment: 'I have been using this Radiant Saffron Youth Serum for 3 weeks and the difference in my skin texture and radiance is unbelievable! It absorbs effortlessly without stickiness.',
    status: 'approved'
  },
  {
    id: 'rev_002',
    product_id: 'prod_001',
    author_name: 'Meera Kapoor',
    rating: 5,
    title: 'Pure luxury in a bottle',
    comment: 'The packaging looks like high-end French luxury cosmetics. The saffron aroma is so gentle and soothing. Highly recommended for bridal preparation!',
    status: 'approved'
  },
  {
    id: 'rev_003',
    product_id: 'prod_005',
    author_name: 'Rhea Sengupta',
    rating: 5,
    title: 'Sindoor Red is the ultimate bridal shade!',
    comment: 'Stayed on throughout an entire 6-hour family function with snacks and dinner without feathering. Does not dry out lips!',
    status: 'approved'
  },
  {
    id: 'rev_004',
    product_id: 'prod_011',
    author_name: 'Kavita Joshi',
    rating: 5,
    title: 'Enchanting and long lasting',
    comment: 'Noor-e-Gulab smells like a royal Mughal garden. Received compliments from everyone at my office.',
    status: 'approved'
  }
];

export const MOCK_SETTINGS = {
  store_name: 'Shagun Shine Cosmetics',
  support_email: 'contact@shagunshine.com',
  support_phone: '+91 9876543210',
  currency_symbol: '₹',
  free_shipping_threshold: 0,
  standard_shipping_rate: 0,
  tax_rate_percentage: 18,
  store_address: 'Luxury Galleria, Road No. 36, Jubilee Hills, Hyderabad - 500033'
};

export const MOCK_COUPONS = [];

export function handleMockRequest(endpoint, method = 'GET', body = null) {
  const url = new URL(endpoint, 'http://localhost');
  const path = url.pathname;
  const searchParams = url.searchParams;

  // 1. Categories
  if (path.startsWith('/categories') || path.startsWith('/api/categories')) {
    return { success: true, categories: MOCK_CATEGORIES };
  }

  // 2. Banners
  if (path.startsWith('/banners') || path.startsWith('/api/banners')) {
    return { success: true, banners: MOCK_BANNERS };
  }

  // 3. Settings
  if (path.startsWith('/settings') || path.startsWith('/api/settings')) {
    return { success: true, settings: MOCK_SETTINGS };
  }

  // 4. Products list & filters
  if (path === '/products' || path === '/api/products') {
    let result = [...MOCK_PRODUCTS];

    const featured = searchParams.get('featured');
    const bestSeller = searchParams.get('bestSeller');
    const newArrival = searchParams.get('newArrival');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort');
    const limit = parseInt(searchParams.get('limit')) || 50;

    if (featured === 'true' || featured === '1') {
      result = result.filter(p => p.is_featured);
    }
    if (bestSeller === 'true' || bestSeller === '1') {
      result = result.filter(p => p.is_best_seller);
    }
    if (newArrival === 'true' || newArrival === '1') {
      result = result.filter(p => p.is_new_arrival);
    }
    if (category) {
      result = result.filter(p => p.category_id === category || p.category_id === `cat_${category}`);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.short_description?.toLowerCase().includes(q));
    }
    if (minPrice) {
      result = result.filter(p => (p.discount_price || p.price) >= parseFloat(minPrice));
    }
    if (maxPrice) {
      result = result.filter(p => (p.discount_price || p.price) <= parseFloat(maxPrice));
    }

    if (sort === 'price_asc') {
      result.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price));
    } else if (sort === 'price_desc') {
      result.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price));
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return {
      success: true,
      products: result.slice(0, limit),
      total: result.length,
      page: 1,
      totalPages: 1
    };
  }

  // 5. Single Product by Slug or ID
  const productSlugMatch = path.match(/^\/(?:api\/)?products\/(?:slug\/)?([^\/]+)$/);
  if (productSlugMatch) {
    const identifier = productSlugMatch[1];
    const index = MOCK_PRODUCTS.findIndex(p => p.slug === identifier || p.id === identifier);

    if (method === 'PUT' && body) {
      let parsed = {};
      try { parsed = typeof body === 'string' ? JSON.parse(body) : body; } catch (e) {}
      if (index !== -1) {
        MOCK_PRODUCTS[index] = { ...MOCK_PRODUCTS[index], ...parsed };
        return { success: true, message: 'Product updated successfully!', product: MOCK_PRODUCTS[index] };
      }
    }

    if (index !== -1) {
      const product = MOCK_PRODUCTS[index];
      const related = MOCK_PRODUCTS.filter(p => p.category_id === product.category_id && p.id !== product.id).slice(0, 4);
      return { success: true, product, relatedProducts: related };
    }
    return { success: true, product: MOCK_PRODUCTS[0], relatedProducts: [] };
  }

  // Handle product creation in mock mode
  if ((path === '/products' || path === '/api/products') && method === 'POST' && body) {
    let parsed = {};
    try { parsed = typeof body === 'string' ? JSON.parse(body) : body; } catch (e) {}
    const newProd = {
      ...parsed,
      id: 'prod_' + Date.now(),
      slug: (parsed.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };
    MOCK_PRODUCTS.unshift(newProd);
    return { success: true, message: 'Product created successfully!', product: newProd };
  }

  // 6. Reviews
  if (path.startsWith('/reviews') || path.startsWith('/api/reviews')) {
    return { success: true, reviews: MOCK_REVIEWS, total: MOCK_REVIEWS.length };
  }

  // 7. Coupons validate
  if (path.includes('/coupons/validate')) {
    const code = searchParams.get('code') || (body && JSON.parse(body || '{}').code);
    const coupon = MOCK_COUPONS.find(c => c.code === code?.toUpperCase());
    if (coupon) {
      return { success: true, coupon, message: 'Coupon applied successfully!' };
    }
    return { success: false, message: 'Invalid or expired coupon code.' };
  }

  // 8. Auth
  if (path.includes('/auth/me')) {
    const token = localStorage.getItem('shagun_token');
    if (token) {
      const savedUser = localStorage.getItem('shagun_user_session');
      if (savedUser) {
        try {
          return { success: true, user: JSON.parse(savedUser), addresses: [], wishlist: [] };
        } catch (e) {}
      }
      return {
        success: true,
        user: {
          id: 'usr_super_admin_001',
          name: 'Shagun Shine Administrator',
          email: 'admin@shagunshine.com',
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        },
        addresses: [],
        wishlist: []
      };
    }
    return { success: false, message: 'Not authenticated' };
  }

  if (path.includes('/auth/login') || path.includes('/auth/register')) {
    let creds = {};
    try {
      creds = typeof body === 'string' ? JSON.parse(body || '{}') : (body || {});
    } catch (e) {}

    const email = (creds.email || '').toLowerCase().trim();
    const isAdminEmail = email.includes('admin') || email === 'admin@shagunshine.com';

    const userObj = isAdminEmail ? {
      id: 'usr_super_admin_001',
      name: 'Shagun Shine Administrator',
      email: creds.email || 'admin@shagunshine.com',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    } : {
      id: 'usr_guest_demo',
      name: 'Shagun Customer',
      email: creds.email || 'customer@shagunshine.com',
      role: 'customer'
    };

    localStorage.setItem('shagun_user_session', JSON.stringify(userObj));

    return {
      success: true,
      token: 'demo_jwt_token_' + Date.now(),
      user: userObj
    };
  }

  // 9. Orders / POS / Checkout mock
  if (path.includes('/orders')) {
    if (method === 'POST') {
      let payload = {};
      try {
        payload = typeof body === 'string' ? JSON.parse(body || '{}') : (body || {});
      } catch (e) {}

      if (path.includes('/pos-sale')) {
        const year = new Date().getFullYear();
        const randNum = Math.floor(10000 + Math.random() * 90000);
        const orderNumber = `SS-POS-${year}-${randNum}`;
        const invoiceNumber = `INV-${year}-${randNum}`;
        const totalAmount = payload.items?.reduce((sum, it) => sum + (it.price * it.quantity), 0) - (payload.discountAmount || 0);

        const posOrder = {
          id: 'ord_pos_' + Date.now(),
          order_number: orderNumber,
          invoice_number: invoiceNumber,
          customer_name: payload.customerName || 'Walk-in Retail Customer',
          customer_phone: payload.customerPhone || '',
          customer_email: payload.customerEmail || '',
          shipping_address: { addressLine1: 'In-Store Counter', city: payload.customerCity || 'Indore', state: payload.customerState || 'Madhya Pradesh' },
          payment_method: payload.paymentMethod || 'Cash',
          payment_status: 'Paid',
          order_status: 'Delivered',
          subtotal: payload.items?.reduce((sum, it) => sum + (it.price * it.quantity), 0) || 0,
          discount_amount: payload.discountAmount || 0,
          shipping_fee: 0,
          total_amount: Math.max(0, totalAmount || 0),
          taxable_amount: Math.round(((totalAmount || 0) / 1.18) * 100) / 100,
          cgst_amount: Math.round((((totalAmount || 0) - ((totalAmount || 0) / 1.18)) / 2) * 100) / 100,
          sgst_amount: Math.round((((totalAmount || 0) - ((totalAmount || 0) / 1.18)) / 2) * 100) / 100,
          igst_amount: 0,
          created_at: new Date().toISOString(),
          items: payload.items || []
        };

        return {
          success: true,
          message: 'Retail sale completed and GST invoice generated.',
          order: posOrder,
          invoice: {
            invoiceNumber,
            orderNumber,
            date: new Date().toISOString(),
            cashier: 'Store Cashier',
            paymentMethod: payload.paymentMethod || 'Cash',
            cashTendered: payload.cashTendered || totalAmount,
            changeReturned: payload.changeReturned || 0
          }
        };
      }

      const orderNumber = 'SS-2026-' + Math.floor(100000 + Math.random() * 900000);
      return {
        success: true,
        order: {
          id: 'ord_demo_' + Date.now(),
          order_number: orderNumber,
          total_amount: 1899,
          status: 'confirmed',
          payment_status: 'paid',
          payment_method: 'online'
        },
        message: 'Order created successfully!'
      };
    }
    return { success: true, orders: [] };
  }

  // Fallback default
  return { success: true, message: 'Action completed successfully.' };
}
