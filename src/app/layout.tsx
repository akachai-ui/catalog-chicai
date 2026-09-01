import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "บริษัท ฉี ไฉ่ อิเล็คทริค (ประเทศไทย) จำกัด | แคตตาล็อกสินค้าและระบบขอใบเสนอราคา B2B",
  description: "แคตตาล็อกอุปกรณ์และระบบไฟฟ้า โซลูชันระดับองค์กร โดย บริษัท ฉี ไฉ่ อิเล็คทริค (ประเทศไทย) จำกัด สำหรับฝ่ายจัดซื้อและผู้บริหาร",
  icons: {
    icon: "/chicailogo.jpg",
  },
};

import { Providers } from "@/components/Providers";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
