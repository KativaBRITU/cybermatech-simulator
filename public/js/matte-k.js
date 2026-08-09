/**
 * Matte K — TRIBAMS floating AI guide
 * Hard-disabled on exam / drill / scenario / assessment surfaces.
 * Also locks on other tabs when a scored session is active server-side.
 */
(function () {
    'use strict';

    const EXAM_PATHS = [
        /^\/training(\/|$)/i,
        /^\/skill-assessment/i,
        /^\/module\/\d+\/quiz/i,
        /^\/scenario/i,
        /^\/custom-training/i,
        /^\/review/i,
        /^\/lab(\/|$)/i
    ];

    const path = window.location.pathname || '';
    const onExamPage = EXAM_PATHS.some((re) => re.test(path));
    const params = new URLSearchParams(window.location.search || '');
    const examTab = ['quiz', 'assessment', 'test', 'exam'].includes(
        (params.get('tab') || '').toLowerCase()
    );

    if (onExamPage || examTab) {
        // Hard client block — do not mount Matte K on test surfaces
        console.info('Matte K: disabled on exam / drill surface');
        // Remove any leftover widget (e.g. cached injection)
        const leftover = document.getElementById('matteKRoot');
        if (leftover) leftover.remove();
        return;
    }

    if (document.getElementById('matteKRoot')) return;

    const root = document.createElement('div');
    root.id = 'matteKRoot';
    root.innerHTML = `
        <button type="button" class="mk-fab" id="mkFab" aria-label="Open Matte K AI">
            <span class="mk-fab-mark">MK</span>
            <span class="mk-fab-sub">AI</span>
        </button>
        <div class="mk-panel" id="mkPanel" role="dialog" aria-label="Matte K assistant">
            <div class="mk-header">
                <div class="mk-avatar">MK</div>
                <div class="mk-header-text">
                    <div class="mk-name">Matte K</div>
                    <div class="mk-status" id="mkStatus">● ONLINE · CYBER OPS GUIDE</div>
                </div>
                <button type="button" class="mk-close" id="mkClose" aria-label="Close">×</button>
            </div>
            <div class="mk-messages" id="mkMessages" aria-live="polite"></div>
            <div class="mk-chips" id="mkChips"></div>
            <div class="mk-input-row">
                <input type="text" id="mkInput" maxlength="1600" placeholder="Ask anything about TRIBAMS — typos are OK" autocomplete="off" />
                <button type="button" id="mkSend">Send</button>
            </div>
            <div class="mk-footnote">Offline during scored drills · visible replies only</div>
        </div>
    `;
    document.body.appendChild(root);

    const fab = document.getElementById('mkFab');
    const panel = document.getElementById('mkPanel');
    const closeBtn = document.getElementById('mkClose');
    const messages = document.getElementById('mkMessages');
    const input = document.getElementById('mkInput');
    const sendBtn = document.getElementById('mkSend');
    const statusEl = document.getElementById('mkStatus');
    const chipsEl = document.getElementById('mkChips');

    const history = [];
    let busy = false;
    let locked = false;

    function addBubble(role, text, opts = {}) {
        const div = document.createElement('div');
        div.className = 'mk-bubble ' + role;
        if (role === 'ai') {
            const label = document.createElement('span');
            label.className = 'mk-label';
            label.textContent = opts.label || 'MATTE K';
            div.appendChild(label);
            const body = document.createElement('div');
            body.className = 'mk-body';
            body.textContent = text;
            div.appendChild(body);
        } else {
            div.textContent = text;
        }
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
        return div;
    }

    function setLockedUI(isLocked, reason) {
        locked = !!isLocked;
        if (locked) {
            statusEl.textContent = '● LOCKED · EXAM IN PROGRESS';
            statusEl.classList.add('locked');
            fab.classList.add('mk-locked');
            fab.title = 'Matte K is disabled during scored tests';
            input.disabled = true;
            sendBtn.disabled = true;
            panel.classList.remove('open');
            chipsEl.querySelectorAll('button').forEach((b) => { b.disabled = true; });
            if (reason) {
                // Avoid spamming — only note once per lock transition
                if (!root.dataset.lockNoted) {
                    addBubble('system', reason);
                    root.dataset.lockNoted = '1';
                }
            }
        } else {
            statusEl.textContent = '● ONLINE · CYBER OPS GUIDE';
            statusEl.classList.remove('locked');
            fab.classList.remove('mk-locked');
            fab.title = 'Open Matte K';
            input.disabled = false;
            sendBtn.disabled = false;
            chipsEl.querySelectorAll('button').forEach((b) => { b.disabled = false; });
            delete root.dataset.lockNoted;
        }
    }

    const chips = [
        'Who are you?',
        'How do ranks unlock?',
        'What does Pro cost?',
        'Explain module 11'
    ];
    chips.forEach((label) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'mk-chip';
        b.textContent = label;
        b.addEventListener('click', () => {
            if (locked) {
                addBubble('system', 'Matte K is locked while a scored test is active.');
                return;
            }
            input.value = label;
            send();
        });
        chipsEl.appendChild(b);
    });

    addBubble(
        'ai',
        'I am Matte K — I can answer any TRIBAMS question (modules, ranks, pricing, orgs, labs, certs). I correct typos and reason with the real platform rules. I stay dark during scored drills.'
    );

    fab.addEventListener('click', () => {
        if (locked) {
            addBubble('system', 'Matte K is locked while a scored drill, scenario, or assessment is active. Finish the test first.');
            panel.classList.add('open');
            return;
        }
        panel.classList.toggle('open');
        if (panel.classList.contains('open')) {
            input.focus();
            messages.scrollTop = messages.scrollHeight;
        }
    });
    closeBtn.addEventListener('click', () => panel.classList.remove('open'));

    async function send() {
        const text = (input.value || '').trim();
        if (!text || busy) return;
        if (locked) {
            addBubble('system', 'Matte K is locked while a scored test is active.');
            return;
        }

        addBubble('user', text);
        input.value = '';
        busy = true;
        sendBtn.disabled = true;
        const typing = addBubble('ai', 'processing…', { label: 'MATTE K · LINK' });
        typing.classList.add('typing');

        try {
            const res = await fetch('/api/matte-k/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({ message: text, history })
            });
            const data = await res.json();
            typing.remove();

            if (data.locked) {
                setLockedUI(true, data.reply || 'Exam lockdown — Matte K unavailable.');
            } else if (data.refused) {
                addBubble('ai', data.reply || 'I cannot help with exam answers.', { label: 'MATTE K · INTEGRITY' });
                history.push({ role: 'user', content: text });
                history.push({ role: 'assistant', content: data.reply });
            } else if (data.success && data.reply) {
                const typoCount = Array.isArray(data.typos) ? data.typos.length : 0;
                addBubble('ai', data.reply, {
                    label: typoCount ? `MATTE K · FIXED ${typoCount} TYPO${typoCount > 1 ? 'S' : ''}` : 'MATTE K'
                });
                history.push({ role: 'user', content: text });
                history.push({ role: 'assistant', content: data.reply });
                if (history.length > 12) history.splice(0, history.length - 12);
            } else {
                addBubble('system', data.message || 'Signal lost. Try again in a moment.');
            }
        } catch (err) {
            typing.remove();
            addBubble('system', 'Link failed. Check your connection and retry — your message was not lost from the UI.');
        } finally {
            busy = false;
            if (!locked) sendBtn.disabled = false;
            input.focus();
        }
    }

    sendBtn.addEventListener('click', send);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            send();
        }
    });

    async function probeLock() {
        try {
            const r = await fetch('/api/matte-k/status', { credentials: 'same-origin' });
            const data = await r.json();
            if (data && data.locked) {
                setLockedUI(true, data.message);
            } else if (locked) {
                setLockedUI(false);
            }
        } catch (_) { /* ignore */ }
    }

    probeLock();
    setInterval(probeLock, 8000);
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') probeLock();
    });
    window.addEventListener('focus', probeLock);
})();
