# Chicai Catalog (Next.js + TypeScript + Firebase)

โปรเจกต์เว็บแคตตาล็อกสินค้า (Product Catalog) พัฒนาด้วย Next.js (App Router), TypeScript, Tailwind CSS และเชื่อมต่อฐานข้อมูล Firebase Firestore

## ✨ จุดเด่นและฟังก์ชันการใช้งาน
- **โครงสร้าง Next.js 16 + TypeScript**: ปลอดภัยด้วย Type-checking และโครงสร้างโค้ดแบบโมเดิร์น
- **รองรับ Firebase Firestore**:
  - รองรับการดึงข้อมูลแคตตาล็อกแบบ Realtime/Firestore
  - มีระบบเพิ่มสินค้าใหม่ (Add Product) บันทึกลง Firestore
  - มีปุ่มซิงค์ข้อมูลสินค้าตัวอย่างเข้า Firestore อัตโนมัติในคลิกเดียว
  - มีโหมด **Demo Mode** ที่ทำงานได้ทันทีแม้ยังไม่ได้ใส่ Firebase config
- **UI ทันสมัยด้วย Tailwind CSS**:
  - Responsive รองรับทั้งคอมพิวเตอร์และมือถือ
  - ตัวกรองตามหมวดหมู่ (Category Filter)
  - ระบบค้นหาสินค้า (Search Bar) แบบ Real-time
  - ตัวจัดเรียงสินค้า (Sort by Featured, Price Low-to-High, High-to-Low)
  - ป๊อปอัปดูรายละเอียดสินค้าพร้อมรูปและสต็อก (Product Detail Modal)

---

## 🚀 วิธีเปิดใช้งานและรันโปรเจกต์

### 1. วิธีเริ่มรัน (Development Mode)
```bash
npm run dev
```
เปิดเบราว์เซอร์ไปที่: [http://localhost:3000](http://localhost:3000)

---

## 🔑 วิธีตั้งค่า Firebase (เชื่อมต่อฐานข้อมูลจริง)

1. เข้าไปที่ [Firebase Console](https://console.firebase.google.com/)
2. สร้างโปรเจกต์ใหม่ หรือเลือกโปรเจกต์ที่มีอยู่
3. ไปที่เมนู **Firestore Database** แล้วกด **Create database** (เลือกโหมด Test mode เพื่อเริ่มต้นได้สะดวก)
4. ไปที่ **Project settings** (รูปเฟืองซ้ายบน) > แท็บ **General** > เลื่อนลงมาที่หัวข้อ **Your apps** แล้วกดเลือกไอคอน **Web (</>)**
5. คัดลอกค่าคอนฟิกมาใส่ลงในไฟล์ `.env.local` ในโปรเจกต์:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

6. เมื่อกรอกเสร็จแล้ว รัน `npm run dev` ใหม่ หน้าเว็บจะเปลี่ยนสถานะเป็น **Firebase Connected** อัตโนมัติ!

---

## 📁 โครงสร้างโปรเจกต์
```
catalog-chicai/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # โครงสร้าง Layout และ Meta tags
│   │   ├── page.tsx           # หน้าแรกของ Catalog
│   │   └── globals.css        # สไตล์ Tailwind CSS
│   ├── components/
│   │   ├── Navbar.tsx         # ส่วนหัว แถบค้นหา และปุ่มเพิ่มสินค้า
│   │   ├── ProductCard.tsx    # การ์ดแสดงสินค้าแต่ละชิ้น
│   │   ├── ProductDetailModal.tsx # ป๊อปอัปแสดงข้อมูลสเปกสินค้า
│   │   └── AddProductModal.tsx    # ฟอร์มเพิ่มสินค้าใหม่ลง Firestore
│   ├── lib/
│   │   └── firebase.ts        # การเชื่อมต่อ Firebase App และ Firestore
│   ├── services/
│   │   └── catalogService.ts  # ฟังก์ชัน CRUD ดึง/เพิ่ม/ลบสินค้าใน Firestore
│   └── types/
│       └── product.ts         # Type definitions (Product, Category)
├── .env.local                 # ไฟล์เก็บคีย์ Firebase สำหรับเครื่องคุณ
├── .env.local.example         # ตัวอย่างเทมเพลต Environment Variables
├── package.json
└── tsconfig.json
```
