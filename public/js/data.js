// PlateShare — Realistic Initial Seed Data and LocalStorage Manager
// Grounded in real-world examples specified in PlateShare_Implementation_Guide.md

const INITIAL_DONATIONS = [
  {
    id: 'ps-101',
    title: 'Vegetarian Thali – 120 meals',
    foodType: 'Vegetarian',
    category: 'Cooked meal',
    quantity: 120,
    unit: 'meals',
    // Safe: expires in ~2 hours 15 mins
    prepTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    expiryTime: new Date(Date.now() + 135 * 60 * 1000).toISOString(),
    storageMethod: 'Insulated hot containers at >65°C',
    allergens: 'Contains dairy (ghee/paneer). No peanuts, no onion/garlic options separate.',
    packagingTime: 'Packed 30 min ago in eco-foil containers',
    pickupInstructions: 'Use service gate 3 near loading dock. Ask for Raj at banquet kitchen.',
    location: {
      name: 'Grand Hyatt Convention Center',
      address: 'Plot 4, Bandra Kurla Complex, Mumbai',
      lat: 19.0657,
      lng: 72.8687
    },
    distance: '1.4 km away',
    donor: {
      name: 'Executive Chef Rajendra',
      organization: 'Grand Hyatt Banquet Hall',
      phone: '+91 98201 44521'
    },
    claimedBy: null,
    otp: '4892',
    visibility: 'ngo', // 'ngo' or 'community'
    status: 'posted', // 'posted', 'claimed', 'picked_up', 'delivered', 'served'
    currentStep: 1,
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ps-102',
    title: 'Paneer Butter Masala with 90 Tandoori Rotis',
    foodType: 'Vegetarian',
    category: 'Cooked meal',
    quantity: 90,
    unit: 'meals',
    // Urgent: expires in ~50 minutes
    prepTime: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    expiryTime: new Date(Date.now() + 50 * 60 * 1000).toISOString(),
    storageMethod: 'Thermal food warmers',
    allergens: 'Contains cashews and dairy.',
    packagingTime: 'Packed 45 mins ago',
    pickupInstructions: 'Kitchen entrance via rear alley. Call chef directly on arrival.',
    location: {
      name: 'Spice Route Fine Dining',
      address: '14 Linking Road, Santacruz West',
      lat: 19.0822,
      lng: 72.8415
    },
    distance: '2.1 km away',
    donor: {
      name: 'Chef Anil Mehra',
      organization: 'Spice Route Bistro',
      phone: '+91 98112 33412'
    },
    claimedBy: null,
    otp: '7315',
    visibility: 'ngo',
    status: 'posted',
    currentStep: 1,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ps-103',
    title: 'Fresh Bakery Breads, Buns & Muffins – 60 packs',
    foodType: 'Vegetarian',
    category: 'Bakery',
    quantity: 60,
    unit: 'pieces',
    // Safe: expires in ~4 hours
    prepTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    expiryTime: new Date(Date.now() + 240 * 60 * 1000).toISOString(),
    storageMethod: 'Dry ambient cooling rack, sealed bakery paper bags',
    allergens: 'Gluten (wheat). Eggs present in muffins.',
    packagingTime: 'Freshly baked today at 4 PM',
    pickupInstructions: 'Front counter. Tell staff you are here for the PlateShare community food pickup.',
    location: {
      name: 'Artisan Sourdough & Patisserie',
      address: 'Shop 8, Hill Road, Bandra West',
      lat: 19.0553,
      lng: 72.8295
    },
    distance: '0.9 km away',
    donor: {
      name: 'Sarah Dsouza',
      organization: 'Artisan Sourdough Bakery',
      phone: '+91 97690 12894'
    },
    claimedBy: null,
    otp: '2941',
    visibility: 'community',
    status: 'posted',
    currentStep: 1,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ps-104',
    title: 'Dum Vegetable Biryani Handi – 80 meals',
    foodType: 'Vegetarian',
    category: 'Cooked meal',
    quantity: 80,
    unit: 'meals',
    // Critical: expires in ~20 minutes!
    prepTime: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
    expiryTime: new Date(Date.now() + 22 * 60 * 1000).toISOString(),
    storageMethod: 'Sealed metal handi with live charcoal lid removed',
    allergens: 'Dairy (ghee), saffron, whole spices.',
    packagingTime: 'Sealed 2 hours ago',
    pickupInstructions: 'Come to dispatch gate B. Quick drive-through pickup ready.',
    location: {
      name: 'Royal Heritage Wedding Hall',
      address: '22 SV Road, Khar West',
      lat: 19.0711,
      lng: 72.8361
    },
    distance: '3.2 km away',
    donor: {
      name: 'Catering Manager Vikram',
      organization: 'Royal Heritage Banquets',
      phone: '+91 99203 77199'
    },
    claimedBy: null,
    otp: '9183',
    visibility: 'ngo',
    status: 'posted',
    currentStep: 1,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ps-105',
    title: 'South Indian Idli, Vada & Sambar – 55 meals',
    foodType: 'Vegetarian',
    category: 'Cooked meal',
    quantity: 55,
    unit: 'meals',
    // Claimed donation in transit
    prepTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    expiryTime: new Date(Date.now() + 110 * 60 * 1000).toISOString(),
    storageMethod: 'Insulated steel urns for sambar, foil trays for idlis',
    allergens: 'Mustard seeds in sambar. Gluten in medu vada.',
    packagingTime: 'Packed 50 mins ago',
    pickupInstructions: 'Front reception. Handover to Robin Hood Army team.',
    location: {
      name: 'Dakshin Bhavan Catering',
      address: '102 Matunga Circle, Mumbai',
      lat: 19.0270,
      lng: 72.8557
    },
    distance: '4.1 km away',
    donor: {
      name: 'Murugan Iyer',
      organization: 'Dakshin Bhavan',
      phone: '+91 98401 55210'
    },
    claimedBy: {
      name: 'Pooja Sharma',
      ngoName: 'Robin Hood Army - Central Chapter',
      phone: '+91 98200 11984',
      claimedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
    },
    otp: '6204',
    visibility: 'ngo',
    status: 'claimed',
    currentStep: 2, // 1: Posted, 2: Claimed, 3: Picked Up, 4: Delivered, 5: Served
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80'
  }
];

const PRESET_PHOTOS = [
  { label: 'Vegetarian Thali / Meal Box', url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80' },
  { label: 'Curry & Rice / Bread', url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80' },
  { label: 'Biryani / Pulao', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80' },
  { label: 'Bakery & Bread Packs', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80' },
  { label: 'Idli / Dosa / South Indian', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80' },
  { label: 'Fresh Fruits & Produce', url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80' }
];

// Data Store Manager
const PlateStore = {
  STORAGE_KEY: 'plateshare_donations_v1',
  USER_KEY: 'plateshare_user_v1',

  getDonations() {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) {
      this.saveDonations(INITIAL_DONATIONS);
      return INITIAL_DONATIONS;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      return INITIAL_DONATIONS;
    }
  },

  saveDonations(list) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
  },

  getDonationById(id) {
    const list = this.getDonations();
    return list.find(d => d.id === id);
  },

  addDonation(donation) {
    const list = this.getDonations();
    list.unshift(donation);
    this.saveDonations(list);
    return donation;
  },

  updateDonation(id, updates) {
    const list = this.getDonations();
    const idx = list.findIndex(d => d.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      this.saveDonations(list);
      return list[idx];
    }
    return null;
  },

  getCurrentUser() {
    const raw = localStorage.getItem(this.USER_KEY);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    return {
      role: 'visitor', // 'visitor', 'donor', 'ngo', 'community'
      name: 'Guest',
      org: 'Visitor',
      email: '',
      isLoggedIn: false
    };
  },

  setCurrentUser(user) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  },

  clearOrderHistory() {
    const list = this.getDonations();
    // Keep only active unreserved items
    const remaining = list.filter(d => d.status === 'posted');
    this.saveDonations(remaining);
    return remaining;
  },

  REVIEWS_KEY: 'plateshare_reviews_v1',

  getReviews(restaurantName) {
    const raw = localStorage.getItem(this.REVIEWS_KEY);
    let allReviews = [];
    if (raw) {
      try { allReviews = JSON.parse(raw); } catch (e) { allReviews = DEFAULT_REVIEWS; }
    } else {
      allReviews = DEFAULT_REVIEWS;
      this.saveReviews(allReviews);
    }
    if (restaurantName) {
      const target = restaurantName.toLowerCase().trim();
      const filtered = allReviews.filter(r => r.restaurant.toLowerCase().includes(target) || target.includes(r.restaurant.toLowerCase()));
      return filtered.length > 0 ? filtered : allReviews.slice(0, 3);
    }
    return allReviews;
  },

  saveReviews(reviews) {
    localStorage.setItem(this.REVIEWS_KEY, JSON.stringify(reviews));
  },

  addReview(review) {
    const reviews = this.getReviews();
    reviews.unshift(review);
    this.saveReviews(reviews);
    return review;
  },

  BOOKMARKS_KEY: 'plateshare_hotel_bookmarks_v1',

  getBookmarkedHotels() {
    const raw = localStorage.getItem(this.BOOKMARKS_KEY);
    if (!raw) return ['rest-1', 'rest-5']; // Default saved hotels for demo delight
    try { return JSON.parse(raw); } catch (e) { return ['rest-1', 'rest-5']; }
  },

  toggleHotelBookmark(hotelId) {
    let saved = this.getBookmarkedHotels();
    if (saved.includes(hotelId)) {
      saved = saved.filter(id => id !== hotelId);
    } else {
      saved.push(hotelId);
    }
    localStorage.setItem(this.BOOKMARKS_KEY, JSON.stringify(saved));
    return saved.includes(hotelId);
  },

  resetDefaults() {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.REVIEWS_KEY);
    localStorage.removeItem(this.BOOKMARKS_KEY);
    return this.getDonations();
  }
};

const DEFAULT_REVIEWS = [
  {
    id: 'rev-1',
    restaurant: 'Grand Hyatt Banquet Hall',
    donorOrg: 'Grand Hyatt Banquet Hall',
    reviewerName: 'Pooja Sharma',
    reviewerType: 'ngo',
    reviewerOrg: 'Robin Hood Army (Central Chapter)',
    rating: 5,
    date: 'Yesterday, 8:45 PM',
    comment: 'Exceptional food quality and packaging! The vegetarian thalis were still piping hot upon pickup and fed over 120 individuals at our Dharavi shelter safely.',
    foodTag: 'Hot Vegetarian Meals',
    verifiedRescue: true
  },
  {
    id: 'rev-2',
    restaurant: 'Grand Hyatt Convention Banquet',
    donorOrg: 'Grand Hyatt Banquet Hall',
    reviewerName: 'Arjun Nair',
    reviewerType: 'community',
    reviewerOrg: 'Kalanagar Community Kitchen',
    rating: 5,
    date: '2 days ago',
    comment: 'Flawless zero-delay pickup. Staff had temperature logs and allergen tags ready as per FSSAI safety norms. The meals were fresh and deeply appreciated!',
    foodTag: 'Cooked Meals',
    verifiedRescue: true
  },
  {
    id: 'rev-3',
    restaurant: 'Spice Route Fine Dining',
    donorOrg: 'Spice Route Bistro',
    reviewerName: 'Sister Teresa Shelter',
    reviewerType: 'ngo',
    reviewerOrg: 'Sister Teresa Hope Mission',
    rating: 5,
    date: '3 days ago',
    comment: 'The paneer butter masala and rotis were packed in insulated food warmers. Highest quality standards we have experienced on PlateShare.',
    foodTag: 'Paneer Masala & Rotis',
    verifiedRescue: true
  },
  {
    id: 'rev-4',
    restaurant: 'Artisan Sourdough Bakery',
    donorOrg: 'Artisan Sourdough Bakery',
    reviewerName: 'Mohammad Farooq',
    reviewerType: 'community',
    reviewerOrg: 'Bandra Youth Foundation',
    rating: 5,
    date: 'Sep 8, 2026',
    comment: 'Freshly baked breads and muffins were packaged cleanly in dry bakery bags. Great contribution to evening community tea distribution.',
    foodTag: 'Fresh Bakery Items',
    verifiedRescue: true
  },
  {
    id: 'rev-5',
    restaurant: 'Royal Heritage Banquets',
    donorOrg: 'Royal Heritage Banquets',
    reviewerName: 'Feeding From Far NGO',
    reviewerType: 'ngo',
    reviewerOrg: 'Feeding From Far',
    rating: 4,
    date: 'Sep 6, 2026',
    comment: 'Handled 80 meals of dum biryani seamlessly via loading gate B. Very swift dispatch process with instant OTP verification.',
    foodTag: 'Vegetable Biryani',
    verifiedRescue: true
  }
];

// Verified Activity Badge Roadmap: 5 Levels of Food Rescue Recognition
const BADGE_ROADMAP = [
  {
    level: 1,
    id: 'badge-lvl-1',
    name: 'Starter Rescue',
    badgeTitle: 'Starter',
    iconType: 'medal-bronze',
    iconText: '3',
    iconClass: 'fa-solid fa-medal',
    iconColor: '#c27803',
    ribbonBg: '#3b82f6',
    ribbonColor: '#ffffff',
    targetMeals: 10,
    unit: 'Verified Meals',
    tierBadgeColor: '#059669',
    tierBadgeBg: '#d1fae5',
    cardBg: '#faf8f2',
    border: '1.5px solid #fde68a',
    unlocked: true,
    desc: 'Awarded upon successfully completing and distributing your first 10 NGO-verified meals.'
  },
  {
    level: 2,
    id: 'badge-lvl-2',
    name: 'Food Saver',
    badgeTitle: 'Food Saver',
    iconType: 'medal-silver',
    iconText: '2',
    iconClass: 'fa-solid fa-medal',
    iconColor: '#9333ea',
    ribbonBg: '#3b82f6',
    ribbonColor: '#ffffff',
    targetMeals: 50,
    unit: 'Verified Meals',
    tierBadgeColor: '#059669',
    tierBadgeBg: '#d1fae5',
    cardBg: '#faf8f2',
    border: '1.5px solid #fde68a',
    unlocked: true,
    desc: 'Awarded for surpassing 50 verified rescued meals with consistent packaging and timely handover.'
  },
  {
    level: 3,
    id: 'badge-lvl-3',
    name: 'Food Hero',
    badgeTitle: 'Food Hero',
    iconType: 'medal-gold',
    iconText: '1',
    iconClass: 'fa-solid fa-medal',
    iconColor: '#ea580c',
    ribbonBg: '#3b82f6',
    ribbonColor: '#ffffff',
    targetMeals: 250,
    unit: 'Verified Meals',
    tierBadgeColor: '#059669',
    tierBadgeBg: '#d1fae5',
    cardBg: '#faf8f2',
    border: '1.5px solid #fde68a',
    unlocked: true,
    desc: 'Awarded for rescuing over 250 surplus meals to community shelters with full temperature compliance.'
  },
  {
    level: 4,
    id: 'badge-lvl-4',
    name: 'Community Champion',
    badgeTitle: 'Community Champion',
    iconType: 'diamond',
    iconClass: 'fa-solid fa-gem',
    iconColor: '#93c5fd',
    targetMeals: 1000,
    currentMeals: 587,
    unit: 'Verified Meals',
    tierBadgeColor: '#0d9488',
    tierBadgeBg: '#ccfbf1',
    cardBg: '#ffffff',
    border: '1.5px solid #e2e8f0',
    unlocked: false,
    desc: 'Diverted 1,000+ meals. Recognizes premier kitchens powering weekly feeding networks.'
  },
  {
    level: 5,
    id: 'badge-lvl-5',
    name: 'PlateShare Legend',
    badgeTitle: 'PlateShare Legend',
    iconType: 'trophy',
    iconClass: 'fa-solid fa-trophy',
    iconColor: '#a8a29e',
    targetMeals: 5000,
    currentMeals: 587,
    unit: 'Verified Meals',
    tierBadgeColor: '#78716c',
    tierBadgeBg: '#f5f5f4',
    cardBg: '#ffffff',
    border: '1.5px solid #e2e8f0',
    unlocked: false,
    desc: 'The pinnacle of food rescue: 5,000+ meals saved from waste, preventing over 5 tons of CO₂.'
  }
];

// Enterprise & Business Profile Recognition
const RESTAURANT_AWARDS = [
  {
    id: 'rest-1',
    name: 'The Taj Lands End & Seafront Banquets',
    category: 'Luxury Hotel & Banquets',
    categoryKey: 'luxury',
    location: 'BJ Road, Bandstand, Bandra West, Mumbai',
    cityArea: 'Bandra West',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    currentMeals: 5420,
    highestBadge: 'PlateShare Legend',
    highestBadgeLevel: 5,
    stats: {
      mealsRescued: 5420,
      kgSaved: 2439,
      co2Prevented: '6.1 Tons',
      activeMonths: 18
    },
    tier: 'Level 5 · PlateShare Legend',
    tierColor: '#b45309',
    tierBg: '#fef3c7',
    rating: 4.98,
    reviewCount: 56,
    fssaiRating: 'Grade A+ (100% Passed)',
    quote: 'The banquet staff maintains pristine cold-chain packing. Fed over 650 children across Mumbai rehabilitation centers with five-star nutritional meals.',
    reviewerOrg: 'Robin Hood Army & Roti Bank',
    badges: [
      { id: 'b1', name: 'Starter Rescue (L1)', icon: 'fa-medal', desc: '10 Meals verified', color: '#c27803' },
      { id: 'b2', name: 'Food Saver (L2)', icon: 'fa-medal', desc: '50 Meals verified', color: '#9333ea' },
      { id: 'b3', name: 'Food Hero (L3)', icon: 'fa-medal', desc: '250 Meals verified', color: '#ea580c' },
      { id: 'b4', name: 'Community Champion (L4)', icon: 'fa-gem', desc: '1,000+ Meals verified', color: '#0284c7' },
      { id: 'b5', name: 'PlateShare Legend (L5)', icon: 'fa-trophy', desc: '5,000+ Meals verified', color: '#b45309' }
    ],
    certificate: {
      id: 'CERT-PS-2026-0999',
      title: 'Level 5 PlateShare Legend Accreditation',
      issuer: 'PlateShare Global Zero-Waste Council',
      issueDate: 'August 30, 2026',
      validUntil: 'August 2027',
      level: 'Level 5 Pinnacle Honors'
    }
  },
  {
    id: 'rest-2',
    name: 'Grand Hyatt Banquet Hall',
    category: 'Luxury Hotel & Banquets',
    categoryKey: 'luxury',
    location: 'Bandra Kurla Complex (BKC), Mumbai',
    cityArea: 'BKC',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    currentMeals: 4850,
    highestBadge: 'Community Champion',
    highestBadgeLevel: 4,
    stats: {
      mealsRescued: 4850,
      kgSaved: 2182,
      co2Prevented: '5.4 Tons',
      activeMonths: 14
    },
    tier: 'Level 4 · Community Champion',
    tierColor: '#0284c7',
    tierBg: '#e0f2fe',
    rating: 4.90,
    reviewCount: 38,
    fssaiRating: 'Grade A+ (100% Passed)',
    quote: 'Always hot, perfectly insulated in food-grade thermo-packs. Their immediate OTP dispatch ensures safe handover in under 15 minutes.',
    reviewerOrg: 'Kalanagar Outreach Shelter',
    badges: [
      { id: 'b1', name: 'Starter Rescue (L1)', icon: 'fa-medal', desc: '10 Meals verified', color: '#c27803' },
      { id: 'b2', name: 'Food Saver (L2)', icon: 'fa-medal', desc: '50 Meals verified', color: '#9333ea' },
      { id: 'b3', name: 'Food Hero (L3)', icon: 'fa-medal', desc: '250 Meals verified', color: '#ea580c' },
      { id: 'b4', name: 'Community Champion (L4)', icon: 'fa-gem', desc: '1,000+ Meals verified', color: '#0284c7' }
    ],
    certificate: {
      id: 'CERT-PS-2026-0891',
      title: 'Level 4 Community Champion Certificate',
      issuer: 'PlateShare & Food Rescue Alliance',
      issueDate: 'August 15, 2026',
      validUntil: 'August 2027',
      level: 'Level 4 Champion Accreditation'
    }
  },
  {
    id: 'rest-3',
    name: 'The Oberoi Trident Marine Pavilion',
    category: 'Luxury Hotel & Banquets',
    categoryKey: 'luxury',
    location: 'Nariman Point, Marine Drive, Mumbai',
    cityArea: 'Marine Drive',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
    currentMeals: 6120,
    highestBadge: 'PlateShare Legend',
    highestBadgeLevel: 5,
    stats: {
      mealsRescued: 6120,
      kgSaved: 2754,
      co2Prevented: '6.9 Tons',
      activeMonths: 20
    },
    tier: 'Level 5 · PlateShare Legend',
    tierColor: '#b45309',
    tierBg: '#fef3c7',
    rating: 4.97,
    reviewCount: 64,
    fssaiRating: 'Grade A+ (100% Passed)',
    quote: 'Setting the gold benchmark for hotel surplus food donation. Every batch includes dietary labels, reheating guidance, and allergen lists.',
    reviewerOrg: 'Seva Kitchen Foundation',
    badges: [
      { id: 'b1', name: 'Starter Rescue (L1)', icon: 'fa-medal', desc: '10 Meals verified', color: '#c27803' },
      { id: 'b2', name: 'Food Saver (L2)', icon: 'fa-medal', desc: '50 Meals verified', color: '#9333ea' },
      { id: 'b3', name: 'Food Hero (L3)', icon: 'fa-medal', desc: '250 Meals verified', color: '#ea580c' },
      { id: 'b4', name: 'Community Champion (L4)', icon: 'fa-gem', desc: '1,000+ Meals verified', color: '#0284c7' },
      { id: 'b5', name: 'PlateShare Legend (L5)', icon: 'fa-trophy', desc: '5,000+ Meals verified', color: '#b45309' }
    ],
    certificate: {
      id: 'CERT-PS-2026-0920',
      title: 'Level 5 Pinnacle Food Stewardship Honors',
      issuer: 'PlateShare Board of Governors',
      issueDate: 'August 1, 2026',
      validUntil: 'August 2027',
      level: 'Level 5 Pinnacle Honors'
    }
  },
  {
    id: 'rest-4',
    name: 'Spice Route Fine Dining',
    category: 'Fine Dining & Restos',
    categoryKey: 'finedining',
    location: '14 Linking Road, Santacruz West, Mumbai',
    cityArea: 'Santacruz West',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    currentMeals: 2940,
    highestBadge: 'Community Champion',
    highestBadgeLevel: 4,
    stats: {
      mealsRescued: 2940,
      kgSaved: 1323,
      co2Prevented: '3.2 Tons',
      activeMonths: 9
    },
    tier: 'Level 4 · Community Champion',
    tierColor: '#0284c7',
    tierBg: '#e0f2fe',
    rating: 4.92,
    reviewCount: 26,
    fssaiRating: 'Grade A+ (100% Passed)',
    quote: 'Top tier biryani and paneer gravies packed fresh right after dinner service. Truly respectful feeding for our youth shelters.',
    reviewerOrg: 'Feeding India Fellowship',
    badges: [
      { id: 'b1', name: 'Starter Rescue (L1)', icon: 'fa-medal', desc: '10 Meals verified', color: '#c27803' },
      { id: 'b2', name: 'Food Saver (L2)', icon: 'fa-medal', desc: '50 Meals verified', color: '#9333ea' },
      { id: 'b3', name: 'Food Hero (L3)', icon: 'fa-medal', desc: '250 Meals verified', color: '#ea580c' },
      { id: 'b4', name: 'Community Champion (L4)', icon: 'fa-gem', desc: '1,000+ Meals verified', color: '#0284c7' }
    ],
    certificate: {
      id: 'CERT-PS-2026-0742',
      title: 'Level 4 Sustainable Food Recovery Honors',
      issuer: 'PlateShare Sustainability Board',
      issueDate: 'July 1, 2026',
      validUntil: 'July 2027',
      level: 'Level 4 Champion Accreditation'
    }
  },
  {
    id: 'rest-5',
    name: 'Bombay Canteen & Regional Kitchen',
    category: 'Fine Dining & Restos',
    categoryKey: 'finedining',
    location: 'Kamala Mills Compound, Lower Parel, Mumbai',
    cityArea: 'Lower Parel',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    currentMeals: 480,
    highestBadge: 'Food Hero',
    highestBadgeLevel: 3,
    stats: {
      mealsRescued: 480,
      kgSaved: 216,
      co2Prevented: '0.6 Tons',
      activeMonths: 4
    },
    tier: 'Level 3 · Food Hero',
    tierColor: '#ea580c',
    tierBg: '#ffedd5',
    rating: 4.87,
    reviewCount: 22,
    fssaiRating: 'Grade A (100% Passed)',
    quote: 'Chef-curated surplus meal kits with exceptional ingredients. Volunteers love picking up from their dedicated back-dock dispatch team.',
    reviewerOrg: 'Annamrita Foundation',
    badges: [
      { id: 'b1', name: 'Starter Rescue (L1)', icon: 'fa-medal', desc: '10 Meals verified', color: '#c27803' },
      { id: 'b2', name: 'Food Saver (L2)', icon: 'fa-medal', desc: '50 Meals verified', color: '#9333ea' },
      { id: 'b3', name: 'Food Hero (L3)', icon: 'fa-medal', desc: '250 Meals verified', color: '#ea580c' }
    ],
    certificate: {
      id: 'CERT-PS-2026-0419',
      title: 'Level 3 Food Hero Certificate',
      issuer: 'PlateShare Culinary Alliance',
      issueDate: 'April 19, 2026',
      validUntil: 'April 2027',
      level: 'Level 3 Hero Certification'
    }
  },
  {
    id: 'rest-6',
    name: 'Artisan Sourdough & Patisserie',
    category: 'Cafes & Bakeries',
    categoryKey: 'cafe',
    location: 'Hill Road, Bandra West, Mumbai',
    cityArea: 'Bandra West',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    currentMeals: 1680,
    highestBadge: 'Community Champion',
    highestBadgeLevel: 4,
    stats: {
      mealsRescued: 1680,
      kgSaved: 756,
      co2Prevented: '1.8 Tons',
      activeMonths: 6
    },
    tier: 'Level 4 · Community Champion',
    tierColor: '#0284c7',
    tierBg: '#e0f2fe',
    rating: 4.88,
    reviewCount: 19,
    fssaiRating: 'Grade A+ (100% Passed)',
    quote: 'Daily surplus artisan breads, buns, and quiches. Freshly baked with pure butter, nourishing dozens of children in nearby orphanages.',
    reviewerOrg: 'St. Jude Child Care Center',
    badges: [
      { id: 'b1', name: 'Starter Rescue (L1)', icon: 'fa-medal', desc: '10 Meals verified', color: '#c27803' },
      { id: 'b2', name: 'Food Saver (L2)', icon: 'fa-medal', desc: '50 Meals verified', color: '#9333ea' },
      { id: 'b3', name: 'Food Hero (L3)', icon: 'fa-medal', desc: '250 Meals verified', color: '#ea580c' },
      { id: 'b4', name: 'Community Champion (L4)', icon: 'fa-gem', desc: '1,000+ Meals verified', color: '#0284c7' }
    ],
    certificate: {
      id: 'CERT-PS-2026-0610',
      title: 'Level 4 Community Nutrition Certificate',
      issuer: 'PlateShare Metro Initiative',
      issueDate: 'June 10, 2026',
      validUntil: 'June 2027',
      level: 'Level 4 Champion Accreditation'
    }
  },
  {
    id: 'rest-7',
    name: 'Blue Tokai Roasters & Fresh Kitchen',
    category: 'Cafes & Bakeries',
    categoryKey: 'cafe',
    location: 'Perry Cross Road, Bandra West, Mumbai',
    cityArea: 'Bandra West',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    currentMeals: 85,
    highestBadge: 'Food Saver',
    highestBadgeLevel: 2,
    stats: {
      mealsRescued: 85,
      kgSaved: 38,
      co2Prevented: '0.1 Tons',
      activeMonths: 2
    },
    tier: 'Level 2 · Food Saver',
    tierColor: '#9333ea',
    tierBg: '#f3e8ff',
    rating: 4.80,
    reviewCount: 14,
    fssaiRating: 'Grade A (100% Passed)',
    quote: 'Wraps, cold-pressed juices, and fresh paninis are sealed hygienically in kraft paper packs every evening. Swift seamless pickup.',
    reviewerOrg: 'Bandra Youth Solidarity',
    badges: [
      { id: 'b1', name: 'Starter Rescue (L1)', icon: 'fa-medal', desc: '10 Meals verified', color: '#c27803' },
      { id: 'b2', name: 'Food Saver (L2)', icon: 'fa-medal', desc: '50 Meals verified', color: '#9333ea' }
    ],
    certificate: {
      id: 'CERT-PS-2026-0215',
      title: 'Level 2 Food Saver Recognition',
      issuer: 'PlateShare Urban Cafe Guild',
      issueDate: 'February 15, 2026',
      validUntil: 'February 2027',
      level: 'Level 2 Food Saver Tier'
    }
  },
  {
    id: 'rest-8',
    name: 'Royal Heritage Wedding Banquets',
    category: 'Luxury Hotel & Banquets',
    categoryKey: 'luxury',
    location: 'SV Road, Khar West, Mumbai',
    cityArea: 'Khar West',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    currentMeals: 3620,
    highestBadge: 'Community Champion',
    highestBadgeLevel: 4,
    stats: {
      mealsRescued: 3620,
      kgSaved: 1629,
      co2Prevented: '4.1 Tons',
      activeMonths: 11
    },
    tier: 'Level 4 · Community Champion',
    tierColor: '#0284c7',
    tierBg: '#e0f2fe',
    rating: 4.85,
    reviewCount: 31,
    fssaiRating: 'Grade A+ (100% Passed)',
    quote: 'Massive wedding surplus handled with surgical precision. Saves over 200kg of royal feasts from landfill disposal every weekend.',
    reviewerOrg: 'Khar Community Relief Hub',
    badges: [
      { id: 'b1', name: 'Starter Rescue (L1)', icon: 'fa-medal', desc: '10 Meals verified', color: '#c27803' },
      { id: 'b2', name: 'Food Saver (L2)', icon: 'fa-medal', desc: '50 Meals verified', color: '#9333ea' },
      { id: 'b3', name: 'Food Hero (L3)', icon: 'fa-medal', desc: '250 Meals verified', color: '#ea580c' },
      { id: 'b4', name: 'Community Champion (L4)', icon: 'fa-gem', desc: '1,000+ Meals verified', color: '#0284c7' }
    ],
    certificate: {
      id: 'CERT-PS-2026-0524',
      title: 'Level 4 Large-Scale Banquet Preservation Honors',
      issuer: 'National Food Recovery Network & PlateShare',
      issueDate: 'May 20, 2026',
      validUntil: 'May 2027',
      level: 'Level 4 Champion Accreditation'
    }
  },
  {
    id: 'rest-9',
    name: 'Green Earth Zero-Waste Organic Bistro',
    category: 'Zero-Waste & Organic',
    categoryKey: 'zerowaste',
    location: '12th Road, Khar West, Mumbai',
    cityArea: 'Khar West',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    currentMeals: 340,
    highestBadge: 'Food Hero',
    highestBadgeLevel: 3,
    stats: {
      mealsRescued: 340,
      kgSaved: 153,
      co2Prevented: '0.4 Tons',
      activeMonths: 3
    },
    tier: 'Level 3 · Food Hero',
    tierColor: '#ea580c',
    tierBg: '#ffedd5',
    rating: 4.93,
    reviewCount: 20,
    fssaiRating: 'Grade A+ (100% Passed)',
    quote: 'Pure farm-to-table organic food. 100% biodegradable packaging with compostable seals. A beacon of modern sustainable hospitality.',
    reviewerOrg: 'EcoLife Mumbai Action',
    badges: [
      { id: 'b1', name: 'Starter Rescue (L1)', icon: 'fa-medal', desc: '10 Meals verified', color: '#c27803' },
      { id: 'b2', name: 'Food Saver (L2)', icon: 'fa-medal', desc: '50 Meals verified', color: '#9333ea' },
      { id: 'b3', name: 'Food Hero (L3)', icon: 'fa-medal', desc: '250 Meals verified', color: '#ea580c' }
    ],
    certificate: {
      id: 'CERT-PS-2026-0312',
      title: 'Level 3 Zero-Waste Culinary Honors',
      issuer: 'Organic Food Alliance & PlateShare',
      issueDate: 'March 12, 2026',
      validUntil: 'March 2027',
      level: 'Level 3 Hero Certification'
    }
  },
  {
    id: 'rest-10',
    name: 'The Daily Neighborhood Deli',
    category: 'Cafes & Bakeries',
    categoryKey: 'cafe',
    location: 'Pali Hill, Bandra West, Mumbai',
    cityArea: 'Bandra West',
    image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80',
    currentMeals: 18,
    highestBadge: 'Starter Rescue',
    highestBadgeLevel: 1,
    stats: {
      mealsRescued: 18,
      kgSaved: 8,
      co2Prevented: '0.02 Tons',
      activeMonths: 1
    },
    tier: 'Level 1 · Starter Rescue',
    tierColor: '#c27803',
    tierBg: '#fef3c7',
    rating: 4.76,
    reviewCount: 8,
    fssaiRating: 'Grade A (100% Passed)',
    quote: 'Newly onboarded kitchen making prompt evening donations of fresh soups, salads, and focaccia. Very polite kitchen crew!',
    reviewerOrg: 'Pali Hill Community Care',
    badges: [
      { id: 'b1', name: 'Starter Rescue (L1)', icon: 'fa-medal', desc: '10 Meals verified', color: '#c27803' }
    ],
    certificate: {
      id: 'CERT-PS-2026-0104',
      title: 'Level 1 Starter Rescue Onboarding Certificate',
      issuer: 'PlateShare Local Community Onboarding',
      issueDate: 'January 4, 2026',
      validUntil: 'January 2027',
      level: 'Level 1 Starter Accreditation'
    }
  }
];
