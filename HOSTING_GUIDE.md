# Hosting Guide: Deploying to Hostinger / PHP Hosting

## สิ่งที่ต้องมี
- `index.html`
- `style.css`
- `app.js`
- `modules/*.js`
- `send_telegram.php`
- `manifest.json`, `sw.js`
- `truss_blueprints.png`

## 1) Upload ไฟล์
อัปโหลดทั้งโฟลเดอร์โปรเจกต์ไปที่ `public_html` หรือ subfolder ที่ต้องการ

## 2) เปิด HTTPS
Web Bluetooth ใช้งานได้เฉพาะบน HTTPS หรือ localhost
- ไปที่ Hostinger hPanel
- เปิด SSL / Let's Encrypt
- เปิด Force HTTPS

## 3) ตั้งค่า Telegram Bot Token
ไฟล์ `send_telegram.php` ใช้ค่า bot token จาก:
- Environment variable `DISTO_TELEGRAM_BOT_TOKEN`  (แนะนำ)
- หรือแก้ในไฟล์โดยแทน `PUT_YOUR_BOT_TOKEN_HERE`

## 4) สิทธิ์โฟลเดอร์ projects
ระบบจะสร้างโฟลเดอร์ `projects` สำหรับเก็บ state ของ bot mode
ตรวจให้ PHP เขียนไฟล์ได้

## 5) ตั้งค่าในหน้าเว็บ
- กรอก `Target Chat ID`
- เปิด `Use PHP Proxy`
- ถ้าไม่ได้ใช้ proxy ให้กรอก Bot Token ที่หน้าเว็บแทน

## 6) ถ้าจะใช้ Telegram Webhook
ตั้ง webhook ของ Telegram bot ให้ชี้มาที่
- `https://your-domain.com/send_telegram.php`

## 7) การใช้งานบน iPhone
Safari ไม่รองรับ Web Bluetooth แบบเดียวกับ Android/Chrome
แนะนำ:
- ใช้ Keyboard Mode (HID)
- หรือใช้ Bluefy แล้ว Add to Home Screen

## 8) หลังอัปเดตเวอร์ชัน
เพราะมี service worker/PWA:
- hard refresh 1 ครั้ง
- หรือ clear site data/cache ก่อนใช้งาน
