"use client";

import React, { useState } from "react";
import { X, Plus, AlertCircle, ShieldCheck } from "lucide-react";
import { CATEGORIES } from "@/services/catalogService";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: any) => Promise<void>;
  isFirebaseActive: boolean;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isFirebaseActive,
}) => {
  const [sku, setSku] = useState(`CC-B2B-${Math.floor(100 + Math.random() * 900)}`);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [category, setCategory] = useState("IT & Conference");
  const [imageUrl, setImageUrl] = useState("");
  const [stock, setStock] = useState("20");
  const [minimumOrder, setMinimumOrder] = useState("1");
  const [leadTime, setLeadTime] = useState("พร้อมส่ง 1-3 วันทำการ");
  const [warranty, setWarranty] = useState("รับประกัน 3 ปี On-site Service");
  const [certifications, setCertifications] = useState("ISO 9001, CE, RoHS");
  const [tags, setTags] = useState("");
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("กรุณาระบุชื่อสินค้า");
      return;
    }
    if (!price || Number(price) <= 0) {
      setError("กรุณาระบุราคาที่ถูกต้อง");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const numPrice = Number(price);

      await onSubmit({
        sku: sku.trim() || `SKU-${Date.now().toString().slice(-4)}`,
        name: name.trim(),
        description: description.trim(),
        price: numPrice,
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        category,
        imageUrl:
          imageUrl.trim() ||
          "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=60",
        stock: Number(stock) || 0,
        minimumOrder: Number(minimumOrder) || 1,
        leadTime: leadTime.trim() || "1-3 วันทำการ",
        warranty: warranty.trim() || "รับประกัน 1 ปี",
        certifications: certifications
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
        bulkPricing: [
          { minQty: Number(minimumOrder) || 1, pricePerUnit: numPrice },
          { minQty: 10, pricePerUnit: Math.round(numPrice * 0.9) },
          { minQty: 30, pricePerUnit: Math.round(numPrice * 0.82) },
        ],
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        featured,
      });

      // Reset
      setName("");
      setDescription("");
      setPrice("");
      setOriginalPrice("");
      setImageUrl("");
      setTags("");
      setFeatured(false);
      onClose();
    } catch (err: any) {
      setError(err?.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#219990]/10 text-[#219990] flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">เพิ่มสินค้าและโซลูชันองค์กร</h2>
            <p className="text-xs text-gray-500">บันทึกข้อมูลสินค้า B2B พร้อมสเปกการจัดซื้อเข้าสู่ Firestore</p>
          </div>
        </div>

        {!isFirebaseActive && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <div>
              <span className="font-semibold">โปรดตั้งค่า Firebase: </span>
              ใส่ค่า Config ในไฟล์ <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900">.env.local</code> เพื่อบันทึกข้อมูลลงฐานข้อมูลจริง
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                รหัสสินค้า (SKU) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden font-mono"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                ชื่อสินค้า / โซลูชัน <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="เช่น ชุดประชุมทางไกล 4K Enterprise"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                ราคาต่อหน่วย (บาท) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="25000"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                ราคาตั้งก่อนส่วนลด
              </label>
              <input
                type="number"
                min="1"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="29000"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                จำนวนสั่งซื้อขั้นต่ำ (MOQ)
              </label>
              <input
                type="number"
                min="1"
                value={minimumOrder}
                onChange={(e) => setMinimumOrder(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                หมวดหมู่
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden bg-white"
              >
                {CATEGORIES.filter((c) => c !== "ทั้งหมด").map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                สต็อกพร้อมส่ง (ชิ้น)
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                การรับประกัน (Warranty)
              </label>
              <input
                type="text"
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
                placeholder="รับประกัน 3 ปี On-site"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                ระยะเวลาจัดส่ง (Lead Time)
              </label>
              <input
                type="text"
                value={leadTime}
                onChange={(e) => setLeadTime(e.target.value)}
                placeholder="พร้อมส่ง 1-2 วันทำการ"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              มาตรฐานรับรอง (Certifications) คั่นด้วยจุลภาค
            </label>
            <input
              type="text"
              value={certifications}
              onChange={(e) => setCertifications(e.target.value)}
              placeholder="ISO 9001, CE, RoHS, มอก."
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              URL รูปภาพสินค้า
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/product.jpg (เว้นว่างไว้ได้)"
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              รายละเอียดสเปกสำหรับจัดซื้อ/ผู้บริหาร
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ระบุจุดเด่น สเปกทางเทคนิค ความเข้ากันได้กับระบบเดิม..."
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              แท็กสินค้า (คั่นด้วยจุลภาค)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="On-site Service, BIFMA Pass, เชื่อมต่อ ERP"
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="b2b-featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 text-[#219990] accent-[#219990] rounded border-gray-300"
            />
            <label htmlFor="b2b-featured" className="text-xs font-medium text-gray-700 cursor-pointer">
              ตั้งเป็น Solution แนะนำสำหรับองค์กร (Featured Solution)
            </label>
          </div>

          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 text-xs font-bold text-white bg-[#219990] hover:bg-[#1b7e76] disabled:opacity-50 rounded-xl shadow-md shadow-[#219990]/25 transition cursor-pointer"
            >
              {loading ? "กำลังบันทึก..." : "บันทึกสินค้าลงระบบ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
