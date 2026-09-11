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

  resetDefaults() {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.REVIEWS_KEY);
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

// Restaurant Food Rescue Badges & Certificates Data
const RESTAURANT_AWARDS = [
  {
    id: 'rest-1',
    name: 'Grand Hyatt Banquet Hall',
    category: 'Luxury Hotel & Convention Center',
    location: 'Bandra Kurla Complex, Mumbai',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    stats: {
      mealsRescued: 4850,
      kgSaved: 2182,
      co2Prevented: '5.4 Tons',
      activeMonths: 14
    },
    tier: 'Platinum Champion',
    tierColor: '#4338ca',
    tierBg: '#e0e7ff',
    rating: 4.9,
    reviewCount: 38,
    badges: [
      { id: 'b1', name: 'Zero Waste Star', icon: 'fa-star', desc: 'Over 4,000 meals rescued without a single incident', color: '#eab308' },
      { id: 'b2', name: 'Rapid Dispatch', icon: 'fa-bolt', desc: 'Average pickup coordination under 18 minutes', color: '#3b82f6' },
      { id: 'b3', name: 'FSSAI Gold Standard', icon: 'fa-shield-halved', desc: '100% compliant food safety temperature logging', color: '#16a34a' },
      { id: 'b4', name: 'Hunger Hero', icon: 'fa-medal', desc: 'Supported 12+ partner NGOs and community shelters', color: '#a855f7' }
    ],
    certificate: {
      id: 'CERT-PS-2026-0891',
      title: 'Certified Zero-Food-Waste Champion',
      issuer: 'PlateShare & Food Rescue Alliance',
      issueDate: 'August 15, 2026',
      validUntil: 'August 2027',
      level: 'Platinum Grade Accreditation'
    }
  },
  {
    id: 'rest-2',
    name: 'Spice Route Fine Dining',
    category: 'Fine Dining & Banquet',
    location: 'Santacruz West, Mumbai',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    stats: {
      mealsRescued: 2940,
      kgSaved: 1323,
      co2Prevented: '3.2 Tons',
      activeMonths: 9
    },
    tier: 'Gold Guardian',
    tierColor: '#b45309',
    tierBg: '#fef3c7',
    rating: 4.95,
    reviewCount: 26,
    badges: [
      { id: 'b1', name: 'Gold Guardian', icon: 'fa-award', desc: 'Surpassed 2,500 safely distributed surplus meals', color: '#d97706' },
      { id: 'b2', name: 'Thermal Master', icon: 'fa-fire-flame-curved', desc: 'Consistently maintains hot food chain above 65°C', color: '#ef4444' },
      { id: 'b3', name: 'Community Pillar', icon: 'fa-heart', desc: 'Direct support to Santacruz local volunteer networks', color: '#ec4899' }
    ],
    certificate: {
      id: 'CERT-PS-2026-0742',
      title: 'Excellence in Sustainable Food Recovery',
      issuer: 'PlateShare Sustainability Board',
      issueDate: 'July 1, 2026',
      validUntil: 'July 2027',
      level: 'Gold Grade Accreditation'
    }
  },
  {
    id: 'rest-3',
    name: 'Artisan Sourdough & Patisserie',
    category: 'Bakery & Cafe',
    location: 'Hill Road, Bandra West, Mumbai',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    stats: {
      mealsRescued: 1680,
      kgSaved: 756,
      co2Prevented: '1.8 Tons',
      activeMonths: 6
    },
    tier: 'Silver Rescuer',
    tierColor: '#475569',
    tierBg: '#f1f5f9',
    rating: 4.88,
    reviewCount: 19,
    badges: [
      { id: 'b1', name: 'Daily Contributor', icon: 'fa-calendar-check', desc: 'Over 100 consecutive days of surplus bakery sharing', color: '#0ea5e9' },
      { id: 'b2', name: 'Eco-Packaging Star', icon: 'fa-box-tissue', desc: '100% plastic-free biodegradable packaging', color: '#10b981' }
    ],
    certificate: {
      id: 'CERT-PS-2026-0610',
      title: 'Community Nutrition & Zero-Waste Certificate',
      issuer: 'PlateShare Metro Initiative',
      issueDate: 'June 10, 2026',
      validUntil: 'June 2027',
      level: 'Silver Grade Accreditation'
    }
  },
  {
    id: 'rest-4',
    name: 'Royal Heritage Wedding Banquets',
    category: 'Large Event Hall & Catering',
    location: 'SV Road, Khar West, Mumbai',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    stats: {
      mealsRescued: 3620,
      kgSaved: 1629,
      co2Prevented: '4.1 Tons',
      activeMonths: 11
    },
    tier: 'Gold Guardian',
    tierColor: '#b45309',
    tierBg: '#fef3c7',
    rating: 4.85,
    reviewCount: 31,
    badges: [
      { id: 'b1', name: 'Mega Event Rescuer', icon: 'fa-people-group', desc: 'Handled over 15 wedding banquet surplus rescues > 100 meals each', color: '#f59e0b' },
      { id: 'b2', name: 'Night Owl Hero', icon: 'fa-moon', desc: 'Swift coordination for late-night post-event collections', color: '#6366f1' }
    ],
    certificate: {
      id: 'CERT-PS-2026-0524',
      title: 'Large-Scale Banquet Food Preservation Honors',
      issuer: 'National Food Recovery Network & PlateShare',
      issueDate: 'May 20, 2026',
      validUntil: 'May 2027',
      level: 'Gold Grade Accreditation'
    }
  }
];
