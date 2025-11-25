// Server Status Management
class ServerStatusManager {
  constructor() {
    this.statusElement = document.querySelector('.server-status');
    this.init();
  }

  init() {
    this.updateServerStatus();
    // Frissítés minden 30 másodpercben
    setInterval(() => this.updateServerStatus(), 30000);
  }

  async updateServerStatus() {
    try {
      const status = await this.getServerStatus();
      this.updateUI(status);
    } catch (error) {
      console.error('Error updating server status:', error);
      this.showOfflineStatus();
    }
  }

  async getServerStatus() {
    // Szimulált válasz - később cseréld le valós API-ra
    return new Promise((resolve) => {
      setTimeout(() => {
        const statusType = Math.random();
        
        if (statusType > 0.6) {
          // Online - 40% esély
          const playerCount = Math.floor(Math.random() * 80) + 10;
          const maxPlayers = 100;
          resolve({
            status: 'online',
            players: playerCount,
            maxPlayers: maxPlayers,
            version: '1.20.4',
            message: `Online - ${playerCount}/${maxPlayers} játékos`
          });
        } else if (statusType > 0.3) {
          // Karbantartás - 30% esély
          resolve({
            status: 'maintenance',
            players: 0,
            maxPlayers: 100,
            version: '1.20.4',
            message: 'Karbantartás alatt'
          });
        } else {
          // Offline - 30% esély
          resolve({
            status: 'offline',
            players: 0,
            maxPlayers: 100,
            version: '1.20.4',
            message: 'Szerver offline'
          });
        }
      }, 1000);
    });
  }

  updateUI(status) {
    if (!this.statusElement) return;

    const indicator = this.statusElement.querySelector('.status-indicator');
    const text = this.statusElement.querySelector('.status-text');
    
    if (indicator && text) {
      // Eltávolítjuk az összes előző stílust
      indicator.className = 'status-indicator';
      text.className = 'status-text';
      
      switch (status.status) {
        case 'online':
          indicator.classList.add('online');
          text.classList.add('online');
          indicator.style.animation = 'statusPulse 2s infinite';
          break;
          
        case 'maintenance':
          indicator.classList.add('maintenance');
          text.classList.add('maintenance');
          indicator.style.animation = 'statusPulseMaintenance 2s infinite';
          break;
          
        case 'offline':
          indicator.classList.add('offline');
          text.classList.add('offline');
          indicator.style.animation = 'none';
          break;
      }
      
      text.textContent = status.message;
    }
  }

  showOfflineStatus() {
    if (!this.statusElement) return;

    const indicator = this.statusElement.querySelector('.status-indicator');
    const text = this.statusElement.querySelector('.status-text');
    
    if (indicator && text) {
      indicator.className = 'status-indicator offline';
      text.className = 'status-text offline';
      text.textContent = 'Szerver nem elérhető';
    }
  }

  // MANUÁLIS VÁLTÁSHOZ - ADMIN FUNKCIÓ
  setManualStatus(status, customMessage = null) {
    const statusData = {
      status: status,
      players: status === 'online' ? Math.floor(Math.random() * 80) + 10 : 0,
      maxPlayers: 100,
      version: '1.20.4',
      message: customMessage || this.getDefaultMessage(status)
    };
    
    this.updateUI(statusData);
  }

  getDefaultMessage(status) {
    switch (status) {
      case 'online':
        return 'Online - Játékosok csatlakoznak...';
      case 'maintenance':
        return 'Karbantartás alatt - Visszatérés hamarosan!';
      case 'offline':
        return 'Szerver offline';
      default:
        return 'Ismeretlen állapot';
    }
  }
}

// Theme Management
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 
                 (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this.init();
  }

  init() {
    this.applyTheme();
    this.setupToggle();
    this.watchSystemTheme();
  }

  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    this.updateToggleIcon();
  }

  updateToggleIcon() {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
      themeIcon.textContent = this.theme === 'dark' ? '☀️' : '🌙';
    }
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', this.theme);
    this.applyTheme();
    this.animateThemeTransition();
  }

  animateThemeTransition() {
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
  }

  setupToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }
  }

  watchSystemTheme() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.theme = e.matches ? 'dark' : 'light';
        this.applyTheme();
      }
    });
  }
}

// Navigation Management
class NavigationManager {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.hamburger = document.querySelector('.hamburger');
    this.navMenu = document.querySelector('.nav-menu');
    this.init();
  }

  init() {
    this.setupScrollEffect();
    this.setupMobileMenu();
    this.setupActiveLinks();
  }

  setupScrollEffect() {
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light';
      
      if (this.navbar) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          this.navbar.style.transform = 'translateY(-100%)';
        } else {
          this.navbar.style.transform = 'translateY(0)';
        }
        
        if (currentScrollY > 50) {
          if (isLightTheme) {
            this.navbar.style.background = 'rgba(233, 236, 239, 0.98)';
          } else {
            this.navbar.style.background = 'rgba(10, 10, 10, 0.98)';
          }
          this.navbar.style.backdropFilter = 'blur(20px)';
        } else {
          if (isLightTheme) {
            this.navbar.style.background = 'rgba(233, 236, 239, 0.95)';
          } else {
            this.navbar.style.background = 'rgba(10, 10, 10, 0.95)';
          }
          this.navbar.style.backdropFilter = 'blur(10px)';
        }
      }
      
      lastScrollY = currentScrollY;
    });
  }

  setupMobileMenu() {
    if (this.hamburger && this.navMenu) {
      this.hamburger.addEventListener('click', () => {
        this.navMenu.classList.toggle('active');
        this.hamburger.classList.toggle('active');
        this.animateHamburger();
      });

      // Close menu when clicking on a link
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          this.navMenu.classList.remove('active');
          this.hamburger.classList.remove('active');
        });
      });
    }
  }

  animateHamburger() {
    const spans = this.hamburger.querySelectorAll('span');
    if (this.hamburger.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  }

  setupActiveLinks() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }
}

// Animation Manager
class AnimationManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollAnimations();
    this.setupHoverEffects();
    this.setupLoadAnimations();
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll(
      '.feature-card, .news-card, .step-card, .team-member, .stat-card, .rule-category'
    );
    
    animatedElements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.animationDelay = `${index * 0.1}s`;
      observer.observe(el);
    });
  }

  setupHoverEffects() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
      button.addEventListener('click', this.createRipple);
    });

    // Add hover effects to cards
    const cards = document.querySelectorAll('.feature-card, .news-card, .step-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
      });
    });
  }

  createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  setupLoadAnimations() {
    // Animate hero elements on load
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .server-info, .hero-buttons');
    heroElements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.animation = `fadeInUp 1s ease-out ${index * 0.2}s both`;
    });

    // Animate floating blocks
    const blocks = document.querySelectorAll('.block');
    blocks.forEach((block, index) => {
      block.style.animation = `float 6s ease-in-out ${index * 1.5}s infinite`;
    });
  }
}

// Utility Functions
function copyIP() {
  const ipAddress = 'fejermc.dnet.hu';
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(ipAddress).then(() => {
      showNotification('IP cím másolva!', 'success');
    }).catch(() => {
      fallbackCopyTextToClipboard(ipAddress);
    });
  } else {
    fallbackCopyTextToClipboard(ipAddress);
  }
}

function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';
  
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
    showNotification('IP cím másolva!', 'success');
  } catch (err) {
    showNotification('Másolás sikertelen', 'error');
  }
  
  document.body.removeChild(textArea);
}

function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => notification.remove());

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Add styles
  Object.assign(notification.style, {
    position: 'fixed',
    top: '100px',
    right: '20px',
    background: type === 'success' ? 'var(--primary-color)' : 'var(--secondary-color)',
    color: 'white',
    padding: '1rem 2rem',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
    zIndex: '10000',
    animation: 'slideInRight 0.3s ease-out',
    fontWeight: '600'
  });
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Maintenance Notification System
class MaintenanceNotification {
  constructor() {
    this.storageKey = 'maintenanceNotificationShown';
    this.notification = null;
    this.init();
  }

  init() {
    // Csak akkor jelenjen meg, ha még nem mutattuk és karbantartás van
    if (!this.hasBeenShown() && this.shouldShowMaintenance()) {
      this.showNotification();
      this.markAsShown();
    }
  }

  hasBeenShown() {
    return localStorage.getItem(this.storageKey) === 'true';
  }

  markAsShown() {
    localStorage.setItem(this.storageKey, 'true');
  }

  shouldShowMaintenance() {
    return true; // Mindig mutassa az értesítést
  }

  showNotification() {
    // Értesítés elem létrehozása
    this.notification = document.createElement('div');
    this.notification.className = 'maintenance-notification';
    this.notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">⚠️</div>
        <div class="notification-text">
          <h4>Szerver Karbantartás</h4>
          <p>A szerver jelenleg karbantartás alatt áll. Visszatérés hamarosan!</p>
        </div>
        <button class="notification-close" onclick="window.maintenanceNotification.closeWithAnimation()">×</button>
      </div>
    `;

    // Stílusok hozzáadása
    this.addStyles();
    
    // Értesítés hozzáadása a body-hoz
    document.body.appendChild(this.notification);

    // Automatikus eltűnés 8 másodperc után
    this.autoCloseTimeout = setTimeout(() => {
      this.closeWithAnimation();
    }, 8000);

    // Globális hozzáférés a bezáráshoz
    window.maintenanceNotification = this;
  }

  closeWithAnimation() {
    if (!this.notification || !this.notification.parentElement) {
      return;
    }

    // Animáció indítása
    this.notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
    
    // Elem eltávolítása az animáció után
    setTimeout(() => {
      if (this.notification && this.notification.parentElement) {
        this.notification.remove();
        this.notification = null;
      }
    }, 300);

    // Auto-close timeout törlése
    if (this.autoCloseTimeout) {
      clearTimeout(this.autoCloseTimeout);
      this.autoCloseTimeout = null;
    }
  }

  addStyles() {
    // Csak akkor adjuk hozzá a stílusokat, ha még nincsenek hozzáadva
    if (document.querySelector('#maintenance-notification-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'maintenance-notification-styles';
    style.textContent = `
      .maintenance-notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, var(--secondary-color), #e55a2b);
        color: white;
        border-radius: 15px;
        padding: 1rem;
        box-shadow: 0 10px 30px rgba(255, 107, 53, 0.3);
        z-index: 10001;
        animation: slideInRight 0.5s ease-out;
        border: 2px solid rgba(255, 255, 255, 0.2);
        max-width: 400px;
        backdrop-filter: blur(10px);
        font-family: 'Exo 2', sans-serif;
      }

      .notification-content {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
      }

      .notification-icon {
        font-size: 2rem;
        animation: pulse 2s infinite;
        flex-shrink: 0;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
      }

      .notification-text {
        flex: 1;
      }

      .notification-text h4 {
        margin: 0 0 0.5rem 0;
        font-size: 1.1rem;
        font-weight: 700;
        font-family: 'Orbitron', monospace;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        letter-spacing: 0.5px;
      }

      .notification-text p {
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.4;
        opacity: 0.9;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      }

      .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        flex-shrink: 0;
        margin-left: auto;
        font-weight: bold;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      .notification-close:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.1);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }

      .notification-close:active {
        transform: scale(0.95);
      }

      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }

      @keyframes pulse {
        0%, 100% {
          transform: scale(1);
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }
        50% {
          transform: scale(1.1);
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
        }
      }

      @media (max-width: 768px) {
        .maintenance-notification {
          top: 80px;
          right: 10px;
          left: 10px;
          max-width: none;
          margin: 0 10px;
        }
        
        .notification-content {
          gap: 0.8rem;
        }
        
        .notification-icon {
          font-size: 1.8rem;
        }
        
        .notification-text h4 {
          font-size: 1rem;
        }
        
        .notification-text p {
          font-size: 0.85rem;
        }
        
        .notification-close {
          width: 28px;
          height: 28px;
          font-size: 1.3rem;
        }
      }

      @media (max-width: 480px) {
        .maintenance-notification {
          top: 70px;
          right: 5px;
          left: 5px;
          padding: 0.8rem;
          margin: 0 5px;
          border-radius: 12px;
        }
        
        .notification-content {
          gap: 0.6rem;
        }
        
        .notification-icon {
          font-size: 1.5rem;
        }
        
        .notification-text h4 {
          font-size: 0.95rem;
          margin-bottom: 0.3rem;
        }
        
        .notification-text p {
          font-size: 0.8rem;
          line-height: 1.3;
        }
        
        .notification-close {
          width: 25px;
          height: 25px;
          font-size: 1.2rem;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Globális változó a status managerhez
let serverStatusManager;

// Admin funkciók
function setServerOnline() {
  if (serverStatusManager) {
    serverStatusManager.setManualStatus('online', 'Online - Játékosok csatlakoznak...');
  }
}

function setServerMaintenance() {
  if (serverStatusManager) {
    serverStatusManager.setManualStatus('maintenance', 'Karbantartás alatt - Visszatérés hamarosan!');
  }
}

function setServerOffline() {
  if (serverStatusManager) {
    serverStatusManager.setManualStatus('offline', 'Szerver offline');
  }
}

function setServerCustom() {
  const status = prompt('Állapot (online/maintenance/offline):', 'maintenance');
  if (!status) return;
  
  const message = prompt('Egyedi üzenet:', 'Karbantartás alatt');
  if (message && serverStatusManager) {
    serverStatusManager.setManualStatus(status, message);
  }
}

// Admin panel mutatása URL paraméterrel
function checkAdminMode() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('admin') === 'true') {
    document.getElementById('adminControls').style.display = 'block';
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Maintenance notification
  const maintenanceNotification = new MaintenanceNotification();
  
  // Theme manager
  const themeManager = new ThemeManager();
  
  // Navigation manager
  const navigationManager = new NavigationManager();
  
  // Animation manager
  const animationManager = new AnimationManager();
  
  // Server status manager - globális változóba
  serverStatusManager = new ServerStatusManager();
  
  // Admin mód ellenőrzése
  checkAdminMode();

  // Only create particle system on desktop for performance
  if (window.innerWidth > 768) {
    // new ParticleSystem(); // Ha van ParticleSystem osztályod
  }
});

// Add CSS for animations and effects
const style = document.createElement('style');
style.textContent = `
  .btn {
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  @keyframes float {
    0%, 100% { 
      transform: translateY(0px) rotate(0deg); 
    }
    50% { 
      transform: translateY(-20px) rotate(180deg); 
    }
  }
  
  @keyframes statusPulse {
    0% {
      box-shadow: 0 0 0 0 rgba(0, 255, 136, 0.7);
      transform: scale(1);
    }
    70% {
      box-shadow: 0 0 0 8px rgba(0, 255, 136, 0);
      transform: scale(1.05);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(0, 255, 136, 0);
      transform: scale(1);
    }
  }
  
  @keyframes statusPulseMaintenance {
    0% {
      box-shadow: 0 0 0 0 rgba(255, 107, 53, 0.7);
      transform: scale(1);
    }
    70% {
      box-shadow: 0 0 0 8px rgba(255, 107, 53, 0);
      transform: scale(1.05);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(255, 107, 53, 0);
      transform: scale(1);
    }
  }
  
  .status-indicator.online {
    background: var(--primary-color);
    animation: statusPulse 2s infinite;
  }
  
  .status-indicator.maintenance {
    background: var(--secondary-color);
    animation: statusPulseMaintenance 2s infinite;
  }
  
  .status-indicator.offline {
    background: #666;
    animation: none;
  }
  
  .admin-controls {
    margin-top: 1rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    display: none;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .admin-controls h4 {
    color: var(--primary-color);
    margin-bottom: 0.5rem;
    font-family: 'Orbitron', monospace;
    font-size: 1rem;
    text-align: center;
  }
  
  .admin-buttons {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .btn-offline {
    background: #666 !important;
    color: white !important;
    border: none !important;
  }
  
  .btn-offline:hover {
    background: #777 !important;
    transform: translateY(-2px);
  }
  
  .btn-custom {
    background: var(--accent-color) !important;
    color: white !important;
    border: none !important;
  }
  
  .btn-custom:hover {
    background: #8b5cf6 !important;
    transform: translateY(-2px);
  }
`;
document.head.appendChild(style);