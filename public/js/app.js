// PlateShare — Application Core Logic
const App = {
  currentRole: 'visitor',
  currentView: 'landing',
  activeDetailId: null,
  filterType: 'all',
  searchQuery: '',
  timerInterval: null,

  showToast(message, type = 'success', title = '') {
    const container = document.getElementById('uiToastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `ui-toast toast-${type}`;

    let iconClass = 'fa-solid fa-circle-check';
    let defaultTitle = 'Success';
    if (type === 'warning') { iconClass = 'fa-solid fa-triangle-exclamation'; defaultTitle = 'Notice'; }
    else if (type === 'info') { iconClass = 'fa-solid fa-circle-info'; defaultTitle = 'Information'; }
    else if (type === 'error') { iconClass = 'fa-solid fa-circle-xmark'; defaultTitle = 'Error'; }

    toast.innerHTML = `
      <div class="ui-toast-icon"><i class="${iconClass}"></i></div>
      <div class="ui-toast-content">
        <div class="ui-toast-title">${title || defaultTitle}</div>
        <div class="ui-toast-message">${message}</div>
      </div>
      <button class="ui-toast-close" onclick="this.closest('.ui-toast').remove()">&times;</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hiding');
      setTimeout(() => toast.remove(), 320);
    }, 4500);
  },

  showModalAlert(message, title = 'Notice', icon = 'fa-solid fa-circle-check', color = 'var(--color-forest-green)') {
    const overlay = document.getElementById('uiModalOverlay');
    const msgEl = document.getElementById('uiModalMessage');
    const titleEl = document.getElementById('uiModalTitle');
    const iconEl = document.getElementById('uiModalIcon');
    const cancelBtn = document.getElementById('uiModalCancelBtn');
    const confirmBtn = document.getElementById('uiModalConfirmBtn');

    if (!overlay) return;
    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.innerHTML = message;
    if (iconEl) iconEl.innerHTML = `<i class="${icon}" style="color: ${color};"></i>`;
    if (cancelBtn) cancelBtn.style.display = 'none';

    overlay.classList.add('active');

    confirmBtn.onclick = () => {
      overlay.classList.remove('active');
    };
  },

  showModalConfirm(message, title = 'Confirm Action', onConfirm, icon = 'fa-solid fa-triangle-exclamation', color = '#d97706') {
    const overlay = document.getElementById('uiModalOverlay');
    const msgEl = document.getElementById('uiModalMessage');
    const titleEl = document.getElementById('uiModalTitle');
    const iconEl = document.getElementById('uiModalIcon');
    const cancelBtn = document.getElementById('uiModalCancelBtn');
    const confirmBtn = document.getElementById('uiModalConfirmBtn');

    if (!overlay) return;
    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.innerHTML = message;
    if (iconEl) iconEl.innerHTML = `<i class="${icon}" style="color: ${color};"></i>`;
    if (cancelBtn) cancelBtn.style.display = 'inline-block';

    overlay.classList.add('active');

    confirmBtn.onclick = () => {
      overlay.classList.remove('active');
      if (typeof onConfirm === 'function') onConfirm();
    };

    cancelBtn.onclick = () => {
      overlay.classList.remove('active');
    };
  },

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
        const enteredName = document.getElementById('authNameInput').value.trim();
        const enteredEmail = document.getElementById('authEmailInput').value.trim();
        const name = enteredName || (enteredEmail ? enteredEmail.split('@')[0] : 'Partner');
        const org = enteredName || 'Partner Organization';

        this.setRole(role, name, org);
        this.closeModal();
        this.showToast(`Logged in successfully as <strong>${name}</strong>!`, 'success', 'Welcome');

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

  setRole(role, name, org) {
    this.currentRole = role;
    const user = PlateStore.getCurrentUser();
    user.role = role;

    if (name && name.trim()) {
      user.name = name.trim();
      user.org = org ? org.trim() : (role === 'donor' ? 'Donor Partner' : (role === 'ngo' ? 'Rescue Partner' : 'Community Volunteer'));
      user.isLoggedIn = true;
    } else {
      // Unauthenticated / Quick Switcher defaults: Show 'Guest' as requested
      user.name = 'Guest';
      user.org = role === 'donor' ? 'Donor' : (role === 'ngo' ? 'NGO' : (role === 'community' ? 'Community' : 'Visitor'));
      user.isLoggedIn = false;
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
      const isGuest = !user.isLoggedIn || user.name === 'Guest';
      const userLabel = isGuest ? 'Guest' : `${user.name} (${user.org})`;
      const roleNames = {
        visitor: '<i class="fa-solid fa-eye"></i> Public Visitor View — Community food-rescue platform',
        donor: `<i class="fa-solid fa-hotel"></i> Donor Mode: Logged in as ${userLabel}`,
        ngo: `<i class="fa-solid fa-handshake-angle"></i> NGO Mode: Logged in as ${userLabel}`,
        community: `<i class="fa-solid fa-users"></i> Community Mode: Logged in as ${userLabel}`
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

    // Toggle body role class for bulletproof CSS rules
    document.body.classList.toggle('role-donor', this.currentRole === 'donor');
    document.body.classList.toggle('role-ngo', this.currentRole === 'ngo');
    document.body.classList.toggle('role-community', this.currentRole === 'community');

    document.querySelectorAll('.nav-donor-only').forEach(el => el.style.display = (this.currentRole === 'donor') ? 'inline-block' : 'none');
    document.querySelectorAll('.nav-ngo-only').forEach(el => el.style.display = (this.currentRole === 'ngo') ? 'inline-block' : 'none');
    document.querySelectorAll('.nav-community-only').forEach(el => el.style.display = (this.currentRole === 'community') ? 'inline-block' : 'none');

    // Hide Find Meals from navbar when in donor mode or at donor page
    const findMealsLink = document.getElementById('navFindMealsLink');
    if (findMealsLink) {
      findMealsLink.style.display = (this.currentRole === 'donor' || this.currentView === 'donor-dashboard') ? 'none' : 'inline-block';
    }
  },

  navigateTo(viewId) {
    this.currentView = viewId;
    window.location.hash = (viewId === 'donation-detail') ? 'donation-detail/' + this.activeDetailId : viewId;

    document.body.classList.toggle('view-donor-dashboard', viewId === 'donor-dashboard');

    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));

    const targetSection = document.getElementById('view-' + viewId);
    if (targetSection) {
      targetSection.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Hide Find Meals when navigating to donor dashboard
    const findMealsLink = document.getElementById('navFindMealsLink');
    if (findMealsLink) {
      findMealsLink.style.display = (this.currentRole === 'donor' || viewId === 'donor-dashboard') ? 'none' : 'inline-block';
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
    else if (viewId === 'awards') this.renderAwardsPage();
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

  currentDonorTab: 'active',

  switchDonorTab(tab) {
    this.currentDonorTab = tab;
    const activeBtn = document.getElementById('donorTabActive');
    const historyBtn = document.getElementById('donorTabHistory');
    const activeSec = document.getElementById('donorActiveSection');
    const historySec = document.getElementById('donorHistorySection');
    const clearHistoryBtn = document.getElementById('donorClearHistoryBtn');

    if (tab === 'active') {
      if (activeBtn) {
        activeBtn.style.color = 'var(--color-forest-green)';
        activeBtn.style.borderBottom = '3px solid var(--color-forest-green)';
        activeBtn.classList.add('active');
      }
      if (historyBtn) {
        historyBtn.style.color = '#7a756c';
        historyBtn.style.borderBottom = 'none';
        historyBtn.classList.remove('active');
      }
      if (activeSec) activeSec.style.display = 'block';
      if (historySec) historySec.style.display = 'none';
      if (clearHistoryBtn) clearHistoryBtn.style.display = 'none';
    } else {
      if (historyBtn) {
        historyBtn.style.color = 'var(--color-forest-green)';
        historyBtn.style.borderBottom = '3px solid var(--color-forest-green)';
        historyBtn.classList.add('active');
      }
      if (activeBtn) {
        activeBtn.style.color = '#7a756c';
        activeBtn.style.borderBottom = 'none';
        activeBtn.classList.remove('active');
      }
      if (activeSec) activeSec.style.display = 'none';
      if (historySec) historySec.style.display = 'block';

      // Only show Clear History button if there are completed/claimed items in history
      const historyCount = PlateStore.getDonations().filter(d => d.status !== 'posted').length;
      if (clearHistoryBtn) {
        clearHistoryBtn.style.display = historyCount > 0 ? 'inline-flex' : 'none';
      }
    }
  },

  clearOrderHistory() {
    const count = PlateStore.getDonations().filter(d => d.status !== 'posted').length;
    if (count === 0) {
      this.showToast('Order history is already empty.', 'info', 'Empty History');
      return;
    }

    this.showModalConfirm(
      `Are you sure you want to clear all <strong>${count}</strong> completed/claimed orders from your Order History?<br><br><span style="color:#71717a; font-size:0.85rem;">Note: Your active food listings will not be affected.</span>`,
      'Clear Order History?',
      () => {
        PlateStore.clearOrderHistory();
        this.renderDonorDashboard();
        this.switchDonorTab('history');
        this.showToast('Order history has been successfully cleared.', 'success', 'History Cleared');
      },
      'fa-solid fa-trash-can',
      '#dc2626'
    );
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

    // Separate active listings from claimed, delivered, and served orders
    const activeList = list.filter(d => d.status === 'posted');
    const historyList = list.filter(d => ['claimed', 'picked_up', 'delivered', 'served'].includes(d.status));

    const activeCountEl = document.getElementById('donorActiveCount');
    const historyCountEl = document.getElementById('donorHistoryCount');
    if (activeCountEl) activeCountEl.textContent = activeList.length;
    if (historyCountEl) historyCountEl.textContent = historyList.length;

    // 1. Render Active Food Listings
    const activeContainer = document.getElementById('donorDonationsFeed');
    if (activeContainer) {
      if (activeList.length === 0) {
        activeContainer.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 40px 20px; background: #fff; border-radius: 12px; border: 1.5px dashed #CBDDD1;">
            <i class="fa-solid fa-utensils" style="font-size: 2.2rem; color: #8AD4A2; margin-bottom: 12px;"></i>
            <h4 style="font-size: 1.15rem; color: #3A3630; margin-bottom: 6px;">No Active Food Listings</h4>
            <p style="font-size: 0.95rem; color: #7A756C; margin-bottom: 16px;">All your surplus meals have been claimed or you haven't posted any active meals.</p>
            <button class="btn btn-orange btn-sm" onclick="App.navigateTo('create-donation')">
              <i class="fa-solid fa-plus-circle"></i> Post New Donation
            </button>
          </div>
        `;
      } else {
        activeContainer.innerHTML = activeList.map(item => {
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
                  <span class="tag-pill" style="color:var(--color-forest-green); font-weight:600;"><i class="fa-solid fa-circle-dot"></i> ACTIVE</span>
                </div>
                <div class="card-countdown">
                  <span style="color: ${urgency.colorHex};"><i class="fa-solid fa-clock" style="margin-right:4px;"></i> ${urgency.timeText}</span>
                </div>
                <div class="card-footer-actions">
                  <button class="btn btn-outline-green btn-sm" style="width:100%;"><i class="fa-solid fa-circle-info"></i> View Details & Stepper</button>
                </div>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // 2. Render Order History (Claimed, Picked Up, Delivered, Served)
    const historyContainer = document.getElementById('donorHistoryFeed');
    if (historyContainer) {
      if (historyList.length === 0) {
        historyContainer.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 40px 20px; background: #fff; border-radius: 12px; border: 1.5px dashed #CBDDD1;">
            <i class="fa-solid fa-clock-rotate-left" style="font-size: 2.2rem; color: #CBDDD1; margin-bottom: 12px;"></i>
            <h4 style="font-size: 1.15rem; color: #3A3630; margin-bottom: 6px;">Order History is Empty</h4>
            <p style="font-size: 0.95rem; color: #7A756C;">When an NGO or volunteer claims, picks up, or serves your food, the completed order will appear here.</p>
          </div>
        `;
      } else {
        const statusConfigs = {
          claimed: { label: 'Claimed', color: '#1e40af', bg: '#eff6ff', icon: 'fa-handshake' },
          picked_up: { label: 'Picked Up', color: '#c2410c', bg: '#fff7ed', icon: 'fa-truck' },
          delivered: { label: 'Delivered', color: '#6b21a8', bg: '#f5f3ff', icon: 'fa-box-check' },
          served: { label: 'Served', color: '#065f46', bg: '#ecfdf5', icon: 'fa-circle-check' }
        };

        historyContainer.innerHTML = historyList.map(item => {
          const cfg = statusConfigs[item.status] || { label: item.status.toUpperCase(), color: '#374151', bg: '#f3f4f6', icon: 'fa-check' };
          const partner = item.claimedBy ? (item.claimedBy.ngoName || item.claimedBy.name || 'Robin Hood Army') : 'Verified Partner';
          return `
            <div class="donation-card" onclick="App.showDetail('${item.id}')" style="cursor:pointer; border: 1.5px solid #CBDDD1; opacity: 0.96;">
              <div class="card-img-wrapper">
                <img src="${item.image}" alt="${item.title}" loading="lazy" />
                <div class="card-img-overlay-badges">
                  <span class="badge" style="background:${cfg.bg}; color:${cfg.color}; font-weight:700;">
                    <i class="fa-solid ${cfg.icon}"></i> ${cfg.label}
                  </span>
                  <span class="badge badge-gray">${item.foodType}</span>
                </div>
              </div>
              <div class="card-body">
                <h3 class="card-title">${item.title}</h3>
                <div class="card-meta-line">
                  <span><i class="fa-solid fa-location-dot" style="color:var(--color-forest-green); margin-right:4px;"></i> ${item.location.name}</span>
                </div>
                <div style="background:#fafaf8; border-radius:8px; padding:8px 10px; margin: 8px 0 12px 0; font-size:0.83rem; color:#4a453e; border:1px solid #E8E2D5;">
                  <div><strong>Claimed By:</strong> ${partner}</div>
                  <div style="color:#7a756c; font-size:0.8rem; margin-top:2px;"><strong>Status:</strong> Step ${item.currentStep || 2} of 5 (${cfg.label})</div>
                </div>
                <div class="card-tags">
                  <span class="tag-pill">${item.quantity} ${item.unit}</span>
                  <span class="tag-pill" style="color:${cfg.color}; font-weight:600;">Status: ${cfg.label}</span>
                </div>
                <div class="card-footer-actions" style="margin-top:10px;">
                  <button class="btn btn-outline-green btn-sm" style="width:100%;">
                    <i class="fa-solid fa-clock-rotate-left"></i> View Order Stepper & OTP
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    const clearHistoryBtn = document.getElementById('donorClearHistoryBtn');
    const historySec = document.getElementById('donorHistorySection');
    if (clearHistoryBtn && historySec) {
      const isHistoryActive = historySec.style.display !== 'none';
      clearHistoryBtn.style.display = (isHistoryActive && historyList.length > 0) ? 'inline-flex' : 'none';
    }
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
          const uploadSuccessText = document.getElementById('uploadPhotoSuccessText');
          if (uploadSuccessText) uploadSuccessText.style.display = 'none';
        });
      });
    }

    // Direct Photo File Upload Handler
    const photoFileInput = document.getElementById('foodPhotoFileInput');
    const triggerPhotoBtn = document.getElementById('triggerPhotoUploadBtn');
    const uploadSuccessText = document.getElementById('uploadPhotoSuccessText');
    const uploadedFileName = document.getElementById('uploadedFileName');

    if (triggerPhotoBtn && photoFileInput) {
      triggerPhotoBtn.addEventListener('click', () => photoFileInput.click());
      photoFileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const dataUrl = event.target.result;
            document.getElementById('selectedPhotoUrl').value = dataUrl;
            document.getElementById('previewImg').src = dataUrl;
            if (uploadSuccessText) uploadSuccessText.style.display = 'block';
            if (uploadedFileName) uploadedFileName.textContent = 'Uploaded: ' + file.name;

            if (photoGrid) {
              photoGrid.querySelectorAll('.preset-photo-item').forEach(i => {
                i.style.borderColor = '#E8E2D5';
                i.classList.remove('selected');
              });
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Real-Time User GPS Geolocation Detection
    const geoBtn = document.getElementById('getRealtimeLocationBtn');
    const geoStatus = document.getElementById('realtimeLocationStatus');
    const geoCoordsText = document.getElementById('realtimeCoordsText');
    const createMapBadgeText = document.getElementById('createMapBadgeText');

    if (geoBtn) {
      geoBtn.addEventListener('click', () => {
        if (!navigator.geolocation) {
          this.showToast('Geolocation is not supported by your browser.', 'warning', 'Location Error');
          return;
        }
        geoBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Detecting GPS...';
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            this.userLocation = { lat, lng };

            if (geoStatus) geoStatus.style.display = 'block';
            if (geoCoordsText) geoCoordsText.textContent = `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`;
            if (createMapBadgeText) createMapBadgeText.textContent = `Live GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;

            const locName = document.getElementById('foodLocationName');
            const locAddr = document.getElementById('foodLocationAddress');
            if (locName) locName.value = 'My Current Kitchen / Dispatch Point';
            if (locAddr) locAddr.value = `Verified GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`;

            geoBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Location Detected';
            geoBtn.className = 'btn btn-sm btn-green';
          },
          (err) => {
            console.warn('Geolocation fallback:', err);
            const lat = 19.0760;
            const lng = 72.8777;
            this.userLocation = { lat, lng };
            if (geoStatus) geoStatus.style.display = 'block';
            if (geoCoordsText) geoCoordsText.textContent = `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E (Default)`;
            if (createMapBadgeText) createMapBadgeText.textContent = `Default GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            geoBtn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i> Location Set';
          },
          { timeout: 8000, enableHighAccuracy: true }
        );
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = PlateStore.getCurrentUser();
      const selectedImg = document.getElementById('selectedPhotoUrl').value || PRESET_PHOTOS[0].url;
      const userLat = (this.userLocation && this.userLocation.lat) ? this.userLocation.lat : 19.0760;
      const userLng = (this.userLocation && this.userLocation.lng) ? this.userLocation.lng : 72.8777;

      const newDonation = {
        id: 'ps-' + Date.now(),
        title: nameInput.value + ' – ' + qtyInput.value + ' ' + unitSelect.value,
        foodType: typeSelect.value,
        category: 'Cooked meal',
        quantity: parseInt(qtyInput.value, 10) || 50,
        unit: unitSelect.value,
        prepTime: new Date(document.getElementById('foodPrepInput').value).toISOString(),
        expiryTime: new Date(expiryInput.value).toISOString(),
        storageMethod: 'Freshly packed container',
        allergens: 'None reported',
        packagingTime: 'Packed fresh at dispatch',
        pickupInstructions: document.getElementById('foodInstructionsInput').value || 'Call on arrival at service entrance.',
        location: {
          name: document.getElementById('foodLocationName').value || 'Commercial Kitchen',
          address: document.getElementById('foodLocationAddress').value || '12 Express Way, Central',
          lat: userLat,
          lng: userLng
        },
        distance: '0.8 km away',
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
      this.showToast('Donation successfully posted! Nearby NGOs and communities have been notified.', 'success', 'Donation Published');
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

    // Only active, unreserved meals belong in the live browsing feed
    let list = PlateStore.getDonations().filter(item => item.status === 'posted');

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
          <p style="font-size: 1.1rem; color: #7A756C; margin-bottom: 12px;">No active surplus food listings match your search.</p>
          <button class="btn btn-outline-green btn-sm" onclick="App.resetFilters()">Reset Filters</button>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(item => {
      const urgency = this.calculateUrgency(item.expiryTime);

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
              <button class="btn btn-orange btn-sm" onclick="App.claimDonation('${item.id}')"><i class="fa-solid fa-handshake"></i> Claim Meals</button>
              <button class="btn btn-outline-green btn-sm" onclick="App.showDetail('${item.id}')"><i class="fa-solid fa-circle-info"></i> Details</button>
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

    // Only active, unreserved community meals
    let list = PlateStore.getDonations().filter(i => i.status === 'posted' && (i.visibility === 'community' || i.visibility === 'ngo'));

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
      this.showToast('Listing not found or expired', 'error', 'Error');
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

    const mapBadgeText = document.getElementById('detailMapBadgeText');
    if (mapBadgeText) {
      const latStr = (item.location && item.location.lat) ? Number(item.location.lat).toFixed(4) : '19.0760';
      const lngStr = (item.location && item.location.lng) ? Number(item.location.lng).toFixed(4) : '72.8777';
      mapBadgeText.textContent = `${item.location.name} (${latStr}, ${lngStr})`;
    }

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

    // Render Restaurant Food Reviews by NGOs & Communities (Bottom Right)
    this.renderRestaurantReviews(item);
  },

  renderRestaurantReviews(item) {
    const container = document.getElementById('detailReviewsContainer');
    if (!container) return;

    const restName = (item.donor && item.donor.organization) ? item.donor.organization : (item.location && item.location.name ? item.location.name : 'Restaurant Partner');
    const reviews = PlateStore.getReviews(restName);

    if (reviews.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 20px 10px; background: #fafaf8; border-radius: 8px; border: 1px dashed #d5cdbc;">
          <i class="fa-solid fa-star" style="color: #cbd5e1; font-size: 1.5rem; margin-bottom: 6px;"></i>
          <p style="font-size: 0.85rem; color: #7a756c; margin: 0;">No reviews yet for this kitchen. Be the first NGO or volunteer to review!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = reviews.map(r => {
      const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
      const isNGO = r.reviewerType === 'ngo';
      const typeBadge = isNGO 
        ? '<span class="badge" style="background:#eff6ff; color:#1d4ed8; font-size:10px; padding:2px 6px;"><i class="fa-solid fa-handshake-angle"></i> NGO Review</span>'
        : '<span class="badge" style="background:#f0fdf4; color:#15803d; font-size:10px; padding:2px 6px;"><i class="fa-solid fa-users"></i> Community</span>';

      return `
        <div class="review-item-bubble">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
            <div>
              <div style="font-size: 0.88rem; font-weight: 700; color: #1f2937; display: flex; align-items: center; gap: 6px;">
                ${r.reviewerName}
                ${r.verifiedRescue ? '<span title="Verified Food Rescue Handover" style="color:var(--color-forest-green); font-size:11px;"><i class="fa-solid fa-circle-check"></i></span>' : ''}
              </div>
              <div style="font-size: 0.76rem; color: #6b7280;">${r.reviewerOrg} · <span style="color:#9ca3af;">${r.date}</span></div>
            </div>
            <div style="text-align: right;">
              <span class="review-stars">${stars}</span>
              <div>${typeBadge}</div>
            </div>
          </div>
          <p style="font-size: 0.83rem; color: #374151; line-height: 1.4; margin: 6px 0 0 0;">
            "${r.comment}"
          </p>
        </div>
      `;
    }).join('');
  },

  toggleReviewForm() {
    const box = document.getElementById('inlineAddReviewBox');
    const btn = document.getElementById('openReviewFormBtn');
    if (!box) return;
    const isHidden = box.style.display === 'none';
    box.style.display = isHidden ? 'block' : 'none';
    if (btn) btn.innerHTML = isHidden ? '<i class="fa-solid fa-xmark"></i> Close' : '<i class="fa-solid fa-pen"></i> Add Review';
  },

  handleReviewSubmit(e) {
    e.preventDefault();
    const item = PlateStore.getDonationById(this.activeDetailId);
    if (!item) return;

    const user = PlateStore.getCurrentUser();
    const rating = parseInt(document.getElementById('reviewRatingSelect').value, 10) || 5;
    const org = document.getElementById('reviewOrgInput').value.trim() || 'Community Partner';
    const comment = document.getElementById('reviewCommentInput').value.trim();

    const restName = (item.donor && item.donor.organization) ? item.donor.organization : (item.location && item.location.name ? item.location.name : 'Restaurant Partner');

    const newRev = {
      id: 'rev-' + Date.now(),
      restaurant: restName,
      donorOrg: restName,
      reviewerName: (user.isLoggedIn && user.name !== 'Guest') ? user.name : 'Verified Rescue Volunteer',
      reviewerType: user.role === 'community' ? 'community' : 'ngo',
      reviewerOrg: org,
      rating: rating,
      date: 'Just now',
      comment: comment,
      foodTag: item.title,
      verifiedRescue: true
    };

    PlateStore.addReview(newRev);
    this.showToast('Thank you! Your food quality review has been published.', 'success', 'Review Added');
    
    // Reset form and refresh reviews
    document.getElementById('reviewCommentInput').value = '';
    this.toggleReviewForm();
    this.renderRestaurantReviews(item);
  },

  currentAwardsFilter: 'all',

  filterAwards(tier) {
    this.currentAwardsFilter = tier;
    document.querySelectorAll('.badge-filter-btn').forEach(btn => {
      if (btn.getAttribute('data-tier') === tier) btn.classList.add('active');
      else btn.classList.remove('active');
    });
    this.renderAwardsPage();
  },

  renderAwardsPage() {
    const container = document.getElementById('restaurantAwardsContainer');
    if (!container) return;

    let list = RESTAURANT_AWARDS;
    if (this.currentAwardsFilter !== 'all') {
      list = list.filter(r => r.tier === this.currentAwardsFilter);
    }

    container.innerHTML = list.map(rest => {
      const stars = '★'.repeat(Math.round(rest.rating));
      return `
        <div class="award-card">
          <div class="award-card-header">
            <img src="${rest.image}" alt="${rest.name}" loading="lazy" />
            <span class="award-tier-badge" style="background:${rest.tierBg}; color:${rest.tierColor};">
              <i class="fa-solid fa-crown" style="margin-right:4px;"></i> ${rest.tier}
            </span>
          </div>
          <div class="award-card-body">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
              <div>
                <h3 style="font-size: 1.15rem; font-weight: 700; color: #1f2937; margin-bottom: 2px;">${rest.name}</h3>
                <span style="font-size: 0.8rem; color: #6b7280;"><i class="fa-solid fa-location-dot" style="color:var(--color-forest-green);"></i> ${rest.location}</span>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 0.95rem; font-weight: 800; color: #b45309;">${rest.rating} <span style="color:#f59e0b; font-size:0.85rem;">★</span></div>
                <div style="font-size: 0.72rem; color: #9ca3af;">${rest.reviewCount} NGO reviews</div>
              </div>
            </div>

            <!-- Stats Ribbon -->
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 8px; margin: 12px 0; text-align: center;">
              <div>
                <div style="font-size: 0.95rem; font-weight: 800; color: var(--color-forest-green);">${rest.stats.mealsRescued.toLocaleString()}</div>
                <div style="font-size: 0.7rem; color: #64748b; text-transform: uppercase;">Meals Saved</div>
              </div>
              <div style="border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">
                <div style="font-size: 0.95rem; font-weight: 800; color: #c2410c;">${rest.stats.kgSaved} kg</div>
                <div style="font-size: 0.7rem; color: #64748b; text-transform: uppercase;">Rescued</div>
              </div>
              <div>
                <div style="font-size: 0.95rem; font-weight: 800; color: #4338ca;">${rest.stats.co2Prevented}</div>
                <div style="font-size: 0.7rem; color: #64748b; text-transform: uppercase;">CO₂ Avoided</div>
              </div>
            </div>

            <!-- Earned Badges -->
            <div style="margin-bottom: 14px;">
              <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.5px;">Earned Food Rescue Badges:</div>
              <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                ${rest.badges.map(b => `
                  <span class="award-badge-pill" title="${b.desc}">
                    <i class="fa-solid ${b.icon}" style="color:${b.color};"></i> ${b.name}
                  </span>
                `).join('')}
              </div>
            </div>

            <!-- Certificate Action Button -->
            <div style="margin-top: auto; border-top: 1px solid #f1f5f9; padding-top: 12px;">
              <button class="btn btn-outline-green btn-sm" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 6px;" onclick="App.openCertModal('${rest.id}')">
                <i class="fa-solid fa-certificate" style="color: #f59e0b;"></i> View Verified Certificate
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  openCertModal(restId) {
    const rest = RESTAURANT_AWARDS.find(r => r.id === restId);
    if (!rest) return;

    const overlay = document.getElementById('certModalOverlay');
    if (!overlay) return;

    document.getElementById('certModalRecipient').textContent = rest.name;
    document.getElementById('certModalTitle').textContent = rest.certificate.title;
    document.getElementById('certModalId').textContent = rest.certificate.id;
    document.getElementById('certModalDate').textContent = rest.certificate.issueDate;
    document.getElementById('certModalGrade').textContent = rest.certificate.level;
    document.getElementById('certModalDesc').textContent = `Awarded for successfully diverting ${rest.stats.mealsRescued.toLocaleString()} surplus meals (${rest.stats.kgSaved} kg) from landfills to authorized shelters and communities with a verified rating of ${rest.rating} ★.`;

    overlay.classList.add('active');
  },

  closeCertModal() {
    const overlay = document.getElementById('certModalOverlay');
    if (overlay) overlay.classList.remove('active');
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

    this.showToast(`You have claimed this food donation! Pickup OTP: <strong>${item.otp}</strong>`, 'success', 'Meals Claimed 🎉');
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

    this.showToast(`You reserved this meal pack! Show OTP <strong>${item.otp}</strong> at pickup.`, 'success', 'Meal Pack Reserved ✅');
    this.showDetail(id);
  },

  advanceStep(id, nextStep, nextStatus) {
    PlateStore.updateDonation(id, {
      currentStep: nextStep,
      status: nextStatus
    });
    this.showToast(`Order updated to Step ${nextStep} (${nextStatus.replace('_', ' ').toUpperCase()})`, 'info', 'Status Updated');
    this.showDetail(id);
  },

  toggleCommunityFallback(id) {
    const item = PlateStore.getDonationById(id);
    if (!item) return;

    PlateStore.updateDonation(id, {
      visibility: 'community'
    });

    this.showToast('Listing has been offered to nearby Communities and is now visible in the Community Meals feed.', 'info', 'Offered to Community 📣');
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