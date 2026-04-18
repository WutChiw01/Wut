#!/bin/bash
# ===== Disto Survey — Deploy to GitHub Pages =====
# รันไฟล์นี้ใน Terminal ที่โฟลเดอร์ Distro

TOKEN="$1"

if [ -z "$TOKEN" ]; then
  echo "❌ ระบุ Token: ./deploy.sh YOUR_GITHUB_TOKEN"
  exit 1
fi

echo "🚀 กำลัง Deploy Disto Survey v3.8..."

git config user.email "your@email.com"
git config user.name "WutChiw01"
git remote set-url origin https://WutChiw01:${TOKEN}@github.com/WutChiw01/Wut.git

git add app.js sw.js
git commit -m "v3.8 Final: null safety fix, SW cache v4.0" 2>/dev/null || echo "ℹ️  ไม่มีอะไรต้อง commit"
git push origin main

if [ $? -eq 0 ]; then
  echo "✅ Deploy สำเร็จ!"
  echo "🌐 รอ 2 นาที แล้วเปิด: https://WutChiw01.github.io/Wut/"
else
  echo "❌ Push ไม่สำเร็จ — ตรวจสอบ Token อีกครั้ง"
fi
