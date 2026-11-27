// @ts-nocheck
/* global VME_DATA, VME_EV_DATA */
/**
 * VME - Vehicle Mechanic Electrician
 * Core Application Engine & State Controller
 */

// Application State
const state = {
  activeView: 'home', // 'home', 'vehicle', 'service', 'repair', 'profile', 'about', 'orders', 'offers', 'contact', 'help', 'reviews', 'settings', 'mechanic_dash', 'electrician_dash'
  userRole: 'customer', // 'customer' | 'mechanic' | 'electrician'
  isLoggedIn: false,
  currentUser: {
    id: '',
    name: 'Guest',
    username: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    city: '',
    bio: '',
    avatar: '👨‍💼',
    userType: 'customer',
    paymentMethods: []
  },
  
  // User's Registered Garage Vehicles
  vehicles: [
    {
      id: 'v1',
      type: 'ev_cars',
      typeName: 'EV Cars',
      brand: 'Tata Motors',
      model: 'Nexon EV',
      regNumber: 'KA 03 MK 7721',
      year: '2023',
      batteryHealth: '97% SOH',
      lastService: '12 Jan 2026'
    },
    {
      id: 'v2',
      type: 'bikes',
      typeName: 'Bikes',
      brand: 'Royal Enfield',
      model: 'Classic 350',
      regNumber: 'KA 01 EK 4482',
      year: '2022',
      batteryHealth: '12.6V Good',
      lastService: '04 Oct 2025'
    }
  ],

  // Booking Wizard Step & State
  addVehicleDraft: { type: '', brand: '', model: '' },
  bookingStep: 1,
  bookingDraft: {
    vehicleType: 'ev_cars',
    brand: 'Tata Motors',
    model: 'Nexon EV',
    category: 'emergency',
    problemId: 'em_ev_dead_bms',
    problemName: 'EV Main Battery Dead / BMS Safety Lockout',
    evIssueType: 'mechanical',
    evIssueId: '',
    registrationNumber: '',
    attachments: [],
    laborCharge: null,
    laborPeriod: null,
    problemDescription: '',
    location: 'Outer Ring Road near Ecospace Tech Park, Bellandur, Bengaluru',
    lat: 12.9260,
    lng: 77.6762,
    technicianType: 'electrician', // 'mechanic' or 'electrician'
    paymentMethod: 'upi_gpay',
    appliedOffer: null
  },
  nearbyTechnicians: [],
  nearbyTechniciansKey: '',
  nearbyTechniciansStatus: 'idle',
  nearbyTechniciansError: '',
  nearbyTechniciansRequestId: 0,

  // Active Ongoing Booking (null or object)
  activeOrder: {
    id: 'VME-SOS-9042',
    date: 'Today, Just Now',
    status: 'en_route', // 'submitted', 'assigned', 'en_route', 'arrived', 'completed'
    vehicle: 'Tata Motors Nexon EV (KA 03 MK 7721)',
    category: 'Emergency Service',
    problem: 'EV Main Battery Dead / BMS Safety Lockout',
    laborCharge: null,
    laborPeriod: null,
    technician: {
      id: 'TECH-102',
      name: 'Vikas Sundaram',
      role: 'Electrician',
      rating: 4.95,
      phone: '+91 97410 44821',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80',
      workshop: 'Vikas Volt EV & Auto Electricals',
      etaMins: 8,
      distanceKm: 2.1
    },
    location: 'Outer Ring Road near Ecospace Tech Park, Bengaluru',
    paymentMethod: 'Google Pay (UPI)',
    messages: [
      { sender: 'tech', text: 'Hello Madhu MK! I have received your EV battery emergency request. Heading towards your location with specialized BMS diagnostic kit.', time: '10 mins ago' },
      { sender: 'user', text: 'Thanks Vikas! The car is parked on the left shoulder right before the flyover.', time: '8 mins ago' },
      { sender: 'tech', text: 'Noted! I am crossing Central Mall now, estimated arrival in 7 minutes.', time: '4 mins ago' }
    ]
  },

  // Past Service Orders
  pastOrders: [
    {
      id: 'VME-ORD-8114',
      date: '14 Jan 2026',
      status: 'completed',
      vehicle: 'Royal Enfield - Classic 350 (KA 01 EK 4482)',
      category: 'Basic Services',
      problem: 'Engine Oil Change + Sump Washer (10W-30 / 20W-40)',
      technician: {
        name: 'Rajesh Sharma',
        role: 'Mechanic',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80'
      },
      cost: 'Parts and labor quoted separately',
      ratingGiven: 5,
      invoiceId: 'INV-2026-8114'
    },
    {
      id: 'VME-ORD-7629',
      date: '02 Dec 2025',
      status: 'completed',
      vehicle: 'Tata Motors Nexon EV (KA 03 MK 7721)',
      category: 'Replace',
      problem: 'EV Anti-Bacterial HEPA Cabin Air Filter',
      technician: {
        name: 'Vikas Sundaram',
        role: 'Electrician',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80'
      },
      cost: 'Parts and labor quoted separately',
      ratingGiven: 5,
      invoiceId: 'INV-2025-7629'
    }
  ],

  // In-App Direct VoIP Calling State
  callActive: false,
  callTimerSec: 0,
  callTimerInterval: null,
  callMuted: false,
  callSpeaker: true,

  // Settings & Permissions State
  permissions: {
    locationPrivacy: 'while_using', // 'while_using', 'always', 'never'
    contactPermission: true,
    bankingPermission: true,
    cameraPermission: true,
    micSpeakerPermission: true,
    dataSharing: false
  },

  security: {
    biometricLogin: true,
    twoFactorAuth: true
  },

  connectedAccounts: {
    google: true,
    apple: false,
    whatsapp: true
  },

  theme: 'dark', // 'dark' or 'light'
};

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initSpotlightEffects();
  initTheme();
  initNavigation();
  initRoleSegmentSwitcher();
  initBookingWizard();
  initInAppCall();
  initInAppChat();
  initLiveMapTracker();
  initOrdersView();
  initOffersView();
  initReviewsView();
  initVehicleGarage();
  initSettingsView();
  initAuthModals();
  renderProfileView();
  updateUIForRole();
  renderActiveOrderBanner();
  void initializeAuthentication();
});

function initSpotlightEffects() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const selector = '.cat-card-tile, .vehicle-type-card, .payment-method-card, .tech-type-card, .settings-card, .assigned-tech-card, .status-tracker-card, .nearby-technician-row, .quick-info-card, .offer-card, .review-card';
  const findSurface = target => target instanceof Element ? target.closest(selector) : null;

  document.addEventListener('pointerover', event => {
    if (event.pointerType === 'touch') return;
    const surface = findSurface(event.target);
    if (!surface || surface.contains(event.relatedTarget)) return;

    surface.classList.add('vme-spotlight-surface');
    if (surface.matches('.cat-card-tile, .vehicle-type-card')) surface.classList.add('vme-tilt-surface');
  });

  document.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    const surface = findSurface(event.target);
    if (!surface) return;

    const bounds = surface.getBoundingClientRect();
    const offsetX = event.clientX - bounds.left;
    const offsetY = event.clientY - bounds.top;
    surface.style.setProperty('--spotlight-x', `${offsetX}px`);
    surface.style.setProperty('--spotlight-y', `${offsetY}px`);
    if (surface.classList.contains('vme-tilt-surface')) {
      surface.style.setProperty('--tilt-x', `${((offsetX / bounds.width) - 0.5) * 3}deg`);
      surface.style.setProperty('--tilt-y', `${(0.5 - (offsetY / bounds.height)) * 3}deg`);
    }
  });

  document.addEventListener('pointerout', event => {
    const surface = findSurface(event.target);
    if (!surface || surface.contains(event.relatedTarget)) return;
    surface.style.removeProperty('--tilt-x');
    surface.style.removeProperty('--tilt-y');
  });
}

// Toast System
const VME_ICON_NAMES = new Set([
  'banknote', 'battery-charging', 'bike', 'car', 'car-front', 'check',
  'clipboard', 'credit-card', 'eye', 'eye-off', 'fuel', 'globe', 'headphones', 'landmark',
  'link', 'lock-keyhole', 'map-pin', 'message-circle', 'mic', 'navigation', 'package', 'phone',
  'phone-off', 'send', 'settings-2', 'shield', 'siren', 'smartphone', 'snowflake', 'sparkles',
  'plus', 'star', 'tag', 'trash-2', 'triangle-alert', 'truck', 'user-round', 'wallet-cards', 'volume-2', 'wrench', 'zap'
]);

const VME_PORTRAIT_IMAGES = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80'
];

function renderIconImage(name, className = '') {
  const iconName = VME_ICON_NAMES.has(name) ? name : 'wrench';
  return `<img class="vme-icon-image ${escapeHTML(className)}" src="https://cdn.jsdelivr.net/npm/lucide-static@0.468.0/icons/${iconName}.svg" alt="" aria-hidden="true" loading="lazy">`;
}

function renderPortraitImage(source, className = '') {
  const portraitUrl = VME_PORTRAIT_IMAGES.includes(source) ? source : VME_PORTRAIT_IMAGES[0];
  return `<img class="vme-person-image ${escapeHTML(className)}" src="${portraitUrl}" alt="" aria-hidden="true" loading="lazy">`;
}

function getProfilePortrait(avatar) {
  const portraitIndex = ['👨‍💼', '👩‍💼', '👨‍🔧', '⚡👩‍🔧'].indexOf(avatar);
  return VME_PORTRAIT_IMAGES[portraitIndex] || VME_PORTRAIT_IMAGES[0];
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-message';
  
  const iconNames = { success: 'check', error: 'triangle-alert', call: 'phone', info: 'sparkles' };
  const iconContainer = document.createElement('span');
  iconContainer.innerHTML = renderIconImage(iconNames[type] || iconNames.info, 'toast-icon');
  const messageElement = document.createElement('span');
  messageElement.textContent = message;
  toast.append(iconContainer, messageElement);
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

// ==========================================================================
// THEME CONTROLLER
// ==========================================================================
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('vme_theme_v2') || 'dark';
  setTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }
}

function setTheme(theme) {
  state.theme = theme;
  localStorage.setItem('vme_theme_v2', theme);
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  
  if (theme === 'light') {
    document.body.classList.add('light-theme');
    if (themeToggleBtn) themeToggleBtn.innerHTML = '🌙';
  } else {
    document.body.classList.remove('light-theme');
    if (themeToggleBtn) themeToggleBtn.innerHTML = '☀️';
  }
}

// ==========================================================================
// NAVIGATION (Top Bar, Drawer, Base Bar)
// ==========================================================================
function initNavigation() {
  // Base Nav Items
  const baseNavItems = document.querySelectorAll('.base-nav-item');
  baseNavItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetView = item.dataset.view;
      if (targetView) {
        navigateTo(targetView);
      }
    });
  });

  // SOS Quick Floating Button
  const sosBtn = document.getElementById('baseSosBtn');
  if (sosBtn) {
    sosBtn.addEventListener('click', () => {
      state.bookingDraft.category = 'emergency';
      state.bookingStep = 1;
      navigateTo('service');
      showToast('Emergency SOS Mode Activated! Rapid dispatch ready.', 'error');
    });
  }

  // Drawer Open/Close
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const sideDrawer = document.getElementById('sideDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');

  function openDrawer() {
    sideDrawer.classList.add('active');
    drawerBackdrop.classList.add('active');
  }

  function closeDrawer() {
    sideDrawer.classList.remove('active');
    drawerBackdrop.classList.remove('active');
  }

  if (menuToggleBtn) menuToggleBtn.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  const drawerLoginBtn = document.getElementById('drawerLoginBtn');
  if (drawerLoginBtn) {
    drawerLoginBtn.addEventListener('click', () => {
      closeDrawer();
      openAuthModal('login');
    });
  }

  // Drawer Menu Items
  const drawerMenuItems = document.querySelectorAll('.drawer-menu-item');
  drawerMenuItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetView = item.dataset.view;
      if (targetView) {
        navigateTo(targetView);
        closeDrawer();
      }
    });
  });

  // Drawer Logout Button
  const drawerLogoutBtn = document.getElementById('drawerLogoutBtn');
  if (drawerLogoutBtn) {
    drawerLogoutBtn.addEventListener('click', async () => {
      closeDrawer();
      await logout();
    });
  }

  // Brand Logo Click -> Go to Home
  const brandLogo = document.getElementById('brandLogoClick');
  if (brandLogo) {
    brandLogo.addEventListener('click', () => navigateTo('home'));
  }

  // Quick Account Pill -> Go to Profile
  const userQuickPill = document.getElementById('userQuickPill');
  if (userQuickPill) {
    userQuickPill.addEventListener('click', () => navigateTo('profile'));
  }
}

function navigateTo(viewId) {
  state.activeView = viewId;

  // Hide all view sections
  document.querySelectorAll('.app-view').forEach(view => {
    view.classList.remove('active');
  });

  // Show target view
  const targetView = document.getElementById(`view-${viewId}`);
  if (targetView) {
    targetView.classList.add('active');
  }

  // Update Base Nav active indicator
  document.querySelectorAll('.base-nav-item').forEach(item => {
    if (item.dataset.view === viewId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Specific view refresh hooks
  if (viewId === 'orders') renderOrdersList();
  if (viewId === 'profile') renderProfileView();
  if (viewId === 'vehicle') renderVehicleGarage();
  if (viewId === 'service') renderWizardStep();
  if (viewId === 'repair') renderRepairDiagnosticView();
  if (viewId === 'reviews') renderReviewsList();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Role Segment Switcher (Demo switcher between Customer, Mechanic, Electrician)
function initRoleSegmentSwitcher() {
  const roleSegBtns = document.querySelectorAll('.role-seg-btn');
  const roleBadgePill = document.getElementById('roleBadgePill');

  roleSegBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedRole = btn.dataset.role;
      setRole(selectedRole);
    });
  });

  if (roleBadgePill) {
    roleBadgePill.addEventListener('click', () => {
      if (state.isLoggedIn) return;
      // Rotate role
      if (state.userRole === 'customer') setRole('mechanic');
      else if (state.userRole === 'mechanic') setRole('electrician');
      else setRole('customer');
    });
  }
}

function setRole(role) {
  if (state.isLoggedIn && role !== state.currentUser.userType) {
    showToast('Your account does not have permission to use that role.', 'error');
    return;
  }

  state.userRole = role;

  // Update segmented buttons
  document.querySelectorAll('.role-seg-btn').forEach(btn => {
    if (btn.dataset.role === role) btn.classList.add('active');
    else btn.classList.remove('active');
  });

  // Update badge pill
  const roleBadgePill = document.getElementById('roleBadgePill');
  if (roleBadgePill) {
    let icon = '👤';
    let label = 'Customer Mode';
    if (role === 'mechanic') { icon = '👨‍🔧'; label = 'Mechanic'; }
    if (role === 'electrician') { icon = '⚡👨‍💻'; label = 'Electrician'; }
    roleBadgePill.innerHTML = `<span>${icon}</span> <span>${label}</span>`;
  }

  updateUIForRole();
  if (state.activeView !== 'home') navigateTo('home');
  showToast(`Switched to ${role.toUpperCase()} mode!`, 'info');
}

function updateUIForRole() {
  const customerSections = document.querySelectorAll('.customer-only');
  const mechanicSections = document.querySelectorAll('.mechanic-only');
  const electricianSections = document.querySelectorAll('.electrician-only');
  document.querySelectorAll('.role-seg-btn').forEach(button => {
    button.disabled = state.isLoggedIn && button.dataset.role !== state.currentUser.userType;
  });

  if (state.userRole === 'customer') {
    customerSections.forEach(el => el.style.display = '');
    mechanicSections.forEach(el => el.style.display = 'none');
    electricianSections.forEach(el => el.style.display = 'none');
  } else if (state.userRole === 'mechanic') {
    customerSections.forEach(el => el.style.display = 'none');
    mechanicSections.forEach(el => el.style.display = '');
    electricianSections.forEach(el => el.style.display = 'none');
    renderMechanicDashboard();
  } else if (state.userRole === 'electrician') {
    customerSections.forEach(el => el.style.display = 'none');
    mechanicSections.forEach(el => el.style.display = 'none');
    electricianSections.forEach(el => el.style.display = '');
    renderElectricianDashboard();
  }
}

// Active Order Floating Banner on Home View
function renderActiveOrderBanner() {
  const container = document.getElementById('activeOrderBannerContainer');
  if (!container) return;

  if (state.activeOrder && state.activeOrder.status !== 'completed') {
    container.innerHTML = `
      <div class="active-order-floating-banner">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="banner-pulse-dot"></div>
          <div>
            <div style="font-weight: 700; font-size: 0.95rem; color: #fff;">
              Active Request: ${state.activeOrder.problem}
            </div>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">
              Assigned: <strong>${state.activeOrder.technician.name}</strong> (${state.activeOrder.technician.role}) • ETA: <strong style="color: var(--primary-light);">${state.activeOrder.technician.etaMins} mins</strong>
            </div>
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn-primary" style="padding: 8px 16px; font-size: 0.85rem;" onclick="openInAppCall('${state.activeOrder.technician.name}', '${state.activeOrder.technician.role}')">
            ${renderIconImage('phone')} Direct Call
          </button>
          <button class="btn-secondary" style="padding: 8px 16px; font-size: 0.85rem;" onclick="openInAppChat()">
            ${renderIconImage('message-circle')} Live Chat
          </button>
          <button class="btn-secondary" style="padding: 8px 16px; font-size: 0.85rem;" onclick="navigateTo('orders')">
            ${renderIconImage('map-pin')} Track Live
          </button>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = '';
  }
}

// ==========================================================================
// STEP-BY-STEP SERVICE BOOKING WIZARD (7 Detailed Steps)
// ==========================================================================
function initBookingWizard() {
  // Stepper Node Clicks
  const stepperNodes = document.querySelectorAll('.wizard-step-node');
  stepperNodes.forEach(node => {
    node.addEventListener('click', () => {
      const step = Number.parseInt(node.dataset.step, 10);
      // Allow going back to previous steps
      if (step < state.bookingStep || step === 1) {
        state.bookingStep = step;
        renderWizardStep();
      }
    });
  });

  // Wizard Footer Nav Buttons
  const nextBtn = document.getElementById('wizardNextBtn');
  const prevBtn = document.getElementById('wizardPrevBtn');

  if (nextBtn) {
    nextBtn.addEventListener('click', handleWizardNext);
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', handleWizardPrev);
  }
}

function handleWizardNext() {
  const requirements = {
    1: [state.bookingDraft.vehicleType, 'Please select a vehicle type to proceed.'],
    2: [state.bookingDraft.brand && state.bookingDraft.model, 'Please select a Brand and Model.'],
    3: [state.bookingDraft.category, 'Please select a service category.'],
    4: [state.bookingDraft.problemId, 'Please select a service task.']
  };
  const requirement = requirements[state.bookingStep];
  if (requirement && !hasBookingSelection(...requirement)) return;

  if (state.bookingStep === 5 && !prepareBookingPaymentStep()) return;
  if (state.bookingStep === 6) {
    completeBookingSubmission();
    return;
  }

  state.bookingStep += 1;
  renderWizardStep();
}

function hasBookingSelection(value, message) {
  if (value) return true;
  showToast(message, 'error');
  return false;
}

function prepareBookingPaymentStep() {
  const descInput = document.getElementById('serviceProblemDescInput');
  const locationInput = document.getElementById('serviceLocationInput');
  const registrationInput = document.getElementById('serviceRegistrationInput');
  const mediaInput = document.getElementById('serviceMediaInput');
  if (descInput) state.bookingDraft.problemDescription = descInput.value;
  if (locationInput) state.bookingDraft.location = locationInput.value.trim();
  if (registrationInput) state.bookingDraft.registrationNumber = registrationInput.value.trim();
  if (mediaInput) state.bookingDraft.attachments = Array.from(mediaInput.files || []).map(file => file.name);
  if (!hasBookingSelection(state.bookingDraft.location, 'Please enter a service location.')) return false;
  if (state.bookingDraft.vehicleType.startsWith('ev_') &&
      !hasBookingSelection(state.bookingDraft.registrationNumber, 'Please enter the EV registration number.')) return false;

  const labor = getLaborRate();
  state.bookingDraft.laborCharge = labor.amount;
  state.bookingDraft.laborPeriod = labor.period;
  return true;
}

function handleWizardPrev() {
  if (state.bookingStep > 1) {
    state.bookingStep--;
    renderWizardStep();
  }
}

function renderWizardStep() {
  updateWizardStepper();
  updateWizardStepVisibility();
  updateWizardFooter();
  renderCurrentWizardStep();
}

function updateWizardStepper() {
  // Update Stepper indicators
  document.querySelectorAll('.wizard-step-node').forEach(node => {
    const step = Number.parseInt(node.dataset.step, 10);
    node.classList.toggle('active', step === state.bookingStep);
    node.classList.toggle('completed', step < state.bookingStep);
  });
}

function updateWizardStepVisibility() {
  document.querySelectorAll('.wizard-step-content').forEach(stepBody => {
    stepBody.classList.remove('active');
  });

  const activeStepBody = document.getElementById(`wizardStep${state.bookingStep}`);
  if (activeStepBody) {
    activeStepBody.classList.add('active');
  }
}

function updateWizardFooter() {
  const prevBtn = document.getElementById('wizardPrevBtn');
  const nextBtn = document.getElementById('wizardNextBtn');
  const wizardFooter = document.getElementById('wizardFooterNav');

  if (wizardFooter) wizardFooter.style.display = state.bookingStep === 7 ? 'none' : 'flex';
  if (state.bookingStep === 7) return;

  if (prevBtn) prevBtn.style.display = state.bookingStep === 1 ? 'none' : 'inline-flex';
  if (nextBtn) {
    nextBtn.innerHTML = state.bookingStep === 6
      ? `<span>Confirm & Submit Request</span> ${renderIconImage('sparkles')}`
      : '<span>Next Step</span> <span>→</span>';
  }
}

function renderCurrentWizardStep() {
  const renderers = {
    1: renderStep1VehicleTypes,
    2: renderStep2BrandsAndModels,
    3: renderStep3Categories,
    4: renderStep4Problems,
    5: renderStep5ReportAndLocation,
    6: renderStep6PaymentMethods,
    7: renderStep7Congratulations
  };
  renderers[state.bookingStep]?.();
}

// Step 1: Vehicle Types
function renderStep1VehicleTypes() {
  const grid = document.getElementById('vehicleTypesGrid');
  if (!grid) return;

  grid.innerHTML = VME_DATA.vehicleTypes.map(vt => {
    const isSelected = state.bookingDraft.vehicleType === vt.id;
    return `
      <div class="vehicle-type-card ${isSelected ? 'selected' : ''}" onclick="selectVehicleType('${vt.id}')">
        <div class="vt-icon">${renderIconImage(vt.icon, 'vehicle-type-icon')}</div>
        <div class="vt-title">${vt.name}</div>
        <div class="vt-desc">${vt.desc}</div>
      </div>
    `;
  }).join('');
}

function getVehicleCatalog(typeId) {
  const catalogType = ['petrol_hatchback', 'diesel_hatchback', 'petrol_sedan', 'diesel_sedan'].includes(typeId)
    ? 'cars'
    : typeId;
  return VME_DATA.catalog[catalogType] || {};
}

window.selectVehicleType = function(typeId) {
  state.bookingDraft.vehicleType = typeId;
  // Reset brand & model when type changes
  const catalog = getVehicleCatalog(typeId);
  const availableBrands = Object.keys(catalog);
  state.bookingDraft.brand = availableBrands[0] || '';
  const models = catalog[state.bookingDraft.brand] || [];
  state.bookingDraft.model = models[0] || '';

  // Auto assign technician preference based on vehicle type
  if (typeId.startsWith('ev_')) {
    state.bookingDraft.technicianType = 'electrician';
  } else {
    state.bookingDraft.technicianType = 'mechanic';
  }

  const firstTask = getApplicableServiceTasks(state.bookingDraft.category)[0];
  state.bookingDraft.problemId = firstTask?.id || '';
  state.bookingDraft.problemName = firstTask?.name || '';
  state.bookingDraft.evIssueId = '';
  state.bookingDraft.evIssueType = 'mechanical';
  state.bookingDraft.registrationNumber = '';
  renderStep1VehicleTypes();
};

// Step 2: Show all documented brands and their example models for the selected type.
function renderStep2BrandsAndModels() {
  const modelsGridContainer = document.getElementById('modelsGridContainer');
  const currentVehicleTypeBadge = document.getElementById('currentVehicleTypeBadge');

  const selectedTypeObj = VME_DATA.vehicleTypes.find(v => v.id === state.bookingDraft.vehicleType);
  if (currentVehicleTypeBadge && selectedTypeObj) {
    currentVehicleTypeBadge.innerHTML = `${renderIconImage(selectedTypeObj.icon, 'inline-type-icon')} ${escapeHTML(selectedTypeObj.name)}`;
  }

  const catalogForType = getVehicleCatalog(state.bookingDraft.vehicleType);
  const brands = Object.keys(catalogForType);
  const selectedBrandModels = catalogForType[state.bookingDraft.brand] || [];
  if (!selectedBrandModels.includes(state.bookingDraft.model)) {
    const firstBrandWithModels = brands.find(brand => catalogForType[brand].length > 0);
    state.bookingDraft.brand = firstBrandWithModels || '';
    state.bookingDraft.model = catalogForType[state.bookingDraft.brand]?.[0] || '';
  }

  if (modelsGridContainer) {
    modelsGridContainer.innerHTML = brands.map(brand => `
      <section class="brand-model-group">
        <h4 class="brand-model-heading">${brand}</h4>
        ${catalogForType[brand].length ? `<div class="brand-model-options">
          ${catalogForType[brand].map(model => {
            const isSelected = state.bookingDraft.brand === brand && state.bookingDraft.model === model;
            return `
              <button class="model-card-btn ${isSelected ? 'selected' : ''}" onclick="selectModel('${model}', '${brand}')">
                <span>${model}</span>
                <span>${isSelected ? renderIconImage('check') : ''}</span>
              </button>
            `;
          }).join('')}
        </div>` : '<p class="brand-model-empty">No example model is listed for this brand in the supplied data.</p>'}
      </section>
    `).join('');
  }
}

window.selectModel = function(model, brand) {
  state.bookingDraft.brand = brand;
  state.bookingDraft.model = model;
  renderStep2BrandsAndModels();
};

// Step 3: Service Categories (Emergency, Basic, Repair, Replace, Safety & Comfort)
function renderStep3Categories() {
  const grid = document.getElementById('categoriesSelectGrid');
  if (!grid) return;

  grid.innerHTML = VME_DATA.categories.map(cat => {
    const isSelected = state.bookingDraft.category === cat.id;
    return `
      <div class="category-select-card ${isSelected ? 'selected' : ''}" onclick="selectCategory('${cat.id}')">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <span class="category-select-icon">${renderIconImage(cat.icon)}</span>
          <span class="cat-badge-pill">${cat.badge}</span>
        </div>
        <div style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700;">
          ${cat.name}
        </div>
        <div style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.4;">
          ${cat.desc}
        </div>
      </div>
    `;
  }).join('');

  const evCategoryReference = document.getElementById('evServiceCategoryReference');
  if (evCategoryReference) {
    const isEV = state.bookingDraft.vehicleType.startsWith('ev_');
    evCategoryReference.hidden = !isEV;
    if (isEV) {
      evCategoryReference.innerHTML = `
        <h4>EV service category guide</h4>
        <div class="ev-category-guide-grid">
          ${VME_EV_DATA.serviceCategories.map(category => `
            <article>
              <strong>${escapeHTML(category.name)}</strong>
              <p>${escapeHTML(category.purpose)}</p>
              <small>${escapeHTML(category.examples)}</small>
            </article>
          `).join('')}
        </div>
      `;
    }
  }
}

window.selectCategory = function(catId) {
  state.bookingDraft.category = catId;
  const tasks = getApplicableServiceTasks(catId);
  if (tasks.length > 0) {
    state.bookingDraft.problemId = tasks[0].id;
    state.bookingDraft.problemName = tasks[0].name;
  }
  renderStep3Categories();
};

window.startBookingWithCategory = function(catId) {
  state.bookingStep = 1;
  window.selectCategory(catId);
  navigateTo('service');
};

function getApplicableServiceTasks(categoryId) {
  const vehicleType = state.bookingDraft.vehicleType;
  const taskVehicleTypes = new Set([vehicleType]);
  if (['petrol_hatchback', 'diesel_hatchback', 'petrol_sedan', 'diesel_sedan'].includes(vehicleType)) {
    taskVehicleTypes.add('cars');
  }
  return (VME_DATA.serviceTasks[categoryId] || []).filter(task =>
    task.types.includes('all') || task.types.some(type => taskVehicleTypes.has(type))
  );
}

function getLaborRate(hour = Number(new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Kolkata',
  hour: 'numeric',
  hourCycle: 'h23'
}).format(new Date()))) {
  if (hour >= 6 && hour < 18) return { amount: 500, period: 'Day (6:00 AM–6:00 PM)' };
  if (hour >= 18) return { amount: 800, period: 'Night (6:00 PM–12:00 AM)' };
  return { amount: 1000, period: 'Midnight (12:00 AM–6:00 AM)' };
}

function getBookingLaborRate() {
  if (state.bookingDraft.laborCharge == null || !state.bookingDraft.laborPeriod) {
    const labor = getLaborRate();
    state.bookingDraft.laborCharge = labor.amount;
    state.bookingDraft.laborPeriod = labor.period;
  }
  return {
    amount: state.bookingDraft.laborCharge,
    period: state.bookingDraft.laborPeriod
  };
}

// Step 4: Display Exact Problems filtered for Category and Vehicle Type!
function renderStep4Problems() {
  const container = document.getElementById('problemsListContainer');
  const catSummary = document.getElementById('problemCategorySummary');
  const issueTypeSelector = document.getElementById('evIssueTypeSelector');
  const evIssueDetails = document.getElementById('evIssueDetails');
  const evSafetyGuidance = document.getElementById('evSafetyGuidance');
  const isEV = state.bookingDraft.vehicleType.startsWith('ev_');

  const selectedCategoryObj = VME_DATA.categories.find(c => c.id === state.bookingDraft.category);
  if (catSummary && selectedCategoryObj) {
    catSummary.innerHTML = `Category: <strong>${selectedCategoryObj.name}</strong> • Vehicle: <strong>${state.bookingDraft.brand} ${state.bookingDraft.model}</strong>`;
  }

  if (!container) return;

  if (issueTypeSelector) issueTypeSelector.hidden = !isEV;
  if (evIssueDetails) evIssueDetails.hidden = !isEV;
  if (evSafetyGuidance) evSafetyGuidance.hidden = true;

  if (isEV) {
    renderEVProblems(container, issueTypeSelector, evIssueDetails, evSafetyGuidance);
    return;
  }

  renderStandardProblems(container);
}

function renderEVProblems(container, issueTypeSelector, evIssueDetails, evSafetyGuidance) {
  const issueTypes = VME_EV_DATA.issueTypes;
  if (!issueTypes.some(type => type.id === state.bookingDraft.evIssueType)) {
    state.bookingDraft.evIssueType = 'mechanical';
  }

  if (issueTypeSelector) {
    issueTypeSelector.innerHTML = issueTypes.map(type => `
      <button type="button" class="${type.id === state.bookingDraft.evIssueType ? 'selected' : ''}"
        aria-pressed="${type.id === state.bookingDraft.evIssueType}"
        onclick="selectEVIssueType('${type.id}')">${escapeHTML(type.name)}</button>
    `).join('');
  }

  const issueRecords = VME_EV_DATA.vehicleIssues[state.bookingDraft.vehicleType]?.[state.bookingDraft.evIssueType] || [];
  const problems = issueRecords.map((record, index) => ({
    id: `ev_${state.bookingDraft.vehicleType}_${state.bookingDraft.evIssueType}_${index}`,
    name: record[0],
    complaint: record[1],
    serviceCategories: getEVServiceCategorySuggestions(record[0], record[1]),
    technicianType: state.bookingDraft.evIssueType === 'electrical' ? 'electrician' : 'mechanic'
  }));

  if (!problems.some(problem => problem.id === state.bookingDraft.evIssueId)) {
    state.bookingDraft.evIssueId = problems[0]?.id || '';
  }

  updateSelectedEVIssue(problems, evSafetyGuidance);
  renderEVIssueDetails(evIssueDetails);
  renderEVProblemCards(container, problems);
}

function updateSelectedEVIssue(problems, evSafetyGuidance) {
  const selectedIssue = problems.find(problem => problem.id === state.bookingDraft.evIssueId);
  if (!selectedIssue) return;

  state.bookingDraft.problemId = selectedIssue.id;
  state.bookingDraft.problemName = selectedIssue.name;
  state.bookingDraft.technicianType = selectedIssue.technicianType;
  const guidance = VME_EV_DATA.safetyGuidance.find(item =>
    item.match.test(`${selectedIssue.name} ${selectedIssue.complaint}`)
  );
  if (!evSafetyGuidance || !guidance) return;

  evSafetyGuidance.hidden = false;
  evSafetyGuidance.innerHTML = `<strong>Safety guidance:</strong> ${escapeHTML(guidance.action)}`;
}

function renderEVIssueDetails(evIssueDetails) {
  if (!evIssueDetails) return;

  evIssueDetails.innerHTML = `
    <details>
      <summary>EV service, reporting and safety reference</summary>
      <h4>Customer report fields</h4>
      <ul>${VME_EV_DATA.reportFields.map(([field, input]) => `<li><strong>${escapeHTML(field)}:</strong> ${escapeHTML(input)}</li>`).join('')}</ul>
      <h4>Safety and professional assignment</h4>
      <ul>${VME_EV_DATA.safetyGuidance.map(item => `<li>${escapeHTML(item.action)}</li>`).join('')}</ul>
      <h4>Implementation notes</h4>
      <ul>${VME_EV_DATA.implementationNotes.map(note => `<li>${escapeHTML(note)}</li>`).join('')}</ul>
    </details>
  `;
}

function renderEVProblemCards(container, problems) {
  container.innerHTML = problems.map(problem => {
    const isSelected = state.bookingDraft.evIssueId === problem.id;
    const categoryNames = problem.serviceCategories
      .map(id => VME_DATA.categories.find(category => category.id === id)?.name)
      .filter(Boolean);
    const specialist = problem.technicianType === 'electrician' ? 'EV electrician' : 'Mechanical technician';
    return `
      <div class="problem-card-item ${isSelected ? 'selected' : ''}" role="button" tabindex="0"
        data-ev-issue-id="${escapeHTML(problem.id)}">
        <div>
          <div style="font-weight: 600; font-size: 0.95rem; color: var(--text-main);">${escapeHTML(problem.name)}</div>
          <div class="prob-meta"><span>${escapeHTML(problem.complaint)}</span></div>
          <div class="ev-issue-meta">
            <span>Suggested service: ${categoryNames.map(escapeHTML).join(', ')}</span>
            <span>Suggested professional: ${escapeHTML(specialist)}</span>
          </div>
        </div>
        <div style="text-align: right; font-size: 0.75rem; color: var(--text-muted);">
          ${isSelected ? `${renderIconImage('check')} Selected` : 'Tap to select'}
        </div>
      </div>
    `;
  }).join('');

  bindSelectableProblemCards(container, '[data-ev-issue-id]', card => {
    window.selectEVIssue(card.dataset.evIssueId);
  });
}

function renderStandardProblems(container) {
  const problems = getApplicableServiceTasks(state.bookingDraft.category);
  if (problems.length === 0) {
    container.innerHTML = `<p style="color: var(--text-secondary);">No preset problems found for this combination. Please describe in next step.</p>`;
    return;
  }

  if (!problems.some(problem => problem.id === state.bookingDraft.problemId)) {
    state.bookingDraft.problemId = problems[0].id;
    state.bookingDraft.problemName = problems[0].name;
  }

  container.innerHTML = problems.map(prob => {
    const isSelected = state.bookingDraft.problemId === prob.id;
    return `
      <div class="problem-card-item ${isSelected ? 'selected' : ''}" role="button" tabindex="0"
        data-problem-id="${escapeHTML(prob.id)}" data-problem-name="${escapeHTML(prob.name)}">
        <div>
          <div style="font-weight: 600; font-size: 0.95rem; color: var(--text-main);">
            ${escapeHTML(prob.name)}
          </div>
          <div class="prob-meta">
            <span>Technician confirms work scope before starting</span>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 0.75rem; color: var(--text-muted);">${isSelected ? `${renderIconImage('check')} Selected` : 'Tap to select'}</div>
        </div>
      </div>
    `;
  }).join('');

  bindSelectableProblemCards(container, '[data-problem-id]', card => {
    window.selectProblem(card.dataset.problemId, card.dataset.problemName);
  });
}

function bindSelectableProblemCards(container, selector, onSelect) {
  container.querySelectorAll(selector).forEach(card => {
    const selectCard = () => onSelect(card);
    card.addEventListener('click', selectCard);
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectCard();
      }
    });
  });
}

window.selectProblem = function(id, name) {
  state.bookingDraft.problemId = id;
  state.bookingDraft.problemName = name;
  renderStep4Problems();
};

window.selectEVIssueType = function(issueType) {
  if (!VME_EV_DATA.issueTypes.some(type => type.id === issueType)) return;
  state.bookingDraft.evIssueType = issueType;
  state.bookingDraft.evIssueId = '';
  renderStep4Problems();
};

window.selectEVIssue = function(issueId) {
  state.bookingDraft.evIssueId = issueId;
  renderStep4Problems();
};

function getEVServiceCategorySuggestions(name, complaint) {
  const issue = `${name} ${complaint}`;
  const categories = new Set(['repair']);
  if (/breakdown|brake failure|tyre puncture|loss of drive|vehicle loses drive|power loss|does not stop|not charging|does not charge|motor failure|motor does not|drive system fails|overheat|swelling/i.test(issue)) {
    categories.add('emergency');
  }
  if (/wear|damage|puncture|swelling|failure|fault|broken|worn/i.test(issue)) {
    categories.add('replace');
  }
  if (/inspection|diagnostic|sensor|warning|temperature|range|drains quickly|reading|communication/i.test(issue)) {
    categories.add('basic');
  }
  if (/brake|tyre|door|seat|window|wiper|camera|infotainment|air.condition|horn|lighting|dashboard|steering|suspension/i.test(issue)) {
    categories.add('safety_comfort');
  }
  return [...categories];
}

// Step 5: Report and Request (Location, Specialist Type, Problem Notes)
function renderStep5ReportAndLocation() {
  const locationInput = document.getElementById('serviceLocationInput');
  const descInput = document.getElementById('serviceProblemDescInput');
  const registrationInput = document.getElementById('serviceRegistrationInput');
  const registrationGroup = document.getElementById('registrationNumberGroup');
  const mediaGroup = document.getElementById('serviceMediaGroup');
  const techMechanicCard = document.getElementById('techTypeMechanic');
  const techElectricianCard = document.getElementById('techTypeElectrician');
  const isEV = state.bookingDraft.vehicleType.startsWith('ev_');

  if (locationInput) locationInput.value = state.bookingDraft.location;
  if (descInput) descInput.value = state.bookingDraft.problemDescription;
  if (registrationInput) registrationInput.value = state.bookingDraft.registrationNumber;
  if (registrationGroup) registrationGroup.hidden = !isEV;
  if (mediaGroup) mediaGroup.hidden = !isEV;

  updateTechnicianTypeCards(techMechanicCard, techElectricianCard);
  void loadNearbyTechnicians();

  const technicianLabel = state.bookingDraft.technicianType === 'electrician'
    ? 'EV electrician'
    : 'mechanical technician';
  const evIssueSummary = isEV
    ? `<div style="font-size: 0.82rem; color: var(--text-secondary);">${escapeHTML(state.bookingDraft.evIssueType)} issue • ${technicianLabel}</div>`
    : '';

  // Selected Summary Pill
  const summaryBox = document.getElementById('step5SummaryBox');
  if (summaryBox) {
    const labor = getBookingLaborRate();
    summaryBox.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 700;">Selected Service</div>
          <div style="font-weight: 700; color: var(--text-main); font-size: 1.05rem;">${state.bookingDraft.problemName}</div>
          <div style="font-size: 0.82rem; color: var(--text-secondary);">${state.bookingDraft.brand} ${state.bookingDraft.model}</div>
          ${evIssueSummary}
        </div>
        <div style="text-align: right;">
          <div style="font-size: 0.75rem; color: var(--text-secondary);">Labor charge · ${labor.period}</div>
          <div style="font-size: 1.1rem; font-weight: 800; color: var(--emerald);">₹${labor.amount}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">Parts/materials quoted separately</div>
        </div>
      </div>
    `;
  }
}

function updateTechnicianTypeCards(mechanicCard, electricianCard) {
  if (!mechanicCard || !electricianCard) return;

  const mechanicSelected = state.bookingDraft.technicianType === 'mechanic';
  mechanicCard.classList.toggle('selected', mechanicSelected);
  electricianCard.classList.toggle('selected', !mechanicSelected);
}

window.selectTechnicianType = function(type) {
  if (!['mechanic', 'electrician'].includes(type)) return;
  state.bookingDraft.technicianType = type;
  state.nearbyTechniciansKey = '';
  renderStep5ReportAndLocation();
};

async function loadNearbyTechnicians() {
  const container = document.getElementById('nearbyTechniciansList');
  if (!container) return;

  const { technicianType, lat, lng } = state.bookingDraft;
  const key = `${technicianType}:${lat}:${lng}`;
  if (state.nearbyTechniciansKey === key && state.nearbyTechniciansStatus !== 'idle') {
    renderNearbyTechnicians();
    return;
  }

  state.nearbyTechniciansKey = key;
  state.nearbyTechniciansStatus = 'loading';
  state.nearbyTechnicians = [];
  const requestId = ++state.nearbyTechniciansRequestId;
  renderNearbyTechnicians();

  const query = new URLSearchParams({ role: technicianType, lat: String(lat), lng: String(lng) });
  try {
    const result = await authApiRequest(`/api/technicians?${query}`);
    if (requestId !== state.nearbyTechniciansRequestId) return;
    state.nearbyTechnicians = result.technicians;
    state.nearbyTechniciansStatus = 'loaded';
  } catch (error) {
    if (requestId !== state.nearbyTechniciansRequestId) return;
    state.nearbyTechniciansStatus = 'error';
    state.nearbyTechniciansError = error.message;
  }
  renderNearbyTechnicians();
}

function renderNearbyTechnicians() {
  const container = document.getElementById('nearbyTechniciansList');
  if (!container) return;

  if (state.nearbyTechniciansStatus === 'loading') {
    container.innerHTML = '<p class="nearby-technicians-message">Searching registered technicians within 25 km…</p>';
    return;
  }
  if (state.nearbyTechniciansStatus === 'error') {
    container.innerHTML = `<p class="nearby-technicians-message">${escapeHTML(state.nearbyTechniciansError || 'Unable to load nearby technicians.')}</p>`;
    return;
  }
  if (!state.nearbyTechnicians.length) {
    container.innerHTML = `<p class="nearby-technicians-message">No registered ${state.bookingDraft.technicianType}s found within 25 km. Try another location or check back later.</p>`;
    return;
  }

  container.innerHTML = `
    <div class="nearby-technicians-heading">Registered ${state.bookingDraft.technicianType}s nearby</div>
    ${state.nearbyTechnicians.map(technician => `
      <div class="nearby-technician-row">
        <div class="nearby-technician-details">
          <strong>${escapeHTML(technician.name)}</strong>
          <span>${technician.distanceKm.toFixed(1)} km away</span>
        </div>
      </div>
    `).join('')}
  `;
}

window.detectCurrentGPS = function() {
  const locationInput = document.getElementById('serviceLocationInput');
  if (navigator.geolocation && state.permissions.locationPrivacy !== 'never') {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        state.bookingDraft.lat = pos.coords.latitude;
        state.bookingDraft.lng = pos.coords.longitude;
        state.nearbyTechniciansKey = '';
        const autoAddr = `Near GPS Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}, Bengaluru`;
        state.bookingDraft.location = autoAddr;
        if (locationInput) locationInput.value = autoAddr;
        void loadNearbyTechnicians();
        showToast('Live GPS location synchronized successfully!', 'success');
      },
      () => {
        // Fallback simulation
        const sampleAddr = 'Outer Ring Road, Kadubeesanahalli, Bengaluru, Karnataka 560103';
        state.bookingDraft.location = sampleAddr;
        state.nearbyTechniciansKey = '';
        if (locationInput) locationInput.value = sampleAddr;
        void loadNearbyTechnicians();
        showToast('Location pinpointed via network triangulation!', 'info');
      }
    );
  } else {
    const sampleAddr = '100 Feet Road, Indiranagar, Bengaluru, Karnataka';
    state.bookingDraft.location = sampleAddr;
    state.nearbyTechniciansKey = '';
    if (locationInput) locationInput.value = sampleAddr;
    void loadNearbyTechnicians();
    showToast('Location set from preset address.', 'info');
  }
};

// Step 6: Payment Methods
function renderStep6PaymentMethods() {
  const methods = [
    { id: 'upi_gpay', icon: 'smartphone', title: 'Google Pay (UPI)', desc: 'Instant 1-click UPI authorization' },
    { id: 'upi_phonepe', icon: 'wallet-cards', title: 'PhonePe (UPI)', desc: 'Scan QR or enter UPI ID' },
    { id: 'upi_paytm', icon: 'wallet-cards', title: 'Paytm UPI / Wallet', desc: 'Paytm balance, UPI & Postpaid' },
    { id: 'upi_bhim', icon: 'landmark', title: 'BHIM UPI', desc: 'Direct bank authorization via NPCI' },
    { id: 'card_debit', icon: 'credit-card', title: 'Debit Card', desc: 'Visa, Mastercard, RuPay with OTP' },
    { id: 'card_credit', icon: 'credit-card', title: 'Credit Card', desc: 'No cost EMI & reward points eligible' },
    { id: 'netbanking', icon: 'landmark', title: 'Net Banking', desc: 'HDFC, ICICI, SBI, Axis & all 50+ banks' },
    { id: 'cash_on_request', icon: 'banknote', title: 'Cash on Request (Pay After)', desc: 'Pay cash or UPI directly after service completion' }
  ];

  const grid = document.getElementById('paymentMethodsGrid');
  if (!grid) return;

  const labor = getBookingLaborRate();
  const quote = document.getElementById('laborQuoteSummary');
  if (quote) {
    quote.innerHTML = `<strong>Labor charge: ₹${labor.amount}</strong> · ${labor.period}<br>Parts/materials are separate and require your approval before work starts.`;
  }

  grid.innerHTML = methods.map(m => {
    const isSelected = state.bookingDraft.paymentMethod === m.id;
    return `
      <div class="payment-method-card ${isSelected ? 'selected' : ''}" onclick="selectPaymentMethod('${m.id}')">
        <div class="pay-icon">${renderIconImage(m.icon)}</div>
        <div class="pay-info">
          <div class="pay-title">${m.title}</div>
          <div class="pay-desc">${m.desc}</div>
        </div>
        <div style="margin-left: auto; font-size: 1.1rem; color: var(--emerald);">
          ${isSelected ? '●' : '○'}
        </div>
      </div>
    `;
  }).join('');
}

window.selectPaymentMethod = function(methodId) {
  state.bookingDraft.paymentMethod = methodId;
  renderStep6PaymentMethods();
};

// Step 7: Complete Submission & Congratulations ("Thanks to customer / Congratulations")
function completeBookingSubmission() {
  if (!state.isLoggedIn) {
    openAuthModal('login');
    showToast('Sign in or create an account before submitting a booking.', 'error');
    return;
  }

  const isEV = state.bookingDraft.vehicleType.startsWith('ev_');
  const preferredEVTech = isEV && state.bookingDraft.technicianType === 'electrician'
    ? VME_DATA.technicians.find(technician =>
      technician.role === 'electrician' &&
      technician.specializations.some(specialization =>
        state.bookingDraft.vehicleType === 'ev_cars'
          ? /EV Cars|Battery Pack BMS/i.test(specialization)
          : /EV Bikes|EV Scooters/i.test(specialization)
      )
    )
    : null;
  const assignedTech = preferredEVTech || VME_DATA.technicians.find(
    technician => technician.role === state.bookingDraft.technicianType
  ) || VME_DATA.technicians[0];

  const orderSuffix = globalThis.crypto.getRandomValues(new Uint32Array(1))[0] % 9000 + 1000;
  const orderId = `VME-${state.bookingDraft.category.substring(0, 3).toUpperCase()}-${orderSuffix}`;
  const labor = getBookingLaborRate();
  const registrationSuffix = state.bookingDraft.registrationNumber
    ? ` (${state.bookingDraft.registrationNumber})`
    : '';
  const vehicleDescription = `${state.bookingDraft.brand} ${state.bookingDraft.model}${registrationSuffix}`;

  // Create active order
  state.activeOrder = {
    id: orderId,
    date: 'Just Now',
    status: 'en_route',
    requestStatus: 'Accepted',
    vehicle: vehicleDescription,
    category: VME_DATA.categories.find(c => c.id === state.bookingDraft.category)?.name || 'Service',
    problem: state.bookingDraft.problemName,
    issueType: isEV ? state.bookingDraft.evIssueType : null,
    registrationNumber: state.bookingDraft.registrationNumber,
    attachments: [...state.bookingDraft.attachments],
    problemDescription: state.bookingDraft.problemDescription,
    laborCharge: labor.amount,
    laborPeriod: labor.period,
    technician: assignedTech,
    location: state.bookingDraft.location,
    paymentMethod: state.bookingDraft.paymentMethod,
    messages: [
      { sender: 'tech', text: `Hi! I have accepted your request for ${state.bookingDraft.problemName}. Heading your way right now!`, time: 'Just now' }
    ]
  };

  state.bookingStep = 7;
  renderWizardStep();
  renderActiveOrderBanner();
  showToast('Booking submitted successfully! Congratulations!', 'success');
}

function renderStep7Congratulations() {
  const container = document.getElementById('wizardStep7');
  if (!container || !state.activeOrder) return;

  const tech = state.activeOrder.technician;

  container.innerHTML = `
    <div class="congrats-card">
      <div class="congrats-icon-ring">${renderIconImage('sparkles')}</div>
      <h2 class="congrats-title">Congratulations & Thank You!</h2>
      <p style="color: var(--text-secondary); max-width: 500px; margin: 0 auto 1.5rem auto;">
        Your service request has been confirmed and priority dispatched. A certified specialist is already assigned and heading to your location.
      </p>

      <div class="congrats-order-badge">
        Booking Reference: ${state.activeOrder.id}
      </div>
      <div class="settings-card" style="max-width: 520px; margin: 1rem auto; text-align: left;">
        <strong>Labor charge: ₹${state.activeOrder.laborCharge}</strong> · ${state.activeOrder.laborPeriod}<br>
        Parts and materials are separate. The technician will confirm any required parts and get your approval before starting work.
      </div>

      <!-- Assigned Technician Card -->
      <div class="assigned-tech-card">
        <div style="font-size: 0.75rem; color: var(--primary-light); font-weight: 700; text-transform: uppercase;">
          Assigned Specialist Nearby
        </div>
        <div class="tech-info-row">
          <div class="tech-avatar-circle">${renderPortraitImage(tech.avatar)}</div>
          <div style="flex: 1;">
            <div style="font-weight: 700; font-size: 1.15rem; color: var(--text-main);">${tech.name}</div>
            <div style="font-size: 0.82rem; color: var(--text-secondary);">${tech.workshop} • <strong>${tech.experience} Exp</strong></div>
            <div style="font-size: 0.8rem; color: var(--amber); margin-top: 2px;">
              ${renderIconImage('star', 'rating-star')} ${tech.rating} (${tech.reviewsCount} verified jobs)
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.3rem; font-weight: 800; color: var(--primary-light);">${tech.etaMins} mins</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary);">${tech.distanceKm} km away</div>
          </div>
        </div>

        <!-- Direct In-App Contact Buttons -->
        <div class="tech-action-buttons">
          <button class="btn-call-direct" onclick="openInAppCall('${tech.name}', '${tech.role}')">
            ${renderIconImage('phone')} Direct In-App Call
          </button>
          <button class="btn-chat-direct" onclick="openInAppChat()">
            ${renderIconImage('message-circle')} Direct In-App Chat
          </button>
        </div>
      </div>

      <!-- Live Order Status Tracker -->
      <div class="status-tracker-card" style="text-align: left; max-width: 520px; margin: 1.5rem auto;">
        <div style="font-weight: 700; font-size: 1rem; margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between;">
          <span>Live Service Progress</span>
          <span style="font-size: 0.75rem; color: var(--emerald); font-weight: 700;">● Active Tracking</span>
        </div>
        <div class="tracker-timeline">
          <div class="timeline-step completed">
            <div class="timeline-label">1. Request Submitted</div>
            <div class="timeline-desc">Problem diagnostics and location registered</div>
          </div>
          <div class="timeline-step completed">
            <div class="timeline-label">2. Specialist Assigned</div>
            <div class="timeline-desc">${tech.name} accepted your job</div>
          </div>
          <div class="timeline-step active">
            <div class="timeline-label">3. En Route (${tech.etaMins} mins ETA)</div>
            <div class="timeline-desc">Technician is moving towards your GPS coordinates</div>
          </div>
          <div class="timeline-step">
            <div class="timeline-label">4. Arrived & Inspecting</div>
            <div class="timeline-desc">On-site vehicle physical inspection</div>
          </div>
          <div class="timeline-step">
            <div class="timeline-label">5. Service Completed & Thanks</div>
            <div class="timeline-desc">Digital warranty receipt generated</div>
          </div>
        </div>
      </div>

      <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 2rem;">
        <button class="btn-primary" onclick="navigateTo('orders')">
          ${renderIconImage('map-pin')} View Live Radar Map & Details
        </button>
        <button class="btn-secondary" onclick="startNewBooking()">
          ${renderIconImage('plus')} Book Another Service
        </button>
      </div>
    </div>
  `;
}

window.startNewBooking = function() {
  state.bookingStep = 1;
  state.bookingDraft.laborCharge = null;
  state.bookingDraft.laborPeriod = null;
  renderWizardStep();
};

// ==========================================================================
// IN-APP VOIP DIRECT CALL (Calling directly in this app)
// ==========================================================================
function initInAppCall() {
  const callModal = document.getElementById('callModal');
  const callMuteBtn = document.getElementById('callMuteBtn');
  const callSpeakerBtn = document.getElementById('callSpeakerBtn');
  const callEndBtn = document.getElementById('callEndBtn');

  callModal?.addEventListener('close', resetInAppCallState);

  if (callMuteBtn) {
    callMuteBtn.addEventListener('click', () => {
      state.callMuted = !state.callMuted;
      callMuteBtn.classList.toggle('active', state.callMuted);
      showToast(state.callMuted ? 'Microphone muted' : 'Microphone unmuted', 'info');
    });
  }

  if (callSpeakerBtn) {
    callSpeakerBtn.addEventListener('click', () => {
      state.callSpeaker = !state.callSpeaker;
      callSpeakerBtn.classList.toggle('active', state.callSpeaker);
      showToast(state.callSpeaker ? 'Speakerphone ON' : 'Ear speaker active', 'info');
    });
  }

  if (callEndBtn) {
    callEndBtn.addEventListener('click', endInAppCall);
  }
}

window.openInAppCall = function(techName, techRole) {
  const modal = document.getElementById('callModal');
  const callerName = document.getElementById('callerNameText');
  const callerRole = document.getElementById('callerRoleText');
  const callTimer = document.getElementById('callTimerDisplay');

  if (callerName) callerName.textContent = techName || (state.activeOrder?.technician.name || 'Technician');
  if (callerRole) callerRole.textContent = `${techRole || (state.activeOrder?.technician.role || 'Partner')} • In-App Encrypted Call`;

  state.callActive = true;
  state.callTimerSec = 0;
  if (callTimer) callTimer.textContent = '00:00';

  if (modal && !modal.open) modal.showModal();
  if (modal) modal.classList.add('active');

  // Start Call Timer
  if (state.callTimerInterval) clearInterval(state.callTimerInterval);
  state.callTimerInterval = setInterval(() => {
    state.callTimerSec++;
    const mins = String(Math.floor(state.callTimerSec / 60)).padStart(2, '0');
    const secs = String(state.callTimerSec % 60).padStart(2, '0');
    if (callTimer) callTimer.textContent = `${mins}:${secs}`;
  }, 1000);

  showToast(`Connected in-app call with ${techName}!`, 'call');
};

function endInAppCall() {
  const modal = document.getElementById('callModal');
  if (modal?.open) modal.close();

  resetInAppCallState();
  showToast('In-app call ended.', 'info');
}

function resetInAppCallState() {
  const modal = document.getElementById('callModal');
  modal?.classList.remove('active');
  state.callActive = false;
  if (state.callTimerInterval) clearInterval(state.callTimerInterval);
  state.callTimerInterval = null;
}

// ==========================================================================
// IN-APP REAL-TIME CHAT (Messaging directly with technician)
// ==========================================================================
function initInAppChat() {
  const chatModal = document.getElementById('chatModal');
  const chatCloseBtn = document.getElementById('chatCloseBtn');
  const chatSendBtn = document.getElementById('chatSendBtn');
  const chatInputField = document.getElementById('chatInputField');
  const chatSendLocationBtn = document.getElementById('chatSendLocationBtn');

  chatModal?.addEventListener('close', () => chatModal.classList.remove('active'));

  if (chatCloseBtn) {
    chatCloseBtn.addEventListener('click', closeInAppChat);
  }

  if (chatSendBtn && chatInputField) {
    chatSendBtn.addEventListener('click', sendChatMessage);
    chatInputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendChatMessage();
    });
  }

  if (chatSendLocationBtn) {
    chatSendLocationBtn.addEventListener('click', shareChatLocation);
  }
}

window.openInAppChat = function() {
  const modal = document.getElementById('chatModal');
  if (modal && !modal.open) modal.showModal();
  if (modal) modal.classList.add('active');
  renderChatMessages();
};

function closeInAppChat() {
  const modal = document.getElementById('chatModal');
  if (modal?.open) modal.close();
}

function renderChatMessages() {
  const container = document.getElementById('chatMessagesBody');
  const chatHeaderName = document.getElementById('chatHeaderName');
  const chatHeaderRole = document.getElementById('chatHeaderRole');

  if (!container) return;

  const tech = state.activeOrder?.technician || VME_DATA.technicians[0];
  if (chatHeaderName) chatHeaderName.textContent = tech.name;
  if (chatHeaderRole) chatHeaderRole.textContent = `${tech.role} • Active Now`;
  const chatAvatar = document.querySelector('.chat-user-avatar');
  if (chatAvatar) chatAvatar.innerHTML = renderPortraitImage(tech.avatar);

  const messages = state.activeOrder?.messages || [
    { sender: 'tech', text: 'Hello! I am your assigned technician. How can I assist you?', time: 'Just now' }
  ];

  container.innerHTML = messages.map(m => {
    const isIncoming = m.sender === 'tech';
    return `
      <div class="chat-bubble ${isIncoming ? 'incoming' : 'outgoing'}">
        <div>${escapeHTML(m.text)}</div>
        <span class="chat-time">${escapeHTML(m.time)}</span>
      </div>
    `;
  }).join('');

  container.scrollTop = container.scrollHeight;
}

function sendChatMessage() {
  const input = document.getElementById('chatInputField');
  if (!input?.value.trim()) return;

  const text = input.value.trim();
  input.value = '';

  if (!state.activeOrder) {
    showToast('No active booking to chat with.', 'error');
    return;
  }

  // Push user message
  state.activeOrder.messages.push({
    sender: 'user',
    text: text,
    time: 'Just now'
  });
  renderChatMessages();

  // Simulated Technician Reply after 1.5 seconds
  setTimeout(() => {
    let reply = "Got it! I am carrying all the required diagnostic equipment and genuine replacement parts.";
    if (text.toLowerCase().includes('where') || text.toLowerCase().includes('eta')) {
      reply = `I am on Outer Ring Road, approximately ${state.activeOrder.technician.etaMins || 6} minutes away!`;
    } else if (text.toLowerCase().includes('location') || text.toLowerCase().includes('reach')) {
      reply = "Yes, your live GPS coordinates are visible right on my in-app technician radar screen.";
    }

    state.activeOrder.messages.push({
      sender: 'tech',
      text: reply,
      time: 'Just now'
    });
    renderChatMessages();
  }, 1500);
}

window.sendQuickChat = function(text) {
  const input = document.getElementById('chatInputField');
  if (input) {
    input.value = text;
    sendChatMessage();
  }
};

function shareChatLocation() {
  const locationMsg = `Shared Live Breakdown Coordinates: Lat 12.9260, Lng 77.6762 (${state.activeOrder?.location || 'Bengaluru'})`;
  if (state.activeOrder) {
    state.activeOrder.messages.push({
      sender: 'user',
      text: locationMsg,
      time: 'Just now'
    });
    renderChatMessages();
    showToast('Live GPS coordinates shared with technician!', 'success');

    setTimeout(() => {
      state.activeOrder.messages.push({
        sender: 'tech',
        text: 'Received your exact GPS coordinates! Route updated on my radar.',
        time: 'Just now'
      });
      renderChatMessages();
    }, 1200);
  }
}

// ==========================================================================
// IN-APP INTERACTIVE RADAR & LIVE GPS MAP
// ==========================================================================
function initLiveMapTracker() {
  // Can be initialized when orders view or map card is opened
}

function renderMapRadarCanvas() {
  const canvas = document.getElementById('liveRadarCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  // Clear background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, width, height);

  // Draw Grid Lines (Street simulation)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Draw Main Highway / Route
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 4;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(80, 80);
  ctx.bezierCurveTo(width * 0.4, 100, width * 0.6, height * 0.5, width - 100, height - 90);
  ctx.stroke();
  ctx.setLineDash([]);

  // Customer Location (Green Target)
  const custX = width - 100;
  const custY = height - 90;
  ctx.beginPath();
  ctx.arc(custX, custY, 24, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(custX, custY, 12, 0, Math.PI * 2);
  ctx.fillStyle = '#10b981';
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px Inter';
  ctx.fillText('Your Location (Breakdown)', custX - 70, custY + 30);

  // Technician Moving Location (Blue Vehicle Icon)
  const techX = 140;
  const techY = 110;
  ctx.beginPath();
  ctx.arc(techX, techY, 20, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(2, 132, 199, 0.3)';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(techX, techY, 10, 0, Math.PI * 2);
  ctx.fillStyle = '#38bdf8';
  ctx.fill();

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 12px Inter';
  ctx.fillText('Technician En Route (2.1 km away)', techX - 40, techY - 20);
}

// ==========================================================================
// ORDERS VIEW (Active Ongoing & Past History)
// ==========================================================================
function initOrdersView() {
  // Sub-tabs: 'active' vs 'past'
  const activeTabBtn = document.getElementById('ordersTabActive');
  const pastTabBtn = document.getElementById('ordersTabPast');

  if (activeTabBtn && pastTabBtn) {
    activeTabBtn.addEventListener('click', () => {
      activeTabBtn.classList.add('active');
      pastTabBtn.classList.remove('active');
      renderOrdersList('active');
    });

    pastTabBtn.addEventListener('click', () => {
      pastTabBtn.classList.add('active');
      activeTabBtn.classList.remove('active');
      renderOrdersList('past');
    });
  }
}

function renderOrdersList(filter = 'active') {
  const container = document.getElementById('ordersListContainer');
  if (!container) return;

  const activeTabBtn = document.getElementById('ordersTabActive');
  const pastTabBtn = document.getElementById('ordersTabPast');
  if (activeTabBtn) activeTabBtn.classList.toggle('active', filter === 'active');
  if (pastTabBtn) pastTabBtn.classList.toggle('active', filter === 'past');

  if (filter === 'active') {
    if (!state.activeOrder || state.activeOrder.status === 'completed') {
      container.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--text-secondary);">
          <div class="empty-orders-icon">${renderIconImage('check')}</div>
          <h3>No Active Bookings Right Now</h3>
          <p style="margin-top: 6px;">Need emergency breakdown assistance or general servicing?</p>
          <button class="btn-primary" style="margin-top: 1.5rem;" onclick="navigateTo('service')">
            Book New Service
          </button>
        </div>
      `;
      return;
    }

    const order = state.activeOrder;
    const tech = order.technician;

    container.innerHTML = `
      <div class="booking-wizard-card" style="margin-bottom: 2rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 1.25rem;">
          <div>
            <span class="cat-badge-pill" style="background: rgba(16, 185, 129, 0.2); color: var(--emerald);">● ACTIVE DISPATCH</span>
            <h2 style="font-size: 1.35rem; font-weight: 800; margin-top: 6px;">${order.problem}</h2>
            <div style="font-size: 0.85rem; color: var(--text-secondary);">${order.vehicle} • ID: ${order.id}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.25rem; font-weight: 800; color: var(--emerald);">${order.laborCharge == null ? 'Labor quote pending' : `₹${order.laborCharge} labor`}</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary);">${order.laborPeriod || 'Parts/materials quoted separately'}</div>
          </div>
        </div>

        <!-- In-App Interactive Radar Map -->
        <div class="live-map-card">
          <div class="map-overlay-eta">
            <div>
              <div style="font-size: 0.7rem; color: var(--text-secondary); text-transform: uppercase;">Estimated Arrival</div>
              <div class="map-eta-time">${tech.etaMins} Mins</div>
            </div>
            <div style="width: 1px; height: 30px; background: var(--border-color);"></div>
            <div>
              <div style="font-size: 0.7rem; color: var(--text-secondary); text-transform: uppercase;">Live Distance</div>
              <div style="font-weight: 700; color: #fff;">${tech.distanceKm} km</div>
            </div>
          </div>
          <canvas id="liveRadarCanvas" width="800" height="380" class="map-viewport"></canvas>
        </div>

        <!-- Assigned Technician Quick Bar with Direct Calling & Chat -->
        <div class="assigned-tech-card" style="margin-top: 1.5rem; max-width: 100%;">
          <div class="tech-info-row">
            <div class="tech-avatar-circle">${renderPortraitImage(tech.avatar)}</div>
            <div style="flex: 1;">
              <div style="font-size: 1.1rem; font-weight: 700;">${tech.name} (${tech.role})</div>
              <div style="font-size: 0.82rem; color: var(--text-secondary);">${tech.workshop}</div>
              <div style="font-size: 0.8rem; color: var(--amber);">${renderIconImage('star', 'rating-star')} ${tech.rating} Verified Specialist</div>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn-primary" style="padding: 10px 16px;" onclick="openInAppCall('${tech.name}', '${tech.role}')">
                ${renderIconImage('phone')} Direct Call
              </button>
              <button class="btn-secondary" style="padding: 10px 16px;" onclick="openInAppChat()">
                ${renderIconImage('message-circle')} Live Chat
              </button>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 1.5rem;">
          <button class="btn-secondary" style="color: var(--danger); border-color: rgba(239, 68, 68, 0.3);" onclick="cancelActiveOrder()">
            Cancel Request
          </button>
          <button class="btn-secondary" onclick="simulateTechnicianArrived()">
            Simulate Arrival & Complete
          </button>
        </div>
      </div>
    `;

    setTimeout(renderMapRadarCanvas, 50);
  } else {
    // Past Orders
    container.innerHTML = state.pastOrders.map(po => `
      <div class="problem-card-item" style="margin-bottom: 1rem; cursor: default;">
        <div style="display: flex; gap: 14px; align-items: center;">
          <div class="tech-avatar-circle">${renderPortraitImage(po.technician.avatar)}</div>
          <div>
            <div style="font-weight: 700; font-size: 1rem; color: var(--text-main);">${po.problem}</div>
            <div style="font-size: 0.82rem; color: var(--text-secondary);">${po.vehicle} • ${po.date}</div>
            <div style="font-size: 0.78rem; color: var(--emerald); margin-top: 4px;">Technician: ${po.technician.name} (${po.technician.role})</div>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: 800; color: var(--text-main); font-size: 1.1rem;">${po.cost}</div>
          <div style="font-size: 0.75rem; color: var(--amber);">${renderIconImage('star', 'rating-star')} ${po.ratingGiven}.0 Rated</div>
          <button class="btn-secondary" style="padding: 4px 10px; font-size: 0.75rem; margin-top: 6px;" onclick="downloadInvoice('${po.invoiceId}')">
            ${renderIconImage('clipboard')} Invoice
          </button>
        </div>
      </div>
    `).join('');
  }
}

window.cancelActiveOrder = function() {
  if (confirm('Are you sure you want to cancel this service request?')) {
    state.activeOrder = null;
    renderOrdersList('active');
    renderActiveOrderBanner();
    showToast('Service request cancelled.', 'info');
  }
};

window.simulateTechnicianArrived = function() {
  if (state.activeOrder) {
    state.activeOrder.status = 'completed';
    // Move to past orders
    state.pastOrders.unshift({
      id: state.activeOrder.id,
      date: 'Today',
      status: 'completed',
      vehicle: state.activeOrder.vehicle,
      category: state.activeOrder.category,
      problem: state.activeOrder.problem,
      technician: {
        name: state.activeOrder.technician.name,
        role: state.activeOrder.technician.role,
        avatar: state.activeOrder.technician.avatar
      },
      cost: state.activeOrder.laborCharge == null ? 'Labor quote pending' : `₹${state.activeOrder.laborCharge} labor`,
      ratingGiven: 5,
      invoiceId: `INV-${Date.now().toString().slice(-6)}`
    });

    state.activeOrder = null;
    renderOrdersList('past');
    renderActiveOrderBanner();
    showToast('Service successfully completed! Thank you for trusting VME.', 'success');
  }
};

window.downloadInvoice = function(invId) {
  showToast(`Downloading digital tax invoice ${invId}...`, 'success');
};

// ==========================================================================
// OFFERS & PROMOTIONS VIEW
// ==========================================================================
function initOffersView() {
  const container = document.getElementById('offersGridContainer');
  if (!container) return;

  if (VME_DATA.offers.length === 0) {
    container.innerHTML = `
      <div class="settings-card" style="grid-column: 1 / -1;">
        <div style="font-weight: 700; margin-bottom: 6px;">No promotions are currently available</div>
        <div style="color: var(--text-secondary);">
          Labor is charged by time of booking. Parts and materials are quoted separately and require your approval before work starts.
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = VME_DATA.offers.map(off => `
    <div class="cat-card-tile" style="border-left: 4px solid var(--amber);">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <span class="cat-badge-pill" style="background: rgba(245, 158, 11, 0.2); color: var(--amber);">${off.badge}</span>
        <span style="font-weight: 800; font-size: 1.1rem; color: var(--primary-light);">${off.discount}</span>
      </div>
      <div class="cat-tile-title">${off.title}</div>
      <div class="cat-tile-desc">${off.desc}</div>
      <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 1rem;">
        <span style="font-family: monospace; font-size: 0.95rem; font-weight: 700; color: var(--text-main); background: var(--bg-input); padding: 4px 10px; border-radius: var(--radius-sm); border: 1px dashed var(--border-color);">
          ${off.code}
        </span>
        <button class="btn-primary" style="padding: 6px 14px; font-size: 0.82rem;" onclick="applyOfferCode('${off.code}')">
          Apply Offer
        </button>
      </div>
    </div>
  `).join('');
}

window.applyOfferCode = function(code) {
  state.bookingDraft.appliedOffer = code;
  showToast(`Coupon code ${code} applied successfully!`, 'success');
  navigateTo('service');
};

// ==========================================================================
// REVIEWS VIEW
// ==========================================================================
function initReviewsView() {
  renderReviewsList();
}

function renderReviewsList() {
  const container = document.getElementById('reviewsListContainer');
  if (!container) return;

  container.innerHTML = VME_DATA.reviews.map(rev => `
    <div class="settings-card" style="margin-bottom: 1.25rem;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
        <div>
          <div style="font-weight: 700; font-size: 1rem; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
            ${rev.author} <span style="font-size: 0.72rem; color: var(--emerald); background: rgba(16, 185, 129, 0.15); padding: 2px 6px; border-radius: 4px;">${renderIconImage('check')} Verified Customer</span>
          </div>
          <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px;">
            ${rev.vehicle} • Serviced by <strong>${rev.techName}</strong>
          </div>
        </div>
        <div style="color: var(--amber); font-size: 0.95rem; font-weight: 700;">
          ${Array.from({ length: rev.rating }, () => renderIconImage('star', 'rating-star')).join('')}
        </div>
      </div>
      <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5;">
        "${rev.comment}"
      </p>
      <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 8px;">
        Reviewed ${rev.date}
      </div>
    </div>
  `).join('');
}

window.submitNewReview = function() {
  const authorInput = document.getElementById('reviewAuthorInput');
  const vehicleInput = document.getElementById('reviewVehicleInput');
  const commentInput = document.getElementById('reviewCommentInput');

  if (!authorInput || !commentInput || !authorInput.value || !commentInput.value) {
    showToast('Please fill out your name and review experience.', 'error');
    return;
  }

  VME_DATA.reviews.unshift({
    id: `REV-${Date.now()}`,
    author: authorInput.value,
    vehicle: vehicleInput ? vehicleInput.value : 'Personal Vehicle',
    techName: 'VME Certified Specialist',
    rating: 5,
    date: 'Just now',
    comment: commentInput.value,
    verified: true
  });

  authorInput.value = '';
  commentInput.value = '';
  renderReviewsList();
  showToast('Thank you for rating your service experience!', 'success');
};

// ==========================================================================
// VEHICLE GARAGE VIEW (Manage My Vehicles)
// ==========================================================================
function initVehicleGarage() {
  renderVehicleGarage();
  const typeGrid = document.getElementById('addVehicleTypesGrid');
  const brandModelGrid = document.getElementById('addVehicleBrandModelGrid');
  const addVehicleForm = document.getElementById('addVehicleForm');
  const addVehicleDialog = document.getElementById('addVehicleModal');
  if (!typeGrid || !brandModelGrid || !addVehicleForm || !addVehicleDialog) return;

  renderAddVehicleTypeOptions();
  typeGrid.addEventListener('click', event => {
    const typeButton = event.target.closest('[data-add-vehicle-type]');
    if (typeButton) selectAddVehicleType(typeButton.dataset.addVehicleType);
  });
  brandModelGrid.addEventListener('click', event => {
    const modelButton = event.target.closest('[data-add-vehicle-model]');
    if (modelButton) selectAddVehicleModel(modelButton.dataset.addVehicleBrand, modelButton.dataset.addVehicleModel);
  });
  addVehicleForm.addEventListener('submit', handleAddVehicleSubmit);
  addVehicleDialog.addEventListener('close', () => addVehicleDialog.classList.remove('active'));
  addVehicleDialog.addEventListener('click', event => {
    if (event.target === addVehicleDialog) addVehicleDialog.close();
  });
}

function renderAddVehicleTypeOptions() {
  const grid = document.getElementById('addVehicleTypesGrid');
  if (!grid) return;

  grid.innerHTML = VME_DATA.vehicleTypes.map(type => `
    <button class="vehicle-type-card ${state.addVehicleDraft.type === type.id ? 'selected' : ''}" type="button"
      data-add-vehicle-type="${escapeHTML(type.id)}" aria-pressed="${state.addVehicleDraft.type === type.id}">
      <span class="vt-icon">${renderIconImage(type.icon, 'vehicle-type-icon')}</span>
      <span class="vt-title">${escapeHTML(type.name)}</span>
      <span class="vt-desc">${escapeHTML(type.desc)}</span>
    </button>
  `).join('');
}

function selectAddVehicleType(typeId) {
  state.addVehicleDraft = { type: typeId, brand: '', model: '' };
  renderAddVehicleTypeOptions();
  renderAddVehicleBrandModels();
}

function renderAddVehicleBrandModels() {
  const group = document.getElementById('addVehicleBrandModelGroup');
  const grid = document.getElementById('addVehicleBrandModelGrid');
  if (!group || !grid) return;

  const catalog = getVehicleCatalog(state.addVehicleDraft.type);
  const brands = Object.keys(catalog);
  group.hidden = brands.length === 0;
  grid.innerHTML = brands.map(brand => `
    <section class="brand-model-group">
      <h4 class="brand-model-heading">${escapeHTML(brand)}</h4>
      <div class="brand-model-options">
        ${catalog[brand].map(model => {
          const selected = state.addVehicleDraft.brand === brand && state.addVehicleDraft.model === model;
          return `
            <button class="model-card-btn ${selected ? 'selected' : ''}" type="button"
              data-add-vehicle-brand="${escapeHTML(brand)}" data-add-vehicle-model="${escapeHTML(model)}"
              aria-pressed="${selected}">
              <span>${escapeHTML(model)}</span>
              ${selected ? renderIconImage('check') : ''}
            </button>
          `;
        }).join('')}
      </div>
    </section>
  `).join('');
  updateAddVehicleSubmitButton();
}

function selectAddVehicleModel(brand, model) {
  state.addVehicleDraft.brand = brand;
  state.addVehicleDraft.model = model;
  renderAddVehicleBrandModels();
}

function updateAddVehicleSubmitButton() {
  const submitButton = document.getElementById('addVehicleSubmitButton');
  if (submitButton) {
    submitButton.disabled = !state.addVehicleDraft.type || !state.addVehicleDraft.brand || !state.addVehicleDraft.model;
  }
}

function handleAddVehicleSubmit(event) {
  event.preventDefault();
  const { type, brand, model } = state.addVehicleDraft;
  const models = getVehicleCatalog(type)[brand] || [];

  if (!models.includes(model)) {
    showToast('Choose a model from the selected vehicle brand.', 'error');
    return;
  }

  const vehicleType = VME_DATA.vehicleTypes.find(item => item.id === type);
  state.vehicles.push({
    id: `v_${Date.now()}`,
    type,
    typeName: vehicleType.name,
    brand,
    model,
    regNumber: '',
    year: '',
    batteryHealth: 'Not recorded',
    lastService: 'Not recorded'
  });

  renderVehicleGarage();
  closeAddVehicleModal();
  showToast('Vehicle added to your VME Garage.', 'success');
}

function renderVehicleGarage() {
  const container = document.getElementById('garageVehiclesList');
  if (!container) return;

  container.innerHTML = state.vehicles.map(v => {
    const savedDetails = [
      v.regNumber ? `Reg: <strong>${escapeHTML(v.regNumber)}</strong>` : '',
      v.year ? `Year: ${escapeHTML(v.year)}` : ''
    ].filter(Boolean).join(' • ') || escapeHTML(v.typeName || 'Vehicle');

    return `
      <div class="settings-card" style="margin-bottom: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="font-size: 2.2rem;">
              ${renderIconImage(v.type.startsWith('ev_') ? 'battery-charging' : 'car-front')}
            </div>
            <div>
              <div style="font-size: 1.15rem; font-weight: 800; color: var(--text-main);">${escapeHTML(v.brand)} ${escapeHTML(v.model)}</div>
              <div style="font-size: 0.82rem; color: var(--text-secondary);">${savedDetails}</div>
              <div style="font-size: 0.78rem; color: var(--primary-light); margin-top: 4px;">Diagnostics: ${escapeHTML(v.batteryHealth)} • Last Serviced: ${escapeHTML(v.lastService)}</div>
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn-primary" style="padding: 8px 14px; font-size: 0.82rem;" onclick="bookForVehicle('${escapeHTML(v.id)}')">
              Book Service
            </button>
            <button class="btn-secondary" style="padding: 8px 12px; font-size: 0.82rem;" onclick="removeVehicle('${escapeHTML(v.id)}')">
              Remove
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.bookForVehicle = function(vehicleId) {
  const v = state.vehicles.find(item => item.id === vehicleId);
  if (v) {
    state.bookingDraft.vehicleType = v.type;
    state.bookingDraft.brand = v.brand;
    state.bookingDraft.model = v.model;
    state.bookingDraft.registrationNumber = v.regNumber || '';
    state.bookingDraft.evIssueId = '';
    state.bookingDraft.evIssueType = 'mechanical';
    state.bookingStep = 3; // Jump directly to categories
    navigateTo('service');
    showToast(`Initiating booking for your ${v.brand} ${v.model}`, 'info');
  }
};

window.addNewVehicleModal = function() {
  const dialog = document.getElementById('addVehicleModal');
  const form = document.getElementById('addVehicleForm');
  if (!dialog || !form) return;

  form.reset();
  state.addVehicleDraft = { type: '', brand: '', model: '' };
  renderAddVehicleTypeOptions();
  renderAddVehicleBrandModels();
  updateAddVehicleSubmitButton();
  dialog.showModal();
  dialog.classList.add('active');
};

window.closeAddVehicleModal = function() {
  const dialog = document.getElementById('addVehicleModal');
  if (dialog?.open) dialog.close();
  dialog?.classList.remove('active');
};

window.removeVehicle = function(vehicleId) {
  if (confirm('Are you sure you want to remove this vehicle from your garage?')) {
    state.vehicles = state.vehicles.filter(v => v.id !== vehicleId);
    renderVehicleGarage();
    showToast('Vehicle removed from garage.', 'info');
  }
};

// ==========================================================================
// REPAIR & DIAGNOSTIC DIRECT VIEW
// ==========================================================================
function renderRepairDiagnosticView() {
  // Pre-sets booking wizard directly to Repair category and opens
  state.bookingDraft.category = 'repair';
  state.bookingStep = 1;
}

// ==========================================================================
// PROFILE VIEW & EDIT PROFILE
// ==========================================================================
function renderProfileView() {
  const u = state.currentUser;
  
  // Set Profile Fields in DOM
  const nameEl = document.getElementById('profileHeaderName');
  const userTagEl = document.getElementById('profileHeaderUsername');
  const avatarEl = document.getElementById('profileHeaderAvatar');
  const idEl = document.getElementById('profileHeaderId');
  const drawerName = document.getElementById('drawerUserName');
  const drawerAvatar = document.getElementById('drawerUserAvatar');

  if (nameEl) nameEl.textContent = u.name;
  if (userTagEl) userTagEl.textContent = `@${u.username} • ${u.userType.toUpperCase()}`;
  if (avatarEl) avatarEl.innerHTML = renderPortraitImage(getProfilePortrait(u.avatar));
  if (idEl) idEl.textContent = u.registrationId || u.id;
  if (drawerName) drawerName.textContent = u.name;
  if (drawerAvatar) drawerAvatar.textContent = u.avatar;

  // Grid details
  const detailsGrid = document.getElementById('profileDetailsGrid');
  if (detailsGrid) {
    detailsGrid.innerHTML = `
      <div class="profile-field-box">
        <div class="profile-field-label">Full Name</div>
        <div class="profile-field-value">${escapeHTML(u.name)}</div>
      </div>
      <div class="profile-field-box">
        <div class="profile-field-label">Username</div>
        <div class="profile-field-value">@${escapeHTML(u.username)}</div>
      </div>
      <div class="profile-field-box">
        <div class="profile-field-label">Mobile Number</div>
        <div class="profile-field-value">${escapeHTML(u.phone)}</div>
      </div>
      <div class="profile-field-box">
        <div class="profile-field-label">Email Address</div>
        <div class="profile-field-value">${escapeHTML(u.email)}</div>
      </div>
      <div class="profile-field-box">
        <div class="profile-field-label">Date of Birth</div>
        <div class="profile-field-value">${escapeHTML(u.dob)}</div>
      </div>
      <div class="profile-field-box">
        <div class="profile-field-label">Gender</div>
        <div class="profile-field-value">${escapeHTML(u.gender)}</div>
      </div>
      <div class="profile-field-box" style="grid-column: 1 / -1;">
        <div class="profile-field-label">Registered Residential Address</div>
        <div class="profile-field-value">${escapeHTML(u.address)}, ${escapeHTML(u.city)}</div>
      </div>
      <div class="profile-field-box" style="grid-column: 1 / -1;">
        <div class="profile-field-label">Bio / About Me</div>
        <div class="profile-field-value">${escapeHTML(u.bio)}</div>
      </div>
    `;
  }

  // Saved Payment Methods
  const paymentsList = document.getElementById('profilePaymentMethodsList');
  if (paymentsList) {
    paymentsList.innerHTML = u.paymentMethods.map(pm => `
      <div class="problem-card-item" style="padding: 10px 14px; margin-bottom: 8px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          ${renderIconImage(pm.type === 'UPI' ? 'smartphone' : 'credit-card')}
          <div>
            <div style="font-weight: 700; font-size: 0.9rem;">${escapeHTML(pm.label)}</div>
            <div style="font-size: 0.78rem; color: var(--text-secondary);">${escapeHTML(pm.detail)}</div>
          </div>
        </div>
        <button class="btn-secondary" style="padding: 4px 8px; font-size: 0.75rem;" data-remove-payment="${escapeHTML(pm.id)}">Remove</button>
      </div>
    `).join('');
    paymentsList.querySelectorAll('[data-remove-payment]').forEach(button => {
      button.addEventListener('click', () => window.removePaymentMethod(button.dataset.removePayment));
    });
  }
}

window.openEditProfileModal = function() {
  const modal = document.getElementById('editProfileModal');
  const u = state.currentUser;

  document.getElementById('editNameInput').value = u.name;
  document.getElementById('editUsernameInput').value = u.username;
  document.getElementById('editPhoneInput').value = u.phone;
  document.getElementById('editEmailInput').value = u.email;
  document.getElementById('editDobInput').value = u.dob;
  document.getElementById('editGenderInput').value = u.gender;
  document.getElementById('editAddressInput').value = u.address;
  document.getElementById('editCityInput').value = u.city;
  document.getElementById('editBioInput').value = u.bio;

  if (modal && !modal.open) modal.showModal();
  if (modal) modal.classList.add('active');
};

function closeEditProfileModal() {
  const modal = document.getElementById('editProfileModal');
  if (modal?.open) modal.close();
}
window.closeEditProfileModal = closeEditProfileModal;

window.saveProfileChanges = function() {
  state.currentUser.name = document.getElementById('editNameInput').value;
  state.currentUser.username = document.getElementById('editUsernameInput').value;
  state.currentUser.phone = document.getElementById('editPhoneInput').value;
  state.currentUser.email = document.getElementById('editEmailInput').value;
  state.currentUser.dob = document.getElementById('editDobInput').value;
  state.currentUser.gender = document.getElementById('editGenderInput').value;
  state.currentUser.address = document.getElementById('editAddressInput').value;
  state.currentUser.city = document.getElementById('editCityInput').value;
  state.currentUser.bio = document.getElementById('editBioInput').value;

  closeEditProfileModal();
  renderProfileView();
  showToast('Profile updated successfully!', 'success');
};

window.changeAvatar = function() {
  const avatars = ['👨‍💼', '👩‍💼', '👨‍🔧', '⚡👩‍🔧', '🏎️', '🏍️', '🚀', '🧑‍💻'];
  const currentIdx = avatars.indexOf(state.currentUser.avatar);
  const nextIdx = (currentIdx + 1) % avatars.length;
  state.currentUser.avatar = avatars[nextIdx];
  renderProfileView();
  showToast('Profile avatar updated!', 'info');
};

window.removePaymentMethod = function(id) {
  state.currentUser.paymentMethods = state.currentUser.paymentMethods.filter(p => p.id !== id);
  renderProfileView();
  showToast('Payment method removed.', 'info');
};

window.addNewPaymentMethod = function() {
  const type = prompt('Enter payment type (UPI or Card):', 'UPI');
  const detail = prompt('Enter UPI ID or Card Number:', 'vikram@okaxis');
  const label = prompt('Enter Bank / Card Label:', 'Axis Bank UPI');

  if (type && detail && label) {
    state.currentUser.paymentMethods.push({
      id: `pay_${Date.now()}`,
      type: type,
      detail: detail,
      label: label
    });
    renderProfileView();
    showToast('Payment method added successfully!', 'success');
  }
};

window.confirmDeleteAccount = function() {
  if (confirm('CRITICAL WARNING: Are you sure you want to permanently delete your VME Account? All vehicle history, invoices, and profile data will be permanently wiped.')) {
    const confirmation = prompt('Type "DELETE" in capital letters to confirm account closure:');
    if (confirmation === 'DELETE') {
      showToast('Your account and associated data have been permanently removed.', 'error');
      openAuthModal('login');
    } else {
      showToast('Account deletion aborted.', 'info');
    }
  }
};

// ==========================================================================
// SETTINGS, PRIVACY & PERMISSIONS CENTER
// ==========================================================================
function initSettingsView() {
  // Location privacy radio items
  const locationRadios = document.querySelectorAll('.location-privacy-radio');
  locationRadios.forEach(radio => {
    radio.addEventListener('click', () => {
      const val = radio.dataset.val;
      setLocationPrivacy(val);
    });
  });

  // Permissions Toggles
  const toggleContact = document.getElementById('toggleContactPerm');
  const toggleCamera = document.getElementById('toggleCameraPerm');
  const toggleDataShare = document.getElementById('toggleDataShare');
  const toggleBiometric = document.getElementById('toggleBiometric');
  const toggle2FA = document.getElementById('toggle2FA');

  if (toggleContact) {
    toggleContact.checked = state.permissions.contactPermission;
    toggleContact.addEventListener('change', (e) => {
      state.permissions.contactPermission = e.target.checked;
      showToast(`Contact permission ${e.target.checked ? 'granted' : 'revoked'}.`, 'info');
    });
  }

  if (toggleCamera) {
    toggleCamera.checked = state.permissions.cameraPermission;
    toggleCamera.addEventListener('change', (e) => {
      state.permissions.cameraPermission = e.target.checked;
      showToast(`Camera & Mic permission ${e.target.checked ? 'granted' : 'revoked'}.`, 'info');
    });
  }

  if (toggleDataShare) {
    toggleDataShare.checked = state.permissions.dataSharing;
    toggleDataShare.addEventListener('change', (e) => {
      state.permissions.dataSharing = e.target.checked;
      showToast(`Diagnostics data sharing ${e.target.checked ? 'enabled' : 'disabled'}.`, 'info');
    });
  }

  if (toggleBiometric) {
    toggleBiometric.checked = state.security.biometricLogin;
    toggleBiometric.addEventListener('change', (e) => {
      state.security.biometricLogin = e.target.checked;
      showToast(`Biometric fingerprint / Face ID login ${e.target.checked ? 'enabled' : 'disabled'}.`, 'info');
    });
  }

  if (toggle2FA) {
    toggle2FA.checked = state.security.twoFactorAuth;
    toggle2FA.addEventListener('change', (e) => {
      state.security.twoFactorAuth = e.target.checked;
      showToast(`Two-Factor Authentication (2FA) ${e.target.checked ? 'enabled' : 'disabled'}.`, 'info');
    });
  }
}

function setLocationPrivacy(val) {
  state.permissions.locationPrivacy = val;
  document.querySelectorAll('.location-privacy-radio').forEach(r => {
    if (r.dataset.val === val) r.classList.add('selected');
    else r.classList.remove('selected');
  });

  let msg = 'Location allowed while using VME app';
  if (val === 'always') msg = 'Always allow location (Background tracking active)';
  if (val === 'never') msg = 'Location blocked (Manual address required)';
  showToast(msg, 'info');
}

window.testCameraAndMic = function() {
  if (navigator.mediaDevices?.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: false, audio: true })
      .then(() => {
        showToast('Microphone & Speaker test PASSED! Audio working flawlessly.', 'success');
      })
      .catch(() => {
        showToast('Microphone & Speaker test simulated: Audio ready for In-App Calls.', 'info');
      });
  } else {
    showToast('In-App VoIP Audio & Speaker certified ready.', 'info');
  }
};

window.openChangePasswordModal = function() {
  const currentPass = prompt('Enter your current password:');
  if (currentPass) {
    const newPass = prompt('Enter new password (min 8 chars):');
    const confirmPass = prompt('Confirm new password:');
    if (newPass && newPass === confirmPass) {
      showToast('Password changed successfully!', 'success');
    } else {
      showToast('Passwords do not match. Change failed.', 'error');
    }
  }
};

window.toggleConnectedAccount = function(platform) {
  state.connectedAccounts[platform] = !state.connectedAccounts[platform];
  const isConn = state.connectedAccounts[platform];
  showToast(`${platform.toUpperCase()} account ${isConn ? 'connected' : 'disconnected'}.`, 'info');

  const btn = document.getElementById(`btnConnect_${platform}`);
  if (btn) {
    btn.textContent = isConn ? 'Disconnect' : 'Connect';
    btn.classList.toggle('btn-primary', !isConn);
    btn.classList.toggle('btn-secondary', isConn);
  }
};

// ==========================================================================
// MECHANIC & ELECTRICIAN WORKSPACE DASHBOARDS
// ==========================================================================
function renderMechanicDashboard() {
  const container = document.getElementById('mechanicDashboardContent');
  if (!container) return;

  container.innerHTML = `
    <div class="hero-banner" style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(2, 132, 199, 0.15) 100%); border-color: var(--amber);">
      <div class="hero-tag" style="background: rgba(245, 158, 11, 0.2); border-color: var(--amber); color: var(--amber);">
        ${renderIconImage('wrench')} MECHANIC CONSOLE
      </div>
      <h2 class="hero-title" style="font-size: 1.8rem;">Mechanic On-Demand Job Radar</h2>
      <p class="hero-desc">
        Direct customer requests in your 15 km workshop zone. See customer's exact location, initiate in-app calls and chats without external apps.
      </p>
    </div>

    <!-- Incoming Job Card -->
    <div class="booking-wizard-card" style="margin-bottom: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <span class="cat-badge-pill" style="background: rgba(239, 68, 68, 0.2); color: var(--danger);">${renderIconImage('siren')} LIVE EMERGENCY BREAKDOWN</span>
        <span style="font-size: 0.8rem; color: var(--text-secondary);">Received 2 mins ago</span>
      </div>

      <div style="font-size: 1.25rem; font-weight: 800; color: var(--text-main);">
        Clutch Cable Snapped & Gear Jam
      </div>
      <div style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px;">
        Vehicle: <strong>Royal Enfield Classic 350 (KA 01 EK 4482)</strong> • Customer: <strong>Madhu MK</strong>
      </div>
      <div style="font-size: 0.88rem; color: var(--primary-light); margin-top: 6px;">
        ${renderIconImage('map-pin')} Customer Location: <strong>Outer Ring Road near Ecospace Flyover, Bellandur (1.8 km away)</strong>
      </div>

      <!-- In-App Direct Radar View -->
      <div class="live-map-card" style="margin-top: 1rem;">
        <canvas id="mechanicRadarCanvas" width="800" height="260" class="map-viewport" style="height: 260px;"></canvas>
      </div>

      <div style="display: flex; gap: 10px; margin-top: 1.5rem; flex-wrap: wrap;">
        <button class="btn-primary" style="flex: 1;" onclick="mechanicAcceptJob()">
          ${renderIconImage('check')} Accept Job & Navigate In-App
        </button>
        <button class="btn-secondary" onclick="openInAppCall('Madhu MK', 'Customer')">
          ${renderIconImage('phone')} Call Customer Directly
        </button>
        <button class="btn-secondary" onclick="openInAppChat()">
          ${renderIconImage('message-circle')} Chat with Customer
        </button>
      </div>
    </div>
  `;

  setTimeout(() => {
    const canvas = document.getElementById('mechanicRadarCanvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 14px Inter';
      ctx.fillText('Live Mechanic Radar: Customer Location Pinpointed at Lat 12.9260, Lng 77.6762', 20, 40);
      ctx.strokeStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(200, 130, 30, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#ef4444';
      ctx.fillText('Breakdown Spot (1.8 km)', 240, 135);
    }
  }, 50);
}

window.mechanicAcceptJob = function() {
  showToast('Job Accepted! Customer notified that Mechanic is en route.', 'success');
};

function renderElectricianDashboard() {
  const container = document.getElementById('electricianDashboardContent');
  if (!container) return;

  container.innerHTML = `
    <div class="hero-banner" style="background: linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(2, 132, 199, 0.15) 100%); border-color: var(--electric);">
      <div class="hero-tag" style="background: rgba(6, 182, 212, 0.2); border-color: var(--electric); color: var(--electric);">
        ${renderIconImage('zap')} ELECTRICIAN CONSOLE
      </div>
      <h2 class="hero-title" style="font-size: 1.8rem;">High-Voltage & Auto Electrical Radar</h2>
      <p class="hero-desc">
        Specialized EV battery diagnostics, BMS fault clearance, charging port unlocks, and alternator repair jobs.
      </p>
    </div>

    <!-- Active EV Job Card -->
    <div class="booking-wizard-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <span class="cat-badge-pill" style="background: rgba(6, 182, 212, 0.2); color: var(--electric);">${renderIconImage('battery-charging')} EV SYSTEM DIAGNOSTICS</span>
        <span style="font-size: 0.8rem; color: var(--text-secondary);">Direct Request</span>
      </div>

      <div style="font-size: 1.25rem; font-weight: 800; color: var(--text-main);">
        BMS Thermal Lockout & 12V Auxiliary Failure
      </div>
      <div style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px;">
        Vehicle: <strong>Tata Motors Nexon EV (KA 03 MK 7721)</strong> • Customer: <strong>Madhu MK</strong>
      </div>
      <div style="font-size: 0.88rem; color: var(--emerald); margin-top: 6px;">
        ${renderIconImage('map-pin')} Exact Coordinates: <strong>Lat 12.9260, Lng 77.6762 (Ecospace Shoulder)</strong>
      </div>

      <div style="display: flex; gap: 10px; margin-top: 1.5rem; flex-wrap: wrap;">
        <button class="btn-primary" style="flex: 1;" onclick="electricianRunDiagnostics()">
          ${renderIconImage('zap')} Run Remote CAN-Bus Diagnostic
        </button>
        <button class="btn-secondary" onclick="openInAppCall('Madhu MK', 'Customer')">
          ${renderIconImage('phone')} Direct In-App VoIP Call
        </button>
        <button class="btn-secondary" onclick="openInAppChat()">
          ${renderIconImage('message-circle')} Chat with Customer
        </button>
      </div>
    </div>
  `;
}

window.electricianRunDiagnostics = function() {
  showToast('OBD & BMS Diagnostic Link Established: Auxiliary 12V voltage 8.2V (Discharged). Jumpstart pack recommended.', 'success');
};

// ==========================================================================
// AUTH MODALS (Customer, Mechanic, Electrician Registration & Login)
// ==========================================================================
function initAuthModals() {
  const authModal = document.getElementById('authModal');
  const authCloseBtn = document.getElementById('authCloseBtn');

  authModal?.addEventListener('close', () => authModal.classList.remove('active'));

  if (authCloseBtn) {
    authCloseBtn.addEventListener('click', closeAuthModal);
  }

  // Password Eye Symbol Show/Hide Toggles
  const eyeButtons = document.querySelectorAll('.eye-toggle-btn');
  eyeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetInputId = btn.dataset.target;
      const targetInput = document.getElementById(targetInputId);
      if (targetInput) {
        if (targetInput.type === 'password') {
          targetInput.type = 'text';
          btn.innerHTML = renderIconImage('eye');
        } else {
          targetInput.type = 'password';
          btn.innerHTML = renderIconImage('eye-off');
        }
      }
    });
  });

  // Switch between Login and Register tabs
  const tabLogin = document.getElementById('authTabLogin');
  const tabRegister = document.getElementById('authTabRegister');

  if (tabLogin && tabRegister) {
    tabLogin.addEventListener('click', () => switchAuthTab('login'));
    tabRegister.addEventListener('click', () => switchAuthTab('register'));
  }

  // Register Role Dropdown / Switcher
  const loginRoleSelect = document.getElementById('loginRoleSelect');
  if (loginRoleSelect) {
    loginRoleSelect.addEventListener('change', (e) => {
      updateLoginRoleFields(e.target.value);
    });
  }

  const regRoleSelect = document.getElementById('regRoleSelect');
  if (regRoleSelect) {
    regRoleSelect.addEventListener('change', (e) => {
      updateRegisterFormFields(e.target.value);
    });
  }
}

function openAuthModal(tab = 'login') {
  const modal = document.getElementById('authModal');
  if (modal) {
    if (!modal.open) modal.showModal();
    modal.classList.add('active');
    switchAuthTab(tab);
  }
}
window.openAuthModal = openAuthModal;

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal?.open) modal.close();
}

function updateAuthTabControls(tab) {
  const tabLogin = document.getElementById('authTabLogin');
  const tabRegister = document.getElementById('authTabRegister');
  const loginForm = document.getElementById('loginFormContainer');
  const registerForm = document.getElementById('registerFormContainer');
  const resetForm = document.getElementById('passwordResetContainer');
  const successContainer = document.getElementById('registrationSuccessContainer');
  const tabSwitcher = document.querySelector('.auth-tab-switch');
  const isLogin = tab === 'login';
  const isRegister = tab === 'register';
  const isSuccess = tab === 'success';

  tabLogin?.classList.toggle('active', isLogin);
  tabRegister?.classList.toggle('active', isRegister);
  if (loginForm) loginForm.style.display = isLogin ? 'block' : 'none';
  if (registerForm) registerForm.style.display = isRegister ? 'block' : 'none';
  if (resetForm) resetForm.style.display = tab === 'reset' ? 'block' : 'none';
  if (successContainer) successContainer.style.display = isSuccess ? 'block' : 'none';
  if (tabSwitcher) tabSwitcher.style.display = (tab === 'reset' || isSuccess) ? 'none' : 'flex';
}

function populatePasswordResetEmail() {
  const loginEmail = document.getElementById('loginEmailPhoneInput')?.value.trim() || '';
  const resetEmail = document.getElementById('resetEmailInput');
  if (resetEmail && loginEmail.includes('@')) resetEmail.value = loginEmail;
}


function updateLoginRoleFields(role) {
  const label = document.getElementById('loginIdentifierLabel');
  const input = document.getElementById('loginEmailPhoneInput');
  const hint = document.getElementById('loginIdentifierHint');
  if (!label || !input) return;

  if (role === 'mechanic') {
    label.textContent = 'Mechanic Registration ID:';
    input.placeholder = 'e.g. VME-MECH-9021';
    if (hint) {
      hint.textContent = 'Submit your assigned Mechanic Registration ID (or email/phone) and password.';
      hint.style.display = 'block';
    }
  } else if (role === 'electrician') {
    label.textContent = 'Electrician Registration ID:';
    input.placeholder = 'e.g. VME-ELEC-7712';
    if (hint) {
      hint.textContent = 'Submit your assigned Electrician Registration ID (or email/phone) and password.';
      hint.style.display = 'block';
    }
  } else {
    label.textContent = 'Email or Mobile Number:';
    input.placeholder = 'name@domain.com or 9876543210';
    if (hint) hint.style.display = 'none';
  }
}

function switchAuthTab(tab) {
  updateAuthTabControls(tab);
  if (tab === 'login') {
    updateLoginRoleFields(document.getElementById('loginRoleSelect')?.value || 'customer');
  }
  if (tab === 'register') {
    updateRegisterFormFields(document.getElementById('regRoleSelect')?.value || 'customer');
  }
  if (tab === 'reset') populatePasswordResetEmail();
}

function updateRegisterFormFields(role) {
  const mechanicFields = document.getElementById('mechanicExtraFields');
  const electricianFields = document.getElementById('electricianExtraFields');
  const technicianLocationFields = document.getElementById('technicianLocationFields');
  if (mechanicFields) mechanicFields.style.display = role === 'mechanic' ? 'block' : 'none';
  if (electricianFields) electricianFields.style.display = role === 'electrician' ? 'block' : 'none';
  if (technicianLocationFields) technicianLocationFields.style.display = role === 'customer' ? 'none' : 'block';
}

window.captureTechnicianLocation = function() {
  const status = document.getElementById('technicianLocationStatus');
  if (!navigator.geolocation) {
    showToast('Location sharing is not available in this browser.', 'error');
    return;
  }

  if (status) status.textContent = 'Waiting for location permission…';
  navigator.geolocation.getCurrentPosition(position => {
    document.getElementById('regLatitude').value = position.coords.latitude;
    document.getElementById('regLongitude').value = position.coords.longitude;
    if (status) status.textContent = 'Workshop location saved. Customers will only see your distance.';
  }, () => {
    if (status) status.textContent = 'Location could not be read. Allow browser location access and try again.';
    showToast('Allow location access to register as a nearby technician.', 'error');
  }, { enableHighAccuracy: true, timeout: 10000 });
};

async function authApiRequest(endpoint, body) {
  let response;
  try {
    response = await fetch(endpoint, {
      method: body === undefined ? 'GET' : 'POST',
      credentials: 'same-origin',
      headers: body === undefined ? { Accept: 'application/json' } : {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
  } catch {
    throw new Error('Unable to connect to the authentication server. Check that the backend is running and try again.');
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error('The authentication server returned an invalid response.');
  }
  if (!response.ok) throw new Error(result.error || 'The authentication request failed.');
  return result;
}

function applyAuthenticatedUser(user) {
  state.currentUser = {
    ...state.currentUser,
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    phone: user.phone,
    userType: user.role,
    registrationId: user.registrationId || user.id
  };
  state.isLoggedIn = true;
  setRole(user.role);
  const topNavAvatar = document.getElementById('topNavAvatar');
  const topNavName = document.querySelector('.user-name-sm');
  const drawerRole = document.getElementById('drawerUserRole');
  const connectedGoogleEmail = document.getElementById('connectedGoogleEmail');
  if (topNavAvatar) topNavAvatar.textContent = state.currentUser.avatar;
  if (topNavName) topNavName.textContent = user.name;
  if (drawerRole) {
    drawerRole.textContent = user.registrationId
      ? `Verified ${user.role} • ${user.registrationId}`
      : `Verified ${user.role} account`;
  }
  if (connectedGoogleEmail) connectedGoogleEmail.textContent = user.email;
  renderProfileView();
}

async function initializeAuthentication() {
  try {
    const { user } = await authApiRequest('/api/auth/session');
    if (!user) {
      state.isLoggedIn = false;
      openAuthModal('login');
      return;
    }
    applyAuthenticatedUser(user);
    closeAuthModal();
  } catch (error) {
    openAuthModal('login');
    console.warn('Initial session check skipped:', error.message);
  }
}

async function logout() {
  try {
    await authApiRequest('/api/auth/logout', {});
  } catch (error) {
    showToast(error.message, 'error');
    return;
  }

  state.isLoggedIn = false;
  state.currentUser = {
    ...state.currentUser,
    id: '',
    name: 'Guest',
    username: '',
    email: '',
    phone: '',
    userType: 'customer'
  };
  setRole('customer');
  renderProfileView();
  const topNavName = document.querySelector('.user-name-sm');
  const drawerRole = document.getElementById('drawerUserRole');
  const connectedGoogleEmail = document.getElementById('connectedGoogleEmail');
  if (topNavName) topNavName.textContent = 'Guest';
  if (drawerRole) drawerRole.textContent = 'Not signed in';
  if (connectedGoogleEmail) connectedGoogleEmail.textContent = 'Not connected';
  openAuthModal('login');
  showToast('You have been signed out.', 'success');
}
window.logout = logout;

window.generateRegistrationOtp = async function() {
  const form = document.querySelector('#registerFormContainer form');
  const requiredInputs = [...form.querySelectorAll('input[required]:not(#regOtpInput)')];
  if (requiredInputs.some(input => !input.reportValidity())) return;

  const password = document.getElementById('regPasswordInput').value;
  const confirmPassword = document.getElementById('regConfirmPasswordInput').value;
  if (password !== confirmPassword) {
    showToast('Passwords do not match.', 'error');
    return;
  }

  const role = document.getElementById('regRoleSelect').value;
  const latitude = document.getElementById('regLatitude').value;
  const longitude = document.getElementById('regLongitude').value;
  if (role !== 'customer' && (!latitude || !longitude)) {
    showToast('Share your workshop location before registering as a technician.', 'error');
    return;
  }

  const button = form.querySelector('button[onclick="generateRegistrationOtp()"]');
  if (button) button.disabled = true;
  try {
    const result = await authApiRequest('/api/auth/register', {
      name: document.getElementById('regFullNameInput').value,
      username: document.getElementById('regUsernameInput').value,
      email: document.getElementById('regEmailInput').value,
      phone: document.getElementById('regPhoneInput').value,
      password,
      role,
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined
    });
    showToast(result.message, 'success');
    document.getElementById('regOtpInput').focus();
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    if (button) button.disabled = false;
  }
};

window.handleLoginSubmit = async function(e) {
  if (e) e.preventDefault();
  const emailOrPhone = document.getElementById('loginEmailPhoneInput')?.value;
  const password = document.getElementById('loginPasswordInput')?.value;
  const role = document.getElementById('loginRoleSelect')?.value || 'customer';
  const rememberMe = document.getElementById('loginRememberMe')?.checked === true;

  if (!emailOrPhone || !password) {
    showToast('Please enter your email/mobile and password.', 'error');
    return;
  }

  const button = document.querySelector('#loginFormContainer button[type="submit"]');
  if (button) button.disabled = true;
  try {
    const result = await authApiRequest('/api/auth/login', { emailOrPhone, password, role, rememberMe });
    applyAuthenticatedUser(result.user);
    closeAuthModal();
    showToast(`Welcome back, ${result.user.name}.`, 'success');
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    if (button) button.disabled = false;
  }
};


let pendingTechnicianAuth = null;

function showRegistrationSuccessModal(user) {
  pendingTechnicianAuth = {
    registrationId: user.registrationId,
    role: user.role,
    name: user.name
  };

  const roleName = user.role === 'mechanic' ? 'Mechanic' : 'Electrician';
  const titleEl = document.getElementById('regSuccessTitle');
  const msgEl = document.getElementById('regSuccessMessage');
  const badgeLabelEl = document.getElementById('regSuccessBadgeLabel');
  const idDisplayEl = document.getElementById('assignedRegistrationIdDisplay');

  if (titleEl) titleEl.textContent = `${roleName} Registration Completed!`;
  if (msgEl) msgEl.textContent = `Welcome ${user.name}! Your account has been verified. Below is your official ${roleName} Registration ID:`;
  if (badgeLabelEl) badgeLabelEl.textContent = `Official ${roleName} ID`;
  if (idDisplayEl) idDisplayEl.textContent = user.registrationId;

  switchAuthTab('success');
  showToast(`Registration complete! Your ID is ${user.registrationId}. Please submit your ID to log in.`, 'success');
}

window.proceedToLoginWithRegistrationId = function() {
  const regId = pendingTechnicianAuth?.registrationId || '';
  const role = pendingTechnicianAuth?.role || 'mechanic';

  switchAuthTab('login');

  const roleSelect = document.getElementById('loginRoleSelect');
  if (roleSelect) {
    roleSelect.value = role;
    updateLoginRoleFields(role);
  }

  const idInput = document.getElementById('loginEmailPhoneInput');
  if (idInput && regId) {
    idInput.value = regId;
  }

  const passInput = document.getElementById('loginPasswordInput');
  if (passInput) {
    passInput.value = '';
    passInput.focus();
  }

  showToast(`Please enter your password and click 'Log In to VME' to submit your Registration ID (${regId}).`, 'info');
};

window.copyRegistrationId = function() {
  const id = document.getElementById('assignedRegistrationIdDisplay')?.textContent?.trim();
  if (id && navigator.clipboard) {
    navigator.clipboard.writeText(id).then(() => {
      showToast(`Copied ${id} to clipboard!`, 'success');
    }).catch(() => {
      showToast(`Registration ID: ${id}`, 'info');
    });
  }
};

window.handleRegisterSubmit = async function(e) {
  if (e) e.preventDefault();
  const email = document.getElementById('regEmailInput')?.value.trim();
  const confirmPass = document.getElementById('regConfirmPasswordInput')?.value;
  const otp = document.getElementById('regOtpInput')?.value;
  const password = document.getElementById('regPasswordInput')?.value;
  if (password !== confirmPass) {
    showToast('Passwords do not match.', 'error');
    return;
  }
  if (!otp) {
    showToast('Send the email verification code before completing registration.', 'error');
    return;
  }

  const button = document.querySelector('#registerFormContainer button[type="submit"]');
  if (button) button.disabled = true;
  try {
    const result = await authApiRequest('/api/auth/verify-email', { email, code: otp });
    const user = result.user;
    if (user.role === 'mechanic' || user.role === 'electrician') {
      showRegistrationSuccessModal(user);
    } else {
      applyAuthenticatedUser(user);
      closeAuthModal();
      showToast(`Your email is verified. Welcome, ${user.name}!`, 'success');
    }
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    if (button) button.disabled = false;
  }
};

window.requestPasswordReset = async function() {
  const emailInput = document.getElementById('resetEmailInput');
  if (!emailInput.reportValidity()) return;

  const button = document.querySelector('#passwordResetContainer > button');
  if (button) button.disabled = true;
  try {
    const result = await authApiRequest('/api/auth/password-reset/request', { email: emailInput.value });
    showToast(result.message, 'success');
    document.getElementById('resetCodeInput').focus();
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    if (button) button.disabled = false;
  }
};

window.completePasswordReset = async function(e) {
  if (e) e.preventDefault();
  const button = document.querySelector('#passwordResetContainer form button[type="submit"]');
  if (button) button.disabled = true;
  try {
    const result = await authApiRequest('/api/auth/password-reset/complete', {
      email: document.getElementById('resetEmailInput').value,
      code: document.getElementById('resetCodeInput').value,
      password: document.getElementById('resetPasswordInput').value
    });
    showToast(result.message, 'success');
    switchAuthTab('login');
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    if (button) button.disabled = false;
  }
};

// Static Modals for FAQs, Terms, Privacy Policy
window.openStaticModal = function(type) {
  if (type === 'terms') {
    alert("VME TERMS OF SERVICE & RULES:\n1. Direct In-App Contact: All calls and chat communications are encrypted and managed natively in the VME app.\n2. Genuine Parts: All components swapped carry standard manufacturer warranty.\n3. Transparent Pricing: Standard diagnostic rates apply with no hidden charges.\n4. Emergency Priority: High-speed roadside SOS dispatches are expedited within 15-30 minutes.");
  } else if (type === 'privacy') {
    alert("VME PRIVACY POLICY:\n1. Location Privacy: Exact GPS coordinates are shared exclusively with your assigned technician to navigate to your breakdown site.\n2. In-App Data: Phone numbers are masked through native VoIP calling.\n3. Banking Security: PCI-DSS compliant payment gateways for UPI, Cards & Net Banking.");
  }
};
