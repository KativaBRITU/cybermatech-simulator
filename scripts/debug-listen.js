/**
 * Minimal listener — proves Windows can open a local port.
 * Run: node scripts/debug-listen.js
 * Then open http://127.0.0.1:3080 in Chrome.
 */
const http = require('http');
const PORT = Number(process.env.PORT || 3080);

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`OK — debug server on 127.0.0.1:${PORT}\nPath: ${req.url}\n`);
});

server.on('error', (err) => {
    console.error('Listen failed:', err.message);
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Kill the other process or set PORT=3090`);
    }
    process.exit(1);
});

server.listen(PORT, '127.0.0.1', () => {
    console.log(`Debug server listening on http://127.0.0.1:${PORT}`);
    console.log('Open that URL in Chrome. If THIS fails too, the problem is Windows/firewall/antivirus — not TRIBAMS.');
});
