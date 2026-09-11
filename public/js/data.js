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

  resetDefaults() {
    localStorage.removeItem(this.STORAGE_KEY);
    return this.getDonations();
  }
};
