// Santosh Nayak Portfolio - Enhanced Multi-Page JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all functionality
  initPageRouting();
  initTypingAnimation();
  initAnimatedCounters();
  initSkillsAnimation();
  initContactForm();
  initMobileMenu();
  initNavbarEffects();
  initScrollAnimations();
  initPageAnimations();
  setCurrentYear();
});

// Page routing system for multi-page experience
function initPageRouting() {
  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('[data-page]');
  const navbar = document.querySelector('.navbar');
  
  let currentPage = 'home';
  let isTransitioning = false;

  // Show initial page
  showPage('home');

  // Add click listeners to all navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      if (isTransitioning) return;
      
      const targetPage = this.getAttribute('data-page');
      
      if (targetPage && targetPage !== currentPage) {
        navigateToPage(targetPage);
      }

      // Close mobile menu if open
      closeMobileMenu();
    });
  });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', function(e) {
    if (e.state && e.state.page) {
      navigateToPage(e.state.page, false);
    }
  });

  // Set initial history state
  history.replaceState({page: 'home'}, '', '#home');

  function navigateToPage(pageName, updateHistory = true) {
    if (isTransitioning || pageName === currentPage) return;
    
    isTransitioning = true;
    
    const currentPageEl = document.getElementById(`${currentPage}-page`);
    const targetPageEl = document.getElementById(`${pageName}-page`);
    
    if (!targetPageEl) return;

    // Update URL and history
    if (updateHistory) {
      history.pushState({page: pageName}, '', `#${pageName}`);
    }

    // Add transitioning classes
    if (currentPageEl) {
      currentPageEl.classList.add('transitioning-out');
    }
    
    // Start transition
    setTimeout(() => {
      showPage(pageName);
      
      // Trigger page-specific animations
      triggerPageAnimations(pageName);
      
      setTimeout(() => {
        if (currentPageEl) {
          currentPageEl.classList.remove('transitioning-out');
        }
        isTransitioning = false;
      }, 300);
    }, 150);
    
    currentPage = pageName;
    updateActiveNavLink(pageName);
    
    // Scroll to top smoothly
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  function showPage(pageName) {
    pages.forEach(page => {
      page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(`${pageName}-page`);
    if (targetPage) {
      targetPage.classList.add('active');
    }
  }

  function updateActiveNavLink(pageName) {
    navLinks.forEach(link => {
      const linkPage = link.getAttribute('data-page');
      link.classList.toggle('active', linkPage === pageName);
    });
  }
}

// Enhanced typing animation for hero subtitle
function initTypingAnimation() {
  const typingElement = document.querySelector('.typing-text');
  if (!typingElement) return;

  const roles = [
    'Full Stack Developer',
    'MERN Stack Expert', 
    'AI & ML Enthusiast',
    'Computer Vision Developer',
    'Problem Solver',
    'Innovation Creator'
  ];

  let currentRole = 0;
  let currentChar = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function typeAnimation() {
    const currentText = roles[currentRole];
    
    if (isDeleting) {
      typingElement.textContent = currentText.substring(0, currentChar - 1);
      currentChar--;
      typeSpeed = 50;
      
      if (currentChar === 0) {
        isDeleting = false;
        currentRole = (currentRole + 1) % roles.length;
        typeSpeed = 500;
      }
    } else {
      typingElement.textContent = currentText.substring(0, currentChar + 1);
      currentChar++;
      typeSpeed = Math.random() * 100 + 50; // Variable typing speed for realism
      
      if (currentChar === currentText.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause before deleting
      }
    }
    
    setTimeout(typeAnimation, typeSpeed);
  }

  // Start typing animation after initial page animations
  setTimeout(typeAnimation, 3000);
}

// Animated counters for statistics
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.stat-number');
  let hasAnimated = false;

  const observerOptions = {
    threshold: 0.5
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateCounters();
      }
    });
  }, observerOptions);

  const statsSection = document.querySelector('.stats-grid');
  if (statsSection) {
    observer.observe(statsSection);
  }

  function animateCounters() {
    counters.forEach((counter, index) => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2000;
      const startTime = performance.now();
      
      // Add delay for stagger effect
      setTimeout(() => {
        function updateCount(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Easing function for smooth animation
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          const current = Math.floor(target * easeOutQuart);
          
          counter.textContent = current;
          
          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            counter.textContent = target;
          }
        }
        
        requestAnimationFrame(updateCount);
      }, index * 200);
    });
  }
}

// Skills animation system
function initSkillsAnimation() {
  let hasAnimated = false;
  
  const observerOptions = {
    threshold: 0.3
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateSkills();
      }
    });
  }, observerOptions);

  // Observe skills page
  const skillsPage = document.getElementById('skills-page');
  if (skillsPage) {
    observer.observe(skillsPage);
  }

  function animateSkills() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach((item, index) => {
      const level = parseInt(item.getAttribute('data-level'));
      const progressBar = item.querySelector('.skill-progress');
      
      setTimeout(() => {
        if (progressBar) {
          progressBar.style.width = `${level}%`;
        }
      }, index * 100);
    });
  }
}

// Enhanced contact form with validation and animations
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    const formControls = contactForm.querySelectorAll('.form-control');
    
    // Add focus animations to form controls
    formControls.forEach(control => {
      control.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
      });
      
      control.addEventListener('blur', function() {
        if (!this.value.trim()) {
          this.parentElement.classList.remove('focused');
        }
      });
      
      // Real-time validation feedback
      control.addEventListener('input', function() {
        validateField(this);
      });
    });

    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();
      
      // Validate all fields
      let isValid = true;
      const fields = [{id: 'name', value: name}, {id: 'email', value: email}, {id: 'subject', value: subject}, {id: 'message', value: message}];
      
      fields.forEach(field => {
        const element = document.getElementById(field.id);
        if (!field.value) {
          showFieldError(element, 'This field is required');
          isValid = false;
        } else if (field.id === 'email' && !isValidEmail(field.value)) {
          showFieldError(element, 'Please enter a valid email address');
          isValid = false;
        } else {
          clearFieldError(element);
        }
      });
      
      if (!isValid) return;
      
      // Submit form with loading animation
      submitForm(this, {name, email, subject, message});
    });
  }

  function validateField(field) {
    const value = field.value.trim();
    
    if (field.type === 'email' && value) {
      if (!isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
      }
    }
    
    if (value || field.type !== 'email') {
      clearFieldError(field);
    }
    
    return true;
  }

  function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
      color: #ff4757;
      font-size: 12px;
      margin-top: 4px;
      opacity: 0;
      transform: translateY(-5px);
      transition: all 0.3s ease;
    `;
    
    field.parentElement.appendChild(errorElement);
    field.style.borderColor = '#ff4757';
    
    requestAnimationFrame(() => {
      errorElement.style.opacity = '1';
      errorElement.style.transform = 'translateY(0)';
    });
  }

  function clearFieldError(field) {
    const existingError = field.parentElement.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }
    field.style.borderColor = '';
  }

  function submitForm(form, data) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    submitButton.style.opacity = '0.7';
    
    // Add loading spinner
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.style.cssText = `
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-left: 8px;
    `;
    submitButton.appendChild(spinner);
    
    // Simulate API call
    setTimeout(() => {
      showNotification('Thank you! Your message has been sent successfully.', 'success');
      form.reset();
      
      // Reset button
      submitButton.textContent = originalText;
      submitButton.disabled = false;
      submitButton.style.opacity = '1';
      spinner.remove();
      
      // Clear focused states
      form.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('focused');
      });
      
    }, 2000);
  }
}

// Mobile menu functionality with animations
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleMobileMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Close menu on page navigation
    navLinks.addEventListener('click', function() {
      closeMobileMenu();
    });
  }

  function toggleMobileMenu() {
    const isActive = navLinks.classList.contains('active');
    
    if (isActive) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function openMobileMenu() {
    navLinks.classList.add('active');
    menuToggle.classList.add('active');
    menuToggle.innerHTML = '&times;';
    menuToggle.style.fontSize = '24px';
    
    // Animate menu items
    const menuItems = navLinks.querySelectorAll('.nav-link');
    menuItems.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(-10px)';
      
      setTimeout(() => {
        item.style.transition = 'all 0.3s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }

  function closeMobileMenu() {
    navLinks.classList.remove('active');
    menuToggle.classList.remove('active');
    menuToggle.innerHTML = '&#9776;';
    menuToggle.style.fontSize = '';
  }
  
  // Expose closeMobileMenu globally
  window.closeMobileMenu = closeMobileMenu;
}

// Navbar scroll effects
function initNavbarEffects() {
  const navbar = document.querySelector('.navbar');
  let lastScrollY = window.scrollY;
  
  if (navbar) {
    window.addEventListener('scroll', throttle(() => {
      const currentScrollY = window.scrollY;
      
      // Add scrolled class for styling
      navbar.classList.toggle('scrolled', currentScrollY > 50);
      
      // Hide/show navbar on mobile based on scroll direction
      if (window.innerWidth <= 768) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          navbar.style.transform = 'translateY(-100%)';
        } else {
          navbar.style.transform = 'translateY(0)';
        }
      }
      
      lastScrollY = currentScrollY;
    }, 10));
  }
}

// Scroll-based animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        
        // Add visible class for custom animations
        entry.target.classList.add('visible');
        
        // Stagger animations for child elements
        const children = entry.target.querySelectorAll('.animate-slide-up, .animate-fade-in');
        children.forEach((child, index) => {
          setTimeout(() => {
            child.style.animationDelay = `${index * 0.1}s`;
            child.style.animationPlayState = 'running';
          }, index * 100);
        });
      }
    });
  }, observerOptions);

  // Observe all animated elements
  const animatedElements = document.querySelectorAll('.animate-slide-up, .animate-fade-in, .section');
  animatedElements.forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
}

// Page-specific animations
function initPageAnimations() {
  // Add entrance animations to page elements
  const pages = document.querySelectorAll('.page');
  
  pages.forEach(page => {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.classList.contains('active')) {
          triggerPageAnimations(entry.target.id.replace('-page', ''));
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(page);
  });
}

function triggerPageAnimations(pageName) {
  const page = document.getElementById(`${pageName}-page`);
  if (!page) return;
  
  const animatedElements = page.querySelectorAll('.animate-slide-up, .animate-fade-in');
  
  animatedElements.forEach((element, index) => {
    element.style.animationDelay = `${index * 0.1}s`;
    element.classList.add('animate-in');
  });
  
  // Page-specific animations
  switch(pageName) {
    case 'skills':
      setTimeout(() => {
        const skillsPage = document.getElementById('skills-page');
        if (skillsPage && skillsPage.classList.contains('active')) {
          animateSkills();
        }
      }, 500);
      break;
    case 'home':
      setTimeout(() => {
        const statsSection = document.querySelector('.stats-grid');
        if (statsSection) {
          initAnimatedCounters();
        }
      }, 800);
      break;
  }
}

// Enhanced notification system
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => {
    notification.style.transform = 'translateX(100%)';
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  });
  
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 16px 24px;
    border-radius: 12px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    max-width: 400px;
    font-family: var(--font-family-base, 'Inter', sans-serif);
    font-size: 14px;
    line-height: 1.5;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    cursor: pointer;
    border: 1px solid rgba(255, 255, 255, 0.1);
  `;
  
  // Set styles based on type
  switch (type) {
    case 'success':
      notification.style.background = 'linear-gradient(135deg, rgba(0, 245, 255, 0.9), rgba(0, 166, 255, 0.9))';
      notification.style.borderColor = 'rgba(0, 245, 255, 0.3)';
      notification.style.boxShadow = '0 10px 40px rgba(0, 245, 255, 0.3)';
      break;
    case 'error':
      notification.style.background = 'linear-gradient(135deg, rgba(255, 71, 87, 0.9), rgba(255, 55, 66, 0.9))';
      notification.style.borderColor = 'rgba(255, 71, 87, 0.3)';
      notification.style.boxShadow = '0 10px 40px rgba(255, 71, 87, 0.3)';
      break;
    default:
      notification.style.background = 'linear-gradient(135deg, rgba(100, 100, 100, 0.9), rgba(80, 80, 80, 0.9))';
  }
  
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <div style="
        width: 8px; 
        height: 8px; 
        border-radius: 50%; 
        background: white;
        animation: pulse 2s infinite;
      "></div>
      <div>${message}</div>
    </div>
    <style>
      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(1.2); }
      }
    </style>
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  requestAnimationFrame(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
  });
  
  // Auto remove
  const autoRemoveTimer = setTimeout(() => {
    removeNotification(notification);
  }, 5000);
  
  // Manual close on click
  notification.addEventListener('click', () => {
    clearTimeout(autoRemoveTimer);
    removeNotification(notification);
  });

  function removeNotification(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }, 400);
  }
}

// Utility functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function setCurrentYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

function throttle(func, wait) {
  let timeout;
  let previous = 0;
  
  return function executedFunction(...args) {
    const now = Date.now();
    
    if (now - previous > wait) {
      func.apply(this, args);
      previous = now;
    } else {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(this, args);
        previous = Date.now();
      }, wait - (now - previous));
    }
  };
}

// Performance optimization
function optimizePerformance() {
  // Preload critical resources
  const criticalElements = document.querySelectorAll('img, video');
  criticalElements.forEach(element => {
    if (element.dataset.src) {
      element.src = element.dataset.src;
    }
  });

  // Add intersection observer for expensive animations
  const expensiveAnimations = document.querySelectorAll('.skill-item, .project-card');
  
  const performanceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.willChange = 'transform, opacity';
      } else {
        entry.target.style.willChange = 'auto';
      }
    });
  }, { rootMargin: '50px' });

  expensiveAnimations.forEach(element => {
    performanceObserver.observe(element);
  });
}

// Add CSS for additional animations
function injectAdditionalStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .animate-in {
      animation-play-state: running !important;
    }
    
    .loading-spinner {
      animation: spin 1s linear infinite;
    }
    
    .form-group.focused .form-label {
      color: var(--color-primary);
      transform: translateY(-2px);
      font-size: var(--font-size-sm);
    }
    
    .field-error {
      animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
  optimizePerformance();
  injectAdditionalStyles();
  
  // Add smooth scroll behavior
  document.documentElement.style.scrollBehavior = 'smooth';
  
  // Initialize page loading animation
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeMobileMenu();
  }
});

// Initialize on page load
window.addEventListener('load', function() {
  // Remove loading states
  document.body.classList.add('fully-loaded');
  
  // Trigger initial animations
  const initialAnimations = document.querySelectorAll('#home-page .animate-slide-up, #home-page .animate-fade-in');
  initialAnimations.forEach((element, index) => {
    setTimeout(() => {
      element.style.animationDelay = `${index * 0.2}s`;
      element.classList.add('animate-in');
    }, 500);
  });
});