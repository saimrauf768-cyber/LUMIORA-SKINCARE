import { Product, Coupon, StoreSettings, Order } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    sku: 'LMR-VITC-30',
    name: 'Glow Boost Vitamin C Serum',
    category: 'Serums',
    price: 1499,
    originalPrice: 1999,
    stock: 45,
    size: '30 ml / 1.0 fl oz',
    skinType: 'All Skin Types, Dull & Hyperpigmented',
    description: 'A revolutionary botanical elixir infused with 15% stabilized L-Ascorbic Acid, Ferulic Acid, and organic Swat citrus extracts. Specifically formulated to neutralize sun spots, fade post-acne pigmentation, and impart an incandescent South Asian glass-skin glow.',
    ingredients: [
      '15% Stabilized L-Ascorbic Acid (Vitamin C)',
      '1% Pure Ferulic Acid',
      'Botanical Hyaluronic Acid Matrix',
      'Citrus Japonica (Kumquat) Fruit Extract',
      'D-Alpha Tocopherol (Vitamin E)',
      'Centella Asiatica (Gotu Kola) Extract'
    ],
    benefits: [
      'Clinically visibly fades hyperpigmentation in 14 days',
      'Shields against environmental pollutants and free radicals',
      'Stimulates dermal collagen synthesis for youthful suppleness',
      'Lightweight, non-sticky rapid absorption finish'
    ],
    howToUse: 'Dispense 3–4 drops onto freshly cleansed fingertips. Gently pat into face and neck before moisturizing. For optimal photoprotection, follow with Lumora SPF 50 during daytime.',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=900',
    secondaryImage: 'https://images.unsplash.com/photo-1608248597359-009180f9dbec?auto=format&fit=crop&q=80&w=900',
    rating: 4.9,
    reviewsCount: 184,
    isFeatured: true,
    isBestSeller: true,
    model3DType: 'serum',
    reviews: [
      {
        id: 'rev-1',
        author: 'Zainab Tariq',
        city: 'Lahore (DHA)',
        rating: 5,
        date: '3 days ago',
        comment: 'This is hands down the best Vitamin C serum in Pakistan. Most international ones oxidize within weeks in our heat, but Lumora remained amber-clear and dissolved my acne marks completely within 3 weeks!',
        verifiedPurchase: true,
        skinType: 'Combination / Sensitive'
      },
      {
        id: 'rev-2',
        author: 'Aiman Siddiqui',
        city: 'Karachi (Clifton)',
        rating: 5,
        date: '1 week ago',
        comment: 'Non-greasy even during humid Karachi summers! My skin feels radiant without any heavy residue under makeup.',
        verifiedPurchase: true,
        skinType: 'Oily'
      }
    ]
  },
  {
    id: 'prod-2',
    sku: 'LMR-HYAL-30',
    name: 'Hyaluronic Acid Hydration Serum',
    category: 'Serums',
    price: 1299,
    originalPrice: 1699,
    stock: 60,
    size: '30 ml / 1.0 fl oz',
    skinType: 'Dehydrated, Dry, Sensitive & Damaged Barrier',
    description: 'Multi-molecular weight hyaluronic acid targeting 5 epidermal layers for immediate 72-hour moisture reservoir replenishing. Blended with Provitamin B5 (Panthenol) and snow mushroom extract to repair cellular moisture barriers.',
    ingredients: [
      'Multi-Molecular Hyaluronic Acid (Low, Medium, High & Oligo)',
      '5% Provitamin B5 (Panthenol)',
      'Tremella Fuciformis (Snow Mushroom) Extract',
      'Hydrolyzed Glycosaminoglycans',
      'Allantoin'
    ],
    benefits: [
      'Delivers sustained 72-hour dermal plumping',
      'Soothes irritated, parched skin instantly on contact',
      'Softens expression lines and flaky rough patches',
      'Forms a breathable dewy moisture cushion'
    ],
    howToUse: 'Apply 2-3 drops to damp skin morning and evening. Follow immediately with Lumora Moisturizing Cream to seal hydration.',
    image: 'https://images.unsplash.com/photo-1608248597359-009180f9dbec?auto=format&fit=crop&q=80&w=900',
    rating: 4.8,
    reviewsCount: 142,
    isFeatured: true,
    isNewArrival: false,
    model3DType: 'serum',
    reviews: [
      {
        id: 'rev-3',
        author: 'Mahnoor Baloch',
        city: 'Islamabad (F-7)',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Islamabad winters usually make my cheeks crack and peel. This serum completely cured my dry patches. Truly medical grade luxury.',
        verifiedPurchase: true,
        skinType: 'Dry'
      }
    ]
  },
  {
    id: 'prod-3',
    sku: 'LMR-NIAC-30',
    name: 'Niacinamide 10% Serum',
    category: 'Serums',
    price: 1399,
    originalPrice: 1799,
    stock: 38,
    size: '30 ml / 1.0 fl oz',
    skinType: 'Oily, Congested, Enlarged Pores & Acne-Prone',
    description: 'High-strength 10% Niacinamide (Vitamin B3) paired with 1% Zinc PCA and Centella Asiatica. Normalizes erratic sebum secretion, visibly refines dilated pores, and suppresses inflammatory blemishes without redness.',
    ingredients: [
      'Niacinamide 10% (Pure Vitamin B3)',
      'Zinc PCA 1%',
      'Centella Asiatica Leaf Water',
      'Licorice Root (Glycyrrhiza Glabra) Extract',
      'N-Acetyl Glucosamine'
    ],
    benefits: [
      'Shrinks the appearance of stretched, visible pores',
      'Calms red hormonal breakouts and post-acne erythema',
      'Controls excessive midday forehead and nose oiliness',
      'Restores smooth velvet texture without peeling'
    ],
    howToUse: 'Smooth 3 drops over entire face morning and evening prior to heavier creams. Safe to combine with Lumora Hyaluronic Acid.',
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=900',
    rating: 4.9,
    reviewsCount: 118,
    isFeatured: true,
    isBestSeller: true,
    model3DType: 'serum',
    reviews: [
      {
        id: 'rev-4',
        author: 'Hamza Farooq',
        city: 'Rawalpindi',
        rating: 5,
        date: '5 days ago',
        comment: 'Great for men with oily skin too. My T-zone shine has dramatically reduced and no more random breakouts after shaving.',
        verifiedPurchase: true,
        skinType: 'Oily / Acne Prone'
      }
    ]
  },
  {
    id: 'prod-4',
    sku: 'LMR-MOIST-50',
    name: 'Luxury Moisturizing Cream',
    category: 'Moisturizers',
    price: 1799,
    originalPrice: 2299,
    stock: 28,
    size: '50 g / 1.76 oz',
    skinType: 'Normal, Dry, Stressed & Compromised Barrier',
    description: 'An indulgent, velvety soufflé cream engineered with a bio-identical 3:1:1 Ceramide complex, plant Squalane, and Organic Shea Butter. Fortifies the lipid mantle, seals in vital moisture, and leaves skin cashmere-soft.',
    ingredients: [
      'Ceramide Complex (Ceramide NP, Ceramide AP, Ceramide EOP)',
      'Phytosphingosine & Cholesterol',
      '100% Plant-Derived Squalane',
      'Colloidal Oatmeal Extract',
      'Cold-Pressed Shea Butter',
      'Meadowfoam Seed Oil'
    ],
    benefits: [
      'Reconstructs damaged moisture barriers in 48 hours',
      'Deep, long-lasting nourishment without greasiness',
      'Cushions against air-conditioned dryness and weather stress',
      'Leaves a refined satin finish that looks gorgeous under makeup'
    ],
    howToUse: 'Warm a pearl-sized amount between clean palms and gently press into skin using upward smoothing motions morning and night.',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=900',
    rating: 5.0,
    reviewsCount: 165,
    isFeatured: true,
    isBestSeller: true,
    model3DType: 'cream',
    reviews: [
      {
        id: 'rev-5',
        author: 'Dr. Sarah Mansoor',
        city: 'Lahore (Gulberg)',
        rating: 5,
        date: '4 days ago',
        comment: 'As a dermatologist, I thoroughly evaluated the formulation ingredients. The 3:1:1 physiological lipid ratio is identical to luxury Swiss medical creams costing Rs. 15,000+. Exceptional value and efficacy.',
        verifiedPurchase: true,
        skinType: 'Dry / Sensitive'
      }
    ]
  },
  {
    id: 'prod-5',
    sku: 'LMR-WASH-150',
    name: 'Gentle Foaming Face Wash',
    category: 'Cleansers',
    price: 999,
    originalPrice: 1399,
    stock: 80,
    size: '150 ml / 5.1 fl oz',
    skinType: 'All Skin Types including Reactive & Sensitive',
    description: 'A sulfate-free, pH 5.5 cloud cleanser powered by amino acid surfactants, organic Green Tea distillate, and Chamomile. Dissolves pollutants, sunscreen, and excess sebum while preserving essential natural moisture.',
    ingredients: [
      'Sodium Cocoyl Apple Amino Acids',
      'Organic Camellia Sinensis (Green Tea) Leaf Distillate',
      'Chamomilla Recutita Flower Extract',
      'Vegetable Glycerin',
      'Panthenol (Pro-Vitamin B5)',
      'Betaine'
    ],
    benefits: [
      '100% Soap-free, Sulfate-free & Alcohol-free',
      'Maintains natural skin pH at 5.5 to prevent microbial breakouts',
      'Rinses completely clean with zero tightness or squeakiness',
      'Soothing botanical aroma from real chamomile'
    ],
    howToUse: 'Pump 1–2 clouds into wet palms. Massage over face in gentle circular motions for 60 seconds, then rinse thoroughly with lukewarm water.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=900',
    rating: 4.7,
    reviewsCount: 92,
    isFeatured: false,
    model3DType: 'cleanser',
    reviews: [
      {
        id: 'rev-6',
        author: 'Kinza Qureshi',
        city: 'Faisalabad',
        rating: 5,
        date: '1 week ago',
        comment: 'Zero tight feeling after washing! Finally a face wash in Pakistan that respects delicate skin barriers.',
        verifiedPurchase: true,
        skinType: 'Sensitive'
      }
    ]
  },
  {
    id: 'prod-6',
    sku: 'LMR-SPF-50',
    name: 'SPF 50 Daily Sunscreen',
    category: 'Sunscreens',
    price: 1199,
    originalPrice: 1599,
    stock: 65,
    size: '50 ml / 1.7 fl oz',
    skinType: 'All Skin Tones & Types, South Asian Fitzpatrick III-V',
    description: 'Ultra-lightweight invisible water-gel daily sun shield with Broad Spectrum UVA/UVB PA++++. Formulated specifically for South Asian skin tones to guarantee absolutely zero white cast, zero flashback, and a velvety matte finish under extreme humidity.',
    ingredients: [
      'Tinosorb S & M Modern High-Stability UV Filters',
      'Uvinul A Plus',
      'Tocopherol (Pure Vitamin E)',
      'Aloe Barbadensis Leaf Water',
      'Adenosine & Niacinamide (Brightening Synergy)'
    ],
    benefits: [
      'Guaranteed 100% zero white cast on brown skin tones',
      'Water and sweat resistant for up to 80 minutes',
      'Non-greasy fluid texture that absorbs within 15 seconds',
      'Doubles as a silky primer beneath daily makeup'
    ],
    howToUse: 'Apply 2 generous finger-lengths to face, neck, and ears 15 minutes before sun exposure. Reapply every 2 hours when swimming or outdoors.',
    image: 'https://images.unsplash.com/photo-1567928815104-b6973dbb3ce3?auto=format&fit=crop&q=80&w=900',
    rating: 4.9,
    reviewsCount: 240,
    isFeatured: true,
    isBestSeller: true,
    model3DType: 'sunscreen',
    reviews: [
      {
        id: 'rev-7',
        author: 'Fatima Zahra',
        city: 'Karachi (PECHS)',
        rating: 5,
        date: 'Yesterday',
        comment: 'I have tested over 15 sunscreens on my warm Pakistani skin tone and every single one left a purple ghost cast. Lumora is totally transparent and feels like water! 10/10.',
        verifiedPurchase: true,
        skinType: 'Warm Medium Tan'
      }
    ]
  },
  {
    id: 'prod-7',
    sku: 'LMR-TONER-120',
    name: 'Rose Glow Toner',
    category: 'Toners',
    price: 1099,
    originalPrice: 1499,
    stock: 42,
    size: '120 ml / 4.0 fl oz',
    skinType: 'All Skin Types, Dehydrated & Uneven',
    description: 'Hydro-distilled from freshly hand-harvested Rosa Damascena petals cultivated in high-altitude Pakistani valleys. Infused with alcohol-free Witch Hazel, Tremella mushroom, and botanical glycerin to balance dermal pH and prep skin for enhanced serum absorption.',
    ingredients: [
      '100% Pure Rosa Damascena Flower Distillate',
      'Alcohol-Free Hamamelis Virginiana (Witch Hazel)',
      'Botanical Glycerin',
      'Tremella Fuciformis Extract',
      'Sodium Hyaluronate',
      'Rosa Canina (Rosehip) Seed Extract'
    ],
    benefits: [
      'Refines pores and restores optimal hydration levels instantly',
      'Calms redness and cools skin inflamed by summer heat',
      'Boosts absorption of subsequent serums by up to 40%',
      'Sensory aromatic luxury from pure steam distillation'
    ],
    howToUse: 'After cleansing, pour onto palms or cotton pad and gently pat into face and décolletage. Can also be misted midday over makeup for an instant dewy refresh.',
    image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=900',
    rating: 4.8,
    reviewsCount: 88,
    isFeatured: false,
    model3DType: 'serum',
    reviews: [
      {
        id: 'rev-8',
        author: 'Sana Mir',
        city: 'Peshawar',
        rating: 5,
        date: '2 weeks ago',
        comment: 'The scent is breathtaking—genuine freshly bloomed mountain roses, no fake chemical perfume. My skin drinks it up.',
        verifiedPurchase: true,
        skinType: 'Normal / Dry'
      }
    ]
  },
  {
    id: 'prod-8',
    sku: 'LMR-NIGHT-50',
    name: 'Overnight Repair Night Cream',
    category: 'Moisturizers',
    price: 1899,
    originalPrice: 2499,
    stock: 25,
    size: '50 g / 1.76 oz',
    skinType: 'Mature, Fatigued, Stressed & Anti-Aging',
    description: 'Intensive nocturnal cellular recovery balm. Combines 1% Bakuchiol (the natural, non-irritating botanical alternative to Retinol), Copper Tripeptide-1, and Argan lipid matrix to stimulate cell turnover and restore elasticity while you sleep.',
    ingredients: [
      '1% Pure Sytenol A (Bakuchiol)',
      'Copper Tripeptide-1 (GHK-Cu)',
      'Organic Moroccan Argan Oil',
      'Melatonin & Resveratrol Complex',
      'Hydrolyzed Collagen Peptides',
      'Evening Primrose Oil'
    ],
    benefits: [
      'Retinol-level anti-aging without flaking, peeling, or sun sensitivity',
      'Visibly reduces fine lines, crow’s feet, and morning puffiness',
      'Accelerates nocturnal cellular regeneration and DNA repair',
      'Wake up with firm, radiant, velvety rested skin'
    ],
    howToUse: 'Gently massage a hazelnut-sized portion into face, neck, and chest every evening as the final step of your nighttime ritual.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=900',
    rating: 4.9,
    reviewsCount: 76,
    isFeatured: true,
    model3DType: 'cream',
    reviews: [
      {
        id: 'rev-9',
        author: 'Haleema Raza',
        city: 'Sialkot',
        rating: 5,
        date: '1 week ago',
        comment: 'I could never use standard retinol because my skin is so sensitive. This Bakuchiol night cream worked miracles on my forehead lines without a hint of redness!',
        verifiedPurchase: true,
        skinType: 'Mature / Sensitive'
      }
    ]
  },
  {
    id: 'prod-9',
    sku: 'LMR-BNDL-GLOW',
    name: 'Complete Glow Skincare Bundle',
    category: 'Bundles',
    price: 3999,
    originalPrice: 5499,
    stock: 18,
    size: 'Complete 4-Piece Protocol',
    skinType: 'Complete Day-to-Night Transformation Protocol',
    description: 'The masterclass in radiant skin. Unites Lumora’s 4 cornerstone formulations in full size: Gentle Foaming Face Wash (150ml), Glow Boost Vitamin C Serum (30ml), Luxury Moisturizing Cream (50g), and SPF 50 Daily Sunscreen (50ml). Presented in a complimentary gold-embossed Lumora vanity travel trunk.',
    ingredients: [
      'Step 1: Gentle Foaming Face Wash (150ml)',
      'Step 2: Glow Boost Vitamin C Serum (30ml)',
      'Step 3: Luxury Moisturizing Cream (50g)',
      'Step 4: SPF 50 Daily Sunscreen (50ml)',
      'Complimentary: Bespoke Gold Embroidered Velvet Vanity Trunk'
    ],
    benefits: [
      'Comprehensive 24-hour botanical skincare protocol',
      'Saves Rs. 1,500 compared to individual formulation purchase',
      'Formulations engineered to chemically amplify each other synergistically',
      'Guaranteed radiant transformation within 21 days'
    ],
    howToUse: 'Morning: Cleanse -> Vitamin C Serum -> Moisturizing Cream -> SPF 50. Evening: Cleanse -> Moisturizing Cream (or pair with your night cream).',
    image: 'https://images.unsplash.com/photo-1512290900672-1f4165509930?auto=format&fit=crop&q=80&w=900',
    rating: 5.0,
    reviewsCount: 340,
    isFeatured: true,
    isBestSeller: true,
    model3DType: 'serum',
    reviews: [
      {
        id: 'rev-10',
        author: 'Noor-ul-Ain',
        city: 'Islamabad (E-11)',
        rating: 5,
        date: '3 days ago',
        comment: 'Bought this as a bridal gift for myself and I am obsessed. The luxury packaging feels like you purchased it at Harrods London. My skin is glowing in all my wedding photos!',
        verifiedPurchase: true,
        skinType: 'Normal / Glowing'
      }
    ]
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'LUMORA10',
    discountPercentage: 10,
    minOrderAmount: 1500,
    isActive: true,
    description: '10% VIP Privilege discount on orders above Rs. 1,500'
  },
  {
    code: 'GLOW20',
    discountPercentage: 20,
    minOrderAmount: 3500,
    isActive: true,
    description: '20% Haute Glow discount on orders above Rs. 3,500'
  },
  {
    code: 'FIRSTORDER',
    discountPercentage: 15,
    minOrderAmount: 2000,
    isActive: true,
    description: '15% Welcome treat for new clients'
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  whatsappNumber: '+923001234567',
  freeShippingThreshold: 2500,
  flatShippingRate: 250,
  announcementText: 'Complimentary Nationwide Delivery on all orders above Rs. 2,500 • Authentic Botanical Formulations',
  isAnnouncementActive: true,
  storeEmail: 'concierge@lumora.pk',
  storePhone: '+92 300 1234567',
  bankDetails: {
    bankName: 'Meezan Bank Ltd (Islamic Banking)',
    accountTitle: 'LUMORA SKINCARE HAUTE PVT LTD',
    accountNumber: '0284-0104829103',
    iban: 'PK62MEZN0002840104829103'
  },
  easypaisaNumber: '0300 1234567',
  easypaisaTitle: 'Lumora Skincare PVT',
  jazzCashNumber: '0300 1234567',
  jazzCashTitle: 'Lumora Skincare PVT'
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'LMR-948210',
    customerName: 'Ayesha Khan',
    phone: '03218921043',
    email: 'ayesha.k@gmail.com',
    address: 'House 42-B, Sector Z, Phase 6, DHA',
    city: 'Lahore',
    deliveryNotes: 'Please call before arriving, deliver after 2 PM',
    items: [
      { product: INITIAL_PRODUCTS[0], quantity: 1 },
      { product: INITIAL_PRODUCTS[3], quantity: 1 }
    ],
    subtotal: 3298,
    shipping: 0,
    discount: 330,
    total: 2968,
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    status: 'Dispatched',
    createdAt: '2026-11-08 14:30',
    trackingNumber: 'TCS-89210344',
    courier: 'TCS Express'
  },
  {
    id: 'LMR-839102',
    customerName: 'Hassan Raza',
    phone: '03019944123',
    email: 'hassan.raza@outlook.com',
    address: 'Apartment 702, Creek Vistas, Phase 8, DHA',
    city: 'Karachi',
    deliveryNotes: 'Leave with reception security desk if unavailable',
    items: [
      { product: INITIAL_PRODUCTS[8], quantity: 1 }
    ],
    subtotal: 3999,
    shipping: 0,
    discount: 0,
    total: 3999,
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Paid',
    status: 'Delivered',
    createdAt: '2026-11-06 11:15',
    trackingNumber: 'TRAX-1192837',
    courier: 'Trax Logistics'
  }
];
