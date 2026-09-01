"use client";

import React, { useState } from "react";
import { X, FileText, Check, ShieldCheck, ShieldOff, Wrench, Layers } from "lucide-react";
import { Language, translations, translateSpecValue, formatWarranty } from "@/lib/i18n";

interface SpecsModalProps {
  product: any | null;
  lang: Language;
  onClose: () => void;
  onAddToRFQ?: (product: any, qty: number) => void;
}

export const SpecsModal: React.FC<SpecsModalProps> = ({
  product,
  lang,
  onClose,
  onAddToRFQ,
}) => {
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const t = translations[lang];

  const name =
    product.names?.[lang] || product.names?.th || product.model || "สินค้า";
  const feature =
    product.key_features?.[lang] || product.key_features?.th || "";

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
  ].filter((item) => item.value && item.value !== "-");


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] sm:max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-md transition cursor-pointer active:scale-95"
          title="ปิดหน้าต่าง"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Left: Image & Model */}
        <div className="md:w-5/12 bg-slate-50 p-4 sm:p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 shrink-0">
          <div className="w-full flex items-center justify-center p-1 sm:p-2">
            <img
              src={imgUrl}
              alt={name}
              className="max-h-[140px] sm:max-h-[220px] md:max-h-[300px] max-w-full object-contain rounded-xl sm:rounded-2xl"
              onError={(e) => {
                (e.target as any).src = "/chicailogo.jpg";
              }}
            />
          </div>

          <div className="mt-2 sm:mt-4 text-center">
            <span className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 bg-slate-900 text-white rounded-full text-[10px] sm:text-xs font-mono font-bold">
              SKU: {product.sku || product.model}
            </span>
            <div className="text-lg sm:text-xl font-black text-[#219990] mt-1 sm:mt-2">
              ฿{(product.sales_price || 0).toLocaleString()}
            </div>
            <div className="text-[10px] sm:text-[11px] text-gray-400">
              {t.salesPriceLabel} {t.exclVat}
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
              {(() => {
                const warrantyInfo = formatWarranty(product.warranty, lang);
                return warrantyInfo.isNoWarranty ? (
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-full text-[10px] sm:text-xs font-semibold">
                    <ShieldOff className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{warrantyInfo.text}</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[10px] sm:text-xs font-semibold">
                    <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{warrantyInfo.text}</span>
                  </div>
                );
              })()}

              {product.stock_status === "pre_order" ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-[10px] sm:text-xs font-semibold">
                  <span>
                    {lang === "zh"
                      ? "⏳ 预订 15-30 天"
                      : lang === "en"
                      ? "⏳ Pre-order 15-30 Days"
                      : "⏳ Pre-order 15-30 วัน"}
                  </span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[10px] sm:text-xs font-semibold">
                  <span>
                    {lang === "zh"
                      ? "✓ 现货 1-3 天"
                      : lang === "en"
                      ? "✓ In Stock 1-3 Days"
                      : "✓ มีสินค้าพร้อมส่ง 1-3 วัน"}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Technical Specs Table */}
        <div className="p-4 sm:p-6 md:w-7/12 flex flex-col overflow-y-auto overscroll-contain">
          <div>
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#219990]/15 text-[#145853] text-xs font-bold mb-2">
              {product.model}{" "}
              {product.variant
                ? `• ${
                    lang === "zh"
                      ? product.variant.includes("Single")
                        ? "单筒型"
                        : product.variant.includes("Double")
                        ? "双筒型"
                        : "标准版"
                      : lang === "th"
                      ? product.variant.includes("Single")
                        ? "กระบอกเดี่ยว"
                        : product.variant.includes("Double")
                        ? "กระบอกคู่"
                        : "รุ่นมาตรฐาน"
                      : product.variant
                  }`
                : ""}
            </div>
            <h2 className="text-xl font-black text-gray-900 leading-snug">
              {name}
            </h2>
            {feature && (
              <p className="mt-2 text-xs text-gray-600 leading-relaxed font-light">
                {feature}
              </p>
            )}
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-[#219990]" />
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                {t.specsModalTitle}
              </h3>
            </div>

            <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <tbody>
                  {specsList.map((item, idx) => (
                    <tr
                      key={item.key}
                      className={idx % 2 === 0 ? "bg-slate-50/60" : "bg-white"}
                    >
                      <td className="py-2.5 px-4 font-semibold text-gray-500 w-5/12 border-b border-slate-100 text-[11px]">
                        {specLabels[item.key] || item.key}
                      </td>
                      <td className="py-2.5 px-4 font-bold text-gray-800 border-b border-slate-100 text-[11px]">
                        {item.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Applicable Fluids & Compatible Machinery Box */}
            {((product.applicable_fluids && product.applicable_fluids.length > 0) ||
              (product.compatible_machinery && product.compatible_machinery.length > 0)) && (
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
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
          </div>

          {/* Action Row: Print Datasheet, LINE Contact & Close */}
          <div className="mt-auto pt-4 sm:pt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 border-t border-slate-100">
            <a
              href="https://line.me/ti/p/htYYhK-o1q"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-5 text-xs font-bold text-white bg-[#06C755] hover:bg-[#05b34c] rounded-xl shadow-md shadow-[#06C755]/20 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98 touch-manipulation order-1 sm:order-2"
              title={
                lang === "zh"
                  ? "微信/LINE 咨询订购"
                  : lang === "en"
                  ? "Contact Khun Ekachai via LINE"
                  : "ปรึกษาหรือสั่งซื้อทาง LINE กับคุณเอกชัย"
              }
            >
              <span className="text-sm leading-none font-black">💬</span>
              <span>
                {lang === "zh"
                  ? "咨询 / 订购 (LINE)"
                  : lang === "en"
                  ? "Inquire / Order (LINE)"
                  : "ปรึกษา / สั่งซื้อทาง LINE"}
              </span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="py-2.5 sm:py-3 px-5 text-xs font-bold text-gray-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer active:scale-98 touch-manipulation order-2"
            >
              {lang === "zh" ? "✕ 关闭" : lang === "en" ? "✕ Close" : "✕ ปิด"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
