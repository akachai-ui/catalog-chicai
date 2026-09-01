"use client";

import React, { useState } from "react";
import { FileText, Check, Layers, Gauge, Target, Zap, ShieldCheck, ShieldOff, Clock, Play, X, ExternalLink } from "lucide-react";
import { Language, formatWarranty } from "@/lib/i18n";

interface IndustrialProductCardProps {
  product: any;
  lang: Language;
  onViewSpecs: (product: any) => void;
  onOpenVideo?: (product: any) => void;
}

export const IndustrialProductCard: React.FC<IndustrialProductCardProps> = ({
  product,
  lang,
  onViewSpecs,
  onOpenVideo,
}) => {
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const name =
    product.names?.[lang] || product.names?.th || product.model || "สินค้า";
  const feature =
    product.key_features?.[lang] || product.key_features?.th || "";

  // Direct Image URL with reliable local fallback
  const getProductImage = () => {
    const model = (product.model || "").toUpperCase();
    if (model.includes("LYJ-001") || model.includes("LYJ")) {
      return "/products/lyj-001.jpg";
    }
    if (model.includes("NXC-ZSJ-100") || model.includes("ZSJ")) {
      return "/products/nxc-zsj-100.jpg";
    }
    if (model.includes("NXC-QZJ-116A") || model.includes("QZJ")) {
      return "/products/nxc-qzj-116a.jpg";
    }
    return product.images?.[0] || product.imageUrl || "/chicailogo.jpg";
  };

  const imgUrl = getProductImage();

  const categoryLabels: Record<string, Record<Language, string>> = {
    "oil-filter": {
      th: "เครื่องกรองน้ำมัน",
      zh: "工业滤油机",
      en: "Oil Filter",
    },
    "cutting-fluid": {
      th: "ฟื้นฟูน้ำยาหล่อเย็น",
      zh: "切削液再生",
      en: "Coolant Filter",
    },
    deslagging: {
      th: "กำจัดตะกรันโลหะ",
      zh: "除渣脱水",
      en: "Deslagging",
    },
  };

  const catLabel =
    categoryLabels[product.category]?.[lang] ||
    product.category ||
    "Machine";

  const isPreOrder = product.stock_status === "pre_order";
  const leadTimeClean = isPreOrder
    ? {
        th: "Pre-order 15-30 วัน",
        zh: "预订 15-30 天",
        en: "Pre-order 15-30 Days",
      }[lang]
    : {
        th: "พร้อมส่ง 1-3 วัน",
        zh: "现货 1-3 天",
        en: "In Stock 1-3 Days",
      }[lang];

  const warrantyInfo = formatWarranty(product.warranty, lang);

  const variantDisplay = (() => {
    const v = product.variant;
    if (!v) return "";
    if (lang === "zh") {
      if (v.includes("Single") || v.includes("เดี่ยว")) return "单筒型";
      if (v.includes("Double") || v.includes("คู่")) return "双筒型";
      if (v.includes("Standard") || v.includes("มาตรฐาน")) return "标准版";
    } else if (lang === "th") {
      if (v.includes("Single") || v.includes("单筒")) return "กระบอกเดี่ยว";
      if (v.includes("Double") || v.includes("双筒")) return "กระบอกคู่";
      if (v.includes("Standard") || v.includes("标准")) return "รุ่นมาตรฐาน";
    }
    return v;
  })();

  // Extract embed info for YouTube / Google Drive / MP4
  const getEmbedVideoUrl = (url?: string) => {
    if (!url) return null;
    const cleanUrl = url.trim();
    if (!cleanUrl) return null;

    // YouTube
    const ytMatch = cleanUrl.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
    );
    if (ytMatch && ytMatch[1]) {
      return {
        type: "youtube" as const,
        embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
        directUrl: cleanUrl,
      };
    }

    // Google Drive
    if (cleanUrl.includes("drive.google.com")) {
      const driveMatch1 = cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (driveMatch1 && driveMatch1[1]) {
        return {
          type: "drive" as const,
          embedUrl: `https://drive.google.com/file/d/${driveMatch1[1]}/preview`,
          directUrl: `https://drive.google.com/file/d/${driveMatch1[1]}/view`,
        };
      }
      const driveMatch2 = cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (driveMatch2 && driveMatch2[1]) {
        return {
          type: "drive" as const,
          embedUrl: `https://drive.google.com/file/d/${driveMatch2[1]}/preview`,
          directUrl: `https://drive.google.com/file/d/${driveMatch2[1]}/view`,
        };
      }
    }

    // Direct MP4
    return {
      type: "direct" as const,
      embedUrl: cleanUrl,
      directUrl: cleanUrl,
    };
  };

  const embedData = getEmbedVideoUrl(product.video_url);

  const btnSpecs = {
    th: "ดูสเปกเต็ม",
    zh: "查看完整参数",
    en: "View Specs",
  }[lang];

  const btnCloseVideo = {
    th: "ปิดคลิป",
    zh: "关闭视频",
    en: "Close Video",
  }[lang];

  return (
    <div className="group relative flex flex-col bg-white rounded-3xl border border-slate-200/90 overflow-hidden hover:shadow-2xl hover:shadow-[#219990]/15 hover:-translate-y-1 transition-all duration-300">
      {/* Product Image / Inline Video Player Container */}
      <div className="relative aspect-4/3 w-full bg-slate-950 overflow-hidden flex items-center justify-center border-b border-slate-100">
        {isPlayingVideo && embedData ? (
          <div className="relative w-full h-full">
            {embedData.type === "youtube" ? (
              <iframe
                src={embedData.embedUrl}
                title={name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : embedData.type === "drive" ? (
              <iframe
                src={embedData.embedUrl}
                title={name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <video
                src={embedData.embedUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              >
                เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอนี้
              </video>
            )}

            {/* Top Overlay Bar: External Direct Link (Fixes Mobile/LINE Black Screen) & Close */}
            <div className="absolute top-2.5 inset-x-2.5 z-30 flex items-center justify-between pointer-events-none">
              <a
                href={embedData.directUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto py-1 px-2.5 rounded-full bg-slate-900/90 hover:bg-[#219990] text-white transition shadow-lg cursor-pointer border border-white/20 flex items-center gap-1.5 text-[10px] font-bold active:scale-95 touch-manipulation"
                title="เปิดคลิปต้นฉบับในหน้าต่างใหม่ / Google Drive (ภาพคมชัด 100%)"
              >
                <ExternalLink className="w-3 h-3 text-emerald-300" />
                <span>
                  {lang === "zh"
                    ? "黑屏? 进Drive播放"
                    : lang === "en"
                    ? "Black screen? Open Drive"
                    : "จอดำ? แตะเปิดใน Drive"}
                </span>
              </a>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPlayingVideo(false);
                }}
                className="pointer-events-auto py-1 px-2.5 rounded-full bg-black/85 hover:bg-red-600 text-white transition shadow-lg cursor-pointer border border-white/25 flex items-center gap-1 text-[10px] font-bold active:scale-95 touch-manipulation"
                title="ปิดวิดีโอ / กลับไปดูรูปสินค้า"
              >
                <X className="w-3.5 h-3.5" />
                <span>{btnCloseVideo}</span>
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => onViewSpecs(product)}
            className="relative w-full h-full bg-slate-50 flex items-center justify-center p-3 cursor-pointer"
          >
            <img
              src={imgUrl}
              alt={name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={(e) => {
                (e.target as any).src = "https://placehold.co/600x450?text=Chicai+Electric";
              }}
            />

            {/* Top Badges Row: Category (Left) & Delivery Status (Right) */}
            <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between gap-2 pointer-events-none z-10">
              <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-slate-900/90 text-white backdrop-blur-xs shadow-xs truncate max-w-[55%]">
                {catLabel}
              </span>

              {isPreOrder ? (
                <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-amber-500 text-white shadow-xs flex items-center gap-1 shrink-0">
                  <Clock className="w-3 h-3" />
                  <span>{leadTimeClean}</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-600 text-white shadow-xs flex items-center gap-1 shrink-0">
                  <Check className="w-3 h-3" />
                  <span>{leadTimeClean}</span>
                </span>
              )}
            </div>

            {/* Video Play Trigger Button Overlay */}
            {embedData && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenVideo) {
                    onOpenVideo(product);
                  } else {
                    setIsPlayingVideo(true);
                  }
                }}
                className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-slate-950/75 hover:bg-red-600 text-white flex items-center justify-center shadow-xl backdrop-blur-xs transition-all duration-300 hover:scale-115 active:scale-90 z-20 group/play cursor-pointer border border-white/40 opacity-90 hover:opacity-100 touch-manipulation"
                title="คลิกเพื่อเล่นวิดีโอสาธิตในช่องนี้ทันที"
              >
                <Play className="w-5 h-5 fill-white translate-x-0.5" />
              </button>
            )}

            {/* Bottom Badges Row: Variant (Left) & SKU (Right) */}
            <div className="absolute bottom-3 inset-x-3.5 flex items-center justify-between gap-2 pointer-events-none z-10">
              {variantDisplay ? (
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-[#219990] text-white shadow-xs truncate max-w-[55%]">
                  {variantDisplay}
                </span>
              ) : (
                <span />
              )}

              <span className="bg-white/95 backdrop-blur-xs text-slate-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs shrink-0">
                {product.sku || product.model}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        {/* Title */}
        <h3
          onClick={() => onViewSpecs(product)}
          className="font-bold text-gray-900 text-base leading-snug group-hover:text-[#219990] transition-colors cursor-pointer line-clamp-2"
        >
          {name}
        </h3>

        {/* 3 Key Closing Specs Badges */}
        <div className="mt-4 grid grid-cols-3 gap-1.5 text-[11px]">
          {product.specs?.flowRate && product.specs.flowRate !== "-" && (
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 text-center">
              <span className="text-[9px] text-gray-400 block font-medium">
                {lang === "th" ? "อัตราไหล" : lang === "zh" ? "额定流量" : "Flow Rate"}
              </span>
              <span className="font-bold text-gray-800 text-[11px] truncate block">
                {product.specs.flowRate}
              </span>
            </div>
          )}

          {product.specs?.precision && product.specs.precision !== "-" && (
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 text-center">
              <span className="text-[9px] text-gray-400 block font-medium">
                {lang === "th" ? "ความละเอียด" : lang === "zh" ? "过滤精度" : "Precision"}
              </span>
              <span className="font-bold text-gray-800 text-[11px] truncate block">
                {product.specs.precision}
              </span>
            </div>
          )}

          {(product.specs?.ozoneLevel && product.specs.ozoneLevel !== "-") ? (
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 text-center">
              <span className="text-[9px] text-gray-400 block font-medium">
                {lang === "th" ? "โอโซน" : lang === "zh" ? "臭氧杀菌" : "Ozone"}
              </span>
              <span className="font-bold text-gray-800 text-[11px] truncate block">
                {product.specs.ozoneLevel}
              </span>
            </div>
          ) : product.specs?.power && product.specs.power !== "-" ? (
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 text-center">
              <span className="text-[9px] text-gray-400 block font-medium">
                {lang === "th" ? "ระบบขับเคลื่อน" : lang === "zh" ? "驱动方式" : "Power"}
              </span>
              <span className="font-bold text-gray-800 text-[11px] truncate block">
                {product.specs.power.includes("Pneumatic")
                  ? (lang === "th" ? "Pneumatic ลม" : lang === "zh" ? "气动动力" : "Pneumatic")
                  : product.specs.power.split(",")[1]?.trim() || "220V 370W"}
              </span>
            </div>
          ) : null}
        </div>

        {/* Quick Sales Applications (1-line punchy badges) */}
        {((product.applicable_fluids && product.applicable_fluids.length > 0) ||
          (product.compatible_machinery && product.compatible_machinery.length > 0)) && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-col gap-1 text-[10px]">
            {product.applicable_fluids && product.applicable_fluids.length > 0 && (
              <div className="flex items-center gap-1.5 truncate text-gray-600">
                <span className="text-blue-600 font-bold shrink-0">
                  {lang === "th" ? "💧 ของเหลว:" : lang === "zh" ? "💧 适用油液:" : "💧 Fluids:"}
                </span>
                <span className="truncate font-medium text-slate-700">
                  {product.applicable_fluids.slice(0, 2).map((f: string) => f.split(" (")[0]).join(" • ")}
                </span>
              </div>
            )}

            {product.compatible_machinery && product.compatible_machinery.length > 0 && (
              <div className="flex items-center gap-1.5 truncate text-gray-600">
                <span className="text-emerald-700 font-bold shrink-0">
                  {lang === "th" ? "⚙️ เครื่องจักร:" : lang === "zh" ? "⚙️ 适用机床:" : "⚙️ Machinery:"}
                </span>
                <span className="truncate font-medium text-slate-700">
                  {product.compatible_machinery.slice(0, 2).map((m: string) => m.split(" (")[0]).join(" • ")}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Price & Actions */}
        <div className="mt-auto pt-3 border-t border-slate-100 space-y-2">
          {/* Warranty Badge (Linked with Database) */}
          {warrantyInfo.isNoWarranty ? (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
              <ShieldOff className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <span>{warrantyInfo.text}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
              <span>{warrantyInfo.text}</span>
            </div>
          )}

          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-[10px] text-gray-400 font-medium">
                {lang === "th" ? "ราคาขาย (บาท)" : lang === "zh" ? "售价 (泰铢)" : "Sales Price (THB)"}
              </div>
              <div className="text-xl font-black text-gray-900 tracking-tight">
                ฿{(product.sales_price || 0).toLocaleString()}
              </div>
            </div>

          <div className="flex items-center">
            <button
              type="button"
              onClick={() => onViewSpecs(product)}
              className="px-4 py-2 text-xs font-bold text-white bg-[#219990] hover:bg-[#1b7e76] rounded-xl shadow-md shadow-[#219990]/20 transition cursor-pointer active:scale-95 touch-manipulation"
            >
              {btnSpecs}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
