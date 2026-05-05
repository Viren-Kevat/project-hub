/* ═══════════════════════════════════════════
   ENROLLMENT MODAL
   ═══════════════════════════════════════════ */

(function() {
    const modal = document.getElementById('enrollModal');
    const openBtn = document.getElementById('openEnrollModal');
    const openBtnMobile = document.getElementById('openEnrollModalMobile');
    const closeBtn = document.getElementById('enrollClose');
    const backdrop = document.getElementById('enrollBackdrop');
    const form = document.getElementById('enrollForm');
    const successState = document.getElementById('enrollSuccess');
    const successCloseBtn = document.getElementById('enrollSuccessClose');
    const submitBtn = document.getElementById('enrollSubmit');
    const charCount = document.getElementById('charCount');
    const messageField = document.getElementById('enrollMessage');

    let lastFocusedElement = null;

    // Open modal
    function openModal() {
        lastFocusedElement = document.activeElement;
        modal.classList.add('is-active');
        document.body.style.overflow = 'hidden';
        
        // Focus first input after animation
        setTimeout(() => {
            document.getElementById('enrollName').focus();
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
        successState.classList.remove('is-visible');
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;
        charCount.textContent = '0 / 300';
        
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
    if (messageField) {
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
            timestamp: new Date().toISOString()
        };

        // Simulate API call (replace with real endpoint)
        console.log('Enrollment Data:', formData);
        
        await new Promise(r => setTimeout(r, 1500));

        // Show success
        document.getElementById('successName').textContent = formData.fullName.split(' ')[0];
        document.getElementById('successEmail').textContent = formData.email;
        
        form.classList.add('is-hidden');
        successState.classList.add('is-visible');

        // Auto-close after 5 seconds
        setTimeout(() => {
            if (modal.classList.contains('is-active')) {
                closeModal();
            }
        }, 5000);
    });

    // Event listeners
    openBtn?.addEventListener('click', openModal);
    openBtnMobile?.addEventListener('click', openModal);
    closeBtn?.addEventListener('click', closeModal);
    backdrop?.addEventListener('click', closeModal);
    successCloseBtn?.addEventListener('click', closeModal);

    // Keyboard
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