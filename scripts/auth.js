// Authentication Management
class AuthManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupFormValidation();
    this.setupFormSubmission();
    this.setupSocialLogin();
  }

  setupFormValidation() {
    // Login form validation
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      this.setupLoginValidation(loginForm);
    }

    // Register form validation
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      this.setupRegisterValidation(registerForm);
    }
  }

  setupLoginValidation(form) {
    const username = form.querySelector('#username');
    const password = form.querySelector('#password');

    username?.addEventListener('blur', () => {
      this.validateField(username, this.validateUsername(username.value));
    });

    password?.addEventListener('blur', () => {
      this.validateField(password, this.validatePassword(password.value));
    });

    // Real-time validation
    username?.addEventListener('input', () => {
      this.clearFieldError(username);
    });

    password?.addEventListener('input', () => {
      this.clearFieldError(password);
    });
  }

  setupRegisterValidation(form) {
    const username = form.querySelector('#regUsername');
    const email = form.querySelector('#regEmail');
    const password = form.querySelector('#regPassword');
    const passwordConfirm = form.querySelector('#regPasswordConfirm');
    const minecraftUsername = form.querySelector('#minecraftUsername');

    // Individual field validation
    username?.addEventListener('blur', () => {
      this.validateField(username, this.validateUsername(username.value));
    });

    email?.addEventListener('blur', () => {
      this.validateField(email, this.validateEmail(email.value));
    });

    password?.addEventListener('blur', () => {
      this.validateField(password, this.validatePassword(password.value));
    });

    passwordConfirm?.addEventListener('blur', () => {
      this.validateField(passwordConfirm, this.validatePasswordConfirm(password.value, passwordConfirm.value));
    });

    minecraftUsername?.addEventListener('blur', () => {
      this.validateField(minecraftUsername, this.validateMinecraftUsername(minecraftUsername.value));
    });

    // Real-time validation clearing
    [username, email, password, passwordConfirm, minecraftUsername].forEach(field => {
      field?.addEventListener('input', () => {
        this.clearFieldError(field);
      });
    });

    // Password confirmation real-time check
    passwordConfirm?.addEventListener('input', () => {
      if (password.value && passwordConfirm.value) {
        this.validateField(passwordConfirm, this.validatePasswordConfirm(password.value, passwordConfirm.value));
      }
    });
  }

  setupFormSubmission() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    loginForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleLogin(loginForm);
    });

    registerForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleRegister(registerForm);
    });
  }

  setupSocialLogin() {
    const discordBtn = document.querySelector('.discord-btn');
    const googleBtn = document.querySelector('.google-btn');

    discordBtn?.addEventListener('click', () => {
      this.handleSocialLogin('discord');
    });

    googleBtn?.addEventListener('click', () => {
      this.handleSocialLogin('google');
    });
  }

  // Validation functions
  validateUsername(username) {
    if (!username) {
      return { valid: false, message: 'Felhasználónév kötelező' };
    }
    if (username.length < 3) {
      return { valid: false, message: 'Minimum 3 karakter szükséges' };
    }
    if (username.length > 16) {
      return { valid: false, message: 'Maximum 16 karakter engedélyezett' };
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return { valid: false, message: 'Csak betűk, számok és aláhúzás engedélyezett' };
    }
    return { valid: true };
  }

  validateEmail(email) {
    if (!email) {
      return { valid: false, message: 'Email cím kötelező' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, message: 'Érvénytelen email formátum' };
    }
    return { valid: true };
  }

  validatePassword(password) {
    if (!password) {
      return { valid: false, message: 'Jelszó kötelező' };
    }
    if (password.length < 8) {
      return { valid: false, message: 'Minimum 8 karakter szükséges' };
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { valid: false, message: 'Tartalmaznia kell kis- és nagybetűt, valamint számot' };
    }
    return { valid: true };
  }

  validatePasswordConfirm(password, passwordConfirm) {
    if (!passwordConfirm) {
      return { valid: false, message: 'Jelszó megerősítése kötelező' };
    }
    if (password !== passwordConfirm) {
      return { valid: false, message: 'A jelszavak nem egyeznek' };
    }
    return { valid: true };
  }

  validateMinecraftUsername(username) {
    if (!username) {
      return { valid: false, message: 'Minecraft felhasználónév kötelező' };
    }
    if (username.length < 3 || username.length > 16) {
      return { valid: false, message: '3-16 karakter között kell lennie' };
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return { valid: false, message: 'Csak betűk, számok és aláhúzás engedélyezett' };
    }
    return { valid: true };
  }

  // UI helper functions
  validateField(field, validation) {
    this.clearFieldError(field);
    
    if (!validation.valid) {
      this.showFieldError(field, validation.message);
      return false;
    }
    
    this.showFieldSuccess(field);
    return true;
  }

  clearFieldError(field) {
    field.classList.remove('error', 'success');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }
  }

  showFieldError(field, message) {
    field.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
  }

  showFieldSuccess(field) {
    field.classList.add('success');
  }

  // Form submission handlers
  async handleLogin(form) {
    const formData = new FormData(form);
    const username = formData.get('username');
    const password = formData.get('password');
    const remember = formData.get('remember') === 'on';

    // Validate all fields
    const usernameField = form.querySelector('#username');
    const passwordField = form.querySelector('#password');

    const isUsernameValid = this.validateField(usernameField, this.validateUsername(username));
    const isPasswordValid = this.validateField(passwordField, this.validatePassword(password));

    if (!isUsernameValid || !isPasswordValid) {
      this.showNotification('Kérjük javítsd ki a hibákat', 'error');
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector('.auth-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Bejelentkezés...';
    submitBtn.disabled = true;

    try {
      // Simulate API call
      await this.simulateApiCall();
      
      // Store login state
      if (remember) {
        localStorage.setItem('rememberedUser', username);
      }
      
      this.showNotification('Sikeres bejelentkezés!', 'success');
      
      // Redirect after success
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
      
    } catch (error) {
      this.showNotification('Hibás felhasználónév vagy jelszó', 'error');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }

  async handleRegister(form) {
    const formData = new FormData(form);
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const passwordConfirm = formData.get('passwordConfirm');
    const minecraftUsername = formData.get('minecraftUsername');
    const agreeTerms = formData.get('agreeTerms') === 'on';

    // Validate all fields
    const fields = [
      { element: form.querySelector('#regUsername'), validator: () => this.validateUsername(username) },
      { element: form.querySelector('#regEmail'), validator: () => this.validateEmail(email) },
      { element: form.querySelector('#regPassword'), validator: () => this.validatePassword(password) },
      { element: form.querySelector('#regPasswordConfirm'), validator: () => this.validatePasswordConfirm(password, passwordConfirm) },
      { element: form.querySelector('#minecraftUsername'), validator: () => this.validateMinecraftUsername(minecraftUsername) }
    ];

    let isFormValid = true;
    fields.forEach(({ element, validator }) => {
      if (!this.validateField(element, validator())) {
        isFormValid = false;
      }
    });

    if (!agreeTerms) {
      this.showNotification('El kell fogadnod a szabályzatot', 'error');
      isFormValid = false;
    }

    if (!isFormValid) {
      this.showNotification('Kérjük javítsd ki a hibákat', 'error');
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector('.auth-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Regisztráció...';
    submitBtn.disabled = true;

    try {
      // Simulate API call
      await this.simulateApiCall();
      
      this.showNotification('Sikeres regisztráció! Ellenőrizd az email-jeidet.', 'success');
      
      // Redirect after success
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
      
    } catch (error) {
      this.showNotification('Regisztráció sikertelen. Próbáld újra később.', 'error');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }

  async handleSocialLogin(provider) {
    this.showNotification(`${provider === 'discord' ? 'Discord' : 'Google'} bejelentkezés...`, 'info');
    
    try {
      // Simulate social login
      await this.simulateApiCall();
      this.showNotification('Sikeres bejelentkezés!', 'success');
      
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
      
    } catch (error) {
      this.showNotification('Bejelentkezés sikertelen', 'error');
    }
  }

  // Utility functions
  async simulateApiCall() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 90% success rate for demo
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error('API Error'));
        }
      }, 1500);
    });
  }

  showNotification(message, type = 'info') {
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
      background: type === 'success' ? 'var(--primary-color)' : 
                  type === 'error' ? 'var(--secondary-color)' : 'var(--accent-color)',
      color: 'white',
      padding: '1rem 2rem',
      borderRadius: '10px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
      zIndex: '10000',
      animation: 'slideInRight 0.3s ease-out',
      fontWeight: '600',
      maxWidth: '300px'
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 4000);
  }
}

// Password strength indicator
class PasswordStrengthIndicator {
  constructor(passwordField, targetElement) {
    this.passwordField = passwordField;
    this.targetElement = targetElement;
    this.init();
  }

  init() {
    this.createIndicator();
    this.passwordField.addEventListener('input', () => {
      this.updateStrength();
    });
  }

  createIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'password-strength';
    indicator.innerHTML = `
      <div class="strength-bar">
        <div class="strength-fill"></div>
      </div>
      <div class="strength-text">Jelszó erősség</div>
    `;
    
    this.targetElement.appendChild(indicator);
    this.strengthFill = indicator.querySelector('.strength-fill');
    this.strengthText = indicator.querySelector('.strength-text');
  }

  updateStrength() {
    const password = this.passwordField.value;
    const strength = this.calculateStrength(password);
    
    this.strengthFill.style.width = `${strength.percentage}%`;
    this.strengthFill.className = `strength-fill strength-${strength.level}`;
    this.strengthText.textContent = strength.text;
  }

  calculateStrength(password) {
    let score = 0;
    let feedback = [];

    if (password.length >= 8) score += 25;
    else feedback.push('minimum 8 karakter');

    if (/[a-z]/.test(password)) score += 25;
    else feedback.push('kisbetű');

    if (/[A-Z]/.test(password)) score += 25;
    else feedback.push('nagybetű');

    if (/\d/.test(password)) score += 25;
    else feedback.push('szám');

    if (/[^a-zA-Z0-9]/.test(password)) score += 10;

    let level, text;
    if (score < 25) {
      level = 'weak';
      text = 'Gyenge';
    } else if (score < 50) {
      level = 'fair';
      text = 'Közepes';
    } else if (score < 75) {
      level = 'good';
      text = 'Jó';
    } else {
      level = 'strong';
      text = 'Erős';
    }

    return {
      percentage: Math.min(score, 100),
      level,
      text: feedback.length > 0 ? `Hiányzik: ${feedback.join(', ')}` : text
    };
  }
}

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AuthManager();
  
  // Add password strength indicator for register form
  const passwordField = document.getElementById('regPassword');
  if (passwordField) {
    const container = passwordField.parentNode;
    new PasswordStrengthIndicator(passwordField, container);
  }
  
  // Pre-fill remembered username
  const rememberedUser = localStorage.getItem('rememberedUser');
  const usernameField = document.getElementById('username');
  if (rememberedUser && usernameField) {
    usernameField.value = rememberedUser;
    document.getElementById('remember').checked = true;
  }
});

// Add CSS for form validation and password strength
const authStyle = document.createElement('style');
authStyle.textContent = `
  .form-group input.error {
    border-color: var(--secondary-color);
    box-shadow: 0 0 10px rgba(255, 107, 53, 0.3);
  }
  
  .form-group input.success {
    border-color: var(--primary-color);
    box-shadow: 0 0 10px var(--shadow-color);
  }
  
  .field-error {
    color: var(--secondary-color);
    font-size: 0.85rem;
    margin-top: 0.5rem;
    animation: fadeInUp 0.3s ease-out;
  }
  
  .password-strength {
    margin-top: 0.5rem;
  }
  
  .strength-bar {
    width: 100%;
    height: 4px;
    background: var(--border-color);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 0.25rem;
  }
  
  .strength-fill {
    height: 100%;
    transition: all 0.3s ease;
    border-radius: 2px;
  }
  
  .strength-weak {
    background: var(--secondary-color);
  }
  
  .strength-fair {
    background: #ffa500;
  }
  
  .strength-good {
    background: #32cd32;
  }
  
  .strength-strong {
    background: var(--primary-color);
  }
  
  .strength-text {
    font-size: 0.8rem;
    color: var(--text-muted);
  }
  
  .auth-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
  
  .checkbox-label input[type="checkbox"] {
    display: none;
  }
`;
document.head.appendChild(authStyle);
