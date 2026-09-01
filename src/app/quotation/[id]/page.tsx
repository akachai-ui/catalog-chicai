"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  Printer,
  ArrowLeft,
  Share2,
  Building2,
  Phone,
  Mail,
  FileText,
  Clock,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

// Thai Baht Text Converter
function thaiBahtText(num: number): string {
  if (isNaN(num) || num === 0) return "ศูนย์บาทถ้วน";
  const numStr = num.toFixed(2);
  const [integerPart, decimalPart] = numStr.split(".");
  const thaiNums = ["ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"];
  const thaiUnits = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];

  const convertGroup = (digits: string) => {
    let result = "";
    const len = digits.length;
    for (let i = 0; i < len; i++) {
      const digit = parseInt(digits[i]);
      const unit = len - i - 1;
      if (digit === 0) continue;
      if (unit === 1 && digit === 1) {
        result += "สิบ";
      } else if (unit === 1 && digit === 2) {
        result += "ยี่สิบ";
      } else if (unit === 0 && digit === 1 && len > 1 && digits[len - 2] !== "0") {
        result += "เอ็ด";
      } else {
        result += thaiNums[digit] + thaiUnits[unit];
      }
    }
    return result;
  };

  let intNum = parseInt(integerPart);
  let bahtResult = "";
  if (intNum >= 1000000) {
    const millions = Math.floor(intNum / 1000000);
    bahtResult += convertGroup(millions.toString()) + "ล้าน";
    intNum = intNum % 1000000;
  }
  if (intNum > 0) {
    bahtResult += convertGroup(intNum.toString()) + "บาท";
  } else if (bahtResult) {
    bahtResult += "บาท";
  }

  if (decimalPart && decimalPart !== "00") {
    let satangResult = convertGroup(decimalPart) + "สตางค์";
    return bahtResult + satangResult;
  } else {
    return bahtResult + "ถ้วน";
  }
}

export default function QuotationViewPage() {
  const params = useParams();
  const quotationId = params?.id as string;

  const [quotation, setQuotation] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const quotationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadQuotation = async () => {
      setLoading(true);
      try {
        // 1. Try fetching from Firestore
        if (isFirebaseConfigured && db && quotationId) {
          const docRef = doc(db, "quotations", quotationId);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            setQuotation({ id: snap.id, ...snap.data() });
            setLoading(false);
            return;
          }
        }

        // 2. Check localStorage cache
        if (typeof window !== "undefined") {
          const cached =
            localStorage.getItem(`quotation_${quotationId}`) ||
            localStorage.getItem("latest_quotation");
          if (cached) {
            setQuotation(JSON.parse(cached));
            setLoading(false);
            return;
          }
        }

        // 3. Demo Fallback
        setQuotation({
          id: quotationId || "DEMO-QT",
          refNo: `QT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-1088`,
          company: {
            companyName: "บริษัท ตัวอย่างผู้ใช้งานอุตสาหกรรม จำกัด",
            taxId: "0105560123456",
            address: "นิคมอุตสาหกรรมบางปู จ.สมุทรปราการ 10280",
            contactName: "ผู้จัดการฝ่ายจัดซื้อและวิศวกรรม",
            department: "ฝ่ายจัดซื้อ (Procurement)",
            phone: "081-234-5678",
            email: "purchasing@factory.co.th",
            note: "ต้องการใบเสนอราคาเพื่อนำเข้าที่ประชุมอนุมัติงบประมาณประจำไตรมาส",
          },
          items: [
            {
              productId: "lyj-001-double",
              sku: "LYJ-001-D",
              name: "เครื่องกรองน้ำมันอุตสาหกรรม (กระบอกคู่ Duplex Non-stop)",
              quantity: 1,
              unitPrice: 82000,
              total: 82000,
            },
            {
              productId: "nxc-zsj-100-100l",
              sku: "NXC-ZSJ-100-100L",
              name: "เครื่องฟื้นฟูและกรองน้ำยาหล่อเย็น 100 L (โอโซน 10,000 mg/H)",
              quantity: 1,
              unitPrice: 175000,
              total: 175000,
            },
          ],
          totalEstimated: 257000,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Error loading quotation:", err);
      } finally {
        setLoading(false);
      }
    };

    loadQuotation();
  }, [quotationId]);

  const handlePrint = () => {
    window.print();
  };

  const handleShareLine = () => {
    if (!quotation) return;
    const refNo = quotation.refNo || `QT-${quotation.id?.slice(0, 8)}`;
    const text = `📄 ใบเสนอราคาทางการ บริษัท ฉี ไฉ่ อิเล็คทริค (ประเทศไทย) จำกัด\nเลขที่: ${refNo}\nลูกค้า: ${quotation.company?.companyName || "-"}\nยอดรวม: ฿${((quotation.totalEstimated || 0) * 1.07).toLocaleString()} (รวม VAT)\nเปิดดูใบเสนอราคาฉบับเต็มได้ที่: ${window.location.href}`;
    window.open(`https://line.me/R/msg/text/?${encodeURIComponent(text)}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center text-xs text-gray-500 font-sans">
        กำลังจัดเตรียมใบเสนอราคาทางการ...
      </div>
    );
  }

  const subtotal = quotation.totalEstimated || 0;
  const vat = subtotal * 0.07;
  const grandTotal = subtotal + vat;
  const refNo = quotation.refNo || `QT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${(quotation.id || "0000").slice(-4).toUpperCase()}`;

  const issueDate = new Date().toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-200 text-slate-900 py-6 sm:py-10 font-sans print:p-0 print:bg-white">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="max-w-[820px] mx-auto px-4 mb-4 flex items-center justify-between gap-3 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-gray-700 hover:bg-slate-50 text-xs font-semibold shadow-xs border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับสู่หน้าร้าน</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShareLine}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#06C755] hover:bg-[#05b04a] text-white text-xs font-bold shadow-xs cursor-pointer transition"
          >
            <Share2 className="w-4 h-4" />
            <span>แชร์เข้า LINE</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#219990] hover:bg-[#1b7e76] text-white text-xs font-bold shadow-md shadow-[#219990]/20 cursor-pointer transition"
          >
            <Printer className="w-4 h-4" />
            <span>🖨️ พิมพ์ / บันทึก PDF (A4)</span>
          </button>
        </div>
      </div>

      {/* Official A4 Quotation Sheet */}
      <div
        ref={quotationRef}
        className="max-w-[820px] mx-auto bg-white border border-slate-300 rounded-2xl shadow-xl p-8 sm:p-12 print:border-none print:shadow-none print:p-0 print:rounded-none print:max-w-none"
      >
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-6 border-b-2 border-slate-800">
          <div className="flex items-start gap-4">
            <img
              src="/chicailogo.jpg"
              alt="โลโก้ ฉี ไฉ่"
              className="w-16 h-16 object-contain rounded-lg border border-slate-200 p-1 shrink-0"
              onError={(e) => {
                (e.target as any).src = "https://placehold.co/120x120?text=CHICAI";
              }}
            />
            <div>
              <h1 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
                บริษัท ฉี ไฉ่ อิเล็คทริค (ประเทศไทย) จำกัด
              </h1>
              <div className="text-xs font-bold text-[#219990] font-mono uppercase tracking-wide">
                CHI CAI ELECTRIC (THAILAND) CO., LTD.
              </div>
              <div className="text-[11px] text-gray-500 mt-1 leading-snug">
                เลขประจำตัวผู้เสียภาษีอากร: 0105566000000 (สำนักงานใหญ่) <br />
                ที่อยู่: อาคารพาณิชย์อุตสาหกรรม ถนนเทพารักษ์ ต.บางพลีใหญ่ อ.บางพลี จ.สมุทรปราการ <br />
                โทร: 02-XXX-XXXX, 08X-XXX-XXXX • อีเมล: sales@chicaielectric.com • LINE: @chicaielectric
              </div>
            </div>
          </div>

          <div className="text-right shrink-0 sm:self-center">
            <div className="inline-block bg-slate-900 text-white font-black text-lg px-4 py-1.5 rounded-lg tracking-wider">
              ใบเสนอราคา
            </div>
            <div className="text-[11px] font-bold text-gray-500 mt-1 font-mono tracking-widest">
              OFFICIAL QUOTATION
            </div>
          </div>
        </div>

        {/* Quotation Metadata & Customer Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 text-xs border-b border-slate-200">
          {/* Customer Details */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 space-y-1">
            <div className="font-bold text-gray-900 text-[13px] flex items-center gap-1.5 mb-1.5 pb-1 border-b border-slate-200">
              <Building2 className="w-4 h-4 text-[#219990]" />
              <span>ข้อมูลลูกค้า (Customer / Sold To):</span>
            </div>
            <div className="font-bold text-gray-800 text-[12px]">
              {quotation.company?.companyName || "ลูกค้าทั่วไป"}
            </div>
            {quotation.company?.taxId && (
              <div className="text-gray-600 font-mono text-[11px]">
                เลขประจำตัวผู้เสียภาษี: {quotation.company.taxId}
              </div>
            )}
            {quotation.company?.address && (
              <div className="text-gray-600 text-[11px]">
                ที่อยู่: {quotation.company.address}
              </div>
            )}
            <div className="text-gray-700 text-[11px] pt-1">
              <span className="font-semibold">เรียน:</span> คุณ {quotation.company?.contactName || "-"}
              {quotation.company?.department ? ` (${quotation.company.department})` : ""}
            </div>
            <div className="flex items-center gap-3 text-[11px] text-gray-600 pt-0.5">
              <span>โทร: {quotation.company?.phone || "-"}</span>
              <span>อีเมล: {quotation.company?.email || "-"}</span>
            </div>
          </div>

          {/* Quotation Document Details */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 space-y-1.5">
            <div className="font-bold text-gray-900 text-[13px] flex items-center gap-1.5 mb-1.5 pb-1 border-b border-slate-200">
              <FileText className="w-4 h-4 text-[#219990]" />
              <span>รายละเอียดเอกสาร (Document Details):</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">เลขที่ใบเสนอราคา:</span>
              <span className="font-bold text-[#219990] font-mono text-[12px]">{refNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">วันที่ออกเอกสาร (Date):</span>
              <span className="font-semibold text-gray-800">{issueDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">กำหนดยืนราคา (Validity):</span>
              <span className="font-semibold text-gray-800">30 วัน (ถึง {validUntil})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">เงื่อนไขการส่งมอบ:</span>
              <span className="font-semibold text-emerald-700">
                {(quotation.items || []).some((it: any) => it.stock_status === "pre_order")
                  ? "Pre-order 15-30 วันทำการ"
                  : "พร้อมส่ง 1-3 วันทำการ"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">ผู้ติดต่อฝ่ายขาย:</span>
              <span className="font-semibold text-gray-800">ฝ่ายวิศวกรรมและการขาย (B2B)</span>
            </div>
          </div>
        </div>

        {/* Quotation Items Table */}
        <div className="py-5">
          <table className="w-full text-left text-xs border-collapse border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-900 text-white font-bold text-[11px]">
              <tr>
                <th className="py-2.5 px-3 text-center w-12">ลำดับ</th>
                <th className="py-2.5 px-3">รายการสินค้า / Description</th>
                <th className="py-2.5 px-3 text-center w-16">จำนวน</th>
                <th className="py-2.5 px-3 text-right w-28">ราคาต่อหน่วย</th>
                <th className="py-2.5 px-3 text-right w-28">จำนวนเงิน (บาท)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {(quotation.items || []).map((it: any, idx: number) => {
                const total = (it.unitPrice || 0) * (it.quantity || 1);
                return (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/70"}>
                    <td className="py-3 px-3 text-center text-gray-500 font-mono">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-gray-900 text-[12px]">{it.name}</div>
                      <div className="text-[10px] text-gray-500 font-mono">
                        รหัสรุ่น / SKU: {it.sku || it.productId}
                      </div>
                      <div className="text-[10px] text-gray-500 font-medium mt-0.5 flex items-center gap-1.5 flex-wrap">
                        <span className="text-emerald-700">
                          ✓ {it.warranty || "รับประกัน 2 ปี On-site Service"}
                        </span>
                        <span>•</span>
                        {it.stock_status === "pre_order" ? (
                          <span className="text-amber-800 font-bold">
                            ⏳ {it.lead_time || "Pre-order 15-30 วัน"}
                          </span>
                        ) : (
                          <span className="text-emerald-800 font-bold">
                            ✓ {it.lead_time || "พร้อมส่ง 1-3 วัน"}
                          </span>
                        )}
                        <span>• มีอะไหล่แท้พร้อมดูแล</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-bold font-mono text-[12px]">
                      {it.quantity || 1} เครื่อง
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-gray-800">
                      ฿{(it.unitPrice || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-gray-900 text-[12px]">
                      ฿{total.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Financial Summary & Baht Text */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pb-6 border-b border-slate-200">
          {/* Thai Baht Text Box */}
          <div className="sm:col-span-7 flex flex-col justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                จำนวนเงินรวมทั้งสิ้น (ตัวอักษร) / Total Amount in Words:
              </div>
              <div className="font-bold text-gray-900 text-[13px] bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                {thaiBahtText(grandTotal)}
              </div>
            </div>

            {quotation.company?.note && (
              <div className="mt-3 text-[11px] text-gray-600 bg-amber-50/80 p-2 rounded-lg border border-amber-200">
                <span className="font-bold text-amber-900">หมายเหตุหน้างาน: </span>
                {quotation.company.note}
              </div>
            )}
          </div>

          {/* Calculations */}
          <div className="sm:col-span-5 space-y-2 text-xs">
            <div className="flex justify-between py-1 px-2 border-b border-slate-100">
              <span className="text-gray-600">รวมเป็นเงิน (Subtotal):</span>
              <span className="font-mono font-bold text-gray-900">฿{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 px-2 border-b border-slate-100">
              <span className="text-gray-600">ภาษีมูลค่าเพิ่ม VAT 7%:</span>
              <span className="font-mono font-bold text-gray-900">฿{vat.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between py-2 px-3 rounded-xl bg-slate-900 text-white font-bold">
              <span>ยอดเงินรวมสุทธิ (Grand Total):</span>
              <span className="font-mono text-sm sm:text-base text-emerald-300">
                ฿{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Commercial Terms & Conditions */}
        <div className="py-4 text-[10px] text-gray-600 space-y-1 border-b border-slate-200">
          <div className="font-bold text-gray-800 text-xs mb-1">
            เงื่อนไขทางการค้าและการรับประกัน (Commercial Terms & Warranty):
          </div>
          <div>1. <span className="font-semibold text-gray-700">การส่งมอบและติดตั้ง:</span> จัดส่งฟรีพร้อมทีมวิศวกรผู้เชี่ยวชาญสาธิตการใช้งานถึงโรงงานภายใน 1–3 วันทำการ</div>
          <div>2. <span className="font-semibold text-gray-700">การรับประกันคุณภาพ:</span> รับประกันตัวเครื่องและระบบควบคุม 2 ปีเต็ม พร้อมบริการตรวจเช็กหน้างาน (On-site Service)</div>
          <div>3. <span className="font-semibold text-gray-700">การชำระเงิน:</span> โอนเงินเข้าบัญชีธนาคาร บริษัท ฉี ไฉ่ อิเล็คทริค (ประเทศไทย) จำกัด (เลขที่บัญชีจะระบุในใบแจ้งหนี้อย่างเป็นทางการ)</div>
          <div>4. <span className="font-semibold text-gray-700">การยืนราคา:</span> ราคานี้ยืนยันความถูกต้องเป็นเวลา 30 วัน นับจากวันที่ระบุในเอกสารฉบับนี้</div>
        </div>

        {/* Signatures & Official Acceptance */}
        <div className="pt-6 grid grid-cols-2 gap-8 text-center text-xs">
          {/* Customer Acceptance */}
          <div className="border border-slate-200 rounded-2xl p-4 flex flex-col justify-between min-h-[140px]">
            <div className="text-[11px] font-bold text-gray-800">
              การยืนยันสั่งซื้อโดยลูกค้า (Customer Acceptance)
            </div>
            <div className="text-[10px] text-gray-400 font-light">
              ข้าพเจ้าตกลงสั่งซื้อสินค้าตามรายการและราคาที่ระบุข้างต้น
            </div>
            <div className="pt-6">
              <div className="border-b border-dashed border-slate-300 w-36 mx-auto mb-1.5" />
              <div className="text-[10px] text-gray-500">
                (ผู้มีอำนาจลงนาม / ประทับตราบริษัท)
              </div>
              <div className="text-[9px] text-gray-400 mt-0.5">วันที่: _____ / _____ / ________</div>
            </div>
          </div>

          {/* Chicai Electric Issuer */}
          <div className="border border-slate-200 rounded-2xl p-4 flex flex-col justify-between min-h-[140px] relative bg-slate-50/50">
            <div className="text-[11px] font-bold text-gray-900">
              ในนาม บริษัท ฉี ไฉ่ อิเล็คทริค (ประเทศไทย) จำกัด
            </div>
            <div className="text-[10px] text-[#219990] font-semibold">
              CHI CAI ELECTRIC (THAILAND) CO., LTD.
            </div>

            {/* Official Stamp Decoration */}
            <div className="pt-6 relative">
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[10px] uppercase tracking-wider mb-1">
                ✓ CERTIFIED OFFICIAL QUOTATION
              </div>
              <div className="text-[10px] text-gray-500 font-semibold">
                ผู้มีอำนาจลงนาม / ฝ่ายวิศวกรรมการขาย
              </div>
              <div className="text-[9px] text-gray-400 mt-0.5">วันที่: {issueDate}</div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-6 text-center text-[9px] text-gray-400">
          เอกสารนี้ออกโดยระบบอัตโนมัติของ บริษัท ฉี ไฉ่ อิเล็คทริค (ประเทศไทย) จำกัด • มีผลบังคับใช้เป็นใบเสนอราคาทางการสำหรับการจัดซื้อระดับองค์กร (B2B)
        </div>
      </div>
    </div>
  );
}
