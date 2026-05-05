/* ═══════════════════════════════════════════
   Floating Social Share Button
   Vanilla JS — draggable, no dependencies
   ═══════════════════════════════════════════ */

(function () {
    'use strict';

    // ── Inject the HTML ──
    var shareHTML = [
        '<div class="social-share" id="socialShare">',
        '  <div class="social-share__pill" id="socialSharePill">',

        // Collapsed state — Share label
        '    <div class="social-share__trigger">',
        '      <svg viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>',
        '      <span></span>',
        '    </div>',

        // Expanded state — social icons
        '    <div class="social-share__actions">',

        //   Twitter / X
        '      <button class="social-share__btn social-share__btn--twitter" type="button" data-action="twitter">',
        '        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
        '        <span class="social-share__tooltip">Twitter / X</span>',
        '      </button>',

        //   Instagram
        '      <button class="social-share__btn social-share__btn--instagram" type="button" data-action="instagram">',
        '        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
        '        <span class="social-share__tooltip">Instagram</span>',
        '      </button>',

        //   LinkedIn
        '      <button class="social-share__btn social-share__btn--linkedin" type="button" data-action="linkedin">',
        '        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
        '        <span class="social-share__tooltip">LinkedIn</span>',
        '      </button>',

        //   Divider
        '      <div class="social-share__divider"></div>',

        //   Copy link
        '      <button class="social-share__btn social-share__btn--copy" type="button" data-action="copy">',
        '        <svg class="icon-copy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
        '        <svg class="icon-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none"><polyline points="20 6 9 17 4 12"/></svg>',
        '        <span class="social-share__tooltip">Copy Link</span>',
        '      </button>',

        '    </div>',
        '  </div>',
        '</div>'
    ].join('\n');

    // Insert into page
    document.body.insertAdjacentHTML('beforeend', shareHTML);

    // ── Cache DOM ──
    var shareRoot = document.getElementById('socialShare');
    var pill = document.getElementById('socialSharePill');
    if (!pill || !shareRoot) return;

    var isExpanded = false;

    /* ════════════════════════════════════════
       DRAG & DROP
       ════════════════════════════════════════ */
    var isDragging = false;
    var wasDragged = false;       // true if the pointer moved enough to count as a drag
    var dragStartX = 0;
    var dragStartY = 0;
    var elStartX = 0;
    var elStartY = 0;
    var DRAG_THRESHOLD = 5;       // px — below this is a click, above is a drag

    // Restore saved position from localStorage
    var savedPos = localStorage.getItem('ph-share-pos');
    if (savedPos) {
        try {
            var pos = JSON.parse(savedPos);
            // Clear CSS defaults so left/top from JS take over
            shareRoot.style.top = pos.top + 'px';
            shareRoot.style.left = pos.left + 'px';
            shareRoot.style.right = 'auto';
            shareRoot.style.bottom = 'auto';
            // Clamp to viewport in case window was resized
            clampToViewport();
        } catch (e) { /* ignore bad data */ }
    }

    function getPointerPos(e) {
        if (e.touches && e.touches.length) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: e.clientX, y: e.clientY };
    }

    function onDragStart(e) {
        // Don't initiate drag from social action buttons when expanded
        if (isExpanded && e.target.closest('[data-action]')) return;

        var p = getPointerPos(e);
        dragStartX = p.x;
        dragStartY = p.y;

        // Get current element position
        var rect = shareRoot.getBoundingClientRect();
        elStartX = rect.left;
        elStartY = rect.top;

        isDragging = true;
        wasDragged = false;

        // Attach move/end listeners to document for reliability
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragEnd);
        document.addEventListener('touchmove', onDragMove, { passive: false });
        document.addEventListener('touchend', onDragEnd);
    }

    function onDragMove(e) {
        if (!isDragging) return;

        var p = getPointerPos(e);
        var dx = p.x - dragStartX;
        var dy = p.y - dragStartY;

        // Check threshold before committing to drag
        if (!wasDragged && Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) {
            return;
        }

        // We've committed to dragging
        if (!wasDragged) {
            wasDragged = true;
            shareRoot.classList.add('is-dragging');
        }

        e.preventDefault(); // prevent scroll on touch

        var newLeft = elStartX + dx;
        var newTop = elStartY + dy;

        // Clear CSS right/bottom so left/top work
        shareRoot.style.right = 'auto';
        shareRoot.style.bottom = 'auto';
        shareRoot.style.left = newLeft + 'px';
        shareRoot.style.top = newTop + 'px';
    }

    function onDragEnd() {
        isDragging = false;
        shareRoot.classList.remove('is-dragging');

        document.removeEventListener('mousemove', onDragMove);
        document.removeEventListener('mouseup', onDragEnd);
        document.removeEventListener('touchmove', onDragMove);
        document.removeEventListener('touchend', onDragEnd);

        if (wasDragged) {
            clampToViewport();
            // Save position
            var rect = shareRoot.getBoundingClientRect();
            localStorage.setItem('ph-share-pos', JSON.stringify({
                left: rect.left,
                top: rect.top
            }));
        }
    }

    function clampToViewport() {
        var rect = shareRoot.getBoundingClientRect();
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        var margin = 8;

        var left = rect.left;
        var top = rect.top;

        if (left < margin) left = margin;
        if (top < margin) top = margin;
        if (left + rect.width > vw - margin) left = vw - rect.width - margin;
        if (top + rect.height > vh - margin) top = vh - rect.height - margin;

        shareRoot.style.left = left + 'px';
        shareRoot.style.top = top + 'px';
    }

    // Attach drag start listeners
    shareRoot.addEventListener('mousedown', onDragStart);
    shareRoot.addEventListener('touchstart', onDragStart, { passive: true });

    // Re-clamp if window resizes
    window.addEventListener('resize', function () {
        // Only clamp if we've been manually positioned
        if (shareRoot.style.left && shareRoot.style.left !== 'auto') {
            clampToViewport();
        }
    });


    /* ════════════════════════════════════════
       EXPAND / COLLAPSE
       ════════════════════════════════════════ */

    // Expand on click (only when collapsed AND not dragged)
    pill.addEventListener('click', function (e) {
        if (wasDragged) return;  // ignore click at end of drag
        if (isExpanded) return;
        isExpanded = true;
        pill.classList.add('is-expanded');
    });

    // Click outside to collapse
    document.addEventListener('mousedown', function (e) {
        if (!isExpanded) return;
        if (shareRoot.contains(e.target)) return;
        isExpanded = false;
        pill.classList.remove('is-expanded');
    });


    /* ════════════════════════════════════════
       SOCIAL ACTIONS
       ════════════════════════════════════════ */

    pill.addEventListener('click', function (e) {
        if (wasDragged) return;
        var btn = e.target.closest('[data-action]');
        if (!btn) return;
        e.stopPropagation();

        var action = btn.getAttribute('data-action');
        var pageUrl = encodeURIComponent(window.location.href);
        var pageTitle = encodeURIComponent(document.title);

        switch (action) {

            case 'twitter':
                window.open(
                    'https://twitter.com/intent/tweet?url=' + pageUrl + '&text=' + pageTitle,
                    '_blank',
                    'width=550,height=420'
                );
                break;

            case 'instagram':
                window.open('https://www.instagram.com/', '_blank');
                break;

            case 'linkedin':
                window.open(
                    'https://www.linkedin.com/sharing/share-offsite/?url=' + pageUrl,
                    '_blank',
                    'width=600,height=500'
                );
                break;

            case 'copy':
                handleCopy(btn);
                break;
        }
    });

    // ── Copy to clipboard with visual feedback ──
    function handleCopy(btn) {
        var iconCopy = btn.querySelector('.icon-copy');
        var iconCheck = btn.querySelector('.icon-check');

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(window.location.href);
        } else {
            var textarea = document.createElement('textarea');
            textarea.value = window.location.href;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }

        btn.classList.add('is-copied');
        if (iconCopy) iconCopy.style.display = 'none';
        if (iconCheck) iconCheck.style.display = '';

        setTimeout(function () {
            btn.classList.remove('is-copied');
            if (iconCopy) iconCopy.style.display = '';
            if (iconCheck) iconCheck.style.display = 'none';
        }, 2000);
    }

    // ── Escape key to close ──
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && isExpanded) {
            isExpanded = false;
            pill.classList.remove('is-expanded');
        }
    });

})();
