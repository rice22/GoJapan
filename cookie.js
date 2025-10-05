class CookiesBanner {
  constructor() {
    this.overlay = null;
    this.banner = null;
    this.acceptBtn = null;
    this.rejectBtn = null;
    this.selectedOption = null;
    
    this.init();
  }

  init() {
    if (this.hasUserConsent()) {
      return;
    }

    this.createBanner();
    this.bindEvents();
    this.showBanner();
  }

  hasUserConsent() {
    return sessionStorage.getItem('cookieConsent') !== null;
  }

  createBanner() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'cookies-overlay';
    
    this.overlay.innerHTML = `
      <div class="cookies-banner">
        <div class="cookies-image-container">
          <img src="elements/cookie.png" alt="Cookies" class="cookies-image">
        </div>
        <div class="cookies-text">
          We use cookies to enhance your experience on our Japan travel guide website. 
          Cookies help us personalize content, analyze traffic, and improve site functionality. 
          By continuing to browse, you agree to our use of cookies. 
          <a href="policy.html" class="learn-more" target="_blank">Learn more</a>
        </div>
        <div class="cookies-buttons">
          <button class="cookie-button accept" data-choice="accept">
            <div class="custom-checkbox"></div>
            Accept
          </button>
          <button class="cookie-button reject" data-choice="reject">
            <div class="custom-checkbox"></div>
            Reject
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(this.overlay);
    
    this.banner = this.overlay.querySelector('.cookies-banner');
    this.acceptBtn = this.overlay.querySelector('[data-choice="accept"]');
    this.rejectBtn = this.overlay.querySelector('[data-choice="reject"]');
  }

  bindEvents() {
    this.acceptBtn.addEventListener('click', () => this.handleChoice('accept'));
    this.rejectBtn.addEventListener('click', () => this.handleChoice('reject'));
    
    this.banner.addEventListener('click', (e) => e.stopPropagation());
  }

  showBanner() {
    this.overlay.classList.add('show');
    
    setTimeout(() => {
      this.banner.classList.add('animate-up');
    }, 100);
  }

  handleChoice(choice) {
    if (this.selectedOption) return;
    
    this.selectedOption = choice;
    
    const clickedBtn = choice === 'accept' ? this.acceptBtn : this.rejectBtn;
    const otherBtn = choice === 'accept' ? this.rejectBtn : this.acceptBtn;
    const checkbox = clickedBtn.querySelector('.custom-checkbox');
    
    this.acceptBtn.style.pointerEvents = 'none';
    this.rejectBtn.style.pointerEvents = 'none';
    
    otherBtn.style.opacity = '0.5';
    
    checkbox.classList.add('checked');
    clickedBtn.classList.add('checked');
    
    sessionStorage.setItem('cookieConsent', choice);
    
    setTimeout(() => {
      this.hideBanner();
    }, 2000);
  }

  hideBanner() {
    this.banner.classList.remove('animate-up');
    this.banner.classList.add('animate-down');
    
    setTimeout(() => {
      this.overlay.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(this.overlay);
      }, 300);
    }, 800);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CookiesBanner();
});
