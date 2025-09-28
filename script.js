// Global application state
let appState = {
    currentRoute: '/',
    showTimer: false,
    timerComplete: false,
    countdown: 10,
    mobileMenuOpen: false,
    formSubmitting: false
};

// Router configuration
const routes = {
    '/': 'home-page',
    '/about': 'about-page',
    '/contact': 'contact-page',
    '/privacy-policy': 'privacy-policy-page',
    '/terms-conditions': 'terms-conditions-page',
    '/refund-policy': 'refund-policy-page'
};

// Constants
const PRESENTATION_URL = "https://docs.google.com/presentation/d/1Vjb9ja-aemrRWvR4VyFd43fWypdowXJ2Gj7Wd7VCiTE/edit?usp=sharing";

// Utility functions
function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

function addClass(element, className) {
    if (element) element.classList.add(className);
}

function removeClass(element, className) {
    if (element) element.classList.remove(className);
}

function toggleClass(element, className) {
    if (element) element.classList.toggle(className);
}

function show(element) {
    if (element) removeClass(element, 'hidden');
}

function hide(element) {
    if (element) addClass(element, 'hidden');
}

// Router functionality
function navigateTo(path) {
    // Update browser history
    if (path !== appState.currentRoute) {
        history.pushState({ path }, '', path);
    }
    
    // Update current route
    appState.currentRoute = path;
    
    // Hide all pages
    $$('.page').forEach(page => {
        removeClass(page, 'active');
    });
    
    // Show target page or 404
    const targetPage = routes[path];
    if (targetPage) {
        const pageElement = $(`#${targetPage}`);
        if (pageElement) {
            addClass(pageElement, 'active');
        }
    } else {
        // Show 404 page
        const notFoundPage = $('#not-found-page');
        if (notFoundPage) {
            addClass(notFoundPage, 'active');
        }
    }
    
    // Update navigation active states
    updateNavigationStates(path);
    
    // Close mobile menu if open
    closeMobileMenu();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateNavigationStates(currentPath) {
    // Update desktop navigation
    $$('.nav-link').forEach(link => {
        const route = link.getAttribute('data-route');
        if (route === currentPath) {
            addClass(link, 'active');
        } else {
            removeClass(link, 'active');
        }
    });
    
    // Update mobile navigation
    $$('.mobile-nav-link').forEach(link => {
        const route = link.getAttribute('data-route');
        if (route === currentPath) {
            addClass(link, 'active');
        } else {
            removeClass(link, 'active');
        }
    });
}

// Handle browser back/forward navigation
window.addEventListener('popstate', (event) => {
    const path = event.state?.path || location.pathname;
    navigateTo(path);
});

// Mobile menu functionality
function toggleMobileMenu() {
    appState.mobileMenuOpen = !appState.mobileMenuOpen;
    
    const mobileMenu = $('.mobile-menu');
    const hamburgerIcon = $('.hamburger-icon');
    const closeIcon = $('.close-icon');
    
    if (appState.mobileMenuOpen) {
        show(mobileMenu);
        hide(hamburgerIcon);
        show(closeIcon);
    } else {
        hide(mobileMenu);
        show(hamburgerIcon);
        hide(closeIcon);
    }
}

function closeMobileMenu() {
    if (appState.mobileMenuOpen) {
        appState.mobileMenuOpen = false;
        const mobileMenu = $('.mobile-menu');
        const hamburgerIcon = $('.hamburger-icon');
        const closeIcon = $('.close-icon');
        
        hide(mobileMenu);
        show(hamburgerIcon);
        hide(closeIcon);
    }
}

// Countdown timer functionality
function startCountdown() {
    appState.showTimer = true;
    appState.countdown = 10;
    
    // Hide hero buttons and show countdown container
    const heroButtons = $('#hero-buttons');
    const messageContainer = $('#message-container');
    const countdownTimer = $('#countdown-timer');
    const scrollMessage = $('#scroll-message');
    const countdownNumber = $('#countdown-number');
    
    hide(heroButtons);
    show(messageContainer);
    show(countdownTimer);
    hide(scrollMessage);
    
    // Start countdown
    const countdownInterval = setInterval(() => {
        appState.countdown--;
        
        if (countdownNumber) {
            countdownNumber.textContent = appState.countdown;
        }
        
        if (appState.countdown <= 0) {
            clearInterval(countdownInterval);
            completeTimer();
        }
    }, 1000);
}

function completeTimer() {
    appState.timerComplete = true;
    
    const countdownTimer = $('#countdown-timer');
    const scrollMessage = $('#scroll-message');
    const linkSection = $('#link-section');
    
    // Hide countdown timer and show scroll message
    hide(countdownTimer);
    show(scrollMessage);
    
    // Show link section after a brief delay
    setTimeout(() => {
        show(linkSection);
        
        // Scroll to link section
        linkSection?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }, 1500);
}

// Copy to clipboard functionality
async function copyToClipboard() {
    const copyBtn = $('#copy-link-btn');
    const copyText = $('#copy-text');
    const copyIcon = $('#copy-icon');
    const checkIcon = $('#check-icon');
    const copySuccess = $('#copy-success');
    
    try {
        // Try modern clipboard API first
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(PRESENTATION_URL);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = PRESENTATION_URL;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
        
        // Update button state
        if (copyText) copyText.textContent = 'Copied!';
        hide(copyIcon);
        show(checkIcon);
        show(copySuccess);
        
        // Add success styling
        if (copyBtn) {
            addClass(copyBtn, 'bg-accent');
            addClass(copyBtn, 'text-accent-foreground');
        }
        
        // Reset after 3 seconds
        setTimeout(() => {
            if (copyText) copyText.textContent = 'Copy Link';
            show(copyIcon);
            hide(checkIcon);
            hide(copySuccess);
            
            if (copyBtn) {
                removeClass(copyBtn, 'bg-accent');
                removeClass(copyBtn, 'text-accent-foreground');
            }
        }, 3000);
        
    } catch (err) {
        console.error('Failed to copy text: ', err);
        
        // Show error state briefly
        if (copyText) copyText.textContent = 'Failed to copy';
        setTimeout(() => {
            if (copyText) copyText.textContent = 'Copy Link';
        }, 2000);
    }
}

// Contact form functionality
function handleContactForm(event) {
    event.preventDefault();
    
    if (appState.formSubmitting) return;
    
    const form = event.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('.form-submit-btn');
    const submitText = $('#submit-text');
    const submitLoading = $('#submit-loading');
    const successMessage = $('#form-success');
    const errorMessage = $('#form-error');
    
    // Validate form
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.focus();
            return;
        }
    });
    
    if (!isValid) {
        showFormError('Please fill in all required fields.');
        return;
    }
    
    // Validate email format
    const emailField = form.querySelector('[type="email"]');
    if (emailField && !isValidEmail(emailField.value)) {
        showFormError('Please enter a valid email address.');
        emailField.focus();
        return;
    }
    
    // Start submission
    appState.formSubmitting = true;
    
    // Update button state
    if (submitBtn) submitBtn.disabled = true;
    hide(submitText);
    show(submitLoading);
    hide(successMessage);
    hide(errorMessage);
    
    // Simulate form submission (in real app, this would be an API call)
    setTimeout(() => {
        // Simulate success
        const success = Math.random() > 0.1; // 90% success rate for demo
        
        if (success) {
            showFormSuccess();
            form.reset();
        } else {
            showFormError('Failed to send message. Please try again later.');
        }
        
        // Reset button state
        appState.formSubmitting = false;
        if (submitBtn) submitBtn.disabled = false;
        show(submitText);
        hide(submitLoading);
        
    }, 2000); // 2 second delay to simulate network request
}

function showFormSuccess() {
    const successMessage = $('#form-success');
    const errorMessage = $('#form-error');
    
    hide(errorMessage);
    show(successMessage);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        hide(successMessage);
    }, 5000);
}

function showFormError(message) {
    const successMessage = $('#form-success');
    const errorMessage = $('#form-error');
    const errorText = errorMessage?.querySelector('p');
    
    if (errorText) errorText.textContent = message;
    
    hide(successMessage);
    show(errorMessage);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        hide(errorMessage);
    }, 5000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Smooth scrolling functionality
function scrollToResources() {
    const resourcesSection = $('#resources');
    if (resourcesSection) {
        resourcesSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Initialize navigation event listeners
function initializeNavigation() {
    // Desktop navigation links
    $$('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const route = link.getAttribute('data-route');
            if (route) {
                navigateTo(route);
            }
        });
    });
    
    // Mobile navigation links
    $$('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const route = link.getAttribute('data-route');
            if (route) {
                navigateTo(route);
            }
        });
    });
    
    // Logo navigation
    const logo = $('.nav-logo');
    if (logo) {
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo('/');
        });
    }
    
    // Mobile menu toggle
    const mobileMenuBtn = $('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
}

// Initialize home page functionality
function initializeHomePage() {
    // Get Link button
    const getLinkBtn = $('#get-link-btn');
    if (getLinkBtn) {
        getLinkBtn.addEventListener('click', startCountdown);
    }
    
    // Browse Resources button
    const browseResourcesBtn = $('#browse-resources-btn');
    if (browseResourcesBtn) {
        browseResourcesBtn.addEventListener('click', scrollToResources);
    }
    
    // Copy Link button
    const copyLinkBtn = $('#copy-link-btn');
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', copyToClipboard);
    }
}

// Initialize contact page functionality
function initializeContactPage() {
    const contactForm = $('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
}

// Initialize footer functionality
function initializeFooter() {
    // Add click handlers for footer links that should navigate
    $$('.footer-link, .footer-bottom-link').forEach(link => {
        const text = link.textContent.toLowerCase();
        
        if (text.includes('privacy')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navigateTo('/privacy-policy');
            });
        } else if (text.includes('terms')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navigateTo('/terms-conditions');
            });
        } else if (text.includes('refund')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navigateTo('/refund-policy');
            });
        } else if (text.includes('contact')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navigateTo('/contact');
            });
        }
    });
}

// Add keyboard navigation support
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Escape key closes mobile menu
        if (e.key === 'Escape' && appState.mobileMenuOpen) {
            closeMobileMenu();
        }
        
        // Tab navigation improvements for accessibility
        if (e.key === 'Tab') {
            // Ensure focus is visible for keyboard users
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    // Remove keyboard navigation class on mouse use
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
}

// Add window resize handler
function initializeResponsiveHandlers() {
    window.addEventListener('resize', () => {
        // Close mobile menu on resize to larger screen
        if (window.innerWidth >= 768 && appState.mobileMenuOpen) {
            closeMobileMenu();
        }
    });
}

// Error handling for images
function initializeImageErrorHandling() {
    $$('img').forEach(img => {
        img.addEventListener('error', function() {
            // Add a fallback or placeholder when images fail to load
            this.style.backgroundColor = '#f3f4f6';
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.justifyContent = 'center';
            this.style.color = '#6b7280';
            this.style.fontSize = '0.875rem';
            this.alt = 'Image not available';
        });
    });
}

// Initialize tooltips and enhanced interactions
function initializeEnhancedInteractions() {
    // Add hover effects for interactive elements
    $$('button, .btn, .nav-link, .footer-link').forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-1px)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add loading states for external links
    $$('a[target="_blank"]').forEach(link => {
        link.addEventListener('click', function() {
            const originalText = this.textContent;
            this.textContent = 'Opening...';
            
            setTimeout(() => {
                this.textContent = originalText;
            }, 1000);
        });
    });
}

// Performance optimizations
function initializePerformanceOptimizations() {
    // Lazy loading for images (basic implementation)
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    $$('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
    
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            // Handle scroll-based animations or effects here if needed
        }, 100);
    });
}

// Analytics and tracking (placeholder)
function initializeAnalytics() {
    // Placeholder for analytics tracking
    // In a real application, you would integrate with Google Analytics or similar
    
    // Track page views
    function trackPageView(path) {
        console.log(`Page view: ${path}`);
        // gtag('config', 'GA_MEASUREMENT_ID', { page_path: path });
    }
    
    // Track events
    function trackEvent(action, category, label) {
        console.log(`Event: ${action} - ${category} - ${label}`);
        // gtag('event', action, { event_category: category, event_label: label });
    }
    
    // Track page views on navigation
    const originalNavigateTo = navigateTo;
    navigateTo = function(path) {
        originalNavigateTo(path);
        trackPageView(path);
    };
    
    // Track button clicks
    $$('button, .btn').forEach(button => {
        button.addEventListener('click', () => {
            const testId = button.getAttribute('data-testid');
            if (testId) {
                trackEvent('click', 'button', testId);
            }
        });
    });
}

// Initialize application
function initializeApp() {
    console.log('Initializing ContentHub Pro application...');
    
    // Initialize all modules
    initializeNavigation();
    initializeHomePage();
    initializeContactPage();
    initializeFooter();
    initializeKeyboardNavigation();
    initializeResponsiveHandlers();
    initializeImageErrorHandling();
    initializeEnhancedInteractions();
    initializePerformanceOptimizations();
    initializeAnalytics();
    
    // Handle initial route
    const initialPath = window.location.pathname;
    navigateTo(initialPath);
    
    console.log('Application initialized successfully!');
}

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Export functions for global access (useful for debugging)
window.ContentHubPro = {
    navigateTo,
    copyToClipboard,
    toggleMobileMenu,
    scrollToResources,
    appState
};

// Service Worker registration (progressive web app support)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Register service worker for better performance and offline support
        // navigator.serviceWorker.register('/service-worker.js')
        //     .then(registration => console.log('SW registered: ', registration))
        //     .catch(registrationError => console.log('SW registration failed: ', registrationError));
    });
}

// Add CSS for keyboard navigation
const keyboardNavigationStyles = `
    .keyboard-navigation *:focus {
        outline: 2px solid var(--ring) !important;
        outline-offset: 2px !important;
    }
`;

// Inject keyboard navigation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = keyboardNavigationStyles;
document.head.appendChild(styleSheet);