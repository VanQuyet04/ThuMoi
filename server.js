const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS - Cho phép request từ các port khác (Live Server, etc.)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.static('.')); // Serve static files

// Khởi tạo database
const db = new sqlite3.Database('messages.db', (err) => {
    if (err) {
        console.error('Lỗi kết nối database:', err.message);
    } else {
        console.log('Đã kết nối đến SQLite database.');
        // Tạo bảng nếu chưa tồn tại
        db.run(`CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            relation TEXT,
            join_status TEXT NOT NULL,
            message TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Lỗi tạo bảng:', err.message);
            } else {
                console.log('Bảng messages đã sẵn sàng.');
            }
        });
    }
});

// API: Lưu lời chúc mới
app.post('/api/messages', (req, res) => {
    const { name, relation, join, message } = req.body;

    if (!name || !join) {
        return res.json({
            status: 'error',
            msg: 'Vui lòng điền đầy đủ thông tin!'
        });
    }

    const sql = `INSERT INTO messages (name, relation, join_status, message) 
                 VALUES (?, ?, ?, ?)`;
    
    db.run(sql, [name, relation || '', join, message || ''], function(err) {
        if (err) {
            console.error('Lỗi lưu message:', err.message);
            return res.json({
                status: 'error',
                msg: 'Có lỗi xảy ra khi lưu lời chúc. Vui lòng thử lại!'
            });
        }

        res.json({
            status: 'success',
            msg: 'Cảm ơn bạn đã gửi lời chúc! ❤️'
        });
    });
});

// API: Lấy tất cả lời chúc
app.get('/api/messages', (req, res) => {
    const sql = `SELECT * FROM messages ORDER BY created_at DESC`;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Lỗi lấy messages:', err.message);
            return res.json({
                status: 'error',
                msg: 'Có lỗi xảy ra khi lấy dữ liệu!'
            });
        }

        res.json({
            status: 'success',
            data: rows
        });
    });
});

// Route: Trang chủ
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route: Trang hiển thị lời chúc
app.get('/messages', (req, res) => {
    res.sendFile(path.join(__dirname, 'messages.html'));
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

// Đóng database khi tắt server
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Đã đóng kết nối database.');
        process.exit(0);
    });
});

