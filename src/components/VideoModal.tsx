"use client";

import React from "react";
import { X, FileText, Check, ShieldCheck, Clock, ExternalLink } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any | null;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  if (!isOpen || !product || !product.video_url) return null;

  const rawUrl = product.video_url.trim();

  // Helper to extract YouTube embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    const ytMatch = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
    );
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
    }
    return null;
  };

  // Helper to extract Google Drive embed URL
  const getGoogleDriveEmbedUrl = (url: string) => {
    if (!url.includes("drive.google.com")) return null;
    const driveMatch1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch1 && driveMatch1[1]) {
      return `https://drive.google.com/file/d/${driveMatch1[1]}/preview`;
    }
    const driveMatch2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (driveMatch2 && driveMatch2[1]) {
      return `https://drive.google.com/file/d/${driveMatch2[1]}/preview`;
    }
    return null;
  };

  const ytEmbedUrl = getYouTubeEmbedUrl(rawUrl);
  const driveEmbedUrl = getGoogleDriveEmbedUrl(rawUrl);

  const title =
    product.names?.th || product.name || product.model || "วิดีโอสาธิตการทำงาน";
  const sku = product.sku || product.model;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80 z-10 flex flex-col max-h-[95vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center font-bold">
              ▶
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400">
                วิดีโอสาธิตการทำงานจริง (Live Machine Demo)
              </div>
              <h3 className="text-base font-bold text-white tracking-tight line-clamp-1">
                {title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block px-3 py-1 bg-slate-800 text-slate-300 text-xs font-mono font-bold rounded-lg border border-slate-700">
              SKU: {sku}
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Box */}
        <div className="relative aspect-16/9 w-full bg-black flex items-center justify-center">
          {ytEmbedUrl ? (
            <iframe
              src={ytEmbedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : driveEmbedUrl ? (
            <iframe
              src={driveEmbedUrl}
              title={title}
              allow="autoplay"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <video
              src={rawUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            >
              เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอนี้
            </video>
          )}
        </div>

        {/* Modal Footer (Sales Actions & Info) */}
        <div className="px-6 py-4 bg-slate-950/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Machine Highlights */}
          <div className="flex items-center gap-3 text-xs text-slate-300 flex-wrap">
            <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>{product.warranty || "รับประกัน 2 ปี On-site"}</span>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
              <Clock className="w-4 h-4" />
              <span>{product.lead_time || "พร้อมส่ง 1-3 วันทำการ"}</span>
            </span>
            <span>•</span>
            <span className="text-slate-400 font-mono">
              ฿{(product.sales_price || product.price || 0).toLocaleString()} (ไม่รวม VAT)
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <a
              href={rawUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>เปิดคลิปต้นฉบับ</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
