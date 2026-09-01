"use client";

import React, { useState } from "react";
import {
  X,
  Star,
  Package,
  Tag,
  Trash2,
  ShieldCheck,
  Clock,
  Award,
  FileText,
  Check,
} from "lucide-react";
import { Product } from "@/types/product";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
  onAddToRFQ: (product: Product, quantity: number) => void;
  isFirebaseActive: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onDelete,
  onAddToRFQ,
  isFirebaseActive,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToRFQ(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-md transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="md:w-5/12 relative bg-slate-100 min-h-[250px] md:min-h-[450px]">
          <img
            src={product.imageUrl || "https://placehold.co/600x400?text=No+Image"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-mono px-3 py-1 rounded-lg">
            SKU: {product.sku}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6 md:w-7/12 flex flex-col overflow-y-auto">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#219990]/15 text-[#145853]">
              {product.category}
            </span>
            {product.rating && (
              <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                {product.reviewCount && (
                  <span className="text-gray-400 font-normal">({product.reviewCount} การประเมิน)</span>
                )}
              </div>
            )}
          </div>

          <h2 className="mt-2.5 text-xl font-bold text-gray-900 leading-snug">
            {product.name}
          </h2>

          {/* Pricing */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#219990]">
              ฿{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ฿{product.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-xs text-gray-400 font-normal">/ ชิ้น (ราคายังไม่รวม VAT)</span>
          </div>

          {/* B2B Tiered Pricing Table */}
          {product.bulkPricing && product.bulkPricing.length > 0 && (
            <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-3">
              <h4 className="text-[11px] font-bold text-gray-600 uppercase mb-2">
                โครงสร้างราคาพิเศษตามปริมาณสั่งซื้อ (Volume Discount):
              </h4>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {product.bulkPricing.map((tier, idx) => (
                  <div key={idx} className="bg-white border border-gray-100 p-2 rounded-lg shadow-2xs">
                    <div className="text-[10px] text-gray-500 font-medium">สั่งซื้อ {tier.minQty}+ ชิ้น</div>
                    <div className="font-bold text-[#145853] mt-0.5">฿{tier.pricePerUnit.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              คุณสมบัติและสเปกสำหรับองค์กร
            </h4>
            <p className="mt-1.5 text-xs text-gray-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Warranty & Lead Time Specifications */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/60 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#219990] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-emerald-950">การรับประกัน</div>
                <div className="text-emerald-800 text-[11px] mt-0.5">{product.warranty}</div>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
              <Clock className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-gray-800">ระยะเวลาจัดส่ง</div>
                <div className="text-gray-600 text-[11px] mt-0.5">{product.leadTime}</div>
              </div>
            </div>
          </div>

          {/* Certifications */}
          {product.certifications && product.certifications.length > 0 && (
            <div className="mt-3 flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                มาตรฐานรับรอง:
              </span>
              {product.certifications.map((cert, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-slate-100 text-slate-700 font-mono text-[10px] font-semibold rounded"
                >
                  {cert}
                </span>
              ))}
            </div>
          )}

          {/* Stock & MOQ */}
          <div className="mt-4 flex items-center justify-between text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-[#219990]" />
              <span>
                พร้อมส่ง: <strong className="text-gray-900">{product.stock} ชิ้น</strong>
              </span>
            </div>
            {product.minimumOrder > 1 && (
              <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-semibold text-[11px]">
                MOQ ขั้นต่ำ: {product.minimumOrder} ชิ้น
              </span>
            )}
          </div>

          {/* Quantity selector and Add to RFQ */}
          <div className="mt-auto pt-5 flex items-center gap-3">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(product.minimumOrder || 1, q - 1))}
                className="px-3 py-2 text-gray-500 hover:bg-gray-100 transition cursor-pointer text-sm font-bold"
              >
                -
              </button>
              <input
                type="number"
                min={product.minimumOrder || 1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(product.minimumOrder || 1, parseInt(e.target.value) || 1))}
                className="w-12 text-center text-xs font-bold outline-hidden"
              />
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-2 text-gray-500 hover:bg-gray-100 transition cursor-pointer text-sm font-bold"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAdd}
              className={`flex-1 py-2.5 px-4 font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                added
                  ? "bg-emerald-600 text-white"
                  : "bg-[#219990] hover:bg-[#1b7e76] text-white shadow-[#219990]/25"
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>เพิ่มลงในรายการขอราคาแล้ว!</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>ใส่ในรายการขอใบเสนอราคา (RFQ)</span>
                </>
              )}
            </button>

            {isFirebaseActive && onDelete && !product.id.startsWith("b2b-") && (
              <button
                onClick={() => {
                  if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?")) {
                    onDelete(product.id);
                    onClose();
                  }
                }}
                className="p-2.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
                title="ลบสินค้า"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
