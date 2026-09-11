// PlateShare — Application Core Logic
const App = {
  currentRole: 'visitor',
  currentView: 'landing',
  activeDetailId: null,
  filterType: 'all',
  searchQuery: '',
  timerInterval: null,

  init() {
    const user = PlateStore.getCurrentUser();
    this.currentRole = user.role || 'visitor';
    this.bindEvents();
    this.setupRoleSwitcher();
    this.setupChatbot();
    this.startCountdownTimer();

    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('donation-detail/')) {
      this.showDetail(hash.split('/')[1]);
    } else if (hash) {
      this.navigateTo(hash);
    } else {
      if (this.currentRole === 'donor') this.navigateTo('donor-dashboard');
      else if (this.currentRole === 'ngo') this.navigateTo('ngo-feed');
      else if (this.currentRole === 'community') this.navigateTo('community-feed');
      else this.navigateTo('landing');
    }
  },

  bindEvents() {
    document.querySelectorAll('[data-view-target]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateTo(el.getAttribute('data-view-target'));
      });
    });

    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('donation-detail/')) {
        this.showDetail(hash.split('/')[1]);
      } else if (hash && hash !== this.currentView) {
        this.navigateTo(hash);
      }
    });

    const openLoginBtn = document.getElementById('openLoginBtn');
    const closeLoginBtn = document.getElementById('closeLoginBtn');
    const loginModal = document.getElementById('loginModal');
    const heroShareBtn = document.getElementById('heroShareBtn');
    const heroNeedBtn = document.getElementById('heroNeedBtn');

    if (openLoginBtn) openLoginBtn.addEventListener('click', () => this.openModal());
    if (closeLoginBtn) closeLoginBtn.addEventListener('click', () => this.closeModal());
    if (loginModal) {
      loginModal.addEventListener('click', (e) => { if (e.target === loginModal) this.closeModal(); });
    }

    if (heroShareBtn) {
      heroShareBtn.addEventListener('click', () => {
        this.setRole('donor');
        this.navigateTo('create-donation');
      });
    }

    if (heroNeedBtn) {
      heroNeedBtn.addEventListener('click', () => {
        this.setRole('ngo');
        this.navigateTo('ngo-feed');
      });
    }

    const authForm = document.getElementById('authForm');
    if (authForm) {
      authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const role = document.getElementById('authRoleSelect').value;
        const name = document.getElementById('authNameInput').value || 'Community Partner';
        this.setRole(role, name);
        this.closeModal();
        if (role === 'donor') this.navigateTo('donor-dashboard');
        else if (role === 'ngo') this.navigateTo('ngo-feed');
        else if (role === 'community') this.navigateTo('community-feed');
        else this.navigateTo('landing');
      });
    }

    const tabLogin = document.getElementById('authTabLogin');
    const tabSignup = document.getElementById('authTabSignup');
    if (tabLogin && tabSignup) {
      tabLogin.addEventListener('click', () => {
        tabLogin.classList.add('active');
        tabSignup.classList.remove('active');
        document.getElementById('authModalTitle').textContent = 'Welcome back';
        document.getElementById('authSubmitBtn').textContent = 'Continue';
      });
      tabSignup.addEventListener('click', () => {
        tabSignup.classList.add('active');
        tabLogin.classList.remove('active');
        document.getElementById('authModalTitle').textContent = 'Create your account';
        document.getElementById('authSubmitBtn').textContent = 'Create Account';
      });
    }

    this.setupCreateDonationForm();
    this.setupFilters();
  },
  setupRoleSwitcher() {
    document.querySelectorAll('.role-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const role = btn.getAttribute('data-role');
        this.setRole(role);
        if (role === 'donor') this.navigateTo('donor-dashboard');
        else if (role === 'ngo') this.navigateTo('ngo-feed');
        else if (role === 'community') this.navigateTo('community-feed');
        else this.navigateTo('landing');
      });
    });
    this.updateRoleUI();
  },

  setRole(role, name) {
    this.currentRole = role;
    const user = PlateStore.getCurrentUser();
    user.role = role;
    if (name) {
      user.name = name;
    } else {
      if (role === 'donor') { user.name = 'Rajendra (Chef)'; user.org = 'Grand Hyatt'; }
      else if (role === 'ngo') { user.name = 'Pooja Sharma'; user.org = 'Robin Hood Army'; }
      else if (role === 'community') { user.name = 'Kiran Patil'; user.org = 'Community Aid'; }
      else { user.name = 'Guest Visitor'; user.org = 'Community Member'; }
    }
    PlateStore.setCurrentUser(user);
    this.updateRoleUI();
  },

  updateRoleUI() {
    const user = PlateStore.getCurrentUser();
    document.querySelectorAll('.role-pill-btn').forEach(btn => {
      if (btn.getAttribute('data-role') === this.currentRole) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    const bannerText = document.getElementById('roleBannerText');
    if (bannerText) {
      const roleNames = {
        visitor: '<i class="fa-solid fa-eye"></i> Public Visitor View — Community food-rescue platform',
        donor: '<i class="fa-solid fa-hotel"></i> Donor Mode: Logged in as ' + user.name + ' (' + user.org + ')',
        ngo: '<i class="fa-solid fa-handshake-angle"></i> NGO Mode: Logged in as ' + user.name + ' (' + user.org + ')',
        community: '<i class="fa-solid fa-users"></i> Community Mode: Logged in as ' + user.name + ' (' + user.org + ')'
      };
      bannerText.innerHTML = roleNames[this.currentRole] || 'PlateShare Platform';
    }

    const userAvatarText = document.getElementById('userAvatarName');
    const userAvatarCircle = document.getElementById('userAvatarCircle');
    if (userAvatarText) userAvatarText.textContent = user.name.split(' ')[0];
    if (userAvatarCircle) userAvatarCircle.textContent = user.name.charAt(0).toUpperCase();

    const visitorActions = document.getElementById('navVisitorActions');
    const userBadge = document.getElementById('navUserBadge');
    if (this.currentRole === 'visitor') {
      if (visitorActions) visitorActions.style.display = 'flex';
      if (userBadge) userBadge.style.display = 'none';
    } else {
      if (visitorActions) visitorActions.style.display = 'none';
      if (userBadge) userBadge.style.display = 'flex';
    }

    document.querySelectorAll('.nav-donor-only').forEach(el => el.style.display = (this.currentRole === 'donor') ? 'inline-block' : 'none');
    document.querySelectorAll('.nav-ngo-only').forEach(el => el.style.display = (this.currentRole === 'ngo') ? 'inline-block' : 'none');
    document.querySelectorAll('.nav-community-only').forEach(el => el.style.display = (this.currentRole === 'community') ? 'inline-block' : 'none');
  },

  navigateTo(viewId) {
    this.currentView = viewId;
    window.location.hash = (viewId === 'donation-detail') ? 'donation-detail/' + this.activeDetailId : viewId;

    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));

    const targetSection = document.getElementById('view-' + viewId);
    if (targetSection) {
      targetSection.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    document.querySelectorAll('.nav-links a').forEach(a => {
      if (a.getAttribute('data-view-target') === viewId) a.classList.add('active');
      else a.classList.remove('active');
    });

    if (viewId === 'donor-dashboard') this.renderDonorDashboard();
    else if (viewId === 'ngo-feed') this.renderNGOFeed();
    else if (viewId === 'community-feed') this.renderCommunityFeed();
    else if (viewId === 'create-donation') this.renderCreateDonation();
    else if (viewId === 'impact') this.renderImpactPage();
  },

  openModal() {
    const m = document.getElementById('loginModal');
    if (m) m.classList.add('active');
  },

  closeModal() {
    const m = document.getElementById('loginModal');
    if (m) m.classList.remove('active');
  },
  calculateUrgency(expiryTimeStr) {
    const now = Date.now();
    const expiry = new Date(expiryTimeStr).getTime();
    const diffMins = Math.round((expiry - now) / (60 * 1000));

    if (diffMins <= 0) {
      return {
        level: 'critical',
        label: 'Expired',
        badgeClass: 'badge-critical',
        borderClass: 'border-critical',
        colorHex: '#C6584A',
        timeText: 'Expired ' + Math.abs(diffMins) + 'm ago'
      };
    } else if (diffMins <= 35) {
      return {
        level: 'critical',
        label: 'Critical',
        badgeClass: 'badge-critical',
        borderClass: 'border-critical',
        colorHex: '#C6584A',
        timeText: 'Safe for ' + diffMins + ' min left'
      };
    } else if (diffMins <= 90) {
      return {
        level: 'urgent',
        label: 'Urgent',
        badgeClass: 'badge-urgent',
        borderClass: 'border-urgent',
        colorHex: '#E5A93B',
        timeText: 'Safe for ' + Math.floor(diffMins / 60) + 'h ' + (diffMins % 60) + 'm'
      };
    } else {
      return {
        level: 'safe',
        label: 'Safe',
        badgeClass: 'badge-safe',
        borderClass: 'border-safe',
        colorHex: '#4B8B5E',
        timeText: 'Safe for ' + Math.floor(diffMins / 60) + 'h ' + (diffMins % 60) + 'm'
      };
    }
  },

  startCountdownTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.currentView === 'ngo-feed') this.renderNGOFeed(false);
      else if (this.currentView === 'donor-dashboard') this.renderDonorDashboard(false);
      else if (this.currentView === 'community-feed') this.renderCommunityFeed(false);
    }, 15000);
  },

  renderDonorDashboard() {
    const list = PlateStore.getDonations();
    const totalMeals = list.reduce((acc, d) => acc + (parseInt(d.quantity) || 0), 0);
    const totalClaimed = list.filter(d => d.status !== 'posted').length;
    const kgRescued = Math.round(totalMeals * 0.45);

    const statMealsEl = document.getElementById('donorStatMeals');
    const statClaimedEl = document.getElementById('donorStatClaimed');
    const statKgEl = document.getElementById('donorStatKg');

    if (statMealsEl) statMealsEl.textContent = totalMeals.toLocaleString();
    if (statClaimedEl) statClaimedEl.textContent = totalClaimed;
    if (statKgEl) statKgEl.textContent = kgRescued + ' kg';

    const container = document.getElementById('donorDonationsFeed');
    if (!container) return;

    if (list.length === 0) {
      container.innerHTML = '<p class="text-muted">No active donations yet. Click Create Donation to share surplus meals!</p>';
      return;
    }

    container.innerHTML = list.map(item => {
      const urgency = this.calculateUrgency(item.expiryTime);
      return `
        <div class="donation-card ${urgency.borderClass}" onclick="App.showDetail('${item.id}')" style="cursor:pointer;">
          <div class="card-img-wrapper">
            <img src="${item.image}" alt="${item.title}" loading="lazy" />
            <div class="card-img-overlay-badges">
              <span class="badge ${urgency.badgeClass}">${urgency.label}</span>
              <span class="badge badge-gray">${item.foodType}</span>
            </div>
          </div>
          <div class="card-body">
            <h3 class="card-title">${item.title}</h3>
            <div class="card-meta-line">
              <span><i class="fa-solid fa-location-dot" style="color:var(--color-forest-green); margin-right:4px;"></i> ${item.location.name}</span>
            </div>
            <div class="card-tags">
              <span class="tag-pill">${item.category}</span>
              <span class="tag-pill">${item.quantity} ${item.unit}</span>
              <span class="tag-pill">Status: ${item.status.toUpperCase()}</span>
            </div>
            <div class="card-countdown">
              <span style="color: ${urgency.colorHex};"><i class="fa-solid fa-clock" style="margin-right:4px;"></i> ${urgency.timeText}</span>
            </div>
            <div class="card-footer-actions">
              <button class="btn btn-outline-green btn-sm"><i class="fa-solid fa-circle-info"></i> View Details & Stepper</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  setupCreateDonationForm() {
    const form = document.getElementById('createDonationForm');
    if (!form) return;

    const nameInput = document.getElementById('foodNameInput');
    const typeSelect = document.getElementById('foodTypeSelect');
    const qtyInput = document.getElementById('foodQtyInput');
    const unitSelect = document.getElementById('foodUnitSelect');
    const expiryInput = document.getElementById('foodExpiryInput');

    const updatePreview = () => {
      const title = nameInput.value || 'Vegetarian Thali – 120 meals';
      const type = typeSelect.value || 'Vegetarian';
      const qty = qtyInput.value || '100';
      const unit = unitSelect.value || 'meals';
      const expiry = expiryInput.value;

      document.getElementById('previewTitle').textContent = title + ' (' + qty + ' ' + unit + ')';
      document.getElementById('previewFoodType').textContent = type;

      let urgency = { label: 'Safe', badgeClass: 'badge-safe' };
      if (expiry) urgency = this.calculateUrgency(expiry);
      const previewBadge = document.getElementById('previewUrgencyBadge');
      if (previewBadge) {
        previewBadge.className = 'badge ' + urgency.badgeClass;
        previewBadge.textContent = urgency.label;
      }
    };

    [nameInput, typeSelect, qtyInput, unitSelect, expiryInput].forEach(el => {
      if (el) {
        el.addEventListener('input', updatePreview);
        el.addEventListener('change', updatePreview);
      }
    });

    const photoGrid = document.getElementById('presetPhotosGrid');
    if (photoGrid) {
      photoGrid.innerHTML = PRESET_PHOTOS.map((p, idx) => `
        <div class="preset-photo-item ${idx === 0 ? 'selected' : ''}" data-url="${p.url}" style="cursor:pointer; position:relative; border-radius:8px; overflow:hidden; border:2px solid ${idx === 0 ? '#E8813A' : '#E8E2D5'}; height:70px;">
          <img src="${p.url}" alt="${p.label}" style="width:100%; height:100%; object-fit:cover;" />
          <span style="position:absolute; bottom:2px; left:4px; font-size:10px; background:rgba(0,0,0,0.65); color:#fff; padding:1px 4px; border-radius:3px;">${p.label.split('/')[0]}</span>
        </div>
      `).join('');

      photoGrid.querySelectorAll('.preset-photo-item').forEach(item => {
        item.addEventListener('click', () => {
          photoGrid.querySelectorAll('.preset-photo-item').forEach(i => {
            i.style.borderColor = '#E8E2D5';
            i.classList.remove('selected');
          });
          item.style.borderColor = '#E8813A';
          item.classList.add('selected');
          document.getElementById('selectedPhotoUrl').value = item.getAttribute('data-url');
          document.getElementById('previewImg').src = item.getAttribute('data-url');
        });
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = PlateStore.getCurrentUser();
      const selectedImg = document.getElementById('selectedPhotoUrl').value || PRESET_PHOTOS[0].url;

      const newDonation = {
        id: 'ps-' + Date.now(),
        title: nameInput.value + ' – ' + qtyInput.value + ' ' + unitSelect.value,
        foodType: typeSelect.value,
        category: document.getElementById('foodCategorySelect').value,
        quantity: parseInt(qtyInput.value, 10) || 50,
        unit: unitSelect.value,
        prepTime: new Date(document.getElementById('foodPrepInput').value).toISOString(),
        expiryTime: new Date(expiryInput.value).toISOString(),
        storageMethod: document.getElementById('foodStorageInput').value || 'Thermal insulated containers at >65°C',
        allergens: document.getElementById('foodAllergensInput').value || 'No allergens specified',
        packagingTime: 'Packed fresh at dispatch',
        pickupInstructions: document.getElementById('foodInstructionsInput').value || 'Call on arrival at service entrance.',
        location: {
          name: document.getElementById('foodLocationName').value || 'Commercial Kitchen',
          address: document.getElementById('foodLocationAddress').value || '12 Express Way, Central',
          lat: 19.0760,
          lng: 72.8777
        },
        distance: '0.9 km away',
        donor: {
          name: user.name || 'Chef Partner',
          organization: user.org || 'Community Donor Partner',
          phone: '+91 98200 88712'
        },
        claimedBy: null,
        otp: Math.floor(1000 + Math.random() * 9000).toString(),
        visibility: 'ngo',
        status: 'posted',
        currentStep: 1,
        image: selectedImg
      };

      PlateStore.addDonation(newDonation);
      alert('✅ Donation successfully posted! Nearby NGOs and communities have been notified.');
      this.showDetail(newDonation.id);
    });
  },

  renderCreateDonation() {
    const now = new Date();
    const defaultExpiry = new Date(now.getTime() + 150 * 60 * 1000);
    const expEl = document.getElementById('foodExpiryInput');
    const prepEl = document.getElementById('foodPrepInput');
    if (expEl) expEl.value = defaultExpiry.toISOString().slice(0, 16);
    if (prepEl) prepEl.value = now.toISOString().slice(0, 16);
  },
  setupFilters() {
    const searchInput = document.getElementById('ngoSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.renderNGOFeed();
      });
    }

    document.querySelectorAll('.ngo-filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.ngo-filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.filterType = chip.getAttribute('data-filter');
        this.renderNGOFeed();
      });
    });
  },

  renderNGOFeed() {
    const container = document.getElementById('ngoFeedContainer');
    if (!container) return;

    let list = PlateStore.getDonations();

    if (this.searchQuery) {
      list = list.filter(item => 
        item.title.toLowerCase().includes(this.searchQuery) ||
        item.location.address.toLowerCase().includes(this.searchQuery) ||
        item.foodType.toLowerCase().includes(this.searchQuery)
      );
    }

    if (this.filterType === 'vegetarian') {
      list = list.filter(i => i.foodType.toLowerCase().includes('veg') && !i.foodType.toLowerCase().includes('non'));
    } else if (this.filterType === 'nonveg') {
      list = list.filter(i => i.foodType.toLowerCase().includes('non'));
    } else if (this.filterType === 'urgent') {
      list = list.filter(i => {
        const u = this.calculateUrgency(i.expiryTime);
        return u.level === 'urgent' || u.level === 'critical';
      });
    } else if (this.filterType === 'nearby') {
      list = list.filter(i => parseFloat(i.distance) <= 2.0);
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 48px 20px; background: #fff; border-radius: 14px; border: 1px solid #E8E2D5;">
          <p style="font-size: 1.1rem; color: #7A756C; margin-bottom: 12px;">No surplus food listings match your search.</p>
          <button class="btn btn-outline-green btn-sm" onclick="App.resetFilters()">Reset Filters</button>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(item => {
      const urgency = this.calculateUrgency(item.expiryTime);
      const isClaimed = item.status !== 'posted';

      return `
        <div class="donation-card ${urgency.borderClass}">
          <div class="card-img-wrapper">
            <img src="${item.image}" alt="${item.title}" loading="lazy" />
            <div class="card-img-overlay-badges">
              <span class="badge ${urgency.badgeClass}">${urgency.label}</span>
              <span class="badge badge-gray"><i class="fa-solid fa-location-arrow"></i> ${item.distance}</span>
            </div>
          </div>
          <div class="card-body">
            <h3 class="card-title">${item.title}</h3>
            <div class="card-meta-line">
              <span><i class="fa-solid fa-location-dot" style="color:var(--color-forest-green); margin-right:4px;"></i> ${item.location.name}</span>
            </div>
            <div class="card-tags">
              <span class="tag-pill">${item.foodType}</span>
              <span class="tag-pill">${item.category}</span>
              <span class="tag-pill">${item.quantity} ${item.unit}</span>
            </div>
            <div class="card-countdown">
              <span style="color: ${urgency.colorHex};"><i class="fa-solid fa-clock" style="margin-right:4px;"></i> ${urgency.timeText}</span>
            </div>
            <div class="card-footer-actions">
              ${isClaimed ? `
                <button class="btn btn-forest btn-sm" onclick="App.showDetail('${item.id}')">
                  ${item.status === 'served' ? '<i class="fa-solid fa-circle-check"></i> Completed' : '<i class="fa-solid fa-truck"></i> Track (' + item.status + ')'}
                </button>
              ` : `
                <button class="btn btn-orange btn-sm" onclick="App.claimDonation('${item.id}')"><i class="fa-solid fa-handshake"></i> Claim Meals</button>
                <button class="btn btn-outline-green btn-sm" onclick="App.showDetail('${item.id}')"><i class="fa-solid fa-circle-info"></i> Details</button>
              `}
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  resetFilters() {
    this.searchQuery = '';
    this.filterType = 'all';
    const input = document.getElementById('ngoSearchInput');
    if (input) input.value = '';
    document.querySelectorAll('.ngo-filter-chip').forEach(c => {
      if (c.getAttribute('data-filter') === 'all') c.classList.add('active');
      else c.classList.remove('active');
    });
    this.renderNGOFeed();
  },

  renderCommunityFeed() {
    const container = document.getElementById('communityFeedContainer');
    if (!container) return;

    let list = PlateStore.getDonations().filter(i => i.visibility === 'community' || i.status === 'posted');

    if (list.length === 0) {
      container.innerHTML = '<p class="text-muted">No community meal boxes available right now. Check back shortly!</p>';
      return;
    }

    container.innerHTML = list.map(item => {
      const urgency = this.calculateUrgency(item.expiryTime);
      const isClaimed = item.status !== 'posted';

      return `
        <div class="donation-card ${urgency.borderClass}">
          <div class="card-img-wrapper">
            <img src="${item.image}" alt="${item.title}" loading="lazy" />
            <div class="card-img-overlay-badges">
              <span class="badge ${urgency.badgeClass}">${urgency.label}</span>
              <span class="badge badge-forest"><i class="fa-solid fa-users" style="margin-right:4px;"></i> Community Meals</span>
            </div>
          </div>
          <div class="card-body">
            <h3 class="card-title">${item.title}</h3>
            <p style="font-size:0.9rem; color:#7A756C; margin-bottom: 10px;">
              Safe surplus from <strong>${item.donor.organization}</strong>
            </p>
            <div class="card-meta-line">
              <span><i class="fa-solid fa-location-dot" style="color:var(--color-forest-green); margin-right:4px;"></i> ${item.location.address}</span>
            </div>
            <div class="card-tags">
              <span class="tag-pill">${item.foodType}</span>
              <span class="tag-pill">${item.quantity} ${item.unit}</span>
            </div>
            <div class="card-countdown">
              <span style="color: ${urgency.colorHex};"><i class="fa-solid fa-clock" style="margin-right:4px;"></i> ${urgency.timeText}</span>
            </div>
            <div class="card-footer-actions">
              ${isClaimed ? `
                <button class="btn btn-forest btn-sm" onclick="App.showDetail('${item.id}')"><i class="fa-solid fa-circle-check"></i> Claimed & Ready</button>
              ` : `
                <button class="btn btn-orange btn-sm" onclick="App.claimCommunityMeal('${item.id}')"><i class="fa-solid fa-hand-holding-heart"></i> I Can Take This</button>
                <button class="btn btn-outline-green btn-sm" onclick="App.showDetail('${item.id}')"><i class="fa-solid fa-circle-info"></i> Details</button>
              `}
            </div>
          </div>
        </div>
      `;
    }).join('');
  },
  showDetail(id) {
    const item = PlateStore.getDonationById(id);
    if (!item) {
      alert('Listing not found');
      this.navigateTo('ngo-feed');
      return;
    }

    this.activeDetailId = id;
    this.navigateTo('donation-detail');

    const urgency = this.calculateUrgency(item.expiryTime);

    document.getElementById('detailTitle').textContent = item.title;
    document.getElementById('detailImage').src = item.image;
    document.getElementById('detailImage').alt = item.title;
    document.getElementById('detailLocationName').textContent = item.location.name;
    document.getElementById('detailAddress').textContent = item.location.address;
    document.getElementById('detailPickupInstructions').textContent = item.pickupInstructions;

    const badgeEl = document.getElementById('detailUrgencyBadge');
    badgeEl.className = 'badge ' + urgency.badgeClass;
    badgeEl.textContent = urgency.label;

    document.getElementById('detailFoodTypeBadge').textContent = item.foodType;
    document.getElementById('detailCategoryBadge').textContent = item.category;

    document.getElementById('passportPrepTime').textContent = new Date(item.prepTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('passportSafeUntil').textContent = new Date(item.expiryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('passportStorage').textContent = item.storageMethod;
    document.getElementById('passportAllergens').textContent = item.allergens;
    document.getElementById('passportPackaging').textContent = item.packagingTime;

    this.renderStepper(item.currentStep || 1);

    const otpContainer = document.getElementById('detailOtpContainer');
    const actionButtonsContainer = document.getElementById('detailActionButtons');
    const fallbackBox = document.getElementById('detailFallbackBox');

    if (item.status === 'posted') {
      otpContainer.style.display = 'none';
      fallbackBox.style.display = 'flex';
      
      actionButtonsContainer.innerHTML = `
        <button class="btn btn-orange btn-lg" style="width:100%;" onclick="App.claimDonation('${item.id}')">
          <i class="fa-solid fa-handshake"></i> Claim These Meals Now
        </button>
      `;
    } else {
      otpContainer.style.display = 'block';
      fallbackBox.style.display = 'none';
      document.getElementById('detailOtpCode').textContent = item.otp || '5921';

      const claimedName = item.claimedBy ? item.claimedBy.ngoName : 'Robin Hood Army';
      const claimedPhone = item.claimedBy ? item.claimedBy.phone : '+91 98200 11984';

      document.getElementById('detailClaimedInfo').innerHTML = `
        <strong>Assigned NGO:</strong> ${claimedName}<br/>
        <strong>Contact:</strong> ${claimedPhone}
      `;

      let nextActionHtml = '';
      if (item.currentStep === 2) {
        nextActionHtml = `
          <button class="btn btn-orange" style="width:100%; margin-bottom:8px;" onclick="App.advanceStep('${item.id}', 3, 'picked_up')">
            <i class="fa-solid fa-truck"></i> Step 3: Mark as Picked Up
          </button>
        `;
      } else if (item.currentStep === 3) {
        nextActionHtml = `
          <button class="btn btn-orange" style="width:100%; margin-bottom:8px;" onclick="App.advanceStep('${item.id}', 4, 'delivered')">
            <i class="fa-solid fa-location-dot"></i> Step 4: Mark as Delivered
          </button>
        `;
      } else if (item.currentStep === 4) {
        nextActionHtml = `
          <button class="btn btn-primary" style="width:100%; margin-bottom:8px; background-color:#4B8B5E; border-color:#4B8B5E;" onclick="App.advanceStep('${item.id}', 5, 'served')">
            <i class="fa-solid fa-circle-check"></i> Step 5: Mark as Served to Community
          </button>
        `;
      } else if (item.currentStep === 5) {
        nextActionHtml = `
          <div style="background:#EAF4EE; color:#4B8B5E; border:1px solid #B8DCBF; border-radius:8px; padding:14px; text-align:center; font-weight:700;">
            <i class="fa-solid fa-circle-check"></i> Completed! Meals safely served to community.
          </div>
        `;
      }

      actionButtonsContainer.innerHTML = nextActionHtml;
    }
  },

  renderStepper(currentStep) {
    const steps = [
      { num: 1, label: 'Posted' },
      { num: 2, label: 'Claimed' },
      { num: 3, label: 'Picked Up' },
      { num: 4, label: 'Delivered' },
      { num: 5, label: 'Served' }
    ];

    const track = document.getElementById('stepperTrack');
    if (!track) return;

    track.innerHTML = steps.map(s => {
      let statusClass = '';
      if (s.num < currentStep) statusClass = 'completed';
      else if (s.num === currentStep) statusClass = 'active';

      return `
        <div class="step-item ${statusClass}">
          <div class="step-circle">${s.num < currentStep ? '<i class="fa-solid fa-check"></i>' : s.num}</div>
          <div class="step-label">${s.label}</div>
        </div>
      `;
    }).join('');
  },

  claimDonation(id) {
    const user = PlateStore.getCurrentUser();
    const item = PlateStore.getDonationById(id);
    if (!item) return;

    PlateStore.updateDonation(id, {
      status: 'claimed',
      currentStep: 2,
      claimedBy: {
        name: user.name || 'Pooja Sharma',
        ngoName: user.org || 'Robin Hood Army',
        phone: '+91 98200 11984',
        claimedAt: new Date().toISOString()
      }
    });

    alert('🎉 You have claimed this food donation! Pickup OTP: ' + item.otp);
    this.showDetail(id);
  },

  claimCommunityMeal(id) {
    const user = PlateStore.getCurrentUser();
    const item = PlateStore.getDonationById(id);
    if (!item) return;

    PlateStore.updateDonation(id, {
      status: 'claimed',
      currentStep: 2,
      claimedBy: {
        name: user.name || 'Local Resident',
        ngoName: 'Community Volunteer Pickup',
        phone: '+91 98920 44102',
        claimedAt: new Date().toISOString()
      }
    });

    alert('✅ You reserved this meal pack! Show OTP ' + item.otp + ' at pickup.');
    this.showDetail(id);
  },

  advanceStep(id, nextStep, nextStatus) {
    PlateStore.updateDonation(id, {
      currentStep: nextStep,
      status: nextStatus
    });
    this.showDetail(id);
  },

  toggleCommunityFallback(id) {
    const item = PlateStore.getDonationById(id);
    if (!item) return;

    PlateStore.updateDonation(id, {
      visibility: 'community'
    });

    alert('📣 Listing has been offered to nearby Communities! It is now visible in the Community Meals feed.');
    this.showDetail(id);
  },
  renderImpactPage() {
    const list = PlateStore.getDonations();
    const totalMeals = 14280 + list.reduce((a, b) => a + (parseInt(b.quantity) || 0), 0);
    const peopleFed = Math.round(totalMeals * 1.15);
    const wasteKg = Math.round(totalMeals * 0.42);

    const mEl = document.getElementById('impactMealsVal');
    const pEl = document.getElementById('impactPeopleVal');
    const wEl = document.getElementById('impactWasteVal');

    if (mEl) mEl.textContent = totalMeals.toLocaleString();
    if (pEl) pEl.textContent = peopleFed.toLocaleString();
    if (wEl) wEl.textContent = wasteKg.toLocaleString() + ' kg';
  },

  setupChatbot() {
    const toggleBtn = document.getElementById('chatbotToggleBtn');
    const closeBtn = document.getElementById('chatbotCloseBtn');
    const windowEl = document.getElementById('chatbotWindow');
    const sendBtn = document.getElementById('chatbotSendBtn');
    const input = document.getElementById('chatbotInput');

    if (toggleBtn && windowEl) {
      toggleBtn.addEventListener('click', () => {
        windowEl.classList.toggle('active');
      });
    }

    if (closeBtn && windowEl) {
      closeBtn.addEventListener('click', () => {
        windowEl.classList.remove('active');
      });
    }

    if (sendBtn && input) {
      const handleSend = () => {
        const text = input.value.trim();
        if (!text) return;
        this.addChatMessage(text, 'user');
        input.value = '';
        setTimeout(() => this.processBotReply(text), 450);
      };

      sendBtn.addEventListener('click', handleSend);
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
      });
    }

    document.querySelectorAll('.chat-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-query');
        this.addChatMessage(query, 'user');
        setTimeout(() => this.processBotReply(query), 450);
      });
    });
  },

  addChatMessage(text, sender = 'bot') {
    const messagesEl = document.getElementById('chatbotMessages');
    if (!messagesEl) return;

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble ' + sender;
    bubble.innerHTML = text;
    messagesEl.appendChild(bubble);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  },

  processBotReply(query) {
    const q = query.toLowerCase();

    if (q.includes('post') || q.includes('share surplus') || q.includes('donate')) {
      this.addChatMessage("Tap <strong>'Create Donation'</strong>, fill in what food you have, when it was prepared, and hit 'Post Donation'. You can also click below:");
      this.addChatMessage("<button class='btn btn-orange btn-sm' onclick='App.setRole(\"donor\"); App.navigateTo(\"create-donation\");'>Go to Create Donation Form</button>");
    } else if (q.includes('find') || q.includes('near') || q.includes('ngo') || q.includes('meals')) {
      this.addChatMessage("There are verified surplus meals waiting nearby in Bandra and Santacruz. Let me switch you to the NGO view:");
      this.addChatMessage("<button class='btn btn-forest btn-sm' onclick='App.setRole(\"ngo\"); App.navigateTo(\"ngo-feed\");'>Browse NGO Food Feed</button>");
    } else if (q.includes('impact') || q.includes('stats')) {
      this.addChatMessage("Together we have rescued over <strong>14,000 meals</strong> and avoided 5,700 kg of food waste. Check out the impact dashboard:");
      this.addChatMessage("<button class='btn btn-outline-green btn-sm' onclick='App.navigateTo(\"impact\");'>View Impact Dashboard</button>");
    } else if (q.includes('safety') || q.includes('passport') || q.includes('safe')) {
      this.addChatMessage("<i class='fa-solid fa-shield-halved' style='color:var(--color-forest-green); margin-right:4px;'></i> <strong>PlateShare Food Safety Passport:</strong> Every donation tracks preparation time, maximum safe consumption window (under 4 hours for cooked items), packaging standards, and allergen notices to ensure 100% human safety.");
    } else {
      this.addChatMessage("I can help you share surplus food, find meals near your community, check food safety passports, or track your impact. What would you like to do?");
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});