// Portfolio Interactive Scripts
// Handles animations, navigation, and user interactions

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initScrollAnimations();
    initNavigation();
    initSmoothScrolling();
    initTypewriterEffect();
    
    // Add loading complete class for initial animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Intersection Observer for scroll-triggered animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add staggered delay based on data-delay attribute
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, delay);
                
                // Only animate once
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements with slide-in class
    const animatedElements = document.querySelectorAll('.slide-in');
    animatedElements.forEach(el => observer.observe(el));
}

// Navigation functionality
function initNavigation() {
    const nav = document.querySelector('.nav-container');
    const navLinks = document.querySelectorAll('.nav-link');
    let lastScrollY = window.scrollY;
    
    // Handle navigation background on scroll
    function handleNavScroll() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            nav.style.background = 'rgba(250, 247, 242, 0.98)';
            nav.style.boxShadow = '0 2px 20px rgba(107, 66, 38, 0.1)';
        } else {
            nav.style.background = 'rgba(250, 247, 242, 0.95)';
            nav.style.boxShadow = 'none';
        }
        
        // Hide/show nav on scroll direction (mobile)
        if (window.innerWidth <= 768) {
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                nav.style.transform = 'translateY(-100%)';
            } else {
                nav.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollY = currentScrollY;
    }
    
    // Throttled scroll handler
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(handleNavScroll, 10);
    });
    
    // Update active nav link based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Typewriter effect for hero tagline
function initTypewriterEffect() {
    const tagline = document.querySelector('.hero-tagline');
    if (!tagline) return;
    
    const text = tagline.textContent;
    tagline.textContent = '';
    tagline.style.opacity = '1';
    
    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            tagline.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 80);
        } else {
            // Add cursor blink effect
            setTimeout(() => {
                tagline.classList.add('typing-complete');
            }, 500);
        }
    }
    
    // Start typewriter after initial hero animation
    setTimeout(typeWriter, 1200);
}

// Enhanced project card interactions
function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Add parallax effect on mouse move
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// Initialize project cards after DOM is loaded
setTimeout(initProjectCards, 500);

// Skills animation on scroll
function animateSkills() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skills = entry.target.querySelectorAll('.skill-item');
                skills.forEach((skill, index) => {
                    setTimeout(() => {
                        skill.style.animationDelay = `${index * 0.1}s`;
                        skill.classList.add('skill-animate');
                    }, index * 100);
                });
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach(category => skillObserver.observe(category));
}

// Statistics counter animation
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                
                // Animate numbers (skip infinity symbol)
                if (finalValue !== '∞') {
                    const finalNum = parseInt(finalValue);
                    let currentNum = 0;
                    const increment = finalNum / 30;
                    
                    target.textContent = '0';
                    
                    const timer = setInterval(() => {
                        currentNum += increment;
                        if (currentNum >= finalNum) {
                            target.textContent = finalValue;
                            clearInterval(timer);
                        } else {
                            target.textContent = Math.floor(currentNum);
                        }
                    }, 50);
                }
                
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => statsObserver.observe(stat));
}

// Initialize stats animation
setTimeout(animateStats, 1000);
setTimeout(animateSkills, 1000);

// Contact form interactions (if needed later)
function initContactInteractions() {
    const contactLinks = document.querySelectorAll('.contact-link');
    
    contactLinks.forEach(link => {
        // Add ripple effect on click
        link.addEventListener('click', function(e) {
            if (this.classList.contains('location')) return;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

initContactInteractions();

// Add CSS for additional animations
const additionalStyles = `
    .typing-complete::after {
        content: '|';
        animation: blink 1s infinite;
    }
    
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
    
    .skill-animate {
        animation: skillPop 0.5s ease-out forwards;
    }
    
    @keyframes skillPop {
        0% {
            transform: scale(0.8);
            opacity: 0.7;
        }
        50% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(232, 137, 74, 0.3);
        transform: scale(0);
        animation: rippleAnimation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes rippleAnimation {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .nav-link.active {
        color: var(--secondary-orange);
    }
    
    .nav-link.active::after {
        width: 100%;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Performance optimization: Reduce animations on slower devices
function checkPerformance() {
    // Simplified performance check
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
    const isSlowDevice = navigator.hardwareConcurrency < 4;
    
    if (isSlowConnection || isSlowDevice) {
        document.documentElement.style.setProperty('--transition-slow', '0.3s ease');
        document.documentElement.style.setProperty('--transition-medium', '0.2s ease');
    }
}

checkPerformance();

// Accessibility enhancements
function initA11y() {
    // Add focus visible styles for keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--transition-slow', '0.1s');
        document.documentElement.style.setProperty('--transition-medium', '0.1s');
        document.documentElement.style.setProperty('--transition-fast', '0.05s');
    }
}

initA11y();

// Debug info (remove in production)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🎨 Portfolio website loaded successfully!');
    console.log('🌟 Features: Scroll animations, smooth navigation, typewriter effect');
    console.log('♿ Accessibility: Keyboard navigation, reduced motion support');
    console.log('📱 Responsive: Mobile-first design with progressive enhancement');
}