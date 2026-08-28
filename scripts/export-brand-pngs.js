/**
 * Export TRIBAMS brand SVGs to PNG for social, print, and external use.
 * Run: node scripts/export-brand-pngs.js
 * Requires: npm install sharp (one-time)
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BRAND = path.join(ROOT, 'public', 'brand');
const OUT = path.join(BRAND, 'export');

async function main() {
    let sharp;
    try {
        sharp = require('sharp');
    } catch (_) {
        console.error('Install sharp first: npm install sharp');
        process.exit(1);
    }

    fs.mkdirSync(OUT, { recursive: true });

    const markSvg = fs.readFileSync(path.join(BRAND, 'tribams-mark.svg'));
    const logoSvg = fs.readFileSync(path.join(BRAND, 'tribams-logo.svg'));

    const exports = [
        { name: 'tribams-mark-512.png', input: markSvg, w: 512, h: 512 },
        { name: 'tribams-mark-1024.png', input: markSvg, w: 1024, h: 1024 },
        { name: 'tribams-logo-banner-1200.png', input: logoSvg, w: 1200, h: 343 },
        { name: 'tribams-logo-banner-2400.png', input: logoSvg, w: 2400, h: 686 }
    ];

    for (const job of exports) {
        const outPath = path.join(OUT, job.name);
        await sharp(job.input, { density: 300 })
            .resize(job.w, job.h, { fit: 'contain', background: { r: 11, g: 18, b: 32, alpha: 0 } })
            .png()
            .toFile(outPath);
        console.log('Wrote', outPath);
    }

    fs.copyFileSync(path.join(BRAND, 'tribams-mark.svg'), path.join(OUT, 'tribams-mark.svg'));
    fs.copyFileSync(path.join(BRAND, 'tribams-logo.svg'), path.join(OUT, 'tribams-logo.svg'));
    fs.writeFileSync(
        path.join(OUT, 'README.txt'),
        [
            'TRIBAMS brand export pack',
            '',
            'PNG files for social media, print, and documents.',
            'SVG files for designers (infinite scale).',
            '',
            'tribams-mark-512.png   — profile / app icon',
            'tribams-mark-1024.png  — high-res icon',
            'tribams-logo-banner-*  — headers, LinkedIn, letterhead',
            '',
            'Gold circuit T = wisdom + cyber precision.',
            '© TRIBAMS · tribams.com'
        ].join('\n'),
        'utf8'
    );
    console.log('Done. Folder:', OUT);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
