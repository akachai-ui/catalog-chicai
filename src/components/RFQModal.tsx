"use client";

import React, { useState } from "react";
import { X, FileText, Trash2, CheckCircle, Building2, Phone, Mail, User, Printer, Share2, MapPin } from "lucide-react";
import { RFQItem } from "@/types/product";
import { submitRFQ } from "@/services/catalogService";
import { useLanguage } from "@/contexts/LanguageContext";

interface RFQModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: RFQItem[];
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearItems: () => void;
}

export const RFQModal: React.FC<RFQModalProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearItems,
}) => {
  const { t } = useLanguage();
  const [companyName, setCompanyName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [address, setAddress] = useState("");
  const [contactName, setContactName] = useState("");
  const [department, setDepartment] = useState("ฝ่ายจัดซื้อ / Procurement");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRfqId, setSubmittedRfqId] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const vat = Math.round(subtotal * 0.07);
  const total = subtotal + vat;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    try {
      setIsSubmitting(true);
      const rfqId = await submitRFQ({
        company: {
          companyName,
          taxId,
          address,
          contactName,
          email,
          phone,
          department,
          note,
        },
        items: items.map((it) => ({
          productId: it.product.id,
          sku: it.product.sku,
          name: it.product.name,
          quantity: it.quantity,
          unitPrice: it.product.price,
          total: it.product.price * it.quantity,
          warranty: (it.product as any).warranty || "รับประกัน 2 ปี On-site Service",
          stock_status: (it.product as any).stock_status || "in_stock",
          lead_time: (it.product as any).lead_time || "พร้อมส่ง 1-3 วันทำการ",
        })),
        totalEstimated: total,
      });

      // Cache quotation for instant viewing
      const quotationPayload = {
        id: rfqId,
        refNo: `QT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`,
        company: {
          companyName,
          taxId,
          address,
          contactName,
          email,
          phone,
          department,
          note,
        },
        items: items.map((it) => ({
          productId: it.product.id,
          sku: it.product.sku,
          name: it.product.name,
          quantity: it.quantity,
          unitPrice: it.product.price,
          total: it.product.price * it.quantity,
          warranty: (it.product as any).warranty || "รับประกัน 2 ปี On-site Service",
          stock_status: (it.product as any).stock_status || "in_stock",
          lead_time: (it.product as any).lead_time || "พร้อมส่ง 1-3 วันทำการ",
        })),
        totalEstimated: total,
        createdAt: new Date().toISOString(),
      };

      if (typeof window !== "undefined") {
        localStorage.setItem(`quotation_${rfqId}`, JSON.stringify(quotationPayload));
        localStorage.setItem("latest_quotation", JSON.stringify(quotationPayload));
      }

      setSubmittedRfqId(rfqId);
      onClearItems();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-10 bg-white p-1 rounded-xl flex items-center justify-center">
              <img
                src="/chicailogo.jpg"
                alt="ฉี ไฉ่ อิเล็คทริค"
                className="h-full w-auto object-contain rounded"
              />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {t.rfqModalTitle} • {t.companyName}
              </h2>
              <p className="text-[11px] text-emerald-400">
                {t.rfqModalSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedRfqId ? (
          <div className="p-8 sm:p-10 text-center flex flex-col items-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-sm">
              <CheckCircle className="w-9 h-9" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900">
              ออกใบเสนอราคาทางการสำเร็จ!
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
              ระบบได้ออกใบเสนอราคาทางการสำหรับ <strong className="text-gray-900">{companyName || "บริษัทของท่าน"}</strong> เรียบร้อยแล้ว
            </p>
            <div className="my-4 px-4 py-2 bg-slate-100 rounded-xl border border-slate-200 text-xs text-gray-600 font-mono">
              เลขที่เอกสารอ้างอิง: <span className="font-bold text-[#219990]">{submittedRfqId}</span>
            </div>

            {/* Actions for customer */}
            <div className="flex flex-col w-full gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  window.open(`/quotation/${submittedRfqId}`, "_blank");
                }}
                className="w-full py-3.5 px-6 bg-[#219990] hover:bg-[#1b7e76] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#219990]/25 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>🖨️ เปิดดู / พิมพ์ใบเสนอราคาทางการ (A4 PDF)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const text = `📄 บริษัท ${companyName || "ลูกค้า"} ได้ออกใบเสนอราคาทางการ เลขที่: ${submittedRfqId}\nเปิดดูเอกสารใบเสนอราคาฉบับทางการได้ที่: ${window.location.origin}/quotation/${submittedRfqId}`;
                  window.open(`https://line.me/R/msg/text/?${encodeURIComponent(text)}`, "_blank");
                }}
                className="w-full py-3 px-6 bg-[#06C755] hover:bg-[#05b04a] text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span>แชร์ใบเสนอราคาเข้า LINE ฝ่ายขาย / ผู้บริหาร</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSubmittedRfqId(null);
                  onClose();
                }}
                className="w-full py-2.5 px-4 text-xs font-semibold text-gray-500 hover:text-gray-800 transition cursor-pointer mt-1"
              >
                เสร็จสิ้น / ปิดหน้าต่าง
              </button>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-700">{t.rfqEmptyTitle}</h4>
            <p className="text-xs text-gray-400 mt-1">
              {t.rfqEmptyDesc}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Table of selected items */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                {t.rfqItemTitle} ({items.length})
              </h4>
              <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-gray-600 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4">{t.rfqSku}</th>
                      <th className="py-3 px-3 text-center">{t.rfqUnitPrice}</th>
                      <th className="py-3 px-3 text-center">{t.rfqQty}</th>
                      <th className="py-3 px-3 text-right">{t.rfqTotal}</th>
                      <th className="py-3 px-2 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map(({ product, quantity }) => (
                      <tr key={product.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4">
                          <div className="font-bold text-gray-900 line-clamp-1">{product.name}</div>
                          <div className="text-[11px] font-mono text-gray-400">SKU: {product.sku}</div>
                        </td>
                        <td className="py-3 px-3 text-center font-medium text-gray-700">
                          ฿{product.price.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <input
                            type="number"
                            min={product.minimumOrder || 1}
                            value={quantity}
                            onChange={(e) => onUpdateQuantity(product.id, Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-16 text-center py-1 px-2 border border-gray-200 rounded-lg text-xs font-semibold focus:border-[#219990] outline-hidden"
                          />
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-gray-900">
                          ฿{(product.price * quantity).toLocaleString()}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => onRemoveItem(product.id)}
                            className="text-gray-400 hover:text-rose-600 transition p-1 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Subtotal bar */}
                <div className="p-4 bg-slate-50 border-t border-gray-200 flex flex-col items-end gap-1 text-xs">
                  <div className="flex justify-between w-64 text-gray-600">
                    <span>{t.rfqSubtotal}</span>
                    <span className="font-semibold">฿{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between w-64 text-gray-600">
                    <span>{t.rfqVat}</span>
                    <span className="font-semibold">฿{vat.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between w-64 text-sm font-bold text-[#145853] pt-1 border-t border-gray-200">
                    <span>{t.rfqTotal}</span>
                    <span className="text-[#219990] font-black text-base">฿{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Procurement / Executive Information Form */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                {t.rfqOrgInfo}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {t.rfqCompanyName} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="Company Name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {t.rfqTaxId}
                  </label>
                  <input
                    type="text"
                    maxLength={13}
                    placeholder="Tax ID (13 หลัก)"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden font-mono"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    ที่อยู่บริษัท / นิคมอุตสาหกรรม (สำหรับระบุในใบเสนอราคา)
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="เช่น นิคมอุตสาหกรรมบางปู จ.สมุทรปราการ 10280"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {t.rfqContactName} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="Contact Name"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {t.rfqDepartment}
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden"
                  >
                    <option value="Procurement">ฝ่ายจัดซื้อ / Procurement / 采购部</option>
                    <option value="Management">ผู้บริหาร / Management / 管理层</option>
                    <option value="Engineering">วิศวกรรม & ซ่อมบำรุง / Engineering / 工程维护</option>
                    <option value="Production">ฝ่ายผลิต / Production / 生产部</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {t.rfqEmail} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      placeholder="email@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {t.rfqPhone} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      required
                      placeholder="Tel / Phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {t.rfqNote}
                  </label>
                  <textarea
                    rows={2}
                    placeholder="..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
              >
                {t.rfqCloseBtn}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 text-xs font-bold text-white bg-[#219990] hover:bg-[#1b7e76] disabled:opacity-50 rounded-xl shadow-md shadow-[#219990]/25 transition cursor-pointer flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>{isSubmitting ? "กำลังออกใบเสนอราคา..." : "📄 ออกใบเสนอราคาทางการทันที (Official Quotation)"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
