"use client";

import React, { useState, useEffect } from "react";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import Link from "next/link";
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Database,
  ArrowLeft,
  Eye,
  Sparkles,
  Layers,
  Wrench,
  ChevronDown,
  ChevronUp,
  Package,
  FileText,
  BarChart3,
  Search,
  ExternalLink,
  Pencil,
  Phone,
  Mail,
  Building2,
  Calendar,
  Clock,
  Printer,
  X,
} from "lucide-react";

export default function AdminPage() {
  // Collapsible Form State (Default closed to prioritize Dashboard)
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form state - Clean empty fields
  const [model, setModel] = useState("");
  const [variant, setVariant] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("oil-filter");
  const [salesPrice, setSalesPrice] = useState("");
  const [warranty, setWarranty] = useState("รับประกัน 2 ปี On-site Service");
  const [stockStatus, setStockStatus] = useState<"in_stock" | "pre_order">("in_stock");
  const [leadTime, setLeadTime] = useState("พร้อมส่ง 1-3 วันทำการ");
  const [videoUrl, setVideoUrl] = useState("");

  // Names (3 languages)
  const [nameTh, setNameTh] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [nameZh, setNameZh] = useState("");

  // Key Features
  const [featureTh, setFeatureTh] = useState("");
  const [featureEn, setFeatureEn] = useState("");
  const [featureZh, setFeatureZh] = useState("");

  // Technical Specs
  const [specType, setSpecType] = useState("");
  const [flowRate, setFlowRate] = useState("");
  const [ozoneLevel, setOzoneLevel] = useState("");
  const [precision, setPrecision] = useState("");
  const [internalCapacity, setInternalCapacity] = useState("");
  const [power, setPower] = useState("");
  const [viscosity, setViscosity] = useState("");
  const [airPressure, setAirPressure] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [weight, setWeight] = useState("");

  // Image URL
  const [imageUrl, setImageUrl] = useState("");

  // Applicable Fluids & Machinery Applications
  const [applicableFluids, setApplicableFluids] = useState("");
  const [compatibleMachinery, setCompatibleMachinery] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  // Dashboard Data State
  const [savedProducts, setSavedProducts] = useState<any[]>([]);
  const [quotationsCount, setQuotationsCount] = useState(0);
  const [quotationsList, setQuotationsList] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"products" | "quotations">("products");
  const [loadingList, setLoadingList] = useState(false);
  const [filterSearch, setFilterSearch] = useState("");

  // Reset form to completely empty
  const handleResetForm = () => {
    setModel("");
    setVariant("");
    setSku("");
    setCategory("oil-filter");
    setSalesPrice("");
    setNameTh("");
    setNameEn("");
    setNameZh("");
    setFeatureTh("");
    setFeatureEn("");
    setFeatureZh("");
    setSpecType("");
    setFlowRate("");
    setOzoneLevel("");
    setPrecision("");
    setInternalCapacity("");
    setPower("");
    setViscosity("");
    setAirPressure("");
    setDimensions("");
    setWeight("");
    setImageUrl("");
    setWarranty("รับประกัน 2 ปี On-site Service");
    setStockStatus("in_stock");
    setLeadTime("พร้อมส่ง 1-3 วันทำการ");
    setVideoUrl("");
    setApplicableFluids("");
    setCompatibleMachinery("");
  };

  // Convert Google Drive link or map to local direct image
  const getDirectImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("/")) return url;
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      const fileId = match[1];
      if (fileId === "1wOIuB5eI7kbsZfi_b2s75V2jBgKCp8_4") return "/products/lyj-001.jpg";
      if (fileId === "1vv5T0LdGzbvhtc2hfiEIHOxQeLgGV4io") return "/products/nxc-zsj-100.jpg";
      if (fileId === "13rvqbgvcu68ksdGQN3WHA2SmaKGG0tUf") return "/products/nxc-qzj-116a.jpg";
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
    return url;
  };

  const previewImage = getDirectImageUrl(imageUrl);

  // Fetch existing products and quotations from Firestore
  const fetchDashboardData = async () => {
    if (!isFirebaseConfigured || !db) return;
    try {
      setLoadingList(true);
      const snapshot = await getDocs(collection(db, "products"));
      const list = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setSavedProducts(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Submit product to Firestore
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFirebaseConfigured || !db) {
      setMessage({
        type: "error",
        text: "ยังไม่ได้ตั้งค่า Firebase หรือคีย์ใน .env.local ไม่ถูกต้อง",
      });
      return;
    }

    try {
      setSaving(true);
      setMessage(null);

      const docId = `${(model || "product")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")}-${(variant || "std")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")}`;

      const directImg = getDirectImageUrl(imageUrl);

      const productDoc = {
        id: docId,
        model: model.trim(),
        variant: variant.trim(),
        sku: sku.trim(),
        category,
        sales_price: Number(salesPrice) || 0,
        warranty: warranty.trim() || "รับประกัน 2 ปี On-site Service",
        stock_status: stockStatus,
        lead_time: leadTime.trim() || (stockStatus === "in_stock" ? "พร้อมส่ง 1-3 วันทำการ" : "Pre-order 15-30 วันทำการ"),
        video_url: videoUrl.trim(),
        names: {
          th: nameTh.trim(),
          en: nameEn.trim(),
          zh: nameZh.trim(),
        },
        key_features: {
          th: featureTh.trim(),
          en: featureEn.trim(),
          zh: featureZh.trim(),
        },
        specs: {
          type: specType.trim() || "-",
          flowRate: flowRate.trim() || "-",
          ozoneLevel: ozoneLevel.trim() || "-",
          precision: precision.trim() || "-",
          internalCapacity: internalCapacity.trim() || "-",
          power: power.trim() || "-",
          viscosity: viscosity.trim() || "-",
          airPressure: airPressure.trim() || "-",
          dimensions: dimensions.trim() || "-",
          weight: weight.trim() || "-",
        },
        images: directImg ? [directImg] : [],
        rawDriveUrl: imageUrl.trim(),
        applicable_fluids: applicableFluids
          ? applicableFluids
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        compatible_machinery: compatibleMachinery
          ? compatibleMachinery
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        featured: true,
        isActive: true,
        updatedAt: serverTimestamp(),
      };

      const docRef = doc(db, "products", docId);
      await setDoc(docRef, productDoc, { merge: true });

      setMessage({
        type: "success",
        text: `บันทึกสินค้า "${nameTh || model}" (SKU: ${sku}) เรียบร้อยแล้ว!`,
      });

      // Clear form and close
      handleResetForm();
      setIsFormOpen(false);

      // Refresh list
      fetchDashboardData();
    } catch (err: any) {
      console.error(err);
      setMessage({
        type: "error",
        text: "เกิดข้อผิดพลาดในการบันทึก: " + (err?.message || err),
      });
    } finally {
      setSaving(false);
    }
  };

  // Load product data into form for editing
  const handleEditProduct = (item: any) => {
    setModel(item.model || "");
    setVariant(item.variant || "");
    setSku(item.sku || "");
    setCategory(item.category || "oil-filter");
    setSalesPrice(item.sales_price ? String(item.sales_price) : "");
    setWarranty(item.warranty || "รับประกัน 2 ปี On-site Service");
    setStockStatus(item.stock_status || "in_stock");
    setLeadTime(item.lead_time || (item.stock_status === "pre_order" ? "Pre-order 15-30 วันทำการ" : "พร้อมส่ง 1-3 วันทำการ"));
    setVideoUrl(item.video_url || "");
    setNameTh(item.names?.th || "");
    setNameEn(item.names?.en || "");
    setNameZh(item.names?.zh || "");
    setFeatureTh(item.key_features?.th || "");
    setFeatureEn(item.key_features?.en || "");
    setFeatureZh(item.key_features?.zh || "");
    setSpecType(item.specs?.type || "");
    setFlowRate(item.specs?.flowRate || "");
    setOzoneLevel(item.specs?.ozoneLevel || "");
    setPrecision(item.specs?.precision || "");
    setInternalCapacity(item.specs?.internalCapacity || "");
    setPower(item.specs?.power || "");
    setViscosity(item.specs?.viscosity || "");
    setAirPressure(item.specs?.airPressure || "");
    setDimensions(item.specs?.dimensions || "");
    setWeight(item.specs?.weight || "");
    setImageUrl(item.rawDriveUrl || item.images?.[0] || "");
    setApplicableFluids(
      Array.isArray(item.applicable_fluids)
        ? item.applicable_fluids.join("\n")
        : typeof item.applicable_fluids === "string"
        ? item.applicable_fluids
        : ""
    );
    setCompatibleMachinery(
      Array.isArray(item.compatible_machinery)
        ? item.compatible_machinery.join("\n")
        : typeof item.compatible_machinery === "string"
        ? item.compatible_machinery
        : ""
    );
    setIsFormOpen(true);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  // Delete product
  const handleDelete = async (docId: string, name: string) => {
    if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบสินค้า "${name}"?`)) return;
    if (!db) return;

    try {
      await deleteDoc(doc(db, "products", docId));
      fetchDashboardData();
      setMessage({ type: "success", text: `ลบสินค้าเรียบร้อยแล้ว` });
    } catch (err: any) {
      alert("ลบไม่สำเร็จ: " + err.message);
    }
  };

  // Filtered products in table
  const filteredList = savedProducts.filter((p) => {
    const q = filterSearch.toLowerCase();
    const name = (p.names?.th || "").toLowerCase();
    const modelStr = (p.model || "").toLowerCase();
    const skuStr = (p.sku || "").toLowerCase();
    return !q || name.includes(q) || modelStr.includes(q) || skuStr.includes(q);
  });

  const formatTimestamp = (ts: any) => {
    if (!ts) return "-";
    try {
      const d = ts.toDate ? ts.toDate() : new Date(ts.seconds ? ts.seconds * 1000 : ts);
      return d.toLocaleDateString("th-TH", {
        day: "numeric",
        month: "short",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "-";
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20 font-sans">
      {/* Top Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold shrink-0"
              title="กลับหน้าร้าน"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">กลับหน้าร้าน</span>
            </Link>
            <div className="h-6 w-px bg-slate-700 shrink-0" />
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#219990] flex items-center justify-center font-bold text-white shadow-xs shrink-0">
                <Database className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xs sm:text-base font-bold leading-none truncate">
                  Chicai Admin<span className="hidden sm:inline"> Dashboard</span>
                </h1>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate hidden sm:block">
                  บริษัท ฉี ไฉ่ อิเล็คทริค (ประเทศไทย) จำกัด
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-[#219990] hover:bg-[#1b7e76] text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer active:scale-95 touch-manipulation"
            >
              {isFormOpen ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span>ซ่อนฟอร์ม</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>+ เพิ่มสินค้า</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Feedback Alert */}
        {message && (
          <div
            className={`p-4 rounded-2xl flex items-start gap-3 text-xs shadow-xs ${
              message.type === "success"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                : "bg-rose-50 border border-rose-200 text-rose-800"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="font-medium flex-1">{message.text}</div>
            <button
              onClick={() => setMessage(null)}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Dashboard Overview Cards (KPIs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => setActiveTab("products")}
            className={`bg-white p-5 rounded-3xl border shadow-xs flex items-center gap-4 cursor-pointer transition ${
              activeTab === "products"
                ? "border-[#219990] ring-2 ring-[#219990]/20"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#219990]/15 text-[#219990] flex items-center justify-center shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900">
                {savedProducts.length}
              </div>
              <div className="text-xs text-gray-500 font-medium">
                สินค้าทั้งหมดในระบบ (SKUs)
              </div>
            </div>
          </div>

          <div
            onClick={() => setActiveTab("quotations")}
            className={`bg-white p-5 rounded-3xl border shadow-xs flex items-center gap-4 cursor-pointer transition ${
              activeTab === "quotations"
                ? "border-amber-500 ring-2 ring-amber-500/20"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900">
                {quotationsCount}
              </div>
              <div className="text-xs text-gray-500 font-medium">
                คำขอใบเสนอราคา (RFQs)
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-600 flex items-center justify-center shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900">3</div>
              <div className="text-xs text-gray-500 font-medium">
                หมวดหมู่เครื่องจักรหลัก
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Connected</span>
              </div>
              <div className="text-xs text-gray-500 font-medium mt-0.5">
                Firebase Firestore Status
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Input Form Section */}
        {isFormOpen && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            {/* Form Section Header */}
            <div className="px-6 sm:px-8 py-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-[#219990]" />
                <div>
                  <h2 className="text-base font-bold">ฟอร์มกรอกข้อมูลสินค้าใหม่ (Add Product Form)</h2>
                  <p className="text-xs text-slate-400">กรอกข้อมูลให้ครบถ้วนเพื่อบันทึกเข้า Cloud Firestore</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition cursor-pointer"
                >
                  ล้างข้อมูลในฟอร์ม
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Input Form Body */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              {/* Section 1: Basic Information */}
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                  <Layers className="w-4 h-4 text-[#219990]" />
                  <h3 className="text-sm font-bold text-gray-900">1. ข้อมูลพื้นฐานสินค้า</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      รหัสรุ่น (Model) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="เช่น LYJ-001"
                      className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      รุ่นย่อย / สเปก (Variant) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={variant}
                      onChange={(e) => setVariant(e.target.value)}
                      placeholder="เช่น Single cylinder, 100 L"
                      className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      รหัสสินค้า (SKU) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      placeholder="เช่น LYJ-001-S"
                      className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      หมวดหมู่
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden bg-white"
                    >
                      <option value="oil-filter">เครื่องกรองน้ำมัน (Oil filter)</option>
                      <option value="cutting-fluid">เครื่องกรองน้ำยาหล่อเย็น (Cutting Fluid)</option>
                      <option value="deslagging">เครื่องกำจัดตะกรันและเศษโลหะ (Deslagging)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      ราคาขาย (Sales Price บาท) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={salesPrice}
                      onChange={(e) => setSalesPrice(e.target.value)}
                      placeholder="เช่น 65000"
                      className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden font-bold text-gray-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      การรับประกัน (Warranty)
                    </label>
                    <input
                      type="text"
                      value={warranty}
                      onChange={(e) => setWarranty(e.target.value)}
                      placeholder="เช่น รับประกัน 2 ปี On-site Service"
                      className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden font-medium"
                    />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {[
                        "รับประกัน 1 ปี On-site Service",
                        "รับประกัน 2 ปี On-site Service (มาตรฐาน)",
                        "รับประกัน 3 ปี On-site Service",
                        "รับประกัน 5 ปี พร้อมตรวจเช็กประจำปี",
                      ].map((w, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setWarranty(w)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-[10px] text-gray-700 rounded-lg transition cursor-pointer font-medium"
                        >
                          + {w}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stock Status & Lead Time */}
                  <div className="sm:col-span-2 pt-3 border-t border-slate-100">
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      สถานะสต็อกและระยะเวลาจัดส่ง (Stock Status & Lead Time)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Segmented Radio */}
                      <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                        <button
                          type="button"
                          onClick={() => {
                            setStockStatus("in_stock");
                            setLeadTime("พร้อมส่ง 1-3 วันทำการ");
                          }}
                          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                            stockStatus === "in_stock"
                              ? "bg-white text-emerald-800 shadow-xs"
                              : "text-gray-500 hover:text-gray-800"
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span>✓ มีสินค้า (In Stock)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setStockStatus("pre_order");
                            setLeadTime("Pre-order 15-30 วันทำการ");
                          }}
                          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                            stockStatus === "pre_order"
                              ? "bg-white text-amber-800 shadow-xs"
                              : "text-gray-500 hover:text-gray-800"
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          <span>⏳ สั่งจอง (Pre-order)</span>
                        </button>
                      </div>

                      {/* Lead Time Input */}
                      <div>
                        <input
                          type="text"
                          value={leadTime}
                          onChange={(e) => setLeadTime(e.target.value)}
                          placeholder="เช่น พร้อมส่ง 1-3 วันทำการ"
                          className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden font-medium"
                        />
                      </div>
                    </div>

                    {/* Quick chips for lead time */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {(stockStatus === "in_stock"
                        ? [
                            "พร้อมส่ง 1-3 วันทำการ",
                            "พร้อมส่ง ภายใน 24 ชม.",
                            "พร้อมส่ง มีสินค้าในสต็อก",
                          ]
                        : [
                            "Pre-order 7-14 วันทำการ",
                            "Pre-order 15-30 วันทำการ",
                            "Pre-order 30-45 วันทำการ",
                            "สั่งผลิต Made-to-order 45-60 วัน",
                          ]
                      ).map((lt, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setLeadTime(lt)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-[10px] text-gray-700 rounded-lg transition cursor-pointer font-medium"
                        >
                          + {lt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Multilingual Names & Features */}
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-[#219990]">🌐</span>
                  <h3 className="text-sm font-bold text-gray-900">
                    2. ชื่อสินค้าและจุดเด่นสำคัญ (3 ภาษา)
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        🇹🇭 ชื่อภาษาไทย (TH-Name) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={nameTh}
                        onChange={(e) => setNameTh(e.target.value)}
                        placeholder="เครื่องกรองน้ำมัน..."
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        🇬🇧 ชื่อภาษาอังกฤษ (EN-Name)
                      </label>
                      <input
                        type="text"
                        value={nameEn}
                        onChange={(e) => setNameEn(e.target.value)}
                        placeholder="Oil filter machine..."
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        🇨🇳 ชื่อภาษาจีน (ZH-Name)
                      </label>
                      <input
                        type="text"
                        value={nameZh}
                        onChange={(e) => setNameZh(e.target.value)}
                        placeholder="工业滤油机..."
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      จุดเด่นสำคัญภาษาไทย (Key Features TH)
                    </label>
                    <textarea
                      rows={2}
                      value={featureTh}
                      onChange={(e) => setFeatureTh(e.target.value)}
                      placeholder="เช่น รองรับน้ำมันไฮดรอลิก, ตัดเฉือน, EDM..."
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Applicable Fluids & Compatible Machinery */}
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                  <span className="text-sm">💧⚙️</span>
                  <h3 className="text-sm font-bold text-gray-900">
                    3. ประเภทน้ำมัน/น้ำยา และเครื่องจักรที่รองรับ (Applications)
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Applicable Fluids */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-gray-800">
                      💧 ประเภทน้ำมันหรือน้ำยาที่ใช้ได้ (Applicable Fluids)
                    </label>
                    <p className="text-[10px] text-gray-500 font-light">
                      ระบุชื่อน้ำมันหรือน้ำยาที่เครื่องนี้รองรับ (1 บรรทัดต่อ 1 ประเภท หรือคลิกเพิ่มด่วนด้านล่าง)
                    </p>
                    <textarea
                      rows={4}
                      value={applicableFluids}
                      onChange={(e) => setApplicableFluids(e.target.value)}
                      placeholder="เช่น:&#10;น้ำมันไฮดรอลิก (Hydraulic Oil ISO VG 32, 46, 68)&#10;น้ำมันหล่อลื่นและเกียร์อุตสาหกรรม (Lube & Gear Oil)&#10;น้ำมันสปาร์ค EDM / Wire Cut"
                      className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden resize-none font-mono bg-white shadow-2xs"
                    />

                    {/* Quick Suggestion Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] text-gray-400 font-medium self-center">คลิกเพิ่มด่วน:</span>
                      {[
                        "น้ำมันไฮดรอลิก (Hydraulic Oil ISO VG 32, 46, 68)",
                        "น้ำยาหล่อเย็นชนิดผสมน้ำ (Water-Soluble Coolant)",
                        "น้ำยาหล่อเย็นกึ่งสังเคราะห์ (Semi-Synthetic)",
                        "น้ำมันตัดกลึงตรง (Neat Cutting Oil)",
                        "น้ำมันสปาร์ค EDM / Wire Cut",
                        "น้ำมันเกียร์และหล่อลื่นรางเลื่อน",
                      ].map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => {
                            setApplicableFluids((prev) =>
                              prev ? (prev.includes(chip) ? prev : `${prev}\n${chip}`) : chip
                            );
                          }}
                          className="px-2 py-0.5 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-600 rounded-md text-[10px] transition cursor-pointer border border-slate-200/60"
                        >
                          + {chip.split(" (")[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Compatible Machinery */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-gray-800">
                      ⚙️ เครื่องจักรในโรงงานที่รองรับ (Compatible Machinery)
                    </label>
                    <p className="text-[10px] text-gray-500 font-light">
                      ระบุประเภทเครื่องจักรที่นำเครื่องนี้ไปใช้ร่วมกันได้ (1 บรรทัดต่อ 1 ชนิดเครื่องจักร)
                    </p>
                    <textarea
                      rows={4}
                      value={compatibleMachinery}
                      onChange={(e) => setCompatibleMachinery(e.target.value)}
                      placeholder="เช่น:&#10;เครื่องฉีดพลาสติก (Plastic Injection Molding)&#10;เครื่องกัด CNC Machining Center (VMC / HMC)&#10;เครื่องกลึง CNC Lathe / Swiss Type"
                      className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden resize-none font-mono bg-white shadow-2xs"
                    />

                    {/* Quick Suggestion Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] text-gray-400 font-medium self-center">คลิกเพิ่มด่วน:</span>
                      {[
                        "เครื่องฉีดพลาสติก (Plastic Injection Molding)",
                        "เครื่องกัด CNC Machining Center (VMC / HMC)",
                        "เครื่องกลึง CNC Lathe / Swiss Type",
                        "เครื่องปั๊มขึ้นรูปโลหะ (Hydraulic Press)",
                        "เครื่องสปาร์ค EDM & Wire Cut",
                        "เครื่องเจียรไน (Grinding Machine)",
                        "ระบบบ่อรวมน้ำยาหล่อเย็นโรงงาน",
                      ].map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => {
                            setCompatibleMachinery((prev) =>
                              prev ? (prev.includes(chip) ? prev : `${prev}\n${chip}`) : chip
                            );
                          }}
                          className="px-2 py-0.5 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-600 rounded-md text-[10px] transition cursor-pointer border border-slate-200/60"
                        >
                          + {chip.split(" (")[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Technical Specifications */}
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                  <Wrench className="w-4 h-4 text-[#219990]" />
                  <h3 className="text-sm font-bold text-gray-900">
                    4. สเปกทางเทคนิค (Technical Specifications)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      ประเภทการกรอง (Type)
                    </label>
                    <input
                      type="text"
                      value={specType}
                      onChange={(e) => setSpecType(e.target.value)}
                      placeholder="เช่น กรองเชิงกายภาพ Pure Physical"
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      อัตราการไหล (Flow Rate)
                    </label>
                    <input
                      type="text"
                      value={flowRate}
                      onChange={(e) => setFlowRate(e.target.value)}
                      placeholder="เช่น 15–20 L/H"
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      ปริมาณการผลิตโอโซน (Ozone Level)
                    </label>
                    <input
                      type="text"
                      value={ozoneLevel}
                      onChange={(e) => setOzoneLevel(e.target.value)}
                      placeholder="เช่น 10000mg/H"
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      ความละเอียดการกรอง (Precision)
                    </label>
                    <input
                      type="text"
                      value={precision}
                      onChange={(e) => setPrecision(e.target.value)}
                      placeholder="เช่น 1 μm"
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      ความจุถังภายใน (Internal Capacity)
                    </label>
                    <input
                      type="text"
                      value={internalCapacity}
                      onChange={(e) => setInternalCapacity(e.target.value)}
                      placeholder="เช่น 100 L"
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      กำลังไฟฟ้า / พลังงาน (Power)
                    </label>
                    <input
                      type="text"
                      value={power}
                      onChange={(e) => setPower(e.target.value)}
                      placeholder="เช่น 220V 50Hz, 370W"
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      ความหนืดน้ำมันที่รองรับ (Viscosity)
                    </label>
                    <input
                      type="text"
                      value={viscosity}
                      onChange={(e) => setViscosity(e.target.value)}
                      placeholder="เช่น 3–52 cSt"
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      แรงดันลม (Air Pressure)
                    </label>
                    <input
                      type="text"
                      value={airPressure}
                      onChange={(e) => setAirPressure(e.target.value)}
                      placeholder="เช่น 0.4–0.5 MPa"
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      ขนาดตัวเครื่อง ก × ย × ส (Dimensions)
                    </label>
                    <input
                      type="text"
                      value={dimensions}
                      onChange={(e) => setDimensions(e.target.value)}
                      placeholder="เช่น 550 × 410 × 1150 mm"
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      น้ำหนัก (Weight)
                    </label>
                    <input
                      type="text"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="เช่น 70 kg"
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Image URL */}
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                  <ImageIcon className="w-4 h-4 text-[#219990]" />
                  <h3 className="text-sm font-bold text-gray-900">5. ลิงก์รูปภาพ (Image URL)</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      วางลิงก์รูปภาพ หรือ Google Drive
                    </label>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://... หรือ /products/lyj-001.jpg"
                      className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden font-mono"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setImageUrl("/products/lyj-001.jpg")}
                        className="text-[10px] px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-md font-mono"
                      >
                        /products/lyj-001.jpg
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageUrl("/products/nxc-zsj-100.jpg")}
                        className="text-[10px] px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-md font-mono"
                      >
                        /products/nxc-zsj-100.jpg
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageUrl("/products/nxc-qzj-116a.jpg")}
                        className="text-[10px] px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-md font-mono"
                      >
                        /products/nxc-qzj-116a.jpg
                      </button>
                    </div>
                  </div>

                  {/* Preview Mini Box */}
                  <div className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-2xl bg-slate-50 min-h-[100px]">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="max-h-20 object-contain rounded-lg"
                        onError={(e) => {
                          (e.target as any).src = "https://placehold.co/200x150?text=Preview";
                        }}
                      />
                    ) : (
                      <span className="text-[10px] text-gray-400">พรีวิวรูปภาพ</span>
                    )}
                  </div>

                  {/* Video URL Input */}
                  <div className="sm:col-span-3 pt-3 border-t border-slate-100">
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="text-red-500">▶️</span>
                        <span>ลิงก์วิดีโอสาธิตการทำงาน (Video Demo URL)</span>
                      </span>
                      <span className="text-[10px] text-gray-400 font-normal">
                        (รองรับ YouTube, Google Drive หรือไฟล์ .mp4)
                      </span>
                    </label>
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="เช่น https://www.youtube.com/watch?v=... หรือ https://youtu.be/..."
                      className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:border-[#219990] outline-hidden font-mono"
                    />
                    <div className="text-[10px] text-gray-400 mt-1">
                      💡 เมื่อระบุลิงก์ ระบบจะแสดงปุ่ม &quot;▶️ ดูคลิปสาธิต&quot; บนการ์ดสินค้าหน้าร้านทันที
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
                >
                  ยกเลิก / ปิดฟอร์ม
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="py-2.5 px-6 bg-[#219990] hover:bg-[#1b7e76] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-[#219990]/25 transition cursor-pointer flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{saving ? "กำลังบันทึก..." : "บันทึกสินค้าลง Firestore"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Header Section */}
        <div className="flex items-center gap-3">
          <div className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-[#219990] text-white shadow-md shadow-[#219990]/20 flex items-center gap-2">
            <Package className="w-4 h-4" />
            <span>จัดการสินค้าในระบบ (Products)</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white">
              {savedProducts.length}
            </span>
          </div>
        </div>

        {/* Dashboard Product Management Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Table Header / Action Bar */}
          <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-gray-900">
                รายการสินค้าในระบบแคตตาล็อก (Catalog Items)
              </h2>
              <p className="text-[11px] sm:text-xs text-gray-500">
                จัดการ เพิ่ม ลบ หรือตรวจสอบความถูกต้องของสินค้าใน Cloud Firestore
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search in table */}
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อ, รหัสรุ่น, SKU..."
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  className="pl-8 pr-3 py-2 sm:py-1.5 text-xs border border-gray-200 rounded-xl outline-hidden focus:border-[#219990] w-full sm:w-60"
                />
              </div>

              <button
                type="button"
                onClick={fetchDashboardData}
                className="px-3.5 py-2 sm:py-1.5 text-xs font-semibold text-gray-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer active:scale-95 touch-manipulation shrink-0"
              >
                รีเฟรช
              </button>
            </div>
          </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              {loadingList ? (
                <div className="p-12 text-center text-xs text-gray-400">กำลังโหลดรายการสินค้า...</div>
              ) : filteredList.length === 0 ? (
                <div className="p-16 text-center text-gray-500 space-y-3">
                  <Package className="w-12 h-12 text-slate-300 mx-auto" />
                  <div className="font-bold text-gray-800">ยังไม่มีสินค้าในฐานข้อมูล</div>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    คลิกที่ปุ่ม &quot;+ เพิ่มสินค้าใหม่&quot; ด้านบนเพื่อเริ่มกรอกข้อมูลสินค้าเข้าสู่ระบบ
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#219990] text-white rounded-xl text-xs font-bold shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>เปิดฟอร์มเพิ่มสินค้า</span>
                  </button>
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-gray-600 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="py-3.5 px-6">รูปภาพ</th>
                      <th className="py-3.5 px-4">รหัสรุ่น / SKU</th>
                      <th className="py-3.5 px-4">ชื่อสินค้า (ไทย)</th>
                      <th className="py-3.5 px-4">หมวดหมู่</th>
                      <th className="py-3.5 px-4 text-right">ราคาขาย (บาท)</th>
                      <th className="py-3.5 px-6 text-center">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredList.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition">
                        {/* Image */}
                        <td className="py-3.5 px-6">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center p-1">
                            <img
                              src={item.images?.[0] || item.imageUrl || "/chicailogo.jpg"}
                              alt={item.names?.th || item.model}
                              className="max-h-full max-w-full object-contain"
                              onError={(e) => {
                                (e.target as any).src = "/chicailogo.jpg";
                              }}
                            />
                          </div>
                        </td>

                        {/* Model & SKU */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-gray-900">{item.model}</div>
                          <div className="text-[10px] font-mono text-gray-400">
                            {item.sku} {item.variant ? `(${item.variant})` : ""}
                          </div>
                          <div className="mt-1">
                            {item.stock_status === "pre_order" ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                ⏳ Pre-order ({item.lead_time || "15-30 วัน"})
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                ✓ มีสินค้า ({item.lead_time || "1-3 วัน"})
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Name */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-gray-800 line-clamp-1">
                            {item.names?.th || "-"}
                          </div>
                          <div className="text-[10px] text-gray-400 line-clamp-1">
                            {item.names?.en || item.names?.zh || ""}
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                            {item.category === "oil-filter"
                              ? "เครื่องกรองน้ำมัน"
                              : item.category === "cutting-fluid"
                              ? "ฟื้นฟูน้ำยาหล่อเย็น"
                              : item.category === "deslagging"
                              ? "กำจัดตะกรันโลหะ"
                              : item.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-4 text-right font-bold text-gray-900 font-mono">
                          ฿{(item.sales_price || 0).toLocaleString()}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              href="/"
                              className="p-1.5 text-gray-400 hover:text-[#219990] transition cursor-pointer"
                              title="ดูหน้าร้าน"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleEditProduct(item)}
                              className="p-1.5 text-gray-400 hover:text-amber-600 transition cursor-pointer"
                              title="แก้ไขข้อมูล / เพิ่ม Application"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id, item.names?.th || item.model)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 transition cursor-pointer"
                              title="ลบสินค้า"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
      </main>
    </div>
  );
}
