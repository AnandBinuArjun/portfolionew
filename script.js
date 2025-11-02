// Performance optimized theme switching functionality
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const themeOptions = document.querySelectorAll('.theme-option');
    const projectTabs = document.querySelectorAll('.project-filter .nav-link');
    const contactForm = document.getElementById('contactForm');
    const contactBtns = document.querySelectorAll('.contact-btn');
    const buttons = document.querySelectorAll('.btn');
    const heroImage = document.querySelector('.hero-image');
    
    // Set initial theme
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Theme switching functionality
    themeOptions.forEach(option => {
        if (option.getAttribute('data-theme') === currentTheme) {
            option.classList.add('active');
        }
        
        option.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            
            themeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            
            showNotification(`Switched to ${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`, 'success');
        });
    });
    
    // Handle toggle between repositories and tools
    const contentToggle = document.getElementById('contentToggle');
    const repositoriesContent = document.getElementById('repositoriesContent');
    const toolsContent = document.getElementById('toolsContent');
    
    if (contentToggle && repositoriesContent && toolsContent) {
        contentToggle.addEventListener('change', function() {
            if (this.checked) {
                repositoriesContent.style.display = 'none';
                toolsContent.style.display = 'block';
            } else {
                repositoriesContent.style.display = 'block';
                toolsContent.style.display = 'none';
            }
        });
    }

    // Optimized scroll animation handler
    let ticking = false;
    
    const animateOnScroll = () => {
        const elements = document.querySelectorAll(
            '.stat-card, .service-card, .project-card, .accordion-item, .contact-item, .section-title, .skill-item, .hero-title, .hero-subtitle, .hero-description, .hero-buttons, .hero-image-container, .certification-card'
        );
        
        const screenPosition = window.innerHeight / 1.3;
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            if (elementPosition < screenPosition) {
                element.classList.add('animate');
            }
        });
    };
    
    // Throttled scroll handler
    const onScroll = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                animateOnScroll();
                ticking = false;
            });
            ticking = true;
        }
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Trigger once on load for elements in viewport
    setTimeout(animateOnScroll, 100);
    
    // Project Filter Tabs
    projectTabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            projectTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            filterProjects(this.getAttribute('data-bs-target').substring(1));
        });
    });

    // Simplified project filtering function
    function filterProjects(category) {
        const allProjects = document.querySelectorAll('.project-card');
        
        if (category === 'all') {
            allProjects.forEach(project => {
                project.parentElement.style.display = 'block';
            });
            return;
        }
        
        // Since we removed the category tabs, all projects are shown in the 'all' category
        allProjects.forEach(project => {
            project.parentElement.style.display = 'block';
        });
    }

    // Form Submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple form validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Add loading state to submit button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                showNotification('Message sent successfully! I will get back to you soon.', 'success');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 800);
        });
    }

    // Contact button functionality
    contactBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const contactSection = document.querySelector('.contact-section');
            if (contactSection) {
                contactSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            showNotification('Feel free to send me a message!', 'info');
        });
    });

    // Simplified ripple effect for buttons
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 400);
        });
    });

    // Animate skill bars
    const skillBars = document.querySelectorAll('.progress-bar');
    
    const animateSkillBars = () => {
        skillBars.forEach(bar => {
            bar.style.width = bar.parentElement.style.width || '100%';
        });
    };

    // Trigger animation when skills section is in view
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    });

    const skillsSection = document.querySelector('.skills-container');
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    // Add floating animation to hero image
    if (heroImage) {
        heroImage.classList.add('float-animation');
    }

    // Initialize animations
    setTimeout(() => {
        document.body.classList.add('loaded');
        
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description, .hero-buttons, .hero-image-container');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('animate');
            }, index * 100);
        });
    }, 100);
    
    // Simplified mouse move parallax effect
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        let isMouseOver = false;
        
        heroSection.addEventListener('mousemove', (e) => {
            if (!isMouseOver) return;
            
            const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
            heroSection.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });
        
        heroSection.addEventListener('mouseenter', () => {
            isMouseOver = true;
        });
        
        heroSection.addEventListener('mouseleave', () => {
            isMouseOver = false;
            heroSection.style.transform = 'rotateY(0deg) rotateX(0deg)';
        });
    }
});

// Optimized notification function
function showNotification(message, type = 'info') {
    // Check if notification already exists
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '12px 16px';
    notification.style.borderRadius = '6px';
    notification.style.color = 'white';
    notification.style.fontWeight = '500';
    notification.style.zIndex = '10000';
    notification.style.boxShadow = '0 3px 10px rgba(0,0,0,0.15)';
    notification.style.transform = 'translateX(100%)';
    notification.style.opacity = '0';
    notification.style.transition = 'all 0.3s ease';
    notification.style.maxWidth = '300px';
    notification.style.fontSize = '0.85rem';
    notification.style.textAlign = 'center';
    
    // Set colors based on type
    switch(type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #4CAF50, #8BC34A)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #F44336, #E91E63)';
            break;
        case 'warning':
            notification.style.background = 'linear-gradient(135deg, #FF9800, #FFC107)';
            break;
        default:
            notification.style.background = 'linear-gradient(135deg, #2196F3, #00BCD4)';
    }
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add ripple effect styles
function addRippleStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.4);
            transform: translate(-50%, -50%);
            animation: rippleEffect 0.4s linear;
            pointer-events: none;
        }
        
        @keyframes rippleEffect {
            from {
                width: 0;
                height: 0;
                opacity: 0.4;
            }
            to {
                width: 300px;
                height: 300px;
                opacity: 0;
            }
        }
        
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }
        
        .float-animation {
            animation: float 3s ease-in-out infinite;
        }
    `;
    document.head.appendChild(style);
}

// Initialize ripple styles
addRippleStyles();

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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