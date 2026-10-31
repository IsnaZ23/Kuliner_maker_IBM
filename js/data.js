/**
 * js/data.js
 * ─────────────────────────────────────────────────────────
 * All static seed data: recipe database, cuisine/city lists,
 * and the AI status-message sequence.
 *
 * Each recipe has:
 *   keywords  — array of Indonesian + English terms used for
 *               ingredient-based matching. Include synonyms,
 *               abbreviations, and common misspellings.
 *   cuisine   — category string matching CUISINES list
 *   cities    — (budget-mode) cities where dish is available
 *   priceRaw  — numeric IDR value for budget filtering
 *
 * The matching engine in app.js scores recipes by counting how
 * many of the user's typed ingredients appear in `keywords`.
 * ─────────────────────────────────────────────────────────
 */

'use strict';

/* ── Application state ────────────────────────────────────── */
const state = {
  mode: 'fridge',
  ingredients: [],
  selectedCuisines: [],
  budget: 25000,
  selectedCity: 'Yogyakarta'
};

/* ── Static lists ─────────────────────────────────────────── */
const CUISINES = ['Any', 'Indonesian', 'Chinese', 'Western', 'Japanese', 'Vegan'];
const CITIES   = ['Yogyakarta', 'Jakarta', 'Bandung', 'Surabaya', 'Bali', 'Medan'];

/* ── AI status messages ───────────────────────────────────── */
const AI_MESSAGES = [
  'Scanning ingredient database…',
  'Matching your ingredients…',
  'Calculating nutritional balance…',
  'Ranking best recipes for you…',
  'Finalising top recommendations…'
];

/* ═══════════════════════════════════════════════════════════
   MASTER RECIPE CATALOGUE
   ───────────────────────────────────────────────────────────
   Add recipes here. `keywords` drives fridge-mode matching;
   `cities` drives budget-mode city filtering.
   ═══════════════════════════════════════════════════════════ */
const ALL_RECIPES = [

  /* ─── CHICKEN / AYAM ─────────────────────────────────── */
  {
    id: 'soto-ayam',
    img: {
      src:   'https://images.unsplash.com/photo-1569476942063-5c96dc30135b?auto=format&fit=crop&w=600&q=80',
      local: 'img/soto-ayam.jpg',
      alt:   'Soto ayam chicken soup in a bowl with vermicelli'
    },
    name: 'Soto Ayam Kampung',
    cost: 'Rp 12,000',
    priceRaw: 12000,
    time: '35 min',
    difficulty: 'Medium',
    cuisine: 'Indonesian',
    cities: ['Yogyakarta', 'Jakarta', 'Bandung', 'Surabaya', 'Bali', 'Medan'],
    keywords: [
      'ayam', 'chicken', 'soto', 'soup', 'broth', 'kuah',
      'bihun', 'vermicelli', 'noodles', 'bawang', 'shallot',
      'kunyit', 'turmeric', 'jahe', 'ginger', 'serai', 'lemongrass'
    ],
    tags: ['ayam', 'soto', 'kuah bening', 'Indonesian'],
    stripe: 'stripe-teal',
    steps: [
      'Boil whole chicken in 1.5 L water with lemongrass, galangal, and bay leaves for 30 min.',
      'Remove chicken, shred the meat, and strain the broth.',
      'Sauté blended shallots, garlic, turmeric, and ginger in oil until fragrant.',
      'Add the spice paste to the broth; simmer 10 min. Season with salt.',
      'Serve over boiled vermicelli with shredded chicken, hard-boiled egg, and sambal.'
    ]
  },
  {
    id: 'ayam-geprek',
    img: {
      src:   'https://images.unsplash.com/photo-1562802378-063ec186a863?auto=format&fit=crop&w=600&q=80',
      local: 'img/ayam-geprek.jpg',
      alt:   'Crispy smashed fried chicken ayam geprek with chili sambal'
    },
    name: 'Ayam Geprek Sambal Bawang',
    cost: 'Rp 15,000',
    priceRaw: 15000,
    time: '30 min',
    difficulty: 'Medium',
    cuisine: 'Indonesian',
    cities: ['Yogyakarta', 'Jakarta', 'Bandung', 'Surabaya', 'Bali', 'Medan'],
    keywords: [
      'ayam', 'chicken', 'geprek', 'crispy', 'goreng', 'fried',
      'sambal', 'chili', 'cabe', 'bawang', 'garlic', 'tepung', 'flour',
      'telur', 'egg', 'minyak', 'oil'
    ],
    tags: ['ayam', 'geprek', 'sambal', 'crispy'],
    stripe: 'stripe-orange',
    steps: [
      'Marinate chicken pieces in salt, garlic, and coriander for 15 min.',
      'Coat in seasoned flour (add egg for extra crunch), then fry until golden.',
      'Pound fresh red chilies and garlic in a mortar to make sambal bawang.',
      'Place the hot fried chicken on top of the sambal and smash (geprek) together.',
      'Serve with steamed rice and fresh cucumber.'
    ]
  },
  {
    id: 'nasi-goreng-ayam',
    img: {
      src:   'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80',
      local: 'img/nasi-goreng-ayam.jpg',
      alt:   'Indonesian chicken fried rice nasi goreng with egg'
    },
    name: 'Nasi Goreng Ayam',
    cost: 'Rp 14,000',
    priceRaw: 14000,
    time: '20 min',
    difficulty: 'Easy',
    cuisine: 'Indonesian',
    cities: ['Yogyakarta', 'Jakarta', 'Bandung', 'Surabaya', 'Bali', 'Medan'],
    keywords: [
      'nasi', 'rice', 'ayam', 'chicken', 'goreng', 'fried',
      'telur', 'egg', 'kecap', 'soy sauce', 'bawang', 'garlic',
      'shallot', 'sisa nasi', 'leftover rice', 'minyak', 'oil', 'cabai', 'chili'
    ],
    tags: ['nasi goreng', 'ayam', 'telur', 'Indonesian'],
    stripe: 'stripe-blue',
    steps: [
      'Heat oil in a wok; fry shallots and garlic until golden.',
      'Add diced chicken breast; stir-fry until cooked through.',
      'Push to the side, crack in egg, scramble lightly, then mix.',
      'Add day-old rice; toss on high heat with kecap manis and soy sauce.',
      'Season with salt and white pepper. Garnish with fried shallots and sliced cucumber.'
    ]
  },
  {
    id: 'opor-ayam',
    img: {
      src:   'https://images.unsplash.com/photo-1574484284002-952d92a03a05?auto=format&fit=crop&w=600&q=80',
      local: 'img/opor-ayam.jpg',
      alt:   'Opor ayam chicken in coconut milk curry'
    },
    name: 'Opor Ayam Kuah Santan',
    cost: 'Rp 18,000',
    priceRaw: 18000,
    time: '45 min',
    difficulty: 'Medium',
    cuisine: 'Indonesian',
    cities: ['Yogyakarta', 'Jakarta', 'Surabaya'],
    keywords: [
      'ayam', 'chicken', 'santan', 'coconut milk', 'opor', 'kunyit', 'turmeric',
      'kemiri', 'candlenut', 'serai', 'lemongrass', 'daun salam', 'bay leaf',
      'bawang', 'shallot', 'garlic', 'lengkuas', 'galangal'
    ],
    tags: ['ayam', 'santan', 'opor', 'Indonesian'],
    stripe: 'stripe-orange',
    steps: [
      'Blend shallots, garlic, candlenuts, turmeric, and coriander into a paste.',
      'Fry the spice paste with lemongrass, galangal, and bay leaf until fragrant.',
      'Add chicken pieces; cook until no longer pink.',
      'Pour in coconut milk; simmer on low heat for 25–30 min, stirring occasionally.',
      'Season with salt and sugar. Serve with lontong or steamed rice.'
    ]
  },

  /* ─── EGG / TELUR ────────────────────────────────────── */
  {
    id: 'telur-dadar',
    img: {
      src:   'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
      local: 'img/telur-dadar.jpg',
      alt:   'Indonesian fluffy omelette telur dadar with herbs'
    },
    name: 'Telur Dadar Bumbu',
    cost: 'Rp 6,000',
    priceRaw: 6000,
    time: '10 min',
    difficulty: 'Easy',
    cuisine: 'Indonesian',
    cities: ['Yogyakarta', 'Jakarta', 'Bandung', 'Surabaya', 'Bali', 'Medan'],
    keywords: [
      'telur', 'egg', 'dadar', 'omelette', 'omelet', 'bawang', 'shallot',
      'cabai', 'chili', 'daun bawang', 'spring onion', 'scallion',
      'minyak', 'oil', 'garam', 'salt'
    ],
    tags: ['telur', 'dadar', 'sarapan', 'quick'],
    stripe: 'stripe-orange',
    steps: [
      'Beat 2 eggs with a pinch of salt and white pepper.',
      'Finely chop shallots, red chili, and spring onion; add to the egg mixture.',
      'Heat oil in a non-stick pan over medium-high heat.',
      'Pour in the egg mixture; swirl to coat the pan.',
      'Cook until edges are set, flip carefully, cook 30 s more. Fold and serve.'
    ]
  },
  {
    id: 'scrambled-tofu-egg',
    img: {
      src:   'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
      local: 'img/scrambled-tofu-egg.jpg',
      alt:   'Scrambled tofu and eggs stir-fried in a pan'
    },
    name: 'Scrambled Tofu with Egg',
    cost: 'Rp 8,000',
    priceRaw: 8000,
    time: '15 min',
    difficulty: 'Easy',
    cuisine: 'Indonesian',
    cities: ['Yogyakarta', 'Jakarta', 'Bandung', 'Surabaya', 'Bali', 'Medan'],
    keywords: [
      'tahu', 'tofu', 'telur', 'egg', 'bawang', 'garlic', 'shallot',
      'kecap', 'soy sauce', 'minyak', 'oil', 'garam', 'salt'
    ],
    tags: ['tahu', 'telur', 'goreng', 'vegan-option'],
    stripe: 'stripe-blue',
    steps: [
      'Crumble firm tofu into small pieces and set aside.',
      'Sauté minced garlic in oil over medium heat until fragrant.',
      'Add tofu; season with soy sauce, salt, and pepper; stir-fry 3 min.',
      'Push tofu to side, crack in eggs, scramble lightly.',
      'Fold eggs into tofu; cook 1 more minute. Serve hot with rice.'
    ]
  },
  {
    id: 'telur-balado',
    img: {
      src:   'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
      local: 'img/telur-balado.jpg',
      alt:   'Telur balado hard boiled eggs in red chili sauce'
    },
    name: 'Telur Balado',
    cost: 'Rp 9,000',
    priceRaw: 9000,
    time: '20 min',
    difficulty: 'Easy',
    cuisine: 'Indonesian',
    cities: ['Yogyakarta', 'Jakarta', 'Padang', 'Surabaya', 'Medan'],
    keywords: [
      'telur', 'egg', 'balado', 'cabai', 'chili', 'bawang', 'garlic',
      'tomat', 'tomato', 'minyak', 'oil', 'gula', 'sugar', 'sambal'
    ],
    tags: ['telur', 'balado', 'pedas', 'Indonesian'],
    stripe: 'stripe-orange',
    steps: [
      'Hard-boil eggs, peel, and lightly fry until golden. Set aside.',
      'Blend red chilies, shallots, garlic, and tomato.',
      'Fry the blended spices in oil until the colour deepens and oil separates.',
      'Add eggs; toss to coat in the sauce. Season with salt and a pinch of sugar.',
      'Simmer 5 min until sauce thickens. Serve with rice.'
    ]
  },

  /* ─── TOFU-TEMPE ─────────────────────────────────────── */
  {
    id: 'tempe-goreng',
    img: {
      src:   'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
      local: 'img/tempe-goreng.jpg',
      alt:   'Crispy fried tempe slices on a plate'
    },
    name: 'Tempe Goreng Renyah',
    cost: 'Rp 5,000',
    priceRaw: 5000,
    time: '15 min',
    difficulty: 'Easy',
    cuisine: 'Indonesian',
    cities: ['Yogyakarta', 'Jakarta', 'Bandung', 'Surabaya', 'Bali', 'Medan'],
    keywords: [
      'tempe', 'tempeh', 'goreng', 'fried', 'bawang', 'garlic',
      'kunyit', 'turmeric', 'ketumbar', 'coriander', 'garam', 'salt',
      'minyak', 'oil', 'vegan'
    ],
    tags: ['tempe', 'goreng', 'crispy', 'vegan'],
    stripe: 'stripe-teal',
    steps: [
      'Slice tempe into thin rectangles.',
      'Mix a marinade of garlic, coriander, turmeric, and salt with a little water.',
      'Soak tempe in the marinade for 10 min.',
      'Fry in hot oil on medium heat until both sides are golden and crispy.',
      'Drain on paper towel. Serve with sambal and steamed rice.'
    ]
  },
  {
    id: 'tahu-bacem',
    img: {
      src:   'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
      local: 'img/tahu-bacem.jpg',
      alt:   'Braised sweet soy tofu tahu bacem'
    },
    name: 'Tahu Bacem Jogja',
    cost: 'Rp 6,000',
    priceRaw: 6000,
    time: '40 min',
    difficulty: 'Medium',
    cuisine: 'Indonesian',
    cities: ['Yogyakarta', 'Surabaya'],
    keywords: [
      'tahu', 'tofu', 'bacem', 'kecap', 'soy sauce', 'sweet soy',
      'gula merah', 'palm sugar', 'bawang', 'garlic', 'shallot',
      'ketumbar', 'coriander', 'daun salam', 'bay leaf', 'vegan'
    ],
    tags: ['tahu', 'bacem', 'manis', 'Jogja'],
    stripe: 'stripe-blue',
    steps: [
      'Bring water, kecap manis, palm sugar, shallots, garlic, coriander, and bay leaf to a boil.',
      'Add firm tofu blocks; simmer on low heat until liquid is nearly absorbed (20–25 min).',
      'Allow to cool so tofu absorbs remaining sauce.',
      'Fry lightly in a little oil until the surface caramelises.',
      'Serve alongside rice, tempe, and sambal.'
    ]
  },

  /* ─── NOODLES ─────────────────────────────────────────── */
  {
    id: 'mie-goreng',
    img: {
      src:   'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?auto=format&fit=crop&w=600&q=80',
      local: 'img/mie-goreng.jpg',
      alt:   'Indonesian fried noodles mie goreng with egg and vegetables'
    },
    name: 'Mie Goreng Jawa',
    cost: 'Rp 12,000',
    priceRaw: 12000,
    time: '20 min',
    difficulty: 'Easy',
    cuisine: 'Indonesian',
    cities: ['Yogyakarta', 'Jakarta', 'Bandung', 'Surabaya', 'Bali', 'Medan'],
    keywords: [
      'mie', 'noodles', 'goreng', 'fried', 'telur', 'egg',
      'kubis', 'cabbage', 'kol', 'sawi', 'bok choy', 'bawang', 'garlic',
      'kecap', 'soy sauce', 'oyster sauce', 'minyak', 'oil', 'wortel', 'carrot'
    ],
    tags: ['mie', 'goreng', 'telur', 'quick'],
    stripe: 'stripe-orange',
    steps: [
      'Boil noodles until al-dente; drain and toss with a drop of oil.',
      'Stir-fry shallots and garlic in hot oil until golden.',
      'Add noodles, kecap manis, and oyster sauce; toss on high heat.',
      'Push aside, scramble an egg in the wok, mix through.',
      'Add cabbage; cook 2 min. Garnish with fried shallots and lime.'
    ]
  },
  {
    id: 'mie-rebus',
    img: {
      src:   'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?auto=format&fit=crop&w=600&q=80',
      local: 'img/mie-rebus.jpg',
      alt:   'Mie rebus Indonesian boiled noodle soup'
    },
    name: 'Mie Rebus Kuah Gurih',
    cost: 'Rp 10,000',
    priceRaw: 10000,
    time: '15 min',
    difficulty: 'Easy',
    cuisine: 'Indonesian',
    cities: ['Yogyakarta', 'Jakarta', 'Bandung', 'Medan'],
    keywords: [
      'mie', 'noodles', 'rebus', 'boiled', 'telur', 'egg', 'sawi', 'bok choy',
      'tahu', 'tofu', 'bawang', 'garlic', 'kecap', 'soy sauce', 'kuah', 'broth'
    ],
    tags: ['mie', 'rebus', 'kuah', 'warm'],
    stripe: 'stripe-teal',
    steps: [
      'Prepare a broth with shallots, garlic, and a splash of soy sauce.',
      'Boil noodles separately; place in a bowl.',
      'Blanch bok choy and bean sprouts for 1 min; arrange on noodles.',
      'Fry an egg (sunny-side up) and place on top.',
      'Pour hot broth over everything. Add fried shallots and sambal.'
    ]
  },

  /* ─── RICE DISHES ─────────────────────────────────────── */
  {
    id: 'nasi-goreng-biasa',
    img: {
      src:   'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80',
      local: 'img/nasi-goreng.jpg',
      alt:   'Classic Indonesian fried rice nasi goreng'
    },
    name: 'Nasi Goreng Kampung',
    cost: 'Rp 10,000',
    priceRaw: 10000,
    time: '15 min',
    difficulty: 'Easy',
    cuisine: 'Indonesian',
    cities: ['Yogyakarta', 'Jakarta', 'Bandung', 'Surabaya', 'Bali', 'Medan'],
    keywords: [
      'nasi', 'rice', 'goreng', 'fried', 'telur', 'egg',
      'bawang', 'shallot', 'garlic', 'kecap', 'soy sauce',
      'sisa nasi', 'leftover', 'minyak', 'oil', 'cabai', 'chili', 'salt'
    ],
    tags: ['nasi goreng', 'telur', 'simpel', 'Indonesian'],
    stripe: 'stripe-blue',
    steps: [
      'Heat oil in wok; fry shallots, garlic, and chili until aromatic.',
      'Add day-old rice; press and toss on high heat.',
      'Add kecap manis, soy sauce, salt, and white pepper.',
      'Push rice aside; fry an egg, break yolk, mix through rice.',
      'Serve with cucumber, tomato, and kerupuk on the side.'
    ]
  },
  {
    id: 'sayur-bening',
    img: {
      src:   'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
      local: 'img/sayur-bening.jpg',
      alt:   'Clear vegetable soup sayur bening with spinach and corn'
    },
    name: 'Sayur Bening Bayam Jagung',
    cost: 'Rp 5,000',
    priceRaw: 5000,
    time: '25 min',
    difficulty: 'Easy',
    cuisine: 'Indonesian',
    cities: ['Yogyakarta', 'Jakarta', 'Bandung', 'Surabaya', 'Bali', 'Medan'],
    keywords: [
      'bayam', 'spinach', 'jagung', 'corn', 'sayur', 'vegetable', 'bening', 'clear',
      'soup', 'bawang', 'shallot', 'garlic', 'gula', 'sugar', 'garam', 'salt', 'vegan'
    ],
    tags: ['sayur', 'bayam', 'jagung', 'vegan'],
    stripe: 'stripe-teal',
    steps: [
      'Bring 600 ml water to a gentle boil.',
      'Add sliced shallots and garlic; simmer 3 min.',
      'Add sweet corn chunks; cook 5 min.',
      'Add spinach leaves; season with salt and a pinch of sugar.',
      'Cook 2 more minutes. Serve as a light, clear soup with rice.'
    ]
  },

  /* ─── BEEF / DAGING ──────────────────────────────────── */
  {
    id: 'rendang-daging',
    img: {
      src:   'https://images.unsplash.com/photo-1574484284002-952d92a03a05?auto=format&fit=crop&w=600&q=80',
      local: 'img/rendang.jpg',
      alt:   'Beef rendang slow-cooked in coconut milk and spices'
    },
    name: 'Rendang Daging Sapi',
    cost: 'Rp 28,000',
    priceRaw: 28000,
    time: '120 min',
    difficulty: 'Hard',
    cuisine: 'Indonesian',
    cities: ['Jakarta', 'Padang', 'Surabaya', 'Medan'],
    keywords: [
      'daging', 'beef', 'sapi', 'rendang', 'santan', 'coconut milk',
      'serai', 'lemongrass', 'kunyit', 'turmeric', 'jahe', 'ginger',
      'kemiri', 'candlenut', 'cabai', 'chili', 'lengkuas', 'galangal',
      'bawang', 'garlic', 'shallot'
    ],
    tags: ['rendang', 'daging', 'santan', 'Minang'],
    stripe: 'stripe-orange',
    steps: [
      'Blend chili, shallots, garlic, galangal, turmeric, and candlenuts.',
      'Add spice paste to a wok with beef, coconut milk, and lemongrass.',
      'Cook on medium heat, stirring often, until coconut milk thickens.',
      'Reduce to low heat; keep stirring as liquid evaporates and oil separates.',
      'Continue cooking until beef is dark brown and almost dry — this takes 1.5–2 h.'
    ]
  },
  {
    id: 'sate-sapi',
    img: {
      src:   'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
      local: 'img/sate-sapi.jpg',
      alt:   'Beef satay skewers grilled with peanut sauce'
    },
    name: 'Sate Sapi Bumbu Kacang',
    cost: 'Rp 22,000',
    priceRaw: 22000,
    time: '45 min',
    difficulty: 'Medium',
    cuisine: 'Indonesian',
    cities: ['Yogyakarta', 'Jakarta', 'Bandung', 'Surabaya'],
    keywords: [
      'sate', 'satay', 'daging', 'beef', 'sapi', 'kacang', 'peanut',
      'bawang', 'garlic', 'shallot', 'kecap', 'soy sauce',
      'ketumbar', 'coriander', 'minyak', 'oil'
    ],
    tags: ['sate', 'daging', 'kacang', 'grilled'],
    stripe: 'stripe-blue',
    steps: [
      'Cut beef into 2 cm cubes; marinate with shallots, garlic, coriander, and kecap manis for 30 min.',
      'Thread onto bamboo skewers (3–4 pieces per skewer).',
      'Grill over charcoal, basting with kecap manis, until charred at edges.',
      'Make peanut sauce: blend roasted peanuts, chili, garlic, kecap, and lime.',
      'Serve satay with peanut sauce, lontong, and raw shallots.'
    ]
  },

  /* ─── SEAFOOD / IKAN ─────────────────────────────────── */
  {
    id: 'ikan-goreng',
    img: {
      src:   'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80',
      local: 'img/ikan-goreng.jpg',
      alt:   'Crispy deep fried fish ikan goreng'
    },
    name: 'Ikan Goreng Kuning',
    cost: 'Rp 16,000',
    priceRaw: 16000,
    time: '20 min',
    difficulty: 'Easy',
    cuisine: 'Indonesian',
    cities: ['Yogyakarta', 'Jakarta', 'Bali', 'Surabaya', 'Medan'],
    keywords: [
      'ikan', 'fish', 'goreng', 'fried', 'kunyit', 'turmeric',
      'bawang', 'garlic', 'shallot', 'jahe', 'ginger',
      'jeruk nipis', 'lime', 'garam', 'salt', 'minyak', 'oil',
      'lele', 'catfish', 'nila', 'tilapia', 'gurame'
    ],
    tags: ['ikan', 'goreng', 'kunyit', 'crispy'],
    stripe: 'stripe-teal',
    steps: [
      'Score the fish with 3 diagonal cuts on each side.',
      'Rub with a paste of turmeric, garlic, lime juice, and salt.',
      'Marinate 15 min to let spices penetrate.',
      'Fry in hot oil on medium heat until golden and cooked through.',
      'Drain and serve with sambal terasi and steamed rice.'
    ]
  },

  /* ─── STREET FOOD / BUDGET ────────────────────────────── */
  {
    id: 'gudeg-yogya',
    img: {
      src:   'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80',
      local: 'img/gudeg.jpg',
      alt:   'Nasi gudeg Yogyakarta served on a banana leaf'
    },
    name: 'Nasi Gudeg Yu Djum',
    cost: 'Rp 15,000',
    priceRaw: 15000,
    time: 'Ready to eat',
    difficulty: 'Dine-out',
    cuisine: 'Indonesian',
    cities: ['Yogyakarta'],
    keywords: [
      'gudeg', 'nangka', 'jackfruit', 'santan', 'coconut', 'krecek',
      'opor', 'nasi', 'rice', 'telur', 'egg', 'Jogja', 'Yogyakarta'
    ],
    tags: ['gudeg', 'Jogja', 'jackfruit', 'dine-out'],
    stripe: 'stripe-orange',
    steps: [
      'Head to Jl. Kaliurang KM 4.5, Yogyakarta.',
      'Order the standard "porsi" — rice, gudeg, krecek, and boiled egg.',
      'Pair with hot teh jahe for Rp 3,000.',
      'Arrive before 10 AM for the freshest batch.',
      'Take-away in banana-leaf wraps available.'
    ]
  },
  {
    id: 'angkringan',
    img: {
      src:   'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80',
      local: 'img/angkringan.jpg',
      alt:   'Indonesian angkringan street food cart at night'
    },
    name: 'Angkringan Lik Man',
    cost: 'Rp 10,000',
    priceRaw: 10000,
    time: 'Ready to eat',
    difficulty: 'Dine-out',
    cuisine: 'Indonesian',
    cities: ['Yogyakarta'],
    keywords: [
      'angkringan', 'nasi kucing', 'sate usus', 'tempe', 'tahu',
      'kopi joss', 'Tugu', 'street food', 'snack', 'Jogja', 'Yogyakarta'
    ],
    tags: ['angkringan', 'street food', 'Jogja', 'cheap'],
    stripe: 'stripe-teal',
    steps: [
      'Find Angkringan Lik Man next to Tugu Train Station.',
      'Pick 4–6 skewers from the cart (sate usus, tempe, tahu).',
      'Order nasi kucing for Rp 2,000 each.',
      'Pair with traditional kopi joss.',
      'Rp 10K–15K for a satisfying experience.'
    ]
  },
  {
    id: 'gado-gado',
    img: {
      src:   'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
      local: 'img/gado-gado.jpg',
      alt:   'Gado-gado Indonesian vegetable salad with peanut sauce'
    },
    name: 'Gado-Gado Segar',
    cost: 'Rp 18,000',
    priceRaw: 18000,
    time: 'Ready to eat',
    difficulty: 'Dine-out',
    cuisine: 'Indonesian',
    cities: ['Jakarta', 'Bandung', 'Surabaya'],
    keywords: [
      'gado', 'kacang', 'peanut', 'sayur', 'vegetable', 'tahu', 'tofu',
      'tempe', 'lontong', 'telur', 'egg', 'kangkung', 'tauge', 'bean sprouts',
      'kentang', 'potato', 'kerupuk', 'vegan'
    ],
    tags: ['gado-gado', 'kacang', 'vegan-option', 'salad'],
    stripe: 'stripe-teal',
    steps: [
      'Blanch kangkung, bean sprouts, and potato; arrange in a bowl.',
      'Add fried tofu, tempe, and lontong.',
      'Make peanut sauce: blend roasted peanuts, chili, garlic, kecap, and tamarind.',
      'Pour sauce over vegetables. Add a boiled egg.',
      'Top with emping crackers and fried shallots.'
    ]
  },
  {
    id: 'soto-betawi',
    img: {
      src:   'https://images.unsplash.com/photo-1569476942063-5c96dc30135b?auto=format&fit=crop&w=600&q=80',
      local: 'img/soto-betawi.jpg',
      alt:   'Soto Betawi Jakarta beef soup with coconut milk'
    },
    name: 'Soto Betawi Bu Haji',
    cost: 'Rp 25,000',
    priceRaw: 25000,
    time: 'Ready to eat',
    difficulty: 'Dine-out',
    cuisine: 'Indonesian',
    cities: ['Jakarta'],
    keywords: [
      'soto', 'betawi', 'daging', 'beef', 'santan', 'coconut milk',
      'kentang', 'potato', 'tomat', 'tomato', 'emping', 'Jakarta'
    ],
    tags: ['soto', 'daging', 'santan', 'Jakarta'],
    stripe: 'stripe-orange',
    steps: [
      'Visit the stall in Menteng, Central Jakarta.',
      'Order the "komplit" — beef, lung, potato, and coconut milk broth.',
      'Ask for extra emping crackers.',
      'Squeeze lime to cut the richness.',
      'Pair with es teh manis for Rp 5,000.'
    ]
  },

  /* ─── VEGAN / VEGETARIAN ─────────────────────────────── */
  {
    id: 'cap-cay',
    img: {
      src:   'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
      local: 'img/cap-cay.jpg',
      alt:   'Indonesian stir-fried vegetables cap cay'
    },
    name: 'Cap Cay Sayuran',
    cost: 'Rp 12,000',
    priceRaw: 12000,
    time: '20 min',
    difficulty: 'Easy',
    cuisine: 'Chinese',
    cities: ['Yogyakarta', 'Jakarta', 'Bandung', 'Surabaya', 'Medan'],
    keywords: [
      'cap cay', 'capcay', 'sayur', 'vegetable', 'wortel', 'carrot',
      'kubis', 'cabbage', 'kol', 'bunga kol', 'cauliflower', 'sawi', 'bok choy',
      'brokoli', 'broccoli', 'bawang', 'garlic', 'soy sauce', 'oyster sauce',
      'minyak', 'oil', 'vegan', 'maizena', 'cornstarch'
    ],
    tags: ['cap cay', 'sayur', 'Chinese', 'vegan'],
    stripe: 'stripe-teal',
    steps: [
      'Prepare vegetables: slice carrot, cabbage, bok choy, and cauliflower.',
      'Stir-fry garlic and shallots in hot oil until fragrant.',
      'Add harder vegetables (carrot, cauliflower) first; cook 3 min.',
      'Add remaining vegetables; season with oyster sauce, soy sauce, salt, pepper.',
      'Mix cornstarch with water; add to wok to thicken. Serve immediately.'
    ]
  },
  {
    id: 'urap-sayur',
    img: {
      src:   'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
      local: 'img/urap.jpg',
      alt:   'Urap Indonesian vegetables with spiced coconut'
    },
    name: 'Urap Sayur Kelapa',
    cost: 'Rp 8,000',
    priceRaw: 8000,
    time: '30 min',
    difficulty: 'Medium',
    cuisine: 'Indonesian',
    cities: ['Yogyakarta', 'Surabaya', 'Bali'],
    keywords: [
      'urap', 'kelapa', 'coconut', 'parut', 'grated', 'sayur', 'vegetable',
      'bayam', 'spinach', 'tauge', 'bean sprouts', 'kangkung',
      'kacang panjang', 'long beans', 'ketumbar', 'coriander',
      'bawang', 'shallot', 'cabai', 'chili', 'vegan'
    ],
    tags: ['urap', 'kelapa', 'vegan', 'Javanese'],
    stripe: 'stripe-blue',
    steps: [
      'Blanch mixed vegetables (spinach, bean sprouts, long beans) for 2 min; drain.',
      'Mix grated coconut with ground shallots, chili, kaffir lime leaf, and salt.',
      'Steam the coconut mixture briefly to cook the spices.',
      'Toss blanched vegetables with the spiced coconut.',
      'Serve at room temperature as a side with rice.'
    ]
  }
];

/* ─────────────────────────────────────────────────────────
   DERIVED VIEWS — built from ALL_RECIPES for backward
   compatibility with budget-mode city filtering.
───────────────────────────────────────────────────────── */

/** All recipes that can be cooked at home (fridge mode pool) */
const RECIPES_FRIDGE = ALL_RECIPES.filter(function(r) {
  return r.difficulty !== 'Dine-out';
});

/**
 * RECIPES_BUDGET — keyed by city; contains every recipe
 * marked as available in that city (dine-out or cookable).
 */
const RECIPES_BUDGET = (function() {
  var map = {};
  CITIES.forEach(function(city) {
    map[city] = ALL_RECIPES.filter(function(r) {
      return r.cities.indexOf(city) !== -1;
    });
  });
  return map;
}());
