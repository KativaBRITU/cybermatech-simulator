(function () {
    const MARK = '/brand/tribams-mark.svg';

    function ensureMark(container) {
        if (!container || container.querySelector('.tribams-brand-mark')) return;
        const img = document.createElement('img');
        img.src = MARK;
        img.alt = '';
        img.className = 'tribams-brand-mark';
        img.width = 32;
        img.height = 32;
        container.insertBefore(img, container.firstChild);
    }

    function upgradeText(el) {
        if (!el || el.querySelector('.tribams-brand-word')) return;
        const text = (el.textContent || '').replace(/🛡️/g, '').trim();
        if (/tribams/i.test(text)) {
            el.innerHTML = '';
            const span = document.createElement('span');
            span.className = 'tribams-brand-word';
            span.textContent = 'TRIBAMS';
            el.appendChild(span);
        }
    }

    document.querySelectorAll('a.logo, .logo:not(.logo-icon)').forEach((el) => {
        if (el.closest('.logo-icon')) return;
        ensureMark(el);
        upgradeText(el);
    });

    document.querySelectorAll('.login-card .logo, .register-card .logo').forEach((el) => {
        const icon = el.querySelector('.logo-icon');
        if (icon) {
            icon.innerHTML = '';
            ensureMark(icon);
        } else {
            ensureMark(el);
        }
        const word = el.querySelector('.logo-text');
        if (word) {
            word.classList.add('tribams-brand-word');
        }
    });
})();
