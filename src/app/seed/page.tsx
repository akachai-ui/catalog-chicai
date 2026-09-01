"use client";

import React, { useState } from "react";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { CheckCircle2, AlertCircle, RefreshCw, ArrowLeft, Database, Sparkles } from "lucide-react";
import Link from "next/link";

const SEED_PRODUCTS = [
  {
    id: "lyj-001-single",
    model: "LYJ-001",
    variant: "Single cylinder",
    sku: "LYJ-001-S",
    category: "oil-filter",
    sales_price: 65000,
    warranty: "รับประกัน 2 ปี On-site Service",
    stock_status: "in_stock",
    lead_time: "พร้อมส่ง 1-3 วันทำการ",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    names: {
      th: "เครื่องกรองน้ำมัน (กระบอกเดี่ยว)",
      en: "Oil filter (single cylinder)",
      zh: "工业滤油机 (单筒型)",
    },
    key_features: {
      th: "รองรับน้ำมันไฮดรอลิก, ตัดเฉือน, EDM, เกียร์ นำกลับมาหมุนเวียนใช้ใหม่เพื่อลดต้นทุน",
      en: "Supports hydraulic, cutting, EDM, and gear oil. Recycle and reuse to reduce operational costs.",
      zh: "支持液压油、切削油、火花机油(EDM)、齿轮油循环过滤再生，大幅降低换油成本。",
    },
    specs: {
      type: "กรองเชิงกายภาพ Pure Physical (ไม่ใช้สารเคมี)",
      flowRate: "15–20 L/H",
      ozoneLevel: "-",
      precision: "1 μm",
      internalCapacity: "-",
      power: "220V 50Hz, 370W",
      viscosity: "3–52 cSt",
      airPressure: "-",
      dimensions: "550 × 410 × 1150 mm",
      weight: "-",
    },
    applicable_fluids: [
      "น้ำมันไฮดรอลิก (Hydraulic Oil ISO VG 32, 46, 68)",
      "น้ำมันหล่อลื่นและน้ำมันเกียร์อุตสาหกรรม (Industrial Lube & Gear Oil)",
      "น้ำมันสปาร์ค EDM / น้ำมันตัดเฉือน (EDM Spark Fluid & Cutting Oil)",
      "น้ำมันเทอร์ไบน์และน้ำมันหมุนเวียน (Turbine & Circulating Oil)",
    ],
    compatible_machinery: [
      "เครื่องฉีดพลาสติก (Plastic Injection Molding Machine)",
      "เครื่องปั๊มขึ้นรูปโลหะ (Hydraulic & Stamping Press)",
      "เครื่องสปาร์ค EDM และเครื่อง Wire Cut",
      "เครื่องจักรอุตสาหกรรมหนักที่มีระบบหล่อลื่นและไฮดรอลิก",
    ],
    images: ["https://lh3.googleusercontent.com/d/1wOIuB5eI7kbsZfi_b2s75V2jBgKCp8_4"],
    featured: true,
    isActive: true,
  },
  {
    id: "lyj-001-double",
    model: "LYJ-001",
    variant: "Double cylinder",
    sku: "LYJ-001-D",
    category: "oil-filter",
    sales_price: 82000,
    warranty: "รับประกัน 2 ปี On-site Service",
    stock_status: "in_stock",
    lead_time: "พร้อมส่ง 1-3 วันทำการ",
    names: {
      th: "เครื่องกรองน้ำมัน (กระบอกคู่)",
      en: "Oil filter (double cylinder)",
      zh: "工业滤油机 (双筒连续型)",
    },
    key_features: {
      th: "รองรับน้ำมันไฮดรอลิก, ตัดเฉือน, EDM, เกียร์ นำกลับมาหมุนเวียนใช้ใหม่เพื่อลดต้นทุน กรองต่อเนื่อง 24 ชม.",
      en: "Supports hydraulic, cutting, EDM, and gear oil. Non-stop continuous 24h filtration.",
      zh: "双筒连续工作，无需停机即可换芯，大幅降低液压油更换成本。",
    },
    specs: {
      type: "กรองเชิงกายภาพ Pure Physical (ไม่ใช้สารเคมี)",
      flowRate: "15–20 L/H",
      ozoneLevel: "-",
      precision: "1 μm",
      internalCapacity: "-",
      power: "220V 50Hz, 370W",
      viscosity: "3–52 cSt",
      airPressure: "-",
      dimensions: "550 × 410 × 1150 mm",
      weight: "-",
    },
    applicable_fluids: [
      "น้ำมันไฮดรอลิก (Hydraulic Oil ISO VG 32, 46, 68)",
      "น้ำมันหล่อลื่นและน้ำมันเกียร์อุตสาหกรรม (Industrial Lube & Gear Oil)",
      "น้ำมันสปาร์ค EDM / น้ำมันตัดเฉือน (EDM Spark Fluid & Cutting Oil)",
      "น้ำมันเทอร์ไบน์และน้ำมันหมุนเวียน (Turbine & Circulating Oil)",
    ],
    compatible_machinery: [
      "เครื่องฉีดพลาสติกที่ทำงานต่อเนื่อง 24 ชม. (Continuous Injection Lines)",
      "เครื่องปั๊มขึ้นรูปโลหะอัตโนมัติ (Automated Stamping Press)",
      "ระบบไฮดรอลิกโรงงานที่ไม่สามารถหยุดเครื่องจักรได้ (Non-Stop Systems)",
      "เครื่อง EDM & Wire Cut สำหรับงานแม่พิมพ์ความแม่นยำสูง",
    ],
    images: ["https://lh3.googleusercontent.com/d/1wOIuB5eI7kbsZfi_b2s75V2jBgKCp8_4"],
    featured: true,
    isActive: true,
  },
  {
    id: "nxc-zsj-100-100l",
    model: "NXC-ZSJ-100",
    variant: "100 L",
    sku: "NXC-ZSJ-100-100L",
    category: "cutting-fluid",
    sales_price: 175000,
    warranty: "รับประกัน 2 ปี On-site Service",
    stock_status: "in_stock",
    lead_time: "พร้อมส่ง 1-3 วันทำการ",
    names: {
      th: "เครื่องกรองและฟื้นฟูน้ำยาหล่อเย็น 100 L",
      en: "Cutting Fluid Filtration & Regeneration (100 L)",
      zh: "切削液净化再生机 100 L",
    },
    key_features: {
      th: "แก้ปัญหาน้ำยาเสื่อมสภาพ/กลิ่นเหม็น ผลิตโอโซน 10,000 mg/H แยกน้ำมันลอยและฆ่าเชื้อแบคทีเรีย",
      en: "Eliminates deterioration & odor with 10,000 mg/H ozone. Separates tramp oil & bacteria.",
      zh: "内置臭氧10000mg/H高效除臭杀菌，油水分离，解决切削液发黑发臭问题。",
    },
    specs: {
      type: "แยกน้ำมันลอย + กรองเศษ + ฆ่าเชื้อด้วยโอโซน",
      flowRate: "100 L/H",
      ozoneLevel: "10000mg/H",
      precision: "10–150 μm (Optional)",
      internalCapacity: "100 L",
      power: "220V 50Hz, <= 200W",
      viscosity: "-",
      airPressure: "0.4–0.5 MPa",
      dimensions: "850 × 420 × 950 mm",
      weight: "-",
    },
    applicable_fluids: [
      "น้ำยาหล่อเย็นชนิดผสมน้ำ (Water-Soluble Coolant)",
      "น้ำยาหล่อเย็นกึ่งสังเคราะห์ (Semi-Synthetic Coolant)",
      "น้ำยาหล่อเย็นสังเคราะห์แท้ (Full Synthetic Coolant)",
      "น้ำมันหล่อเย็นตัดกลึงงานเจียรและงานมิลลิ่ง",
    ],
    compatible_machinery: [
      "เครื่องกัด CNC Machining Center (Vertical / Horizontal VMC)",
      "เครื่องกลึง CNC Lathe / Swiss Type",
      "เครื่องเจียรราบและกลม (Surface & Cylindrical Grinding)",
      "เครื่องตัดและกลึงโลหะทั่วไป",
    ],
    images: ["https://lh3.googleusercontent.com/d/1vv5T0LdGzbvhtc2hfiEIHOxQeLgGV4io"],
    featured: true,
    isActive: true,
  },
  {
    id: "nxc-zsj-100-500l",
    model: "NXC-ZSJ-100",
    variant: "500 L",
    sku: "NXC-ZSJ-100-500L",
    category: "cutting-fluid",
    sales_price: 220000,
    warranty: "รับประกัน 2 ปี On-site Service",
    stock_status: "in_stock",
    lead_time: "พร้อมส่ง 1-3 วันทำการ",
    names: {
      th: "เครื่องกรองและฟื้นฟูน้ำยาหล่อเย็น 500 L",
      en: "Cutting Fluid Filtration & Regeneration (500 L)",
      zh: "切削液净化再生机 500 L",
    },
    key_features: {
      th: "ความจุใหญ่ 500 L สำหรับระบบหล่อเย็นรวมและโรงงานขนาดใหญ่ ผลิตโอโซน 10,000 mg/H",
      en: "Large 500 L capacity for centralized coolant systems. 10,000 mg/H ozone disinfection.",
      zh: "500L大容量处理系统，适用于大型集中供液车间，快速再生循环使用。",
    },
    specs: {
      type: "แยกน้ำมันลอย + กรองเศษ + ฆ่าเชื้อด้วยโอโซน",
      flowRate: "100 L/H",
      ozoneLevel: "10000mg/H",
      precision: "10–150 μm (Optional)",
      internalCapacity: "500 L",
      power: "220V 50Hz, <= 200W",
      viscosity: "-",
      airPressure: "0.4–0.5 MPa",
      dimensions: "850 × 420 × 950 mm",
      weight: "-",
    },
    applicable_fluids: [
      "น้ำยาหล่อเย็นชนิดผสมน้ำ (Water-Soluble Coolant)",
      "น้ำยาหล่อเย็นกึ่งสังเคราะห์ (Semi-Synthetic Coolant)",
      "น้ำยาหล่อเย็นสังเคราะห์แท้ (Full Synthetic Coolant)",
      "บ่อพักและระบบน้ำยาหล่อเย็นรวม (Centralized Coolant Tanks)",
    ],
    compatible_machinery: [
      "ระบบรวมศูนย์น้ำยาหล่อเย็น (Centralized Coolant System) หลายเครื่องจักร",
      "กลุ่มเครื่อง CNC Machining Lines หลายสิบเครื่อง",
      "โรงงานผลิตชิ้นส่วนยานยนต์และงานขึ้นรูปโลหะขนาดใหญ่",
    ],
    images: ["https://lh3.googleusercontent.com/d/1vv5T0LdGzbvhtc2hfiEIHOxQeLgGV4io"],
    featured: true,
    isActive: true,
  },
  {
    id: "nxc-qzj-116a",
    model: "NXC-QZJ-116A",
    variant: "Standard",
    sku: "NXC-QZJ-116A",
    category: "deslagging",
    sales_price: 82000,
    warranty: "รับประกัน 2 ปี On-site Service",
    stock_status: "in_stock",
    lead_time: "พร้อมส่ง 1-3 วันทำการ",
    names: {
      th: "เครื่องกำจัดตะกรันและเศษโลหะ",
      en: "Deslagging Machine",
      zh: "强力除渣脱水排渣机",
    },
    key_features: {
      th: "ความจุ 11.5L สั่งงานง่าย One-Click Start ถ่ายของเหลวรวดเร็ว แยกเศษเหล็กและสิ่งปนเปื้อน",
      en: "11.5L capacity, easy One-Click Start, fast liquid separation for metal sludge & chips.",
      zh: "容积11.5L，气动一键启动，抽吸彻底，迅速清除切削液箱底部沉淀金属废渣。",
    },
    specs: {
      type: "แยกเศษเหล็กและสิ่งปนเปื้อนออกจากของเหลว",
      flowRate: "116 L/min",
      ozoneLevel: "-",
      precision: "270 μm",
      internalCapacity: "11.5L",
      power: "Pneumatic (ใช้ระบบลม)",
      viscosity: "-",
      airPressure: "0.4–0.6 bar (สูบก๊าซ 670 L/min)",
      dimensions: "1000 × 500 × 1000 mm",
      weight: "70 kg",
    },
    applicable_fluids: [
      "น้ำยาหล่อเย็นที่มีเศษผงเหล็ก, อลูมิเนียม, สแตนเลส (Chips & Sludge)",
      "น้ำมันตัดกลึงที่มีเศษตะกอนก้นถัง (Cutting Oil with Slag)",
      "ของเหลวอุตสาหกรรมที่มีกากตะกอนแขวนลอย",
    ],
    compatible_machinery: [
      "เครื่องกัด CNC Machining Center ทุกรุ่น (ล้างก้นถังใน 5 นาที)",
      "เครื่องกลึง CNC Lathe",
      "เครื่องเลื่อยสายพานอุตสาหกรรม (Band Saw)",
      "ถังดักตะกอนและบ่อพักน้ำยาในโรงงาน",
    ],
    images: ["https://lh3.googleusercontent.com/d/13rvqbgvcu68ksdGQN3WHA2SmaKGG0tUf"],
    featured: true,
    isActive: true,
  },
];

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSeed = async () => {
    if (!isFirebaseConfigured || !db) {
      setError("ยังไม่ได้ตั้งค่า Firebase หรือคีย์ใน .env.local ไม่ถูกต้อง");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setLogs([]);

      const updatedLogs: string[] = [];

      for (const item of SEED_PRODUCTS) {
        const docRef = doc(db, "products", item.id);
        await setDoc(docRef, {
          ...item,
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        });
        const msg = `✓ อัปโหลดสำเร็จ: [${item.sku}] ${item.names.th} (฿${item.sales_price.toLocaleString()})`;
        updatedLogs.push(msg);
        setLogs([...updatedLogs]);
      }

      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ Firebase Firestore");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-slate-200">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-800 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับหน้าแรก</span>
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#219990]/15 text-[#219990] flex items-center justify-center">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              นำเข้าข้อมูลสินค้าจริงเข้าสู่ Firebase Firestore
            </h1>
            <p className="text-xs text-gray-500">
              สำหรับโปรเจกต์ catalog-chicai (บริษัท ฉี ไฉ่ อิเล็คทริค จำกัด)
            </p>
          </div>
        </div>

        <div className="my-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2 text-gray-700">
          <div className="font-semibold text-gray-900">รายการสินค้าที่จะนำเข้า (5 รายการ):</div>
          <ul className="list-disc list-inside space-y-1 text-gray-600 pl-1">
            <li><strong>LYJ-001 (Single):</strong> เครื่องกรองน้ำมัน (กระบอกเดี่ยว) - ฿65,000</li>
            <li><strong>LYJ-001 (Double):</strong> เครื่องกรองน้ำมัน (กระบอกคู่) - ฿82,000</li>
            <li><strong>NXC-ZSJ-100 (100L):</strong> เครื่องกรองและฟื้นฟูน้ำยาหล่อเย็น 100 L - ฿175,000</li>
            <li><strong>NXC-ZSJ-100 (500L):</strong> เครื่องกรองและฟื้นฟูน้ำยาหล่อเย็น 500 L - ฿220,000</li>
            <li><strong>NXC-QZJ-116A:</strong> เครื่องกำจัดตะกรันและเศษโลหะ - ฿82,000</li>
          </ul>
        </div>

        {error && (
          <div className="mb-5 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">เกิดข้อผิดพลาด: </span>
              {error}
              <div className="mt-1 text-[11px] text-rose-600">
                (หากเกิดจาก Permission โปรดตรวจสอบว่าได้เปิด Firestore ในโหมด <strong>Test mode</strong> ที่ Firebase Console แล้วหรือยัง)
              </div>
            </div>
          </div>
        )}

        {logs.length > 0 && (
          <div className="mb-5 p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-1.5 font-mono text-xs text-emerald-800">
            {logs.map((log, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{log}</span>
              </div>
            ))}
          </div>
        )}

        {success ? (
          <div className="p-6 bg-emerald-500 text-white rounded-2xl text-center space-y-3 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-12 h-12 mx-auto" />
            <h3 className="text-lg font-bold">นำเข้าสินค้าทั้ง 5 รายการสู่ Firebase สำเร็จแล้ว! 🎉</h3>
            <p className="text-xs text-emerald-100">
              ข้อมูลทั้งหมดพร้อมรูปภาพและสเปกจริงถูกบันทึกลงใน Firestore Collection &quot;products&quot; เรียบร้อย
            </p>
            <Link
              href="/"
              className="inline-block mt-2 px-6 py-2.5 bg-white text-emerald-800 text-xs font-bold rounded-xl shadow transition hover:bg-emerald-50"
            >
              กลับไปดูหน้าแรก
            </Link>
          </div>
        ) : (
          <button
            onClick={handleSeed}
            disabled={loading}
            className="w-full py-4 px-6 bg-[#219990] hover:bg-[#1b7e76] disabled:opacity-50 text-white text-sm font-bold rounded-2xl shadow-xl shadow-[#219990]/25 transition cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01]"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>กำลังนำเข้าข้อมูลเข้าสู่ Firebase Firestore...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>🚀 กดเพื่อนำเข้าสินค้า 5 รายการเข้าสู่ Cloud Firestore ทันที</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
