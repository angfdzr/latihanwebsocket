const mysql = require('mysql');
// konfigurasi koneksi MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'websocket_db'
});

// koneksi ke database
db.connect((err)=>{
    if (err){
        console.error('Error koneksi MySQL:', err);
    } else {
        console.log('Terhubung ke MySQL');
    }
});

module.exports = db;