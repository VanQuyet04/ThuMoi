# Thiệp Mời Sinh Nhật

Dự án thiệp mời sinh nhật với hệ thống lưu và hiển thị lời chúc sử dụng SQLite.

## Cài đặt

1. Cài đặt Node.js (nếu chưa có)
2. Cài đặt dependencies:
```bash
npm install
```

## Chạy ứng dụng

```bash
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

## Cấu trúc

- `index.html` - Trang thiệp mời chính
- `messages.html` - Trang hiển thị tất cả lời chúc
- `server.js` - Backend server với API
- `style.css` - File CSS
- `messages.db` - Database SQLite (tự động tạo khi chạy lần đầu)

## API Endpoints

- `POST /api/messages` - Lưu lời chúc mới
- `GET /api/messages` - Lấy tất cả lời chúc

## Routes

- `/` - Trang thiệp mời
- `/messages` - Trang hiển thị lời chúc

