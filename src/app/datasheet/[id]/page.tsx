"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  Printer,
  ArrowLeft,
  Download,
  ShieldCheck,
  Zap,
  Droplets,
  Target,
  Wrench,
  Gauge,
  Phone,
  MessageCircle,
  Globe,
  Share2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { toJpeg } from "html-to-image";
import { translations, Language, translateSpecValue, formatWarranty } from "@/lib/i18n";

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

export default function CatalogDatasheetPage() {
  const params = useParams();
  const productId = params?.id as string;

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<"th" | "zh" | "en">("th");
  const [viewMode, setViewMode] = useState<"poster" | "classic">("poster");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const catalogRef = useRef<HTMLDivElement>(null);

  // Fallback products
  const FALLBACKS: Record<string, any> = {
    "lyj-001-single": {
      id: "lyj-001-single",
      model: "LYJ-001",
      variant: "Single cylinder",
      sku: "LYJ-001-S",
      category: "oil-filter",
      sales_price: 65000,
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
    },
    "lyj-001-double": {
      id: "lyj-001-double",
      model: "LYJ-001",
      variant: "Double cylinder",
      sku: "LYJ-001-D",
      category: "oil-filter",
      sales_price: 82000,
      names: {
        th: "เครื่องกรองน้ำมัน (กระบอกคู่)",
        en: "Oil filter (double cylinder)",
        zh: "工业滤油机 (双筒型)",
      },
      key_features: {
        th: "รองรับน้ำมันไฮดรอลิก, ตัดเฉือน, EDM, เกียร์ นำกลับมาหมุนเวียนใช้ใหม่เพื่อลดต้นทุน กรองต่อเนื่อง 24 ชม.",
        en: "Supports hydraulic, cutting, EDM, and gear oil. Continuous 24h filtration.",
        zh: "支持液压油、切削油循环再生，双筒连续工作，无需停机换芯。",
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
    },
    "nxc-zsj-100-100l": {
      id: "nxc-zsj-100-100l",
      model: "NXC-ZSJ-100",
      variant: "100 L",
      sku: "NXC-ZSJ-100-100L",
      category: "cutting-fluid",
      sales_price: 175000,
      names: {
        th: "เครื่องกรองและฟื้นฟูน้ำยาหล่อเย็น 100 L",
        en: "Cutting Fluid Filtration & Regeneration (100 L)",
        zh: "切削液净化再生机 100 L",
      },
      key_features: {
        th: "แก้ปัญหาน้ำยาเสื่อมสภาพ/กลิ่นเหม็น ผลิตโอโซน 10,000 mg/H แยกน้ำมันลอยและฆ่าเชื้อ",
        en: "Solves deterioration/odor issues, produces ozone 10,000 mg/H, removes tramp oil.",
        zh: "内置臭氧10000mg/H除臭杀菌，油水分离，彻底解决切削液发黑发臭问题。",
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
    },
    "nxc-zsj-100-500l": {
      id: "nxc-zsj-100-500l",
      model: "NXC-ZSJ-100",
      variant: "500 L",
      sku: "NXC-ZSJ-100-500L",
      category: "cutting-fluid",
      sales_price: 220000,
      names: {
        th: "เครื่องกรองและฟื้นฟูน้ำยาหล่อเย็น 500 L",
        en: "Cutting Fluid Filtration & Regeneration (500 L)",
        zh: "切削液净化再生机 500 L",
      },
      key_features: {
        th: "ความจุใหญ่ 500 L สำหรับระบบหล่อเย็นรวมและโรงงานขนาดใหญ่ ผลิตโอโซน 10,000 mg/H",
        en: "Large 500 L capacity for centralized coolant systems. 10,000 mg/H ozone disinfection.",
        zh: "500L大容量处理系统，适用于集中供液车间，快速再生循环使用。",
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
    },
    "nxc-qzj-116a": {
      id: "nxc-qzj-116a",
      model: "NXC-QZJ-116A",
      variant: "Standard",
      sku: "NXC-QZJ-116A",
      category: "deslagging",
      sales_price: 82000,
      names: {
        th: "เครื่องกำจัดตะกรันและเศษโลหะ",
        en: "Deslagging Machine",
        zh: "强力除渣脱水排渣机",
      },
      key_features: {
        th: "ความจุ 11.5L สั่งงานง่าย One-Click Start ถ่ายของเหลวรวดเร็ว แยกเศษเหล็กและสิ่งปนเปื้อน",
        en: "11.5L capacity, easy One-Click Start, fast fluid discharge for metal sludge & chips.",
        zh: "容积11.5L，气动一键启动，快速抽吸清理水箱底部金属废渣。",
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
    },
  };

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;
      try {
        setLoading(true);
        if (isFirebaseConfigured && db) {
          const docRef = doc(db, "products", productId);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            setProduct({ id: snap.id, ...snap.data() });
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error(err);
      }

      // Fallback
      if (FALLBACKS[productId]) {
        setProduct(FALLBACKS[productId]);
      } else {
        setProduct({
          id: productId,
          model: productId.toUpperCase(),
          variant: "Standard",
          sku: productId.toUpperCase(),
          category: "industrial",
          sales_price: 65000,
          names: {
            th: `เครื่องจักรอุตสาหกรรมรุ่น ${productId}`,
            en: `Industrial Machine ${productId}`,
            zh: `工业机械 ${productId}`,
          },
          specs: {
            type: "กรองเชิงกายภาพ Pure Physical",
            flowRate: "15–20 L/H",
            precision: "1 μm",
            power: "220V 50Hz",
          },
        });
      }
      setLoading(false);
    };

    loadProduct();
  }, [productId]);

  const getProductImage = () => {
    if (!product) return "/chicailogo.jpg";
    const model = (product.model || "").toUpperCase();
    if (model.includes("LYJ-001") || model.includes("LYJ")) return "/products/lyj-001.jpg";
    if (model.includes("NXC-ZSJ-100") || model.includes("ZSJ")) return "/products/nxc-zsj-100.jpg";
    if (model.includes("NXC-QZJ-116A") || model.includes("QZJ")) return "/products/nxc-qzj-116a.jpg";
    return product.images?.[0] || "/chicailogo.jpg";
  };

  // Download Catalog as High-Res Image (Ready to send on LINE)
  const handleDownloadImage = async () => {
    const node = catalogRef.current;
    if (!node) return;
    try {
      setIsGeneratingImage(true);
      if (document.fonts) {
        await document.fonts.ready;
      }

      const width = 760;
      const height = node.scrollHeight || node.offsetHeight;

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
          margin: "0",
          transform: "none",
        },
      });

      const link = document.createElement("a");
      link.download = `Chicai-Catalog-${product.sku || product.model}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate catalog image:", err);
      window.print();
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 text-sm text-gray-500 font-sans">
        กำลังโหลดแคตตาล็อกสินค้า (Product Catalog)...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6 text-sm text-gray-500 font-sans">
        <div>ไม่พบข้อมูลสินค้ารหัสนี้</div>
        <Link href="/" className="mt-4 text-[#219990] underline font-bold">
          กลับหน้าหลัก
        </Link>
      </div>
    );
  }

  const t = translations[lang];

  const name = product.names?.[lang] || product.names?.th || product.model;
  const feature = product.key_features?.[lang] || product.key_features?.th || "";
  const imgUrl = getProductImage();

  const specLabels: Record<string, string> = {
    type: t.specType,
    flowRate: t.specFlowRate,
    ozoneLevel: t.specOzoneLevel,
    precision: t.specPrecision,
    internalCapacity: t.specInternalCapacity,
    power: t.specPower,
    viscosity: t.specViscosity,
    airPressure: t.specAirPressure,
    dimensions: t.specDimensions,
    weight: t.specWeight,
  };

  const specsList = [
    { key: "type", value: translateSpecValue(product.specs?.type, lang) },
    { key: "flowRate", value: translateSpecValue(product.specs?.flowRate, lang) },
    { key: "ozoneLevel", value: translateSpecValue(product.specs?.ozoneLevel, lang) },
    { key: "precision", value: translateSpecValue(product.specs?.precision, lang) },
    { key: "internalCapacity", value: translateSpecValue(product.specs?.internalCapacity, lang) },
    { key: "power", value: translateSpecValue(product.specs?.power, lang) },
    { key: "viscosity", value: translateSpecValue(product.specs?.viscosity, lang) },
    { key: "airPressure", value: translateSpecValue(product.specs?.airPressure, lang) },
    { key: "dimensions", value: translateSpecValue(product.specs?.dimensions, lang) },
    { key: "weight", value: translateSpecValue(product.specs?.weight, lang) },
  ].filter((s) => s.value && s.value !== "-");

  return (
    <div className="min-h-screen bg-slate-200/90 py-6 sm:py-10 px-2 sm:px-4 font-sans text-slate-900 print:bg-white print:p-0">
      {/* Floating Control Bar for Sales & Line Sharing */}
      <div className="max-w-[780px] mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl shadow-md border border-slate-200 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-[#219990] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToCatalog}</span>
        </Link>

        {/* Style Selector: Artwork โฆษณา vs เอกสารสเปก */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewMode("poster")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              viewMode === "poster"
                ? "bg-[#219990] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>🎨</span>
            <span>{lang === "zh" ? "广告画册 (Poster)" : lang === "en" ? "Ad Poster Artwork" : "Artwork โฆษณา"}</span>
          </button>

          <button
            onClick={() => setViewMode("classic")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              viewMode === "classic"
                ? "bg-[#219990] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>📄</span>
            <span>{lang === "zh" ? "技术参数表" : lang === "en" ? "Technical Datasheet" : "เอกสารสเปก"}</span>
          </button>
        </div>

        {/* 3-Language Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {(["th", "zh", "en"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                lang === l ? "bg-[#219990] text-white shadow-xs" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {l === "th" ? "ไทย" : l === "zh" ? "中文" : "EN"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* 1-Click Save as Image for LINE sharing */}
          <button
            onClick={handleDownloadImage}
            disabled={isGeneratingImage}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/25 transition cursor-pointer"
            title="บันทึกเป็นรูปภาพสำหรับแชร์ในแชท LINE"
          >
            <Download className="w-4 h-4" />
            <span>{isGeneratingImage ? t.savingImageText : t.saveLineImageBtn}</span>
          </button>

          {/* Print or Save as PDF */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#219990] hover:bg-[#1b7e76] text-white text-xs font-bold rounded-xl shadow-md shadow-[#219990]/25 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printPdfBtn}</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* COMMERCIAL CATALOG FLYER CONTAINER (FOR LINE / WEB / PRINT)  */}
      {/* ============================================================ */}
      <div className="w-full flex justify-center overflow-x-auto pb-8">
        {viewMode === "poster" ? (
          /* ============================================================ */
          /* PREMIUM ADVERTISING ARTWORK POSTER (สไตล์ Artwork โฆษณา)     */
          /* ============================================================ */
          <div
            ref={catalogRef}
            id="catalog-flyer"
            className="w-[760px] max-w-[760px] min-w-[760px] bg-gradient-to-b from-[#041a17] via-[#072a25] to-[#031512] text-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-800/40 relative print:shadow-none print:rounded-none print:border-none print:w-full print:min-w-0"
          >
            {/* Background Decorative Tech Grid & Radial Glows */}
            <div className="absolute inset-0 bg-[radial-gradient(#219990_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
            <div className="absolute -top-16 -right-16 w-96 h-96 bg-[#219990]/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/3 -left-20 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-[#219990]/20 rounded-full blur-3xl pointer-events-none" />

            {/* Top Brand Banner & Official Tag */}
            <div className="relative z-10 p-6 sm:p-8 border-b border-white/10 bg-black/35 backdrop-blur-xs">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 bg-white p-1.5 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-950/60 shrink-0 border border-white/25">
                    <img
                      src="/chicailogo.jpg"
                      alt="Chicai Logo"
                      className="max-h-full max-w-full object-contain rounded-lg"
                    />
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-black tracking-tight leading-tight text-white flex items-center gap-2">
                      <span>{t.companyName}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                        OFFICIAL
                      </span>
                    </div>
                    <div className="text-xs font-bold text-emerald-400 font-mono mt-0.5">
                      {t.companySubName}
                    </div>
                    <div className="text-[11px] text-slate-300 font-light mt-0.5">
                      {t.footerTagline}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 rounded-full text-[10px] font-black tracking-wider uppercase shadow-md shadow-amber-500/20">
                    <span>★</span>
                    <span>COMMERCIAL ARTWORK</span>
                  </div>
                  <div className="text-[11px] text-emerald-300 font-mono font-bold mt-1.5">
                    MODEL: {product.model}
                  </div>
                </div>
              </div>

              {/* Catchy Ad Tagline */}
              <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-200 text-xs font-semibold border border-emerald-400/30 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {lang === "zh"
                    ? "🔥 工业级高端品质 • 节能降耗 • 延长设备与油液寿命 70%+"
                    : lang === "en"
                    ? "🔥 Industrial Grade Quality • Cut Fluid & Maintenance Costs by 70%+"
                    : "🔥 นวัตกรรมอุตสาหกรรมมาตรฐานสูง • ลดต้นทุนน้ำมันและของเหลวหล่อเย็นได้ทันที 70%"}
                </span>
              </div>
            </div>

            {/* Hero Stage Showcase: 3D Pedestal + Copy + Promo Price */}
            <div className="relative z-10 p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* 3D Spotlight Stage */}
                <div className="md:col-span-5 relative flex flex-col items-center justify-center">
                  <div className="relative w-full aspect-square max-w-[300px] rounded-3xl bg-gradient-to-b from-white/10 via-white/5 to-transparent p-5 border border-white/15 flex flex-col items-center justify-between shadow-2xl backdrop-blur-md overflow-hidden group">
                    <div className="absolute inset-0 m-auto w-48 h-48 rounded-full bg-[#219990]/35 blur-2xl pointer-events-none" />

                    {/* Top Badges */}
                    <div className="w-full flex items-center justify-between gap-1 z-10">
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black shadow-md">
                        ⚡ DEMO FREE
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-[10px] font-bold">
                        {product.lead_time || "พร้อมส่ง 1-3 วัน"}
                      </span>
                    </div>

                    {/* Machine Photo */}
                    <div className="relative z-10 w-full flex-1 flex items-center justify-center p-2">
                      <img
                        src={imgUrl}
                        alt={name}
                        className="max-h-[220px] max-w-full w-auto h-auto object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.7)] hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as any).src = "/chicailogo.jpg";
                        }}
                      />
                    </div>

                    {/* Stage Line */}
                    <div className="w-full pt-2.5 border-t border-white/15 flex items-center justify-between text-[11px] z-10">
                      <span className="font-mono font-bold text-slate-300">
                        SKU: {product.sku || product.model}
                      </span>
                      <span className="text-emerald-300 font-bold text-[10px]">
                        {product.variant ? translateVariant(product.variant, lang) : "มาตรฐาน"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ad Value Proposition & Commercial Price */}
                <div className="md:col-span-7 space-y-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 bg-white/10 text-emerald-300 rounded-full text-xs font-mono font-bold border border-white/15">
                      {product.model}
                    </span>
                    {product.variant && (
                      <span className="px-3 py-1 bg-[#219990] text-white rounded-full text-xs font-bold shadow-md shadow-[#219990]/30">
                        {translateVariant(product.variant, lang)}
                      </span>
                    )}
                    <span className="px-2.5 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded-full text-[10px] font-bold">
                      ✓ เครื่องแท้ 100%
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-white leading-snug tracking-tight">
                    {name}
                  </h1>

                  {feature && (
                    <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-light">
                      {feature}
                    </p>
                  )}

                  {/* 3 Key Selling Bullet Points */}
                  <div className="space-y-1.5 text-xs text-slate-200 font-medium">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        {lang === "zh"
                          ? "循环再生油液与切削液，在线过滤无需停机"
                          : lang === "en"
                          ? "Online fluid reclamation: Recycles fluid without downtime"
                          : "กรองฟื้นฟูของเหลวแบบ Online หมุนเวียนใช้ใหม่ได้ทันทีโดยไม่ต้องหยุดไลน์ผลิต"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        {lang === "zh"
                          ? "有效延长刀具、精密模具与液压系统使用寿命 2–3 倍"
                          : lang === "en"
                          ? "Extends CNC cutting tools & hydraulic components lifespan by 2–3x"
                          : "ลดการสึกหรอ ยืดอายุเครื่องมือตัด CNC และวาล์วไฮดรอลิก 2–3 เท่า"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        {lang === "zh"
                          ? "快速收回投资成本，一般 3–6 个月即可回本"
                          : lang === "en"
                          ? "Fast ROI: Payback period typically within 3 to 6 months"
                          : "จุดคุ้มทุนไวมาก คืนทุนค่าเครื่องจักรภายใน 3–6 เดือน ประหยัดหลักแสนต่อปี"}
                      </span>
                    </div>
                  </div>

                  {/* Commercial Special Price Banner */}
                  <div className="p-4 bg-gradient-to-r from-emerald-950/90 via-[#0d3b37] to-[#145853]/90 border-2 border-emerald-400/40 rounded-2xl flex items-center justify-between shadow-xl">
                    <div>
                      <div className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{lang === "zh" ? "特惠促销价格" : lang === "en" ? "Special Promotional Price" : "ราคาโปรโมชั่นพิเศษ"}</span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
                        ฿{(product.sales_price || 0).toLocaleString()}
                        <span className="text-xs font-normal text-emerald-200 ml-1.5 font-sans">
                          {t.exclVat}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="px-3 py-1 bg-white text-slate-900 text-[11px] font-black rounded-xl shadow-md">
                        {formatWarranty(product.warranty, lang).text}
                      </div>
                      <div className="text-[10px] text-emerald-200 mt-1 font-medium">
                        ✓ ออกใบกำกับภาษีได้ 100%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Commercial Pillars */}
            <div className="relative z-10 px-6 sm:px-8 py-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/40 transition flex flex-col items-center text-center backdrop-blur-xs">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 shadow-inner">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div className="font-black text-white text-xs">{t.h1Title}</div>
                  <div className="text-[10px] text-slate-300 mt-1 leading-snug">{t.h1Desc}</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/40 transition flex flex-col items-center text-center backdrop-blur-xs">
                  <div className="w-10 h-10 rounded-xl bg-[#219990]/20 text-[#219990] flex items-center justify-center mb-2 shadow-inner">
                    <Target className="w-5 h-5" />
                  </div>
                  <div className="font-black text-white text-xs">{t.h2Title}</div>
                  <div className="text-[10px] text-slate-300 mt-1 leading-snug">{t.h2Desc}</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/40 transition flex flex-col items-center text-center backdrop-blur-xs">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center mb-2 shadow-inner">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="font-black text-white text-xs">{formatWarranty(product.warranty, lang).text}</div>
                  <div className="text-[10px] text-slate-300 mt-1 leading-snug">{t.h3Desc}</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/40 transition flex flex-col items-center text-center backdrop-blur-xs">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center mb-2 shadow-inner">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div className="font-black text-white text-xs">{t.h4Title}</div>
                  <div className="text-[10px] text-slate-300 mt-1 leading-snug">{t.h4Desc}</div>
                </div>
              </div>
            </div>

            {/* Specifications Matrix */}
            <div className="relative z-10 px-6 sm:px-8 py-5">
              <div className="flex items-center gap-2 mb-3.5 pb-2 border-b border-white/15">
                <Gauge className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider">
                  {t.flyerSpecsTitle}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {specsList.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition"
                  >
                    <span className="text-slate-400 text-[11px] font-medium">
                      {specLabels[s.key] || s.key}
                    </span>
                    <span className="font-bold text-white text-right text-[11px] max-w-[62%] leading-tight break-words font-mono">
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Applicable Fluids & Factory Machinery */}
            {((product.applicable_fluids && product.applicable_fluids.length > 0) ||
              (product.compatible_machinery && product.compatible_machinery.length > 0)) && (
              <div className="relative z-10 mx-6 sm:mx-8 mb-4 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                {product.applicable_fluids && product.applicable_fluids.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold text-emerald-300 flex items-center gap-1.5 mb-1.5">
                      <span>💧</span>
                      <span>
                        {lang === "th"
                          ? "ประเภทน้ำมันและของเหลวที่รองรับ (Applicable Fluids)"
                          : lang === "zh"
                          ? "适用油液与化学品类型 (Applicable Fluids)"
                          : "Applicable Fluid Types"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {product.applicable_fluids.map((fluid: string, fIdx: number) => (
                        <span
                          key={fIdx}
                          className="px-2.5 py-1 bg-black/40 rounded-lg border border-white/15 text-slate-200 text-[11px] font-medium"
                        >
                          {fluid}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {product.compatible_machinery && product.compatible_machinery.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold text-emerald-300 flex items-center gap-1.5 mb-1.5">
                      <span>⚙️</span>
                      <span>
                        {lang === "th"
                          ? "เครื่องจักรในโรงงานที่ใช้งานร่วมกันได้ (Compatible Machinery)"
                          : lang === "zh"
                          ? "适用机床与工业设备 (Compatible Machinery)"
                          : "Compatible Factory Machinery"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {product.compatible_machinery.map((mach: string, mIdx: number) => (
                        <span
                          key={mIdx}
                          className="px-2.5 py-1 bg-black/40 rounded-lg border border-emerald-500/30 text-emerald-300 text-[11px] font-medium"
                        >
                          {mach}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Sales Closing Banner & Direct Contact */}
            <div className="relative z-10 m-6 sm:m-8 p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-400/40 text-white shadow-2xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
                <div className="space-y-1.5 max-w-xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#219990] text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t.ctaInterested}</span>
                  </div>
                  <div className="text-base sm:text-lg font-black text-white">
                    {t.ctaContactTitle}
                  </div>
                  <div className="text-xs text-slate-300 font-light">
                    {t.ctaContactDesc}
                  </div>
                  <div className="pt-2 text-[11px] text-slate-400 space-y-0.5">
                    <div>
                      {lang === "zh"
                        ? "地址: 75/2 3楼 12组 Bang Phli Yai, Bang Phli, Samut Prakan 10540"
                        : lang === "en"
                        ? "Office: 75/2 3rd Fl., Moo 12, Bang Phli Yai, Bang Phli, Samut Prakan 10540"
                        : "สำนักงาน: 75/2 ชั้นที่ 3 หมู่ที่ 12 ต.บางพลีใหญ่ อ.บางพลี จ.สมุทรปราการ 10540"}
                    </div>
                    <div>
                      {lang === "zh"
                        ? "电话: 02-1307590-91 • Email: akachai.chaicai@gmail.com • 工作时间: 周一至五 08:00-17:00"
                        : lang === "en"
                        ? "Tel: 02-1307590-91 • Email: akachai.chaicai@gmail.com • Mon - Fri: 08:00 - 17:00"
                        : "โทร: 02-1307590-91 • Email: akachai.chaicai@gmail.com • เวลาทำการ: จ-ศ 08.00-17.00"}
                    </div>
                  </div>
                </div>

                {/* Quick Contact Badges */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
                  <a
                    href="https://line.me/ti/p/htYYhK-o1q"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-2xl bg-[#06C755] hover:bg-[#05b34c] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#06C755]/30 transition active:scale-95 touch-manipulation cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>
                      {lang === "zh" ? "LINE: Max (คุณเอกชัย)" : lang === "en" ? "LINE: Max (Ekachai)" : "LINE: คุณเอกชัย (Max)"}
                    </span>
                  </a>
                  <a
                    href="tel:0924797666"
                    className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold flex items-center gap-2 transition active:scale-95 touch-manipulation cursor-pointer"
                    title="โทรหาฝ่ายขายทันที"
                  >
                    <Phone className="w-4 h-4 text-emerald-300" />
                    <span>
                      {lang === "zh" ? "092-479-7666 (Max)" : lang === "en" ? "092-479-7666 (Max)" : "092-479-7666 (ฝ่ายขายตรง)"}
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* Footer Stamp */}
            <div className="pb-6 text-center text-[10px] text-slate-500 font-mono">
              © {new Date().getFullYear()} {t.companySubName} • OFFICIAL INDUSTRIAL CATALOG FLYER • ALL RIGHTS RESERVED
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* CLASSIC TECHNICAL DATASHEET (เอกสารสเปกวิศวกรรม)               */
          /* ============================================================ */
          <div
            ref={catalogRef}
            id="catalog-flyer"
            className="w-[760px] max-w-[760px] min-w-[760px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 print:shadow-none print:rounded-none print:border-none print:w-full print:min-w-0"
          >
          {/* Top Header Banner */}
          <div className="relative bg-gradient-to-r from-[#072421] via-[#0d3b37] to-[#145853] text-white p-6 sm:p-8">
            <div className="relative z-10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 bg-white p-1.5 rounded-2xl flex items-center justify-center shadow-md shrink-0">
                  <img
                    src="/chicailogo.jpg"
                    alt="Chicai Logo"
                    className="max-h-full max-w-full object-contain rounded-lg"
                  />
                </div>
                <div>
                  <div className="text-base sm:text-lg font-black tracking-tight leading-tight">
                    {t.companyName}
                  </div>
                  <div className="text-[11px] font-bold text-emerald-300 font-mono mt-0.5">
                    {t.companySubName}
                  </div>
                  <div className="text-[10px] text-emerald-100/80 font-light mt-0.5">
                    {t.footerTagline}
                  </div>
                </div>
              </div>

              <div className="hidden sm:block text-right shrink-0">
                <div className="inline-block px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-[10px] font-bold tracking-widest text-emerald-200 border border-white/20 uppercase">
                  {t.officialCatalogBadge}
                </div>
                <div className="text-[10px] text-emerald-200/80 font-mono mt-1">
                  SKU: {product.sku || product.model}
                </div>
              </div>
            </div>

            {/* Decorative subtle glows */}
            <div className="absolute right-0 top-0 w-64 h-64 bg-[#219990]/25 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Hero Product Presentation */}
          <div className="p-6 sm:p-8 bg-gradient-to-b from-slate-50 to-white">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Machine Photo Showcase */}
              <div className="md:col-span-5 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-between min-h-[310px] sm:min-h-[350px]">
                <div className="w-full flex-1 flex items-center justify-center p-2 overflow-hidden">
                  <img
                    src={imgUrl}
                    alt={name}
                    className="max-h-[220px] sm:max-h-[250px] max-w-full w-auto h-auto object-contain drop-shadow-md transition-transform duration-300"
                    onError={(e) => {
                      (e.target as any).src = "/chicailogo.jpg";
                    }}
                  />
                </div>

                <div className="w-full mt-2 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="font-mono font-bold text-gray-500">
                    MODEL: {product.model}
                  </span>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-[#145853] font-bold rounded-md text-[10px]">
                    {t.inStockBadge}
                  </span>
                </div>
              </div>

              {/* Title & Key Value Proposition */}
              <div className="md:col-span-7 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-mono font-bold">
                    {product.sku || product.model}
                  </span>
                  {product.variant && (
                    <span className="px-3 py-1 bg-[#219990] text-white rounded-full text-xs font-bold">
                      {translateVariant(product.variant, lang)}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                  {name}
                </h1>

                {feature && (
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
                    {feature}
                  </p>
                )}

                {/* Price Banner */}
                <div className="p-3.5 bg-[#219990]/10 border border-[#219990]/25 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                      {t.salesPriceLabel}
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-[#145853] tracking-tight">
                      ฿{(product.sales_price || 0).toLocaleString()}
                      <span className="text-xs font-medium text-gray-500 ml-1.5 font-sans">
                        {t.exclVat}
                      </span>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <span className="inline-block px-2.5 py-1 bg-[#219990] text-white font-bold text-[10px] rounded-lg">
                      {formatWarranty(product.warranty, lang).text}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Key Visual Highlights Cards */}
          <div className="px-6 sm:px-8 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col items-center text-center">
                <Droplets className="w-5 h-5 text-[#219990] mb-1.5 shrink-0" />
                <div className="font-bold text-gray-900 text-[11px]">{t.h1Title}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">{t.h1Desc}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col items-center text-center">
                <Target className="w-5 h-5 text-[#219990] mb-1.5 shrink-0" />
                <div className="font-bold text-gray-900 text-[11px]">{t.h2Title}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">{t.h2Desc}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col items-center text-center">
                <ShieldCheck className="w-5 h-5 text-[#219990] mb-1.5 shrink-0" />
                <div className="font-bold text-gray-900 text-[11px]">
                  {formatWarranty(product.warranty, lang).text}
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">{t.h3Desc}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col items-center text-center">
                <Wrench className="w-5 h-5 text-[#219990] mb-1.5 shrink-0" />
                <div className="font-bold text-gray-900 text-[11px]">{t.h4Title}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">{t.h4Desc}</div>
              </div>
            </div>
          </div>

          {/* Specifications Infographic Grid */}
          <div className="px-6 sm:px-8 py-5">
            <div className="flex items-center gap-2 mb-3.5 pb-2 border-b border-slate-200">
              <Gauge className="w-4 h-4 text-[#219990]" />
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                {t.flyerSpecsTitle}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {specsList.map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl"
                >
                  <span className="text-gray-500 text-[11px] font-medium">
                    {specLabels[s.key] || s.key}
                  </span>
                  <span className="font-bold text-gray-900 text-right text-[11px] max-w-[62%] leading-tight break-words">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Applicable Fluids & Compatible Machinery Box */}
          {((product.applicable_fluids && product.applicable_fluids.length > 0) ||
            (product.compatible_machinery && product.compatible_machinery.length > 0)) && (
            <div className="mx-6 sm:mx-8 mb-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              {product.applicable_fluids && product.applicable_fluids.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-gray-800 flex items-center gap-1.5 mb-1.5">
                    <span>💧</span>
                    <span>
                      {lang === "th"
                        ? "ประเภทน้ำมันหรือน้ำยาที่รองรับ (Applicable Fluids)"
                        : lang === "zh"
                        ? "适用油液与化学品类型 (Applicable Fluids)"
                        : "Applicable Fluid Types"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {product.applicable_fluids.map((fluid: string, fIdx: number) => (
                      <span
                        key={fIdx}
                        className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-slate-700 text-[11px] font-medium shadow-2xs"
                      >
                        {fluid}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.compatible_machinery && product.compatible_machinery.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-gray-800 flex items-center gap-1.5 mb-1.5">
                    <span>⚙️</span>
                    <span>
                      {lang === "th"
                        ? "เครื่องจักรในโรงงานที่ใช้งานร่วมกันได้ (Compatible Machinery)"
                        : lang === "zh"
                        ? "适用机床与工业设备 (Compatible Machinery)"
                        : "Compatible Factory Machinery"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {product.compatible_machinery.map((mach: string, mIdx: number) => (
                      <span
                        key={mIdx}
                        className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-emerald-800 text-[11px] font-medium shadow-2xs"
                      >
                        {mach}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Commercial Call to Action & Contact Section (For LINE Customers) */}
          <div className="m-6 sm:m-8 p-6 rounded-3xl bg-slate-900 text-white relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
              <div className="space-y-1.5 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#219990] text-white text-[10px] font-bold">
                  <Sparkles className="w-3 h-3" />
                  <span>{t.ctaInterested}</span>
                </div>
                <div className="text-base sm:text-lg font-black text-white">
                  {t.ctaContactTitle}
                </div>
                <div className="text-xs text-slate-300 font-light">
                  {t.ctaContactDesc}
                </div>
                <div className="pt-2 text-[11px] text-slate-400 space-y-0.5">
                  <div>
                    {lang === "zh"
                      ? "地址: 75/2 3楼 12组 Bang Phli Yai, Bang Phli, Samut Prakan 10540"
                      : lang === "en"
                      ? "Office: 75/2 3rd Fl., Moo 12, Bang Phli Yai, Bang Phli, Samut Prakan 10540"
                      : "สำนักงาน: 75/2 ชั้นที่ 3 หมู่ที่ 12 ต.บางพลีใหญ่ อ.บางพลี จ.สมุทรปราการ 10540"}
                  </div>
                  <div>
                    {lang === "zh"
                      ? "电话: 02-1307590-91 • Email: akachai.chaicai@gmail.com • 工作时间: 周一至五 08:00-17:00"
                      : lang === "en"
                      ? "Tel: 02-1307590-91 • Email: akachai.chaicai@gmail.com • Mon - Fri: 08:00 - 17:00"
                      : "โทร: 02-1307590-91 • Email: akachai.chaicai@gmail.com • เวลาทำการ: จ-ศ 08.00-17.00"}
                  </div>
                </div>
              </div>

              {/* Quick Contact Badges */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
                <a
                  href="https://line.me/ti/p/htYYhK-o1q"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-2xl bg-[#06C755] hover:bg-[#05b34c] text-white text-xs font-bold flex items-center gap-2 shadow-md transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>
                    {lang === "zh" ? "LINE: Max (คุณเอกชัย)" : lang === "en" ? "LINE: Max (Ekachai)" : "LINE: คุณเอกชัย (Max)"}
                  </span>
                </a>
                <a
                  href="tel:0924797666"
                  className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold flex items-center gap-2 transition"
                  title="โทรหาฝ่ายขายทันที"
                >
                  <Phone className="w-4 h-4 text-emerald-300" />
                  <span>
                    {lang === "zh" ? "092-479-7666 (Max)" : lang === "en" ? "092-479-7666 (Max)" : "092-479-7666 (ฝ่ายขายตรง)"}
                  </span>
                </a>
              </div>
            </div>

            {/* Decorative background shape */}
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#219990]/20 rounded-full blur-2xl" />
          </div>

          {/* Footer Note */}
          <div className="pb-6 text-center text-[10px] text-gray-400">
            © {new Date().getFullYear()} {t.companySubName} • 75/2 ม.12 ต.บางพลีใหญ่ อ.บางพลี จ.สมุทรปราการ 10540 • {t.copyright.toUpperCase()}
          </div>
        </div>
      )}
    </div>
  </div>
);
}
