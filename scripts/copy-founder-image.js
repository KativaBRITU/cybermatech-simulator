const fs = require('fs');
const path = require('path');
const src = path.join(
    process.env.USERPROFILE || '',
    '.cursor',
    'projects',
    'c-Users-CASH-CONVERTERS-Desktop-cybermatech-simulator',
    'assets',
    'britu-kativa-founder-gold-logo.png'
);
const dest = path.join(__dirname, '..', 'public', 'uploads', 'news', 'britu-kativa-founder-gold.png');
fs.mkdirSync(path.dirname(dest), { recursive: true });
if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log('Copied founder gold image to', dest);
} else {
    console.log('Source not found:', src);
    const fallback = path.join(__dirname, '..', 'public', 'uploads', 'news', 'britu-kativa-founder-polished-preview.png');
    if (fs.existsSync(fallback)) {
        fs.copyFileSync(fallback, dest);
        console.log('Used polished preview as fallback');
    }
}
