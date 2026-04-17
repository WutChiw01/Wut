Disto Survey App - เวอร์ชันแก้ไข

สิ่งที่แก้ไขหลัก
1) แก้ app.js ที่มีโค้ดซ้ำท้ายไฟล์ ทำให้ init ซ้ำและพฤติกรรมเพี้ยน
2) เพิ่มระบบ persist/load state ด้วย localStorage ให้ข้อมูลไม่หายง่ายเมื่อรีเฟรช
3) แก้ bug การบันทึกจุดวัดที่เขียนทับค่า point ผิดตัวแปร
4) แก้ modules/telegram.js ให้ทำงานตรงกับ send_telegram.php จริง
5) เขียน send_telegram.php ใหม่ให้รองรับครบ 4 โหมด:
   - ส่งข้อความทดสอบจากหน้าเว็บ
   - ส่ง PDF เข้า Telegram
   - รับ state สำหรับ bot mode
   - รับค่าที่วัดกลับจากหน้าเว็บเข้าสู่ flow Telegram
6) ตัดการ hardcode bot token ออกจากไฟล์ PHP

วิธีใช้งานแบบเร็ว
A. ใช้งานหน้าเว็บอย่างเดียว
- เปิด index.html ผ่านโดเมน/โฮสต์จริง
- กรอกข้อมูลโครงการ
- วัดจุด A/B/C/D
- กดคำนวณ
- ไปหน้า layout / report เพื่อดูผลและสร้าง PDF

B. ใช้งาน Telegram Proxy
1. เปิดไฟล์ send_telegram.php
2. ตั้งค่า BOT TOKEN โดยเลือกวิธีใดวิธีหนึ่ง
   วิธีแนะนำ: ตั้ง environment variable ชื่อ DISTO_TELEGRAM_BOT_TOKEN บนเซิร์ฟเวอร์
   วิธีง่าย: แก้บรรทัด
      $BOT_TOKEN = getenv('DISTO_TELEGRAM_BOT_TOKEN') ?: 'PUT_YOUR_BOT_TOKEN_HERE';
   แล้วแทน PUT_YOUR_BOT_TOKEN_HERE ด้วย token จริง
3. สร้างโฟลเดอร์ projects ให้เขียนได้
4. เปิดหน้าเว็บ กรอก Chat ID
5. เปิดสวิตช์ Use PHP Proxy = ON
6. กดทดสอบส่งข้อความ

C. ใช้งาน Bluetooth
- Android/Chrome: ใช้ App Mode (BLE) ได้
- iPhone/Safari: ใช้ Keyboard Mode (HID) หรือ Bluefy ตามข้อจำกัดของ Web Bluetooth

คำแนะนำการ deploy
1. อัปโหลดทั้งโฟลเดอร์ขึ้น public_html หรือ subfolder
2. ต้องเปิด HTTPS ถ้าจะใช้ Web Bluetooth
3. ถ้าใช้งานบน Hostinger ให้ตรวจว่า PHP ทำงานได้
4. ถ้าใช้ Telegram webhook ให้ตั้ง webhook ของ bot มาที่ send_telegram.php

ข้อจำกัดที่ยังควรทดสอบหน้างานจริง
- BLE ของ Leica แต่ละรุ่นอาจมี format packet ต่างกัน ต้องทดสอบกับเครื่องจริง
- Bot mode flow ต้องทดสอบร่วมกับ webhook จริงของ Telegram
- PWA/service worker ควร clear cache 1 ครั้งหลังอัปเดตเวอร์ชัน

แนะนำหลังอัปโหลดไฟล์ใหม่
- ลบ cache browser / hard refresh
- ถ้าเคยเปิดเวอร์ชันเก่าไว้ ให้ปิดแล้วเปิดใหม่
