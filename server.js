const WebSocket = require('ws');
const db = require('./db'); // Import koneksi MySQL
const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', (ws) => {
    console.log('Client connected');

    // Kirim data dari MySQL ke klien (batasi 10 entri)
    db.query('SELECT * FROM logs LIMIT 10', (err, results) => {
        if (err) {
            console.error('Error membaca data dari database:', err);
            return;
        }
        ws.send(JSON.stringify({ type: 'database', data: results }));
    });

    // Interval untuk kirim pesan real-time ke klien
    const interval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'realtime',
                message: 'Data dari server',
                timestamp: new Date()
            }));
        }
    }, 3000);

    // Terima pesan dari klien
    ws.on('message', (message) => {
        try {
            const msg = JSON.parse(message);

            // Notifikasi jika terdapat keyword "urgent"
            if (msg.text && msg.text.includes('urgent')) {
                ws.send(JSON.stringify({ type: 'notification', notification: 'Keyword detected: urgent' }));
            }

            console.log(`Pesan dari client (JSON):`, msg);
        } catch (err) {
            console.error('Pesan dari client (non-JSON):', message);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        clearInterval(interval); // Hentikan interval saat klien terputus
    });
});

console.log('WebSocket server berjalan di ws://localhost:3000');
