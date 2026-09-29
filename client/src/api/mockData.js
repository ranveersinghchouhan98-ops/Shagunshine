export const MOCK_CATEGORIES = [
  {
    id: 'cat_skincare',
    name: 'Skincare',
    slug: 'skincare',
    description: 'Luminous serums, nourishing creams, and revitalizing elixirs infused with gold dust and botanical extracts.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
    subcategories: ['Serums & Elixirs', 'Moisturizers & Creams', 'Cleansers & Toners', 'Face Masks & Peels', 'Sun Protection']
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

export const MOCK_PRODUCTS = [
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
    description: 'Your effortless 3-step morning skincare routine: Rose & Pearl Cleanser (150ml), 24K Gold Radiant Serum (30ml), and Dewy Velvet SPF 50 Sunscreen (50g).',
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
    subcategory: 'Serums & Elixirs',
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
    comment: 'I have been using this 24K Gold Youth Elixir for 3 weeks and the difference in my skin texture and radiance is unbelievable! It absorbs effortlessly without stickiness.',
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
  support_email: 'shagunshine887@gmail.com',
  support_phone: '+91 9876543210',
  currency_symbol: '₹',
  free_shipping_threshold: 999,
  standard_shipping_rate: 99,
  tax_rate_percentage: 18,
  store_address: 'Luxury Galleria, Road No. 36, Jubilee Hills, Hyderabad - 500033'
};

export const MOCK_COUPONS = [
  { code: 'SHINE20', discount_type: 'percentage', discount_value: 20, min_spend: 1499 },
  { code: 'GLOW500', discount_type: 'flat', discount_value: 500, min_spend: 2499 },
  { code: 'WELCOME10', discount_type: 'percentage', discount_value: 10, min_spend: 999 }
];

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
    const product = MOCK_PRODUCTS.find(p => p.slug === identifier || p.id === identifier);
    if (product) {
      const related = MOCK_PRODUCTS.filter(p => p.category_id === product.category_id && p.id !== product.id).slice(0, 4);
      return { success: true, product, relatedProducts: related };
    }
    return { success: true, product: MOCK_PRODUCTS[0], relatedProducts: [] };
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
      return {
        success: true,
        user: {
          id: 'usr_guest_demo',
          name: 'Shagun Customer',
          email: 'customer@shagunshine.com',
          role: 'customer'
        }
      };
    }
    return { success: false, message: 'Not authenticated' };
  }

  if (path.includes('/auth/login') || path.includes('/auth/register')) {
    return {
      success: true,
      token: 'demo_jwt_token_' + Date.now(),
      user: {
        id: 'usr_guest_demo',
        name: 'Shagun Customer',
        email: 'customer@shagunshine.com',
        role: 'customer'
      }
    };
  }

  // 9. Orders / Checkout mock
  if (path.includes('/orders')) {
    if (method === 'POST') {
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
