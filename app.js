const WebSocket = require('ws');
const db = require('./db'); // Import koneksi MySQL

// Koneksi ke WebSocket Server
const ws = new WebSocket('ws://localhost:3000');

ws.on('open', () => {
    console.log('Terhubung ke WebSocket server');

    // Kirim pesan dalam format JSON
    ws.send(JSON.stringify({ text: 'Halo Server! Ini dari Client' }));
});

ws.on('message', (data) => {
    try {
        const jsonData = JSON.parse(data);
        console.log('Data diterima dari server:', jsonData); // Log data

        if (jsonData.type === 'database') {
            jsonData.data.forEach(item => {
                console.log('Data untuk disimpan ke database:', item); // Debug data per item
                const query = 'INSERT INTO logs (message, timestamp) VALUES (?, ?)';
                const values = [item.message, item.timestamp];

                db.query(query, values, (err, result) => {
                    if (err) {
                        console.error('Gagal menyimpan data ke MySQL:', err);
                    } else {
                        console.log('Data berhasil disimpan ke database, ID:', result.insertId);
                    }
                });
            });
        } else if (jsonData.type === 'realtime') {
            console.log('Data real-time diterima dari server:', jsonData);
        } else if (jsonData.type === 'notification') {
            console.log('Notifikasi diterima:', jsonData.notification);
        }
    } catch (err) {
        console.error('Error parsing message:', err);
    }
});


// Handle error
ws.on('error', (err) => {
    console.error('Error WebSocket:', err);
});

ws.on('close', () => {
    console.log('WebSocket connection closed');
});
