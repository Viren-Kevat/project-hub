/* ═══════════════════════════════════════════
   TOOLS PAGE — tools.js
   3D Tilt and Glow Effects for Tool Cards
   ═══════════════════════════════════════════ */

class ToolCard {
    constructor(element) {
        this.card = element;
        this.inner = element.querySelector('.tool-card__inner');
        this.glow = element.querySelector('.tool-card__glow');
        this.rect = null;
        
        // Constants
        this.MAX_TILT_X = 10;
        this.MAX_TILT_Y = 10;
        this.GLOW_SIZE = 400;
        
        // Bind methods
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        
        // Initialize
        this.init();
    }

    init() {
        this.inner.addEventListener('mousemove', this.onMouseMove);
        this.inner.addEventListener('mouseleave', this.onMouseLeave);
    }

    onMouseMove(e) {
        this.rect = this.inner.getBoundingClientRect();
        
        const x = e.clientX - this.rect.left;
        const y = e.clientY - this.rect.top;
        
        // Calculate normalized coordinates (0 to 1)
        const xNorm = x / this.rect.width;
        const yNorm = y / this.rect.height;
        
        // Calculate rotation (inverted for natural feel)
        const rotateX = (yNorm - 0.5) * this.MAX_TILT_X;
        const rotateY = -(xNorm - 0.5) * this.MAX_TILT_Y;
        
        // Update 3D transform
        this.card.style.setProperty('--rotate-x', `${rotateX}deg`);
        this.card.style.setProperty('--rotate-y', `${rotateY}deg`);
        
        // Update glow position
        const glowXPercent = (x / this.rect.width) * 100;
        const glowYPercent = (y / this.rect.height) * 100;
        this.glow.style.setProperty('--glow-x', `${glowXPercent}%`);
        this.glow.style.setProperty('--glow-y', `${glowYPercent}%`);
        
        // Add tilted class for animation
        this.card.classList.add('tilted');
    }

    onMouseLeave() {
        // Reset 3D transform
        this.card.style.setProperty('--rotate-x', '0deg');
        this.card.style.setProperty('--rotate-y', '0deg');
        
        // Reset glow
        this.glow.style.setProperty('--glow-x', '50%');
        this.glow.style.setProperty('--glow-y', '50%');
        
        // Remove tilted class
        this.card.classList.remove('tilted');
    }

    destroy() {
        this.inner.removeEventListener('mousemove', this.onMouseMove);
        this.inner.removeEventListener('mouseleave', this.onMouseLeave);
    }
}

// ── Initialize Tool Cards ──
document.addEventListener('DOMContentLoaded', function() {
    const toolCards = document.querySelectorAll('.tool-card');
    const toolCardInstances = [];

    toolCards.forEach(cardElement => {
        const instance = new ToolCard(cardElement);
        toolCardInstances.push(instance);
    });

    if (window.lucide && typeof lucide.replace === 'function') {
        lucide.replace();
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', function() {
        toolCardInstances.forEach(instance => instance.destroy());
    });
});

// ── Smooth Scroll for Navigation Links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ── Filter Tool Cards (optional - for future use) ──
function filterToolCards(category) {
    const cards = document.querySelectorAll('.tool-card');
    
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.opacity = '1';
            card.style.pointerEvents = 'auto';
            card.classList.add('visible');
            card.classList.remove('hidden');
        } else {
            card.style.opacity = '0.3';
            card.style.pointerEvents = 'none';
            card.classList.remove('visible');
            card.classList.add('hidden');
        }
    });
}

// ── Tab Navigation Highlight ──
function updateNavHighlight() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Check if link matches current page
        if (href === 'tools.html' || currentPath.includes('tools')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Initialize nav highlight
document.addEventListener('DOMContentLoaded', updateNavHighlight);

// ── Intersection Observer for Lazy Animation ──
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.tool-card').forEach(card => {
        card.style.animationPlayState = 'paused';
        observer.observe(card);
    });
});
