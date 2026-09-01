"use client";

import React, { useState, useEffect, useMemo } from "react";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Navbar } from "@/components/Navbar";
import { IndustrialProductCard } from "@/components/IndustrialProductCard";
import { SpecsModal } from "@/components/SpecsModal";
import { VideoModal } from "@/components/VideoModal";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Building2,
  FileText,
  CheckCircle2,
  Package,
  Layers,
  Sparkles,
  BookOpen,
  MapPin,
  Phone,
  Mail,
  User,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { lang, t } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [selectedProductForSpecs, setSelectedProductForSpecs] = useState<any | null>(null);
  const [selectedProductForVideo, setSelectedProductForVideo] = useState<any | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch products from Firestore
  const loadProducts = async () => {
    if (!isFirebaseConfigured || !db) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "products"));
      const list = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setProducts(list);
    } catch (err) {
      console.error("Failed to fetch products from Firestore:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);


  // Category filter tabs
  const categories = [
    {
      id: "all",
      label: t.allCategories,
    },
    {
      id: "oil-filter",
      label: t.oilFilterCategory,
    },
    {
      id: "cutting-fluid",
      label: t.cuttingFluidCategory,
    },
    {
      id: "deslagging",
      label: t.deslaggingCategory,
    },
  ];

  // Filtering products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat =
        selectedCategory === "all" || p.category === selectedCategory;

      const q = searchQuery.toLowerCase();
      const name = (p.names?.[lang] || p.names?.th || "").toLowerCase();
      const model = (p.model || "").toLowerCase();
      const sku = (p.sku || "").toLowerCase();
      const fluids = (p.applicable_fluids || []).join(" ").toLowerCase();
      const machinery = (p.compatible_machinery || []).join(" ").toLowerCase();

      const matchSearch =
        !q ||
        name.includes(q) ||
        model.includes(q) ||
        sku.includes(q) ||
        fluids.includes(q) ||
        machinery.includes(q);

      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchQuery, lang]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-gray-900 text-white text-xs rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="w-4 h-4 text-[#219990] shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Navbar with Language Switcher */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isFirebaseActive={isFirebaseConfigured}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-12">
        {/* Multilingual Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#0d3b37] via-[#145853] to-[#219990] text-white p-6 sm:p-10 md:p-14 shadow-2xl shadow-[#219990]/20 mb-8 sm:mb-10">
          <div className="relative z-10 max-w-3xl">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] sm:text-xs font-semibold mb-4 sm:mb-5 text-emerald-100 border border-white/20">
              <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#219990]" />
              <span>{t.companyName}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {t.heroTitle1} <br className="hidden sm:inline" />
              <span className="text-emerald-300 font-extrabold">{t.heroTitle2}</span>
            </h1>

            {/* Description */}
            <p className="mt-3 sm:mt-4 text-xs sm:text-base text-emerald-50/90 leading-relaxed max-w-2xl font-light">
              {t.heroDesc}
            </p>

            {/* Action Buttons */}
            <div className="mt-6 sm:mt-7 flex flex-wrap items-center gap-2.5 sm:gap-3.5">
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-white text-[#145853] hover:bg-emerald-50 text-xs font-bold rounded-xl shadow-lg transition cursor-pointer hover:scale-[1.02] active:scale-95 touch-manipulation"
              >
                <BookOpen className="w-4 h-4 text-[#219990]" />
                <span>{t.masterCatalogBtn}</span>
              </Link>

              <Link
                href="/admin"
                className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition cursor-pointer backdrop-blur-xs active:scale-95 touch-manipulation"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                <span>{t.adminLink}</span>
              </Link>
            </div>
          </div>

          {/* Decorative background glows */}
          <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-[#219990]/30 blur-3xl" />
          <div className="absolute right-10 -bottom-20 w-80 h-80 rounded-full bg-[#0d3b37]/70 blur-3xl" />
        </div>

        {/* Section Header & Category Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer touch-manipulation active:scale-95 ${
                    active
                      ? "bg-[#219990] text-white shadow-md shadow-[#219990]/25"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-gray-500 font-medium">
            {t.foundProducts(filteredProducts.length)}
          </div>
        </div>

        {/* Product Grid from Firestore */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-3xl border border-slate-200 p-6 animate-pulse space-y-4 shadow-sm"
              >
                <div className="aspect-4/3 bg-slate-200 rounded-2xl" />
                <div className="h-4 bg-slate-200 rounded-md w-1/3" />
                <div className="h-5 bg-slate-200 rounded-md w-3/4" />
                <div className="h-4 bg-slate-100 rounded-md w-full" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm p-8 max-w-xl mx-auto">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">
              {t.noProductsTitle}
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              {t.noProductsDesc}
            </p>
            <Link
              href="/admin"
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-[#219990] hover:bg-[#1b7e76] text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.openAdminBtn}</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <IndustrialProductCard
                key={product.id}
                product={product}
                lang={lang}
                onViewSpecs={(p) => setSelectedProductForSpecs(p)}
                onOpenVideo={(p) => setSelectedProductForVideo(p)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Technical Specs Modal */}
      <SpecsModal
        product={selectedProductForSpecs}
        lang={lang}
        onClose={() => setSelectedProductForSpecs(null)}
      />

      {/* Demonstration Video Modal */}
      <VideoModal
        isOpen={!!selectedProductForVideo}
        onClose={() => setSelectedProductForVideo(null)}
        product={selectedProductForVideo}
      />

      {/* Official Contact Channels Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-[#145853] rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden border border-slate-800">
          {/* Subtle Background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#219990]/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold mb-3 backdrop-blur-xs border border-white/15">
                <span>ช่องทางติดต่อทางการ • Official Channels</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                ปรึกษาวิศวกรผู้เชี่ยวชาญ & สั่งซื้อสินค้า
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                ยินดีให้คำปรึกษาการเลือกเครื่องจักรอุตสาหกรรม กรองน้ำมันหม้อแปลง และอุปกรณ์ไฟฟ้าแรงสูง พร้อมบริการจัดส่งและ On-site Service ทั่วประเทศไทย
              </p>
            </div>

            {/* 3 Digital Channels */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* LINE Direct Contact */}
              <a
                href="https://line.me/ti/p/htYYhK-o1q"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 p-5 rounded-2xl bg-[#06C755]/10 hover:bg-[#06C755]/20 border border-[#06C755]/30 hover:border-[#06C755] transition-all duration-300 cursor-pointer shadow-lg hover:-translate-y-1"
              >
                <div className="p-3 rounded-xl bg-[#06C755] text-white shadow-md shadow-[#06C755]/30 shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 5.82 2 10.53c0 2.91 1.71 5.48 4.32 6.94-.19.67-.68 2.45-.78 2.82-.12.44.16.43.34.31.14-.09 2.22-1.51 3.12-2.12.33.05.66.08 1 .08 5.52 0 10-3.82 10-8.53S17.52 2 12 2zm-4.7 11.23h-1.6c-.22 0-.4-.18-.4-.4v-4.6c0-.22.18-.4.4-.4h1.6c.22 0 .4.18.4.4v.6c0 .22-.18.4-.4.4h-.8v1.1h.8c.22 0 .4.18.4.4v.6c0 .22-.18.4-.4.4h-.8v1.1h.8c.22 0 .4.18.4.4v.6c0 .22-.18.4-.4.4zm2.8 0h-.8c-.22 0-.4-.18-.4-.4v-4.6c0-.22.18-.4.4-.4h.8c.22 0 .4.18.4.4v4.6c0 .22-.18.4-.4.4zm4.4 0h-.8c-.16 0-.3-.09-.36-.24l-1.8-2.6v2.44c0 .22-.18.4-.4.4h-.8c-.22 0-.4-.18-.4-.4v-4.6c0-.22.18-.4.4-.4h.8c.16 0 .3.09.36.24l1.8 2.6V8.23c0-.22.18-.4.4-.4h.8c.22 0 .4.18.4.4v4.6c0 .22-.18.4-.4.4zm3.6-3.2h-.8v1.1h.8c.22 0 .4.18.4.4v.6c0 .22-.18.4-.4.4h-1.6c-.22 0-.4-.18-.4-.4v-4.6c0-.22.18-.4.4-.4h1.6c.22 0 .4.18.4.4v.6c0 .22-.18.4-.4.4h-.8v1.1h.8c.22 0 .4.18.4.4v.6c0 .22-.18.4-.4.4z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white">LINE</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#06C755] text-white">แชตด่วน</span>
                  </div>
                  <p className="text-xs text-emerald-300 mt-1 font-mono truncate">คุณเอกชัย หาบ้านแท่น (Max)</p>
                  <p className="text-[11px] text-slate-300 mt-1.5 leading-snug">
                    แชตปรึกษาสเปกและสั่งซื้อสินค้ากับคุณเอกชัยโดยตรง
                  </p>
                </div>
              </a>

              {/* Facebook Page */}
              <a
                href="https://www.facebook.com/chicai.thailand"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 p-5 rounded-2xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/30 hover:border-[#1877F2] transition-all duration-300 cursor-pointer shadow-lg hover:-translate-y-1"
              >
                <div className="p-3 rounded-xl bg-[#1877F2] text-white shadow-md shadow-[#1877F2]/30 shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white">Facebook</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1877F2] text-white">ติดตาม</span>
                  </div>
                  <p className="text-xs text-blue-300 mt-1 font-mono truncate">chicai.thailand</p>
                  <p className="text-[11px] text-slate-300 mt-1.5 leading-snug">
                    ภาพการส่งมอบเครื่องจักรหน้างานจริง และผลงานการบริการ
                  </p>
                </div>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/chicai.thailand/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 p-5 rounded-2xl bg-[#E4405F]/10 hover:bg-[#E4405F]/20 border border-[#E4405F]/30 hover:border-[#E4405F] transition-all duration-300 cursor-pointer shadow-lg hover:-translate-y-1"
              >
                <div className="p-3 rounded-xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white shadow-md shadow-[#E4405F]/30 shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white">Instagram</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E4405F] text-white">Follow</span>
                  </div>
                  <p className="text-xs text-pink-300 mt-1 font-mono truncate">@chicai.thailand</p>
                  <p className="text-[11px] text-slate-300 mt-1.5 leading-snug">
                    แกลเลอรีภาพถ่ายสินค้า งานผลิต และคลิปวิดีโอสาธิต
                  </p>
                </div>
              </a>
            </div>

            {/* Corporate Info Bar: Address, Phone, Contact Person, Email */}
            <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {/* Address */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-[11px]">ที่ตั้งสำนักงานใหญ่</div>
                  <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                    75/2 ชั้นที่ 3 หมู่ที่ 12 ต.บางพลีใหญ่ อ.บางพลี จ.สมุทรปราการ 10540
                  </p>
                </div>
              </div>

              {/* Sales Representative */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <User className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-[11px]">ฝ่ายขาย / ผู้ประสานงาน</div>
                  <div className="text-white font-medium text-[11px] mt-0.5">
                    คุณเอกชัย หาบ้านแท่น (Max)
                  </div>
                  <a
                    href="tel:0924797666"
                    className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold text-xs mt-1"
                    title="โทรหาฝ่ายขายทันที"
                  >
                    <Phone className="w-3 h-3" />
                    <span>092-479-7666</span>
                  </a>
                </div>
              </div>

              {/* Office Tel */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-[11px]">เบอร์โทรศัพท์สำนักงาน</div>
                  <a
                    href="tel:021307590"
                    className="block text-slate-200 hover:text-white font-semibold text-xs mt-0.5"
                    title="โทรเข้าสำนักงาน"
                  >
                    02-1307590-91
                  </a>
                  <p className="text-[10px] text-emerald-400 font-medium mt-0.5">เวลาทำการ: จ-ศ 08.00-17.00</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-[11px]">อีเมลติดต่อ (Email)</div>
                  <a
                    href="mailto:akachai.chaicai@gmail.com"
                    className="block text-slate-200 hover:text-white font-mono text-[11px] mt-0.5 break-all hover:underline"
                    title="ส่งอีเมลติดต่อ"
                  >
                    akachai.chaicai@gmail.com
                  </a>
                  <p className="text-[10px] text-slate-400 mt-0.5">ส่งสเปก / เอกสารทางการ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Footer */}
      <footer className="mt-auto border-t border-gray-200 bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src="/chicailogo.jpg" alt="Chicai Logo" className="h-10 w-10 object-contain rounded-xl border border-slate-200" />
              <div>
                <span className="font-bold text-gray-900 text-sm">
                  {t.companyName}
                </span>
                <p className="text-gray-500 font-mono text-[11px]">
                  {t.companySubName}
                </p>
              </div>
            </div>

            {/* Social Links Pills */}
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href="https://line.me/ti/p/htYYhK-o1q"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#06C755] text-xs font-bold transition border border-emerald-200"
                title="แชตติดต่อคุณเอกชัยทาง LINE"
              >
                <span className="font-black text-sm">💬</span>
                <span>LINE</span>
              </a>

              <a
                href="https://www.facebook.com/chicai.thailand"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1877F2] text-xs font-bold transition border border-blue-200"
                title="Facebook"
              >
                <span className="font-black text-sm">f</span>
                <span>Facebook</span>
              </a>

              <a
                href="https://www.instagram.com/chicai.thailand/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-[#E4405F] text-xs font-bold transition border border-pink-200"
                title="Instagram"
              >
                <span className="font-black text-sm">📷</span>
                <span>Instagram</span>
              </a>

              <a
                href="tel:0924797666"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition border border-slate-200"
                title="โทรหาฝ่ายขาย"
              >
                <Phone className="w-3.5 h-3.5 text-[#219990]" />
                <span>092-479-7666</span>
              </a>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-gray-500">
            <div>
              สำนักงาน: 75/2 ชั้นที่ 3 หมู่ที่ 12 ต.บางพลีใหญ่ อ.บางพลี จ.สมุทรปราการ 10540 • โทร: 02-1307590-91 • เวลาทำการ: จ-ศ 08.00-17.00
            </div>
            <div className="text-gray-400">
              © {new Date().getFullYear()} {t.companySubName}. {t.copyright}.
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Speed LINE Contact Button */}
      <a
        href="https://line.me/ti/p/htYYhK-o1q"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-[#06C755] hover:bg-[#05b34c] text-white rounded-full shadow-2xl hover:shadow-[#06C755]/50 hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white cursor-pointer group touch-manipulation"
        title="แชตติดต่อคุณเอกชัยทาง LINE"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <span className="text-sm leading-none font-black">💬</span>
        <span className="font-bold text-xs tracking-wide">แชตทาง LINE</span>
      </a>
    </div>
  );
}
