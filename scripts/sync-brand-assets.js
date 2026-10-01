#!/usr/bin/env node
/**
 * Copy homepage/team images from gitignored uploads/ into committed public/brand/.
 * Run before deploy: node scripts/sync-brand-assets.js
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const pairs = [
    [
        path.join(root, 'public', 'uploads', 'news', 'britu-kativa-founder-gold.png'),
        path.join(root, 'public', 'brand', 'founder-portrait.png')
    ],
    [
        path.join(root, 'public', 'uploads', 'news', 'news_1787830186577.jpg'),
        path.join(root, 'public', 'brand', 'founder-portrait-fallback.jpg')
    ],
    [
        path.join(root, 'public', 'uploads', 'founders', 'britu-kativa.jpg'),
        path.join(root, 'public', 'brand', 'team', 'britu-kativa.jpg')
    ],
    [
        path.join(root, 'public', 'uploads', 'founders', 'selma-iyambo.jpg'),
        path.join(root, 'public', 'brand', 'team', 'selma-iyambo.jpg')
    ],
    [
        path.join(root, 'public', 'uploads', 'founders', 'erastus-nakapipi.jpg'),
        path.join(root, 'public', 'brand', 'team', 'erastus-nakapipi.jpg')
    ]
];

let copied = 0;
let skipped = 0;
for (const [src, dest] of pairs) {
    if (!fs.existsSync(src)) {
        console.log('skip (missing source):', path.relative(root, src));
        skipped += 1;
        continue;
    }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    console.log('copied:', path.relative(root, dest));
    copied += 1;
}
console.log(`done — ${copied} copied, ${skipped} skipped`);
