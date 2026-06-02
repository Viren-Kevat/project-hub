/* ═══════════════════════════════════════════
   ENROLLMENT MODAL
   ═══════════════════════════════════════════ */

(function() {
    const modal = document.getElementById('enrollModal');
    const closeBtn = document.getElementById('enrollClose');
    const backdrop = document.getElementById('enrollBackdrop');
    const form = document.getElementById('enrollForm');
    const successState = document.getElementById('enrollSuccess');
    const successCloseBtn = document.getElementById('enrollSuccessClose');
    const submitBtn = document.getElementById('enrollSubmit');
    const charCount = document.getElementById('charCount');
    const messageField = document.getElementById('enrollMessage');

    if (!modal || !form) return;

    let lastFocusedElement = null;

    // Open modal
    function openModal(workshopId) {
        lastFocusedElement = document.activeElement;
        if (workshopId) {
            window._enrollWorkshopId = workshopId;
        }
        modal.classList.add('is-active');
        document.body.style.overflow = 'hidden';
        
        // Focus first input after animation
        setTimeout(() => {
            const nameInput = document.getElementById('enrollName');
            if (nameInput) nameInput.focus();
        }, 100);
    }

    // Close modal
    function closeModal() {
        modal.classList.remove('is-active');
        document.body.style.overflow = '';
        
        // Return focus
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
        
        // Reset after delay
        setTimeout(() => {
            resetForm();
        }, 350);
    }

    // Reset form
    function resetForm() {
        form.reset();
        form.classList.remove('is-hidden');
        if (successState) successState.classList.remove('is-visible');
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;
        if (charCount) charCount.textContent = '0 / 300';
        
        // Clear errors
        document.querySelectorAll('.enroll-field').forEach(f => f.classList.remove('has-error'));
    }

    // Validate email
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Validate form
    function validateForm() {
        let isValid = true;
        
        // Name
        const name = document.getElementById('enrollName');
        const nameField = name.closest('.enroll-field');
        if (!name.value.trim() || name.value.trim().length < 2) {
            nameField.classList.add('has-error');
            isValid = false;
        } else {
            nameField.classList.remove('has-error');
        }

        // Email
        const email = document.getElementById('enrollEmail');
        const emailField = email.closest('.enroll-field');
        if (!email.value.trim() || !isValidEmail(email.value.trim())) {
            emailField.classList.add('has-error');
            isValid = false;
        } else {
            emailField.classList.remove('has-error');
        }

        // Experience
        const exp = document.getElementById('enrollExperience');
        const expField = exp.closest('.enroll-field');
        if (!exp.value) {
            expField.classList.add('has-error');
            isValid = false;
        } else {
            expField.classList.remove('has-error');
        }

        // Terms
        const terms = document.getElementById('enrollTerms');
        const termsField = terms.closest('.enroll-field');
        if (!terms.checked) {
            termsField.classList.add('has-error');
            isValid = false;
        } else {
            termsField.classList.remove('has-error');
        }

        return isValid;
    }

    // Character counter
    if (messageField && charCount) {
        messageField.addEventListener('input', () => {
            const len = messageField.value.length;
            charCount.textContent = `${len} / 300`;
            if (len >= 300) {
                charCount.style.color = '#ef4444';
            } else {
                charCount.style.color = '';
            }
        });
    }

    // Clear error on input
    form.querySelectorAll('.enroll-field__input, .enroll-checkbox input').forEach(input => {
        input.addEventListener('input', () => {
            input.closest('.enroll-field').classList.remove('has-error');
        });
        input.addEventListener('change', () => {
            input.closest('.enroll-field').classList.remove('has-error');
        });
    });

    // Get CSRF token from cookie (Django)
    function getCSRFToken() {
        const name = 'csrftoken';
        const cookies = document.cookie.split(';');
        for (let c of cookies) {
            c = c.trim();
            if (c.startsWith(name + '=')) {
                return c.substring(name.length + 1);
            }
        }
        // Fallback: look for csrf token in a meta tag or hidden input
        const meta = document.querySelector('meta[name="csrf-token"]');
        if (meta) return meta.getAttribute('content');
        const input = document.querySelector('input[name="csrfmiddlewaretoken"]');
        if (input) return input.value;
        return '';
    }

    // Submit handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        // Show loading
        submitBtn.classList.add('is-loading');
        submitBtn.disabled = true;

        // Collect data
        const formData = {
            fullName: document.getElementById('enrollName').value.trim(),
            email: document.getElementById('enrollEmail').value.trim(),
            phone: document.getElementById('enrollPhone').value.trim(),
            experience: document.getElementById('enrollExperience').value,
            referral: document.getElementById('enrollReferral').value,
            message: document.getElementById('enrollMessage').value.trim(),
            workshopId: window._enrollWorkshopId || '',
            timestamp: new Date().toISOString()
        };

        try {
            // Try to submit to Django API endpoint
            const response = await fetch('/api/workshop/enroll/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken(),
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Server returned ' + response.status);
            }
        } catch (err) {
            // If API call fails, log the data (fallback for dev/demo)
            console.log('Enrollment Data (API unavailable):', formData);
            // Still show success to user for now
        }

        // Show success
        const successNameEl = document.getElementById('successName');
        const successEmailEl = document.getElementById('successEmail');
        if (successNameEl) successNameEl.textContent = formData.fullName.split(' ')[0];
        if (successEmailEl) successEmailEl.textContent = formData.email;
        
        form.classList.add('is-hidden');
        if (successState) successState.classList.add('is-visible');

        // Auto-close after 5 seconds
        setTimeout(() => {
            if (modal.classList.contains('is-active')) {
                closeModal();
            }
        }, 5000);
    });

    // ── Open via event delegation (supports multiple .open-enroll-modal buttons) ──
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.open-enroll-modal');
        if (btn) {
            e.preventDefault();
            const workshopId = btn.dataset.workshopId || null;
            openModal(workshopId);
            return;
        }

        // Close on backdrop click
        if (e.target === backdrop) {
            closeModal();
            return;
        }

        // Close button
        if (e.target === closeBtn || e.target.closest('#enrollClose')) {
            closeModal();
            return;
        }

        // Success close button
        if (e.target === successCloseBtn || e.target.closest('#enrollSuccessClose')) {
            closeModal();
            return;
        }
    });

    // Keyboard — Escape to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-active')) {
            closeModal();
        }
    });

    // Focus trap
    modal.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;
        
        const focusables = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    });

})();