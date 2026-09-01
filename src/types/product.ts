export interface BulkPriceTier {
  minQty: number;
  pricePerUnit: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  imageUrl: string;
  stock: number;
  stock_status?: "in_stock" | "pre_order"; // "in_stock" (มีสินค้า) หรือ "pre_order" (สั่งจอง)
  lead_time?: string; // เช่น "พร้อมส่ง 1-3 วันทำการ", "Pre-order 15-30 วันทำการ"
  minimumOrder: number; // MOQ (Minimum Order Quantity)
  leadTime?: string; // รองรับ backward compatibility
  warranty: string; // เช่น "รับประกัน 2 ปี On-site"
  video_url?: string; // ลิงก์คลิปวิดีโอสาธิต เช่น YouTube หรือ MP4
  certifications?: string[]; // เช่น ["ISO 9001", "CE", "RoHS"]
  bulkPricing?: BulkPriceTier[];
  datasheetUrl?: string;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  applicable_fluids?: string[];
  compatible_machinery?: string[];
  featured?: boolean;
  createdAt?: string | Date;
}

export interface RFQItem {
  product: Product;
  quantity: number;
}

export interface RFQForm {
  companyName: string;
  taxId: string;
  address?: string;
  contactName: string;
  email: string;
  phone: string;
  department: string;
  note?: string;
}

export type Category = {
  id: string;
  name: string;
  icon?: string;
};
