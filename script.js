// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile menu functionality
const initMobileMenu = () => {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const dropdownItems = document.querySelectorAll('.dropdown');
    
    // Toggle mobile menu
    const toggleMobileMenu = () => {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    };
    
    // Close mobile menu
    const closeMobileMenu = () => {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
        
        // Close all dropdowns
        dropdownItems.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    };
    
    // Event listeners
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Handle dropdown clicks in mobile
    dropdownItems.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('a');
        dropdownLink.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                
                // Close other dropdowns first
                dropdownItems.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
                
                // Toggle current dropdown
                dropdown.classList.toggle('active');
            }
        });
    });
    
    // Close menu when clicking nav links (except dropdown toggles)
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                // If it's a dropdown toggle, don't close immediately
                if (link.closest('.dropdown') && !link.closest('.dropdown-menu')) {
                    return; // Let dropdown handle its own logic
                }
                // Close menu for all other links
                closeMobileMenu();
            }
        });
    });
    
    // Close menu when clicking dropdown submenu items
    const dropdownLinks = navMenu.querySelectorAll('.dropdown-menu a');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });
    
    // Close menu on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });
    
    // Universal click handler for mobile menu
    if (navMenu) {
        navMenu.addEventListener('click', (e) => {
            // Don't close when clicking on dropdown toggles
            if (e.target.closest('.dropdown') && !e.target.closest('.dropdown-menu')) {
                e.stopPropagation();
                return;
            }
            
            // Close menu for any other clickable element
            if (window.innerWidth <= 768 && 
                (e.target.tagName === 'A' || 
                 e.target.tagName === 'BUTTON' || 
                 e.target.closest('a') || 
                 e.target.closest('button'))) {
                closeMobileMenu();
            }
            
            e.stopPropagation();
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close menu on escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
};

// Form submission handler
const initContactForm = () => {
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            const navMenu = document.getElementById('navMenu');
            if (navMenu && navMenu.classList.contains('active')) {
                const mobileMenuToggle = document.getElementById('mobileMenuToggle');
                const mobileOverlay = document.getElementById('mobileOverlay');
                
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                mobileOverlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
            
            // Get form data
            const inputs = this.querySelectorAll('input');
            const textareas = this.querySelectorAll('textarea');
            const select = this.querySelector('select');
            
            const formData = {
                companyName: inputs[0].value,
                address: textareas[0].value,
                gstin: inputs[1].value,
                pinCode: inputs[2].value,
                companyEmail: inputs[3].value,
                category: select.value,
                requirements: textareas[1].value
            };
            
            // Simple validation - only Company Name and Product Category required
            if (!formData.companyName || formData.companyName.trim() === '') {
                alert('Please enter Company/Firm Name.');
                return;
            }
            
            if (!formData.category || formData.category.trim() === '') {
                alert('Please select a Product Category.');
                return;
            }
            
            // Special handling for Industrial Bearing - redirect to bharatbearing.com
            if (formData.category === 'industrial-bearing') {
                window.open('https://bharatbearing.com', '_blank');
                this.reset();
                alert('You are being redirected to Bharat Bearing website for Industrial Bearing inquiries.');
                return;
            }
            
            // Email validation (only if email is filled)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (formData.companyEmail && formData.companyEmail.trim() !== '' && !emailRegex.test(formData.companyEmail)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Create WhatsApp message with only filled fields
            const addFieldIfFilled = (label, value) => value && value.trim() !== '' ? `${label}: ${value}\n` : '';
            
            const whatsappMessage = `Hello Shree Balaji Enterprises (SBE),

We are interested in your premium products and would like to discuss business partnership.

*COMPANY DETAILS:*
Company/Firm: ${formData.companyName}
${addFieldIfFilled('Address', formData.address)}${addFieldIfFilled('GSTIN', formData.gstin)}${addFieldIfFilled('Pin Code', formData.pinCode)}${addFieldIfFilled('Company Email', formData.companyEmail)}
*PRODUCT INTEREST:* ${formData.category}

${addFieldIfFilled('*DETAILED REQUIREMENTS:*', formData.requirements)}
Please provide technical specifications, pricing, and commercial terms.

Thank you for your time.`;
            
            // Open WhatsApp with pre-filled message
            const whatsappUrl = `https://wa.me/917357371032?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');
            
            // Reset form and show success message
            this.reset();
            alert('Thank you for your inquiry! You are being redirected to WhatsApp to complete your request.');
        });
    }
};

// Button click handlers
const initButtonHandlers = () => {
    // Request Quote buttons
    document.querySelectorAll('.btn-primary').forEach(button => {
        if (button.textContent.includes('Request') || button.textContent.includes('Quote')) {
            button.addEventListener('click', (e) => {
                if (button.type !== 'submit') {
                    e.preventDefault();
                    // Close mobile menu if open
                    const navMenu = document.getElementById('navMenu');
                    if (navMenu && navMenu.classList.contains('active')) {
                        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
                        const mobileOverlay = document.getElementById('mobileOverlay');
                        
                        mobileMenuToggle.classList.remove('active');
                        navMenu.classList.remove('active');
                        mobileOverlay.classList.remove('active');
                        document.body.classList.remove('menu-open');
                    }
                    
                    document.querySelector('#contact').scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
    
    // Contact Us buttons
    document.querySelectorAll('.btn-primary').forEach(button => {
        if (button.textContent.includes('Contact')) {
            button.addEventListener('click', (e) => {
                if (button.type !== 'submit') {
                    e.preventDefault();
                    // Close mobile menu if open
                    const navMenu = document.getElementById('navMenu');
                    if (navMenu && navMenu.classList.contains('active')) {
                        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
                        const mobileOverlay = document.getElementById('mobileOverlay');
                        
                        mobileMenuToggle.classList.remove('active');
                        navMenu.classList.remove('active');
                        mobileOverlay.classList.remove('active');
                        document.body.classList.remove('menu-open');
                    }
                    
                    document.querySelector('#contact').scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
    
    // View All Products button
    document.querySelectorAll('.btn-secondary').forEach(button => {
        if (button.textContent.includes('View All Products')) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelector('#products').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }
    });
    
    // Product Learn More buttons
    document.querySelectorAll('.btn-outline').forEach(button => {
        if (button.textContent.includes('Learn More')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                // Close mobile menu if open
                const navMenu = document.getElementById('navMenu');
                if (navMenu && navMenu.classList.contains('active')) {
                    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
                    const mobileOverlay = document.getElementById('mobileOverlay');
                    
                    mobileMenuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    mobileOverlay.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
                
                const productCard = this.closest('.product-card');
                const productName = productCard.querySelector('h3').textContent;
                
                // Scroll to products section
                document.querySelector('#products').scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Pre-select the product category in the contact form
                setTimeout(() => {
                    const select = document.querySelector('.contact-form select');
                    if (select) {
                        const productValue = productName.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '');
                        // Map product names to select values
                        const productMapping = {
                            'bobbin-transport-system-(bts)': 'bobbin-transport-system',
                            'separator-clips': 'separator-clips',
                            'bobbin-trolleys': 'bobbin-trolleys',
                            'separators': 'separators',
                            'gear-cutters': 'gear-cutters',
                            'ss-trolleys-for-ycp': 'ss-trolleys',
                            'spindle-buttons': 'spindle-buttons',
                            'silent-chain': 'silent-chain',
                            'industrial-bearing': 'industrial-bearing'
                        };
                        
                        const mappedValue = productMapping[productValue] || 'other';
                        select.value = mappedValue;
                        
                        // Scroll to contact form
                        setTimeout(() => {
                            document.querySelector('#contact').scrollIntoView({
                                behavior: 'smooth'
                            });
                        }, 500);
                    }
                }, 500);
            });
        }
    });
};

// Navbar scroll effect
const initNavbarScroll = () => {
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    });
};

// Intersection Observer for animations
const initScrollAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Animate elements on scroll
    document.querySelectorAll('.product-card, .feature-card, .industry-card, .gallery-item, .stat-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
};

// Counter animation for stats
const initCounterAnimation = () => {
    const animateCounters = () => {
        const counters = document.querySelectorAll('.stat-item h3');
        
        counters.forEach(counter => {
            const text = counter.textContent;
            const hasPlus = text.includes('+');
            const hasPercent = text.includes('%');
            const number = parseInt(text.replace(/\D/g, ''));
            
            if (number > 0) {
                const duration = 2000;
                const step = number / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += step;
                    if (current < number) {
                        let displayValue = Math.floor(current);
                        if (hasPlus) displayValue += '+';
                        if (hasPercent) displayValue += '%';
                        counter.textContent = displayValue;
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = text; // Restore original text
                    }
                };
                
                // Start animation when element comes into view
                const counterObserver = new IntersectionObserver((entries) => {
                    if (entries[0].isIntersecting) {
                        updateCounter();
                        counterObserver.disconnect();
                    }
                });
                
                counterObserver.observe(counter);
            }
        });
    };
    
    animateCounters();
};

// Prevent body scroll when menu is open
const initBodyScrollControl = () => {
    const style = document.createElement('style');
    style.innerHTML = `
        body.menu-open {
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
};

// Enhanced mobile menu interactions
const initEnhancedMobileMenu = () => {
    // Add touch-friendly hover effects
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('touchstart', () => {
            link.style.backgroundColor = '#f7fafc';
        });
        
        link.addEventListener('touchend', () => {
            setTimeout(() => {
                link.style.backgroundColor = '';
            }, 150);
        });
    });
};

// Enhanced image loading and optimization
const initImageHandling = () => {
    // Add loading placeholder for all product and gallery images
    const addImageLoadingEffects = () => {
        const images = document.querySelectorAll('.product-img, .gallery-img');
        
        images.forEach(img => {
            // Add loading class initially
            img.classList.add('image-loading');
            
            // Handle image load
            img.addEventListener('load', () => {
                img.classList.remove('image-loading');
                img.classList.add('image-loaded');
            });
            
            // Handle image error
            img.addEventListener('error', () => {
                img.classList.remove('image-loading');
                img.classList.add('image-error');
                // Create fallback icon
                const fallback = document.createElement('div');
                fallback.className = 'image-fallback';
                fallback.innerHTML = '<i class="fas fa-image"></i>';
                img.style.display = 'none';
                img.parentNode.appendChild(fallback);
            });
        });
    };
    
    // Lazy loading with Intersection Observer
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                    }
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    addImageLoadingEffects();
};

// Header top bar auto-hide on mobile scroll
const initHeaderAutoHide = () => {
    let lastScrollTop = 0;
    const headerTop = document.querySelector('.header-top');
    
    if (headerTop && window.innerWidth <= 768) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                headerTop.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                headerTop.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
        
        headerTop.style.transition = 'transform 0.3s ease';
    }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initBodyScrollControl();
    initEnhancedMobileMenu();
    initContactForm();
    initButtonHandlers();
    initNavbarScroll();
    initScrollAnimations();
    initCounterAnimation();
    initImageHandling();
    initHeaderAutoHide();
    
    // Add loading complete class for any CSS transitions
    document.body.classList.add('loaded');
    
    // Debug: Log when mobile menu is initialized
    if (window.innerWidth <= 768) {
        console.log('Mobile menu initialized for Shree Balaji Enterprises');
    }
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Page is visible again, ensure mobile menu is closed
        const navMenu = document.getElementById('navMenu');
        if (navMenu && navMenu.classList.contains('active') && window.innerWidth <= 768) {
            const mobileMenuToggle = document.getElementById('mobileMenuToggle');
            const mobileOverlay = document.getElementById('mobileOverlay');
            
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }
});

// Add WhatsApp floating button functionality (optional)
const initWhatsAppButton = () => {
    // Create floating WhatsApp button
    const whatsappFloat = document.createElement('div');
    whatsappFloat.innerHTML = '<i class="fab fa-whatsapp"></i>';
    whatsappFloat.className = 'whatsapp-float';
    whatsappFloat.onclick = () => {
        window.open('https://wa.me/917357371032?text=Hello! I am interested in your industrial parts and would like to get more information.', '_blank');
    };
    
    // Add styles for floating button
    const floatStyles = document.createElement('style');
    floatStyles.innerHTML = `
        .whatsapp-float {
            position: fixed;
            width: 60px;
            height: 60px;
            bottom: 40px;
            right: 40px;
            background-color: #25d366;
            color: white;
            border-radius: 50%;
            text-align: center;
            font-size: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        }
        
        .whatsapp-float:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 12px rgba(0,0,0,0.3);
        }
        
        @media (max-width: 768px) {
            .whatsapp-float {
                width: 50px;
                height: 50px;
                bottom: 20px;
                right: 20px;
                font-size: 24px;
            }
        }
    `;
    
    document.head.appendChild(floatStyles);
    document.body.appendChild(whatsappFloat);
};

// Initialize WhatsApp floating button
initWhatsAppButton();
