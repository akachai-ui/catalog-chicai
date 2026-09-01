"use client";

import React from "react";
import Link from "next/link";
import { Globe, Settings, BookOpen, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/lib/i18n";

interface NavbarProps {
  isFirebaseActive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const { lang, setLang, t } = useLanguage();

  const languages: { code: Language; short: string; label: string }[] = [
    { code: "th", short: "TH", label: "ไทย" },
    { code: "zh", short: "中", label: "中文" },
    { code: "en", short: "EN", label: "EN" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Brand Logo & Corporate Info */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 group shrink min-w-0">
            <div className="relative flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-white p-1 border border-slate-200/90 shadow-xs group-hover:border-[#219990]/40 group-hover:shadow-md transition-all duration-300 shrink-0">
              <img
                src="/chicailogo.jpg"
                alt="ฉี ไฉ่ อิเล็คทริค"
                className="h-full w-full object-contain rounded-lg sm:rounded-xl"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-lg font-black text-slate-900 tracking-tight group-hover:text-[#219990] transition-colors truncate">
                  <span className="sm:hidden">ฉี ไฉ่ อิเล็คทริค</span>
                  <span className="hidden sm:inline">{t.companyName}</span>
                </span>
                <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-[#219990]/10 text-[#145853] border border-[#219990]/20 uppercase tracking-wide">
                  <Sparkles className="w-2.5 h-2.5 text-[#219990]" />
                  {t.b2bBadge}
                </span>
              </div>
              <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400 tracking-wide font-mono uppercase truncate hidden sm:block">
                {t.companySubName}
              </div>
            </div>
          </Link>

          {/* Right Navigation & Action Cluster */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Master Catalog Action Link */}
            <Link
              href="/catalog"
              className="p-2 sm:px-3.5 sm:py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer border border-slate-200/80 flex items-center gap-1.5 active:scale-95 touch-manipulation"
              title={t.masterCatalogBtn}
            >
              <BookOpen className="w-4 h-4 text-[#219990]" />
              <span className="hidden lg:inline">{t.masterCatalogBtn}</span>
            </Link>

            {/* Direct LINE Contact Button */}
            <a
              href="https://line.me/ti/p/htYYhK-o1q"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 sm:px-3.5 py-2 bg-[#06C755] hover:bg-[#05b34c] text-white text-xs font-bold rounded-xl shadow-md shadow-[#06C755]/25 transition cursor-pointer flex items-center gap-1 sm:gap-1.5 active:scale-95 touch-manipulation"
              title="แชตติดต่อคุณเอกชัยทาง LINE"
            >
              <span className="text-sm leading-none font-black">💬</span>
              <span className="hidden sm:inline">LINE</span>
            </a>

            {/* Minimalist Segmented Language Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 sm:p-1 rounded-xl border border-slate-200/80">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1 hidden md:block" />
              {languages.map((l) => {
                const isActive = lang === l.code;
                return (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={`px-1.5 sm:px-2.5 py-1 text-[10px] sm:text-[11px] font-bold rounded-lg transition-all cursor-pointer touch-manipulation ${
                      isActive
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                    title={l.label}
                  >
                    {l.short}
                  </button>
                );
              })}
            </div>

            {/* Subtle Admin Portal Icon Button */}
            <Link
              href="/admin"
              className="p-2 sm:p-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition cursor-pointer active:scale-95 touch-manipulation"
              title="เข้าสู่ระบบจัดการสินค้าหลังบ้าน (Admin Dashboard)"
            >
              <Settings className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
