/**
 * Applies no-code media from content/site-media.json via API.
 * Drop files in public/media and edit the JSON — no page coding.
 */
(function () {
    'use strict';

    function pageKey() {
        const p = (window.location.pathname || '/').replace(/\/$/, '') || '/';
        if (p === '/') return 'home';
        if (p.startsWith('/login')) return 'login';
        if (p.startsWith('/register')) return 'register';
        if (p.startsWith('/dashboard')) return 'dashboard';
        if (p.startsWith('/training')) return 'training';
        if (p.startsWith('/resources')) return 'resources';
        return 'home';
    }

    function applyBackground(el, imageUrl, overlay) {
        if (!el || !imageUrl) return;
        const probe = new Image();
        probe.onload = () => {
            el.style.backgroundImage = overlay
                ? `linear-gradient(${overlay}, ${overlay}), url('${imageUrl}')`
                : `url('${imageUrl}')`;
            el.style.backgroundSize = 'cover';
            el.style.backgroundPosition = 'center';
            el.classList.add('has-media-bg');
        };
        probe.onerror = () => {
            /* file not uploaded yet — keep CSS fallback */
        };
        probe.src = imageUrl;
    }

    function mountVideo(container, src, poster) {
        if (!container || !src) return;
        const existing = container.querySelector('.media-hero-video');
        if (existing) existing.remove();

        const video = document.createElement('video');
        video.className = 'media-hero-video';
        video.src = src;
        if (poster) video.poster = poster;
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.setAttribute('aria-hidden', 'true');
        video.addEventListener('error', () => video.remove());
        container.prepend(video);
    }

    function applyModuleMedia(mod) {
        if (!mod) return;
        if (mod.background_image) {
            applyBackground(document.body, mod.background_image, 'rgba(238,242,245,0.82)');
        }
        const slot = document.getElementById('moduleMediaSlot');
        if (!slot) return;
        if (mod.video) {
            slot.hidden = false;
            slot.innerHTML = `
                <div class="module-video-wrap">
                    <video controls playsinline preload="metadata" ${mod.video_poster ? `poster="${mod.video_poster}"` : ''}>
                        <source src="${mod.video}">
                    </video>
                    <p class="module-video-caption">Module briefing video — watch before the drill if provided.</p>
                </div>
            `;
        } else {
            slot.hidden = true;
            slot.innerHTML = '';
        }
    }

    async function boot() {
        const key = pageKey();
        const memberPage = ['dashboard', 'training', 'resources'].includes(key);
        const endpoint = memberPage ? '/api/media' : '/api/public/media';

        try {
            const res = await fetch(endpoint, { credentials: 'same-origin' });
            if (!res.ok) return;
            const data = await res.json();
            const pages = data.media?.pages || {};
            const cfg = pages[key] || {};

            if (key === 'home') {
                const hero = document.querySelector('.hero');
                if (cfg.hero_video) {
                    mountVideo(hero, cfg.hero_video, cfg.hero_video_poster || '');
                } else if (cfg.hero_background) {
                    applyBackground(hero, cfg.hero_background, cfg.overlay || 'rgba(11, 36, 48, 0.72)');
                }
            } else if (cfg.background) {
                applyBackground(document.body, cfg.background, cfg.overlay || '');
            }

            if (data.media?.brand?.name) {
                document.querySelectorAll('[data-brand-name]').forEach((el) => {
                    el.textContent = data.media.brand.name;
                });
            }
        } catch (_) { /* keep defaults */ }

        window.CybermatechMedia = { applyModuleMedia, pageKey };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
