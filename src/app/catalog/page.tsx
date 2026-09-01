"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  Printer,
  ArrowLeft,
  Download,
  ShieldCheck,
  Droplets,
  Target,
  Wrench,
  Gauge,
  Phone,
  MessageCircle,
  Building2,
  Sparkles,
  Layers,
  FileSpreadsheet,
  CheckCircle2,
} from "lucide-react";
import { toJpeg } from "html-to-image";
import { translations, Language, translateSpecValue } from "@/lib/i18n";

// Fallback all 5 products
const DEFAULT_PRODUCTS = [
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
      "น้ำมันหล่อลื่นและเกียร์อุตสาหกรรม (Lube & Gear Oil)",
      "น้ำมันสปาร์ค EDM / น้ำมันตัดเฉือน",
    ],
    compatible_machinery: [
      "เครื่องฉีดพลาสติก (Plastic Injection Molding)",
      "เครื่องปั๊มขึ้นรูปโลหะ (Hydraulic Press)",
      "เครื่องสปาร์ค EDM & Wire Cut",
    ],
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
      zh: "工业滤油机 (双筒型)",
    },
    key_features: {
      th: "รองรับน้ำมันไฮดรอลิก, ตัดเฉือน, EDM, เกียร์ กรองต่อเนื่อง 24 ชม. สลับกระบอกกรองโดยไม่ต้องหยุดเครื่อง",
      en: "Supports hydraulic, cutting, EDM, and gear oil. 24-hour continuous filtration without downtime.",
      zh: "支持液压油、切削油循环再生，双筒连续过滤工作，无需停机换芯。",
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
      "น้ำมันหล่อลื่นและเกียร์อุตสาหกรรม (Lube & Gear Oil)",
      "น้ำมันสปาร์ค EDM / น้ำมันตัดเฉือน",
    ],
    compatible_machinery: [
      "เครื่องฉีดพลาสติกต่อเนื่อง 24 ชม.",
      "เครื่องปั๊มโลหะอัตโนมัติ (Automated Stamping Press)",
      "ระบบไฮดรอลิกที่ไม่สามารถหยุดเครื่องได้",
    ],
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
      en: "Solves deterioration/odor issues, produces ozone 10,000 mg/H, removes tramp oil and kills bacteria.",
      zh: "内置臭氧 10,000 mg/H 深度杀菌除臭，油水分离，彻底解决切削液发黑变质问题。",
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
      "น้ำยาหล่อเย็นสังเคราะห์แท้ (Full Synthetic)",
    ],
    compatible_machinery: [
      "เครื่องกัด CNC Machining Center (VMC / HMC)",
      "เครื่องกลึง CNC Lathe / Swiss Type",
      "เครื่องเจียรราบและกลม (Grinding Machine)",
    ],
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
      th: "ความจุใหญ่ 500 L สำหรับระบบหล่อเย็นรวมและโรงงานขนาดใหญ่ ผลิตโอโซน 10,000 mg/H บำบัดน้ำยาปริมาณมาก",
      en: "Large 500 L capacity for centralized coolant systems. 10,000 mg/H ozone disinfection for high-volume plants.",
      zh: "500L大容量处理系统，适用于集中供液车间，快速再生循环复用。",
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
      "บ่อพักและระบบน้ำยาหล่อเย็นรวม (Centralized Tanks)",
    ],
    compatible_machinery: [
      "ระบบรวมศูนย์น้ำยาหล่อเย็น (Centralized Coolant System)",
      "กลุ่มเครื่อง CNC Machining Lines หลายสิบเครื่อง",
      "โรงงานผลิตชิ้นส่วนยานยนต์ขนาดใหญ่",
    ],
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
      th: "ความจุ 11.5L สั่งงานง่าย One-Click Start ถ่ายของเหลวรวดเร็ว แยกเศษเหล็กและสิ่งปนเปื้อนออกจากก้นถัง",
      en: "11.5L capacity, easy One-Click Start, fast fluid discharge for metal sludge & chips.",
      zh: "容积 11.5L，气动一键启动，快速抽吸清理水箱底部金属废渣。",
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
      "น้ำยาหล่อเย็นที่มีเศษผงเหล็ก, อลูมิเนียม, สแตนเลส",
      "น้ำมันตัดกลึงที่มีเศษตะกอนก้นถัง",
      "ของเหลวอุตสาหกรรมที่มีกากตะกอนแขวนลอย",
    ],
    compatible_machinery: [
      "เครื่องกัด CNC Machining Center ทุกรุ่น (ล้างถัง 5 นาที)",
      "เครื่องกลึง CNC Lathe",
      "เครื่องเลื่อยสายพานอุตสาหกรรม (Band Saw)",
    ],
  },
];

function translateVariant(variant: string | undefined, lang: Language): string {
  if (!variant) return "";
  if (lang === "zh") {
    if (variant === "Single cylinder") return "单筒型";
    if (variant === "Double cylinder") return "双筒型";
    if (variant === "Standard") return "标准版";
  } else if (lang === "th") {
    if (variant === "Single cylinder") return "กระบอกเดี่ยว";
    if (variant === "Double cylinder") return "กระบอกคู่";
    if (variant === "Standard") return "รุ่นมาตรฐาน";
  }
  return variant;
}

export default function MasterCatalogPage() {
  const [products, setProducts] = useState<any[]>(DEFAULT_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Language>("th");
  const [downloadingPage, setDownloadingPage] = useState<number | null>(null);

  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);
  const page3Ref = useRef<HTMLDivElement>(null);
  const page4Ref = useRef<HTMLDivElement>(null);

  const t = translations[lang];

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        if (isFirebaseConfigured && db) {
          const snap = await getDocs(collection(db, "products"));
          if (!snap.empty) {
            const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            setProducts(list);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error(err);
      }
      setProducts(DEFAULT_PRODUCTS);
      setLoading(false);
    };

    fetchAllProducts();
  }, []);

  const getProductImage = (p: any) => {
    const model = (p.model || "").toUpperCase();
    if (model.includes("LYJ-001") || model.includes("LYJ")) return "/products/lyj-001.jpg";
    if (model.includes("NXC-ZSJ-100") || model.includes("ZSJ")) return "/products/nxc-zsj-100.jpg";
    if (model.includes("NXC-QZJ-116A") || model.includes("QZJ")) return "/products/nxc-qzj-116a.jpg";
    return p.images?.[0] || "/chicailogo.jpg";
  };

  // Download a single A4 page as High-Res Image for LINE
  const handleDownloadSinglePage = async (pageNumber: number, ref: React.RefObject<HTMLDivElement | null>) => {
    const node = ref.current;
    if (!node) return;
    try {
      setDownloadingPage(pageNumber);
      if (document.fonts) {
        await document.fonts.ready;
      }

      const width = 794;
      const height = 1123;

      const dataUrl = await toJpeg(node, {
        quality: 0.95,
        backgroundColor: "#ffffff",
        pixelRatio: 2,
        width: width,
        height: height,
        canvasWidth: width * 2,
        canvasHeight: height * 2,
        style: {
          width: `${width}px`,
          maxWidth: `${width}px`,
          minWidth: `${width}px`,
          height: `${height}px`,
          margin: "0",
          transform: "none",
        },
      });

      const link = document.createElement("a");
      link.download = `Chicai-Catalog-A4-Page-${pageNumber}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      window.print();
    } finally {
      setDownloadingPage(null);
    }
  };

  // Download all 4 A4 pages in sequence
  const handleDownloadAllPages = async () => {
    await handleDownloadSinglePage(1, page1Ref);
    setTimeout(() => handleDownloadSinglePage(2, page2Ref), 700);
    setTimeout(() => handleDownloadSinglePage(3, page3Ref), 1400);
    setTimeout(() => handleDownloadSinglePage(4, page4Ref), 2100);
  };

  const handlePrint = () => {
    window.print();
  };

  // Products partitioning for 4 equal pages:
  // Page 2: Product 0 & 1 (LYJ Series)
  // Page 3: Product 2 & 3 (NXC-ZSJ Series)
  // Page 4: Product 4 (NXC-QZJ) + Comparison Matrix + Contact Footer
  const lyjProducts = products.filter(
    (p) => (p.model || "").includes("LYJ") || p.category === "oil-filter"
  ).slice(0, 2);

  const zsjProducts = products.filter(
    (p) => (p.model || "").includes("ZSJ") || p.category === "cutting-fluid"
  ).slice(0, 2);

  const qzjProduct = products.find(
    (p) => (p.model || "").includes("QZJ") || p.category === "deslagging"
  ) || products[4] || DEFAULT_PRODUCTS[4];

  return (
    <div className="min-h-screen bg-slate-200/90 py-6 sm:py-10 px-2 sm:px-4 font-sans text-slate-900 print:bg-white print:p-0">
      {/* Top Floating Control Bar */}
      <div className="max-w-[794px] mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl shadow-md border border-slate-200 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-[#219990] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToCatalog}</span>
        </Link>

        {/* 3-Language Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {(["th", "zh", "en"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                lang === l ? "bg-[#219990] text-white shadow-xs" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {l === "th" ? "🇹🇭 ไทย" : l === "zh" ? "🇨🇳 中文" : "🇬🇧 EN"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* 1-Click Save as Image for LINE */}
          <button
            onClick={handleDownloadAllPages}
            disabled={downloadingPage !== null}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/25 transition cursor-pointer"
            title="บันทึกภาพขนาด A4 ทั้ง 4 หน้าสำหรับส่ง LINE"
          >
            <Download className="w-4 h-4" />
            <span>
              {downloadingPage !== null
                ? `กำลังบันทึกหน้า ${downloadingPage}...`
                : "📸 บันทึก 4 หน้าส่ง LINE"}
            </span>
          </button>

          {/* Print or Save as PDF */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#219990] hover:bg-[#1b7e76] text-white text-xs font-bold rounded-xl shadow-md shadow-[#219990]/25 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printFullCatalog}</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4 BALANCED A4 PAGES CONTAINER (210mm x 297mm EACH)          */}
      {/* ============================================================ */}
      <div className="w-full flex flex-col items-center gap-8 print:gap-0 pb-12">
        {/* ========================================================== */}
        {/* PAGE 1: COVER & CORPORATE SOLUTION OVERVIEW (A4)           */}
        {/* ========================================================== */}
        <div className="relative group">
          {/* Quick Page Download Button (Screen only) */}
          <div className="absolute -top-3 right-6 z-20 print:hidden opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => handleDownloadSinglePage(1, page1Ref)}
              className="px-3 py-1 bg-slate-900/90 text-white text-[10px] font-bold rounded-full shadow hover:bg-slate-900 transition flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              <span>ดาวน์โหลดเฉพาะหน้า 1 (A4)</span>
            </button>
          </div>

          <div
            ref={page1Ref}
            className="w-[794px] min-w-[794px] max-w-[794px] h-[1123px] min-h-[1123px] max-h-[1123px] bg-white rounded-2xl shadow-2xl overflow-hidden p-8 sm:p-10 flex flex-col justify-between border border-slate-200 print:shadow-none print:rounded-none print:border-none print:p-8 print:break-after-page"
          >
            {/* Page 1 Header */}
            <div>
              <div className="flex items-center justify-between border-b-2 border-[#219990] pb-5">
                <div className="flex items-center gap-3.5">
                  <div className="w-16 h-16 bg-white p-2 rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
                    <img
                      src="/chicailogo.jpg"
                      alt="Chicai Logo"
                      className="max-h-full max-w-full object-contain rounded-lg"
                    />
                  </div>
                  <div>
                    <h1 className="text-lg font-black text-gray-900 leading-tight">
                      {t.companyName}
                    </h1>
                    <div className="text-xs font-bold text-emerald-700 font-mono mt-0.5">
                      {t.companySubName}
                    </div>
                    <div className="text-[11px] text-gray-500 font-light mt-0.5">
                      {t.footerTagline}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-block px-3 py-1 bg-[#219990]/15 text-[#145853] text-[11px] font-bold rounded-full uppercase tracking-wider">
                    {t.officialCatalogBadge}
                  </span>
                  <div className="text-[10px] text-gray-400 font-mono mt-1">
                    DOC: CAT-2026-CHICAI
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">
                    ISSUE: {new Date().toLocaleDateString("th-TH")}
                  </div>
                </div>
              </div>

              {/* Cover Hero Banner */}
              <div className="mt-8 relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#072421] via-[#0d3b37] to-[#145853] text-white p-8 shadow-lg">
                <div className="relative z-10 space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-emerald-200 border border-white/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>INDUSTRIAL FLUID RECOVERY SOLUTIONS</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    {t.masterCatalogTitle}
                  </h2>
                  <p className="text-xs text-emerald-100/90 leading-relaxed font-light max-w-xl">
                    {t.masterCatalogSubtitle}
                  </p>

                  <div className="pt-2 flex items-center gap-2">
                    <span className="px-3 py-1 bg-[#219990] text-white font-bold text-xs rounded-lg">
                      {t.h1Title}
                    </span>
                    <span className="text-xs text-emerald-100/90 font-light">
                      • {t.h1Desc}
                    </span>
                  </div>
                </div>

                <div className="absolute right-0 top-0 w-64 h-64 bg-[#219990]/25 rounded-full blur-3xl pointer-events-none" />
              </div>

              {/* 4 Core Value Propositions Grid */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#219990]/15 flex items-center justify-center text-[#145853] shrink-0">
                    <Droplets className="w-5 h-5 text-[#219990]" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-xs">{t.h1Title}</div>
                    <div className="text-[11px] text-gray-600 mt-0.5 leading-relaxed font-light">{t.h1Desc}</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#219990]/15 flex items-center justify-center text-[#145853] shrink-0">
                    <Target className="w-5 h-5 text-[#219990]" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-xs">{t.h2Title}</div>
                    <div className="text-[11px] text-gray-600 mt-0.5 leading-relaxed font-light">{t.h2Desc}</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#219990]/15 flex items-center justify-center text-[#145853] shrink-0">
                    <ShieldCheck className="w-5 h-5 text-[#219990]" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-xs">{t.h3Title}</div>
                    <div className="text-[11px] text-gray-600 mt-0.5 leading-relaxed font-light">{t.h3Desc}</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#219990]/15 flex items-center justify-center text-[#145853] shrink-0">
                    <Wrench className="w-5 h-5 text-[#219990]" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-xs">{t.h4Title}</div>
                    <div className="text-[11px] text-gray-600 mt-0.5 leading-relaxed font-light">{t.h4Desc}</div>
                  </div>
                </div>
              </div>

              {/* Product Series Index Box */}
              <div className="mt-8 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#219990]" />
                  <span>สารบัญหมวดหมู่เครื่องจักร (Catalogue Table of Contents)</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="font-semibold text-gray-800">
                      01. เครื่องกรองน้ำมันอุตสาหกรรม (LYJ Series - 2 Models)
                    </span>
                    <span className="font-mono text-gray-400 font-bold">PAGE 02</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="font-semibold text-gray-800">
                      02. เครื่องฟื้นฟูน้ำยาหล่อเย็นและฆ่าเชื้อโอโซน (NXC-ZSJ Series - 2 Models)
                    </span>
                    <span className="font-mono text-gray-400 font-bold">PAGE 03</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="font-semibold text-gray-800">
                      03. เครื่องกำจัดตะกรันและตารางเปรียบเทียบสเปกทุกรุ่น (NXC-QZJ & Matrix)
                    </span>
                    <span className="font-mono text-gray-400 font-bold">PAGE 04</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Page 1 Footer */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-gray-400">
              <div>{t.companySubName} • OFFICIAL MASTER CATALOGUE</div>
              <div className="font-bold text-gray-600">PAGE 1 / 4</div>
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* PAGE 2: OIL FILTER SERIES - 2 MACHINES (LYJ-001)           */}
        {/* ========================================================== */}
        <div className="relative group">
          <div className="absolute -top-3 right-6 z-20 print:hidden opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => handleDownloadSinglePage(2, page2Ref)}
              className="px-3 py-1 bg-slate-900/90 text-white text-[10px] font-bold rounded-full shadow hover:bg-slate-900 transition flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              <span>ดาวน์โหลดเฉพาะหน้า 2 (A4)</span>
            </button>
          </div>

          <div
            ref={page2Ref}
            className="w-[794px] min-w-[794px] max-w-[794px] h-[1123px] min-h-[1123px] max-h-[1123px] bg-white rounded-2xl shadow-2xl overflow-hidden p-8 sm:p-10 flex flex-col justify-between border border-slate-200 print:shadow-none print:rounded-none print:border-none print:p-8 print:break-after-page"
          >
            <div>
              {/* Page 2 Header */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-[#219990]">
                <div className="flex items-center gap-2">
                  <div className="px-2 py-0.5 bg-[#219990] text-white text-[10px] font-bold rounded">
                    SECTION 01
                  </div>
                  <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                    เครื่องกรองน้ำมันอุตสาหกรรม (Industrial Oil Filter Series)
                  </h2>
                </div>
                <div className="text-xs font-mono text-gray-400">LYJ SERIES</div>
              </div>

              {/* Machine 1: LYJ-001 Single */}
              {lyjProducts[0] && (
                <div className="mt-4 p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
                  <div className="grid grid-cols-12 gap-5 items-center">
                    <div className="col-span-4 bg-white p-3 rounded-2xl border border-slate-200 flex flex-col items-center justify-between min-h-[185px]">
                      <img
                        src={getProductImage(lyjProducts[0])}
                        alt="LYJ-001 Single"
                        className="max-h-[140px] max-w-full object-contain"
                      />
                      <div className="w-full mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <span className="font-mono font-bold text-gray-600">{lyjProducts[0].model}</span>
                        <span className="text-emerald-700 font-bold">{t.inStockBadge}</span>
                      </div>
                    </div>

                    <div className="col-span-8 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[10px] font-mono font-bold">
                          {lyjProducts[0].sku}
                        </span>
                        <div className="text-right">
                          <span className="text-lg font-black text-[#145853]">
                            ฿{(lyjProducts[0].sales_price || 0).toLocaleString()}
                          </span>
                          <span className="text-[10px] text-gray-400 ml-1">{t.exclVat}</span>
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-gray-900">
                        {lyjProducts[0].names?.[lang] || lyjProducts[0].names?.th}
                      </h3>
                      <p className="text-[11px] text-gray-600 font-light leading-relaxed">
                        {lyjProducts[0].key_features?.[lang] || lyjProducts[0].key_features?.th}
                      </p>

                      {/* Specs Mini Table */}
                      <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
                        <div className="p-1.5 bg-white rounded border border-slate-200 flex justify-between">
                          <span className="text-gray-500">{t.specFlowRate}:</span>
                          <span className="font-bold text-gray-800">{lyjProducts[0].specs?.flowRate}</span>
                        </div>
                        <div className="p-1.5 bg-white rounded border border-slate-200 flex justify-between">
                          <span className="text-gray-500">{t.specPrecision}:</span>
                          <span className="font-bold text-gray-800">{lyjProducts[0].specs?.precision}</span>
                        </div>
                        <div className="p-1.5 bg-white rounded border border-slate-200 flex justify-between">
                          <span className="text-gray-500">{t.specPower}:</span>
                          <span className="font-bold text-gray-800">{lyjProducts[0].specs?.power}</span>
                        </div>
                        <div className="p-1.5 bg-white rounded border border-slate-200 flex justify-between">
                          <span className="text-gray-500">{t.specDimensions}:</span>
                          <span className="font-bold text-gray-800">{lyjProducts[0].specs?.dimensions}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Machine 2: LYJ-001 Double */}
              {lyjProducts[1] && (
                <div className="mt-4 p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
                  <div className="grid grid-cols-12 gap-5 items-center">
                    <div className="col-span-4 bg-white p-3 rounded-2xl border border-slate-200 flex flex-col items-center justify-between min-h-[185px]">
                      <img
                        src={getProductImage(lyjProducts[1])}
                        alt="LYJ-001 Double"
                        className="max-h-[140px] max-w-full object-contain"
                      />
                      <div className="w-full mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <span className="font-mono font-bold text-gray-600">{lyjProducts[1].model}</span>
                        <span className="text-emerald-700 font-bold">{t.inStockBadge}</span>
                      </div>
                    </div>

                    <div className="col-span-8 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-[#219990] text-white rounded text-[10px] font-bold">
                          {translateVariant("Double cylinder", lang)}
                        </span>
                        <div className="text-right">
                          <span className="text-lg font-black text-[#145853]">
                            ฿{(lyjProducts[1].sales_price || 0).toLocaleString()}
                          </span>
                          <span className="text-[10px] text-gray-400 ml-1">{t.exclVat}</span>
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-gray-900">
                        {lyjProducts[1].names?.[lang] || lyjProducts[1].names?.th}
                      </h3>
                      <p className="text-[11px] text-gray-600 font-light leading-relaxed">
                        {lyjProducts[1].key_features?.[lang] || lyjProducts[1].key_features?.th}
                      </p>

                      {/* Specs Mini Table */}
                      <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
                        <div className="p-1.5 bg-white rounded border border-slate-200 flex justify-between">
                          <span className="text-gray-500">{t.specFlowRate}:</span>
                          <span className="font-bold text-gray-800">{lyjProducts[1].specs?.flowRate}</span>
                        </div>
                        <div className="p-1.5 bg-white rounded border border-slate-200 flex justify-between">
                          <span className="text-gray-500">{t.specPrecision}:</span>
                          <span className="font-bold text-gray-800">{lyjProducts[1].specs?.precision}</span>
                        </div>
                        <div className="p-1.5 bg-white rounded border border-slate-200 flex justify-between">
                          <span className="text-gray-500">{t.specPower}:</span>
                          <span className="font-bold text-gray-800">{lyjProducts[1].specs?.power}</span>
                        </div>
                        <div className="p-1.5 bg-white rounded border border-slate-200 flex justify-between">
                          <span className="text-gray-500">{t.specDimensions}:</span>
                          <span className="font-bold text-gray-800">{lyjProducts[1].specs?.dimensions}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Feature Callout */}
              <div className="mt-5 p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#219990] shrink-0" />
                  <span className="text-[11px] font-semibold">
                    รับประกันตัวเครื่อง 2 ปีเต็ม On-site Service • ไส้กรองและอะไหล่แท้พร้อมส่งทันที
                  </span>
                </div>
                <span className="font-mono text-[10px] font-bold text-emerald-700">100% PURE PHYSICAL</span>
              </div>
            </div>

            {/* Page 2 Footer */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-gray-400">
              <div>{t.companySubName} • INDUSTRIAL OIL FILTRATION</div>
              <div className="font-bold text-gray-600">PAGE 2 / 4</div>
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* PAGE 3: COOLANT REGENERATION SERIES - 2 MACHINES (NXC-ZSJ) */}
        {/* ========================================================== */}
        <div className="relative group">
          <div className="absolute -top-3 right-6 z-20 print:hidden opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => handleDownloadSinglePage(3, page3Ref)}
              className="px-3 py-1 bg-slate-900/90 text-white text-[10px] font-bold rounded-full shadow hover:bg-slate-900 transition flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              <span>ดาวน์โหลดเฉพาะหน้า 3 (A4)</span>
            </button>
          </div>

          <div
            ref={page3Ref}
            className="w-[794px] min-w-[794px] max-w-[794px] h-[1123px] min-h-[1123px] max-h-[1123px] bg-white rounded-2xl shadow-2xl overflow-hidden p-8 sm:p-10 flex flex-col justify-between border border-slate-200 print:shadow-none print:rounded-none print:border-none print:p-8 print:break-after-page"
          >
            <div>
              {/* Page 3 Header */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-[#219990]">
                <div className="flex items-center gap-2">
                  <div className="px-2 py-0.5 bg-[#219990] text-white text-[10px] font-bold rounded">
                    SECTION 02
                  </div>
                  <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                    เครื่องฟื้นฟูน้ำยาหล่อเย็นและฆ่าเชื้อโอโซน (Coolant Regeneration Series)
                  </h2>
                </div>
                <div className="text-xs font-mono text-gray-400">NXC-ZSJ SERIES</div>
              </div>

              {/* Machine 3: NXC-ZSJ-100 (100 L) */}
              {zsjProducts[0] && (
                <div className="mt-4 p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
                  <div className="grid grid-cols-12 gap-5 items-center">
                    <div className="col-span-4 bg-white p-3 rounded-2xl border border-slate-200 flex flex-col items-center justify-between min-h-[185px]">
                      <img
                        src={getProductImage(zsjProducts[0])}
                        alt="NXC-ZSJ-100 (100 L)"
                        className="max-h-[140px] max-w-full object-contain"
                      />
                      <div className="w-full mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <span className="font-mono font-bold text-gray-600">{zsjProducts[0].model}</span>
                        <span className="text-emerald-700 font-bold">{t.inStockBadge}</span>
                      </div>
                    </div>

                    <div className="col-span-8 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[10px] font-mono font-bold">
                          {zsjProducts[0].sku}
                        </span>
                        <div className="text-right">
                          <span className="text-lg font-black text-[#145853]">
                            ฿{(zsjProducts[0].sales_price || 0).toLocaleString()}
                          </span>
                          <span className="text-[10px] text-gray-400 ml-1">{t.exclVat}</span>
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-gray-900">
                        {zsjProducts[0].names?.[lang] || zsjProducts[0].names?.th}
                      </h3>
                      <p className="text-[11px] text-gray-600 font-light leading-relaxed">
                        {zsjProducts[0].key_features?.[lang] || zsjProducts[0].key_features?.th}
                      </p>

                      {/* Specs Mini Table */}
                      <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
                        <div className="p-1.5 bg-white rounded border border-slate-200 flex justify-between">
                          <span className="text-gray-500">{t.specFlowRate}:</span>
                          <span className="font-bold text-gray-800">{zsjProducts[0].specs?.flowRate}</span>
                        </div>
                        <div className="p-1.5 bg-white rounded border border-slate-200 flex justify-between">
                          <span className="text-gray-500">{t.specOzoneLevel}:</span>
                          <span className="font-bold text-gray-800">{zsjProducts[0].specs?.ozoneLevel}</span>
                        </div>
                        <div className="p-1.5 bg-white rounded border border-slate-200 flex justify-between">
                          <span className="text-gray-500">{t.specInternalCapacity}:</span>
                          <span className="font-bold text-gray-800">{zsjProducts[0].specs?.internalCapacity}</span>
                        </div>
                        <div className="p-1.5 bg-white rounded border border-slate-200 flex justify-between">
                          <span className="text-gray-500">{t.specPower}:</span>
                          <span className="font-bold text-gray-800">{zsjProducts[0].specs?.power}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Machine 4: NXC-ZSJ-100 (500 L) */}
              {zsjProducts[1] && (
                <div className="mt-4 p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
                  <div className="grid grid-cols-12 gap-5 items-center">
                    <div className="col-span-4 bg-white p-3 rounded-2xl border border-slate-200 flex flex-col items-center justify-between min-h-[185px]">
                      <img
                        src={getProductImage(zsjProducts[1])}
                        alt="NXC-ZSJ-100 (500 L)"
                        className="max-h-[140px] max-w-full object-contain"
                      />
                      <div className="w-full mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <span className="font-mono font-bold text-gray-600">{zsjProducts[1].model}</span>
                        <span className="text-emerald-700 font-bold">{t.inStockBadge}</span>
                      </div>
                    </div>

                    <div className="col-span-8 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-[#219990] text-white rounded text-[10px] font-bold">
                          {translateVariant("500 L", lang)}
                        </span>
                        <div className="text-right">
                          <span className="text-lg font-black text-[#145853]">
                            ฿{(zsjProducts[1].sales_price || 0).toLocaleString()}
                          </span>
                          <span className="text-[10px] text-gray-400 ml-1">{t.exclVat}</span>
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-gray-900">
                        {zsjProducts[1].names?.[lang] || zsjProducts[1].names?.th}
                      </h3>
                      <p className="text-[11px] text-gray-600 font-light leading-relaxed">
                        {zsjProducts[1].key_features?.[lang] || zsjProducts[1].key_features?.th}
                      </p>

                      {/* Specs Mini Table */}
                      <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
                        <div className="p-1.5 bg-white rounded border border-slate-200 flex justify-between">
                          <span className="text-gray-500">{t.specFlowRate}:</span>
                          <span className="font-bold text-gray-800">{zsjProducts[1].specs?.flowRate}</span>
                        </div>
                        <div className="p-1.5 bg-white rounded border border-slate-200 flex justify-between">
                          <span className="text-gray-500">{t.specOzoneLevel}:</span>
                          <span className="font-bold text-gray-800">{zsjProducts[1].specs?.ozoneLevel}</span>
                        </div>
                        <div className="p-1.5 bg-white rounded border border-slate-200 flex justify-between">
                          <span className="text-gray-500">{t.specInternalCapacity}:</span>
                          <span className="font-bold text-gray-800">{zsjProducts[1].specs?.internalCapacity}</span>
                        </div>
                        <div className="p-1.5 bg-white rounded border border-slate-200 flex justify-between">
                          <span className="text-gray-500">{t.specPower}:</span>
                          <span className="font-bold text-gray-800">{zsjProducts[1].specs?.power}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Ozone Technology Feature */}
              <div className="mt-5 p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#219990] shrink-0" />
                  <span className="text-[11px] font-semibold">
                    โอโซนเข้มข้น 10,000 mg/H กำจัดกลิ่นเหม็นและแบคทีเรีย ยืดอายุน้ำยาคูลแลนท์มากกว่า 1 ปี
                  </span>
                </div>
                <span className="font-mono text-[10px] font-bold text-emerald-700">OZONE TECH</span>
              </div>
            </div>

            {/* Page 3 Footer */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-gray-400">
              <div>{t.companySubName} • COOLANT REGENERATION</div>
              <div className="font-bold text-gray-600">PAGE 3 / 4</div>
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* PAGE 4: DESLAGGING + COMPARISON MATRIX + CONTACT CTA (A4)  */}
        {/* ========================================================== */}
        <div className="relative group">
          <div className="absolute -top-3 right-6 z-20 print:hidden opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => handleDownloadSinglePage(4, page4Ref)}
              className="px-3 py-1 bg-slate-900/90 text-white text-[10px] font-bold rounded-full shadow hover:bg-slate-900 transition flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              <span>ดาวน์โหลดเฉพาะหน้า 4 (A4)</span>
            </button>
          </div>

          <div
            ref={page4Ref}
            className="w-[794px] min-w-[794px] max-w-[794px] h-[1123px] min-h-[1123px] max-h-[1123px] bg-white rounded-2xl shadow-2xl overflow-hidden p-8 sm:p-10 flex flex-col justify-between border border-slate-200 print:shadow-none print:rounded-none print:border-none print:p-8 print:break-after-page"
          >
            <div>
              {/* Page 4 Header */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-[#219990]">
                <div className="flex items-center gap-2">
                  <div className="px-2 py-0.5 bg-[#219990] text-white text-[10px] font-bold rounded">
                    SECTION 03
                  </div>
                  <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                    เครื่องกำจัดตะกรัน & ตารางเปรียบเทียบสเปก (Deslagging & Matrix)
                  </h2>
                </div>
                <div className="text-xs font-mono text-gray-400">NXC-QZJ & MATRIX</div>
              </div>

              {/* Machine 5: NXC-QZJ-116A */}
              {qzjProduct && (
                <div className="mt-3.5 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-3 bg-white p-2.5 rounded-xl border border-slate-200 flex flex-col items-center justify-between min-h-[135px]">
                      <img
                        src={getProductImage(qzjProduct)}
                        alt="NXC-QZJ-116A"
                        className="max-h-[100px] max-w-full object-contain"
                      />
                      <span className="font-mono text-[10px] font-bold text-gray-600 mt-1">
                        {qzjProduct.model}
                      </span>
                    </div>

                    <div className="col-span-9 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900">
                          {qzjProduct.names?.[lang] || qzjProduct.names?.th}
                        </span>
                        <span className="text-base font-black text-[#145853]">
                          ฿{(qzjProduct.sales_price || 0).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-600 font-light leading-relaxed">
                        {qzjProduct.key_features?.[lang] || qzjProduct.key_features?.th}
                      </p>
                      <div className="grid grid-cols-3 gap-1 pt-1 text-[10px]">
                        <div className="p-1 bg-white rounded border border-slate-200">
                          <span className="text-gray-400">Flow: </span>
                          <span className="font-bold">{qzjProduct.specs?.flowRate}</span>
                        </div>
                        <div className="p-1 bg-white rounded border border-slate-200">
                          <span className="text-gray-400">Drive: </span>
                          <span className="font-bold">Pneumatic</span>
                        </div>
                        <div className="p-1 bg-white rounded border border-slate-200">
                          <span className="text-gray-400">Weight: </span>
                          <span className="font-bold">{qzjProduct.specs?.weight}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Master Comparison Matrix Table */}
              <div className="mt-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <FileSpreadsheet className="w-4 h-4 text-[#219990]" />
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    {t.comparisonMatrixTitle}
                  </h3>
                </div>

                <div className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white font-bold text-[10px]">
                        <th className="py-2 px-2.5 w-3/12 border-r border-slate-700">SPECIFICATIONS</th>
                        {products.map((p, idx) => (
                          <th key={idx} className="py-2 px-1 text-center border-r border-slate-700 last:border-none">
                            <div className="font-mono text-emerald-300">{p.model}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[10px]">
                      <tr>
                        <td className="py-1.5 px-2.5 font-semibold text-gray-600 bg-slate-50 border-r border-slate-200">
                          {t.salesPriceLabel}
                        </td>
                        {products.map((p, idx) => (
                          <td key={idx} className="py-1.5 px-1 text-center font-black text-[#145853] border-r border-slate-200 last:border-none">
                            ฿{(p.sales_price || 0).toLocaleString()}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-1.5 px-2.5 font-semibold text-gray-600 bg-slate-50 border-r border-slate-200">
                          {t.specFlowRate}
                        </td>
                        {products.map((p, idx) => (
                          <td key={idx} className="py-1.5 px-1 text-center font-bold text-gray-800 border-r border-slate-200 last:border-none">
                            {p.specs?.flowRate || "-"}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-1.5 px-2.5 font-semibold text-gray-600 bg-slate-50 border-r border-slate-200">
                          {t.specPrecision}
                        </td>
                        {products.map((p, idx) => (
                          <td key={idx} className="py-1.5 px-1 text-center font-bold text-gray-800 border-r border-slate-200 last:border-none">
                            {p.specs?.precision || "-"}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-1.5 px-2.5 font-semibold text-gray-600 bg-slate-50 border-r border-slate-200">
                          {t.specOzoneLevel}
                        </td>
                        {products.map((p, idx) => (
                          <td key={idx} className="py-1.5 px-1 text-center font-bold text-gray-800 border-r border-slate-200 last:border-none">
                            {p.specs?.ozoneLevel || "-"}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-1.5 px-2.5 font-semibold text-gray-600 bg-slate-50 border-r border-slate-200">
                          {t.specPower}
                        </td>
                        {products.map((p, idx) => (
                          <td key={idx} className="py-1.5 px-1 text-center text-[9px] font-bold text-gray-800 border-r border-slate-200 last:border-none">
                            {translateSpecValue(p.specs?.power, lang)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-1.5 px-2.5 font-semibold text-gray-600 bg-slate-50 border-r border-slate-200">
                          {t.specDimensions}
                        </td>
                        {products.map((p, idx) => (
                          <td key={idx} className="py-1.5 px-1 text-center font-mono text-[9px] text-gray-700 border-r border-slate-200 last:border-none">
                            {p.specs?.dimensions || "-"}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Commercial CTA & Contact Footer Box */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-900 text-white relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#219990] text-white text-[9px] font-bold">
                      <Sparkles className="w-3 h-3" />
                      <span>{t.ctaInterested}</span>
                    </div>
                    <div className="text-xs font-black text-white">
                      {t.ctaContactTitle}
                    </div>
                    <div className="text-[10px] text-slate-300 font-light">
                      {t.ctaContactDesc}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <a
                      href="https://line.me/ti/p/htYYhK-o1q"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white text-[10px] font-bold flex items-center gap-1.5 transition shadow-sm"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>LINE: คุณเอกชัย</span>
                    </a>
                    <a
                      href="tel:0924797666"
                      className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[10px] font-bold flex items-center gap-1.5 transition border border-white/20"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-300" />
                      <span>092-479-7666 (คุณเอกชัย)</span>
                    </a>
                    <a
                      href="https://www.facebook.com/chicai.thailand"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-[#1877F2] hover:bg-blue-600 text-white text-[10px] font-bold flex items-center gap-1.5 transition shadow-sm"
                    >
                      <span>FB: chicai.thailand</span>
                    </a>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800 flex flex-wrap items-center justify-between text-[9px] text-slate-400 gap-2">
                  <div>
                    สำนักงาน: 75/2 ชั้น 3 ม.12 ต.บางพลีใหญ่ อ.บางพลี จ.สมุทรปราการ 10540 • โทร: 02-1307590-91 • เวลาทำการ: จ-ศ 08.00-17.00
                  </div>
                  <div>Email: akachai.chaicai@gmail.com</div>
                </div>
              </div>
            </div>

            {/* Page 4 Footer */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-gray-400">
              <div>{t.companySubName} • 75/2 ม.12 ต.บางพลีใหญ่ อ.บางพลี จ.สมุทรปราการ 10540</div>
              <div className="font-bold text-gray-600">PAGE 4 / 4</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
