"use client";

import React from "react";
import Link from "next/link";
import { Settings, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/lib/i18n";

const ThaiFlag = () => (
  <svg className="w-4 h-3 rounded-2xs shadow-2xs shrink-0" viewBox="0 0 900 600">
    <rect width="900" height="600" fill="#A51931" />
    <rect y="100" width="900" height="400" fill="#F4F5F8" />
    <rect y="200" width="900" height="200" fill="#2D2A4A" />
  </svg>
);

const ChinaFlag = () => (
  <svg className="w-4 h-3 rounded-2xs shadow-2xs shrink-0" viewBox="0 0 900 600">
    <rect width="900" height="600" fill="#DE2910" />
    <polygon points="150,90 162,126 200,126 169,148 181,185 150,162 119,185 131,148 100,126 138,126" fill="#FFDE00" />
    <polygon points="300,50 304,63 317,63 306,71 310,83 300,76 290,83 294,71 283,63 296,63" fill="#FFDE00" />
    <polygon points="360,100 364,113 377,113 366,121 370,133 360,126 350,133 354,121 343,113 356,113" fill="#FFDE00" />
    <polygon points="360,180 364,193 377,193 366,201 370,213 360,206 350,213 354,201 343,193 356,193" fill="#FFDE00" />
    <polygon points="300,230 304,243 317,243 306,251 310,263 300,256 290,263 294,251 283,243 296,243" fill="#FFDE00" />
  </svg>
);

const UKFlag = () => (
  <svg className="w-4 h-3 rounded-2xs shadow-2xs shrink-0" viewBox="0 0 60 30">
    <rect width="60" height="30" fill="#012169" />
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2" />
    <path d="M30,0 v30 M0,15 h60" stroke="#FFFFFF" strokeWidth="10" />
    <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
  </svg>
);

interface NavbarProps {
  isFirebaseActive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const { lang, setLang, t } = useLanguage();

  const languages: { code: Language; short: string; label: string; Flag: React.ComponentType }[] = [
    { code: "th", short: "TH", label: "ไทย", Flag: ThaiFlag },
    { code: "zh", short: "CN", label: "中文", Flag: ChinaFlag },
    { code: "en", short: "EN", label: "EN", Flag: UKFlag },
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
            <div className="hidden sm:block min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-lg font-black text-slate-900 tracking-tight group-hover:text-[#219990] transition-colors truncate">
                  {t.companyName}
                </span>
                <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-[#219990]/10 text-[#145853] border border-[#219990]/20 uppercase tracking-wide">
                  <Sparkles className="w-2.5 h-2.5 text-[#219990]" />
                  {t.b2bBadge}
                </span>
              </div>
              <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400 tracking-wide font-mono uppercase truncate">
                {t.companySubName}
              </div>
            </div>
          </Link>

          {/* Right Navigation & Action Cluster */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
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

            {/* Segmented Language Switcher with National Flags */}
            <div className="flex items-center bg-slate-100 p-0.5 sm:p-1 rounded-xl border border-slate-200/80">
              {languages.map((l) => {
                const isActive = lang === l.code;
                const Flag = l.Flag;
                return (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] font-bold rounded-lg transition-all cursor-pointer touch-manipulation active:scale-95 ${
                      isActive
                        ? "bg-white text-[#145853] shadow-xs ring-1 ring-slate-200/80 font-black"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                    title={l.label}
                  >
                    <Flag />
                    <span>{l.short}</span>
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
