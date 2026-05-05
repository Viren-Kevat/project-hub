/* ════════════════════════════════════════════════════════════
   Quantum Pulse Loader — Reusable loader component
   Inject this loader at page load, then hide it after content loads
   ════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /**
     * Creates and manages the quantum pulse loader
     * @param {Object} options - Configuration options
     * @param {string} options.containerId - ID of container to mount loader in (default: 'app')
     * @param {number} options.minDisplayTime - Minimum time to show loader in ms (default: 1500)
     * @param {number} options.timeout - Timeout to hide loader if content doesn't load (default: 10000)
     * @returns {Object} Loader controller object
     */
    function createQuantumLoader(options = {}) {
        const config = {
            containerId: options.containerId || 'app',
            minDisplayTime: options.minDisplayTime || 1500,
            timeout: options.timeout || 10000,
        };

        let isHidden = false;
        const loadStartTime = Date.now();

        // Create loader HTML structure
        function createLoaderHTML() {
            const wrapper = document.createElement('div');
            wrapper.id = 'quantum-pulse-loader';
            wrapper.setAttribute('aria-live', 'polite');
            wrapper.setAttribute('aria-label', 'Loading page content');
            wrapper.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(14px);
                z-index: 9999;
                transition: opacity 0.3s ease-out;
            `;

            const inner = document.createElement('div');
            inner.className = 'generating-loader-wrapper';

            inner.innerHTML = `
                <div class="generating-loader-text">
                    <span class="generating-loader-letter">G</span>
                    <span class="generating-loader-letter">e</span>
                    <span class="generating-loader-letter">n</span>
                    <span class="generating-loader-letter">e</span>
                    <span class="generating-loader-letter">r</span>
                    <span class="generating-loader-letter">a</span>
                    <span class="generating-loader-letter">t</span>
                    <span class="generating-loader-letter">i</span>
                    <span class="generating-loader-letter">n</span>
                    <span class="generating-loader-letter">g</span>
                </div>
                <div class="generating-loader-bar"></div>
            `;

            wrapper.appendChild(inner);
            return wrapper;
        }

        // Hide loader with fade effect
        function hideLoader() {
            if (isHidden) return;
            isHidden = true;

            const loaderEl = document.getElementById('quantum-pulse-loader');
            if (!loaderEl) return;

            const elapsed = Date.now() - loadStartTime;
            const remaining = Math.max(0, config.minDisplayTime - elapsed);

            setTimeout(() => {
                loaderEl.style.opacity = '0';
                setTimeout(() => {
                    if (loaderEl && loaderEl.parentNode) {
                        loaderEl.parentNode.removeChild(loaderEl);
                    }
                }, 300);
            }, remaining);
        }

        // Show loader
        function showLoader() {
            // Don't show if already showing
            if (document.getElementById('quantum-pulse-loader')) {
                return;
            }

            const loaderEl = createLoaderHTML();
            document.body.insertBefore(loaderEl, document.body.firstChild);

            // Hide after timeout if nothing else hides it
            setTimeout(() => {
                if (!isHidden) hideLoader();
            }, config.timeout);
        }

        // Public API
        return {
            show: showLoader,
            hide: hideLoader,
            isHidden: () => isHidden,
        };
    }

    // Define init function first
    function initLoader() {
        // Check if any element has data-quantum-loader attribute
        const loaderElement = document.querySelector('[data-quantum-loader]');
        if (loaderElement) {
            const options = {
                containerId: loaderElement.dataset.loaderContainer || 'app',
                minDisplayTime: parseInt(loaderElement.dataset.loaderMinTime) || 1500,
                timeout: parseInt(loaderElement.dataset.loaderTimeout) || 10000,
            };
            window.quantumLoader = createQuantumLoader(options);
            window.quantumLoader.show();

            // Auto-hide when page fully loads
            window.addEventListener('load', () => {
                setTimeout(() => {
                    if (window.quantumLoader) {
                        window.quantumLoader.hide();
                    }
                }, 500);
            });
        }
    }

    // Auto-initialize on page load if data attribute is present
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLoader);
    } else {
        // If DOMContentLoaded already fired, init immediately
        setTimeout(initLoader, 0);
    }

    // Expose to global scope
    window.createQuantumLoader = createQuantumLoader;
})();
