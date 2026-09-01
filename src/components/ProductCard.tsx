"use client";

import React from "react";
import { Star, ShieldCheck, Clock, Plus, FileText, Check } from "lucide-react";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onSelect: (p: Product) => void;
  onAddToRFQ: (p: Product) => void;
  isInRFQ?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToRFQ,
  isInRFQ = false,
}) => {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-gray-200/80 overflow-hidden hover:shadow-xl hover:shadow-[#219990]/10 hover:-translate-y-1 transition-all duration-300">
      {/* Image Container */}
      <div
        onClick={() => onSelect(product)}
        className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden cursor-pointer"
      >
        <img
          src={product.imageUrl || "https://placehold.co/600x400?text=No+Image"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges: Category & Featured */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-slate-900/90 text-white backdrop-blur-xs shadow-xs">
            {product.category}
          </span>
          {product.featured && (
            <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-[#219990] text-white shadow-xs">
              Solution แนะนำ
            </span>
          )}
        </div>

        {/* MOQ Badge */}
        {product.minimumOrder > 1 && (
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-amber-500 text-white shadow-xs">
              MOQ: {product.minimumOrder} ชิ้น
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* SKU code */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[11px] font-mono font-semibold text-gray-400 uppercase tracking-wide">
            SKU: {product.sku}
          </span>
          {product.rating && (
            <div className="flex items-center gap-1 text-amber-500 text-[11px] font-semibold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelect(product)}
          className="font-bold text-gray-900 line-clamp-2 group-hover:text-[#219990] transition-colors cursor-pointer text-sm leading-snug"
        >
          {product.name}
        </h3>

        {/* Description */}
        <p className="mt-1.5 text-xs text-gray-500 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* B2B Value Highlights */}
        <div className="mt-3 py-2.5 border-y border-gray-100 flex flex-col gap-1 text-[11px] text-gray-600">
          <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#219990] shrink-0" />
            <span className="line-clamp-1">{product.warranty}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="line-clamp-1">{product.leadTime}</span>
          </div>
        </div>

        {/* Bulk Pricing Hint */}
        {product.bulkPricing && product.bulkPricing.length > 1 && (
          <div className="mt-2 text-[11px] text-[#145853] font-medium bg-[#219990]/10 px-2 py-1 rounded-md">
            มีราคาส่งสำหรับคำสั่งซื้อ {product.bulkPricing[1].minQty}+ ชิ้น
          </div>
        )}

        {/* Pricing & RFQ CTA */}
        <div className="mt-auto pt-4 flex items-end justify-between gap-2">
          <div>
            <div className="text-[10px] text-gray-400">ราคาประมาณการ / ชิ้น</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-gray-900">
                ฿{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ฿{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <div className="text-[10px] text-gray-400">
              สต็อกพร้อมส่ง: <span className="font-semibold text-gray-700">{product.stock} ชิ้น</span>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToRFQ(product);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs ${
              isInRFQ
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : "bg-[#219990] hover:bg-[#1b7e76] text-white shadow-[#219990]/25"
            }`}
          >
            {isInRFQ ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span>ในรายการ</span>
              </>
            ) : (
              <>
                <FileText className="w-3.5 h-3.5" />
                <span>+ ขอราคา</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
