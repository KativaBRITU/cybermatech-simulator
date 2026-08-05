/**
 * Guest vs member navigation.
 * Member-only targets stay hidden until /api/user-info confirms a session.
 */
(function () {
    'use strict';

    const MEMBER_SELECTORS = '[data-auth="member"]';
    const GUEST_SELECTORS = '[data-auth="guest"]';

    function setVisibility(isMember) {
        document.querySelectorAll(MEMBER_SELECTORS).forEach((el) => {
            el.hidden = !isMember;
            el.classList.toggle('is-hidden', !isMember);
        });
        document.querySelectorAll(GUEST_SELECTORS).forEach((el) => {
            el.hidden = isMember;
            el.classList.toggle('is-hidden', isMember);
        });
        document.documentElement.dataset.auth = isMember ? 'member' : 'guest';
    }

    // Hide member CTAs immediately to avoid flash for guests
    setVisibility(false);

    fetch('/api/user-info', { credentials: 'same-origin' })
        .then((r) => r.json())
        .then((data) => {
            const isMember = !!(data && data.success && (data.username || data.user));
            setVisibility(isMember);
            if (isMember && data.username) {
                document.querySelectorAll('[data-auth-username]').forEach((el) => {
                    el.textContent = data.username;
                });
            }
        })
        .catch(() => setVisibility(false));
})();
