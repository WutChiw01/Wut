# Disto Survey

เว็บแอปสำรวจหลังคาเพื่อประเมินการติดตั้งโซลาร์เซลล์ ใช้งานแบบ static บน GitHub Pages ได้ทันทีที่:

- https://WutChiw01.github.io/Wut/

## สิ่งที่ใช้งานได้บน GitHub Pages
- วัดและบันทึกจุด A/B/C/D แบบ manual
- คำนวณมิติหลังคา, slope, พื้นที่
- คำนวณ layout แผงและ BOQ
- ประเมินโครงสร้างเบื้องต้น
- สร้าง PDF รายงานในเครื่องผู้ใช้
- PWA / install to home screen
- Share / copy summary

## ข้อจำกัดบน GitHub Pages
GitHub Pages เป็น static hosting จึง **ไม่รองรับ PHP**. ฟีเจอร์ด้านล่างจะไม่ทำงานบน `github.io` โดยตรง:
- `send_telegram.php`
- PHP Proxy สำหรับ Telegram
- Telegram webhook / bot mode state server

ถ้าต้องใช้ฟีเจอร์ Telegram proxy หรือ bot mode ให้ deploy ชุดเดียวกันไปยัง hosting ที่รองรับ PHP เช่น Hostinger ด้วย

## วิธีใช้งานเร็ว
1. กรอกข้อมูลโครงการ
2. วัดจุด A, B, C, D หรือกรอกค่าด้วยมือ
3. กดคำนวณ
4. ตรวจ layout และ report
5. กดสร้าง PDF หรือ share summary

## หมายเหตุ
- Android/Chrome รองรับ Web Bluetooth ได้ดีกว่า
- iPhone/Safari ควรใช้ Keyboard Mode (HID)
- หากเว็บไม่อัปเดตหลัง deploy ให้ hard refresh หรือล้าง cache service worker 1 ครั้ง


## Production mode on main
This `main` branch is now the **no-bot production** variant for GitHub Pages.
The previous bot/PHP-capable line is preserved in branch `bot-experimental-no-preserve-20260418`.
