import {
  collection,
  getDocs,
  doc,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { Product } from "@/types/product";

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "prod-lyj-001-single",
    sku: "LYJ-001 (Single cylinder)",
    name: "เครื่องกรองน้ำมัน Oil Filter (Single cylinder) รุ่น LYJ-001",
    description: "เครื่องกรองน้ำมันอุตสาหกรรมระบบกระบอกเดี่ยว (Single Cylinder) ออกแบบสำหรับกรองน้ำมันไฮดรอลิก น้ำมันหล่อลื่น และน้ำมันเครื่องจักร กำจัดอนุภาคตะกอน ความชื้น และสิ่งสกปรกขนาดเล็ก ยืดอายุการใช้งานน้ำมันได้ 3-5 เท่า ช่วยลดต้นทุนการเปลี่ยนถ่ายน้ำมันได้มากกว่า 70% และลดการสึกหรอของวาล์วกับปั๊มไฮดรอลิกในโรงงาน",
    price: 45000,
    originalPrice: 52000,
    category: "เครื่องกรองน้ำมัน (Oil Filter)",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60",
    stock: 15,
    minimumOrder: 1,
    leadTime: "พร้อมส่ง 1-3 วันทำการ",
    warranty: "รับประกัน 2 ปี พร้อม On-site Service ดูแลถึงหน้างาน",
    certifications: ["ISO 9001:2015", "CE Standard", "RoHS"],
    bulkPricing: [
      { minQty: 1, pricePerUnit: 45000 },
      { minQty: 3, pricePerUnit: 41500 },
      { minQty: 5, pricePerUnit: 38500 },
    ],
    rating: 4.9,
    reviewCount: 26,
    tags: ["กระบอกเดี่ยว", "กรองน้ำมันไฮดรอลิก", "ประหยัดค่าเปลี่ยนน้ำมัน 70%"],
    featured: true,
  },
  {
    id: "prod-lyj-001-double",
    sku: "LYJ-001 (Double cylinder)",
    name: "เครื่องกรองน้ำมัน Oil Filter (Double cylinder) รุ่น LYJ-001",
    description: "เครื่องกรองน้ำมันอุตสาหกรรมระบบกระบอกคู่ (Double Cylinder Duplex System) สำหรับสายการผลิตที่ต้องเดินเครื่องต่อเนื่อง 24 ชั่วโมง สามารถสลับกระบอกทำงานเพื่อเปลี่ยนไส้กรองได้ทันทีโดยไม่ต้องหยุดการทำงานของเครื่องจักร (Non-stop operation) อัตราการไหลสูง กรองความชื้นและฝุ่นละอองโลหะได้อย่างมีประสิทธิภาพสูงสุด",
    price: 78000,
    originalPrice: 89000,
    category: "เครื่องกรองน้ำมัน (Oil Filter)",
    imageUrl: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=60",
    stock: 10,
    minimumOrder: 1,
    leadTime: "พร้อมส่ง 1-3 วันทำการ",
    warranty: "รับประกัน 2 ปี พร้อม On-site Service ดูแลถึงหน้างาน",
    certifications: ["ISO 9001:2015", "CE Standard"],
    bulkPricing: [
      { minQty: 1, pricePerUnit: 78000 },
      { minQty: 3, pricePerUnit: 72000 },
      { minQty: 5, pricePerUnit: 67000 },
    ],
    rating: 4.9,
    reviewCount: 34,
    tags: ["กระบอกคู่ Duplex", "ทำงานต่อเนื่อง 24 ชม.", "เปลี่ยนไส้กรองไม่ต้องหยุดเครื่อง"],
    featured: true,
  },
  {
    id: "prod-nxc-zsj-100-100l",
    sku: "NXC-ZSJ-100 (100 L)",
    name: "เครื่องกรองและฟื้นฟูน้ำยาหล่อเย็น 100 L (Cutting Fluid Filtration & Regeneration)",
    description: "ระบบบำบัดและฟื้นฟูสภาพน้ำยาคูลแลนท์ (Coolant / Cutting Fluid) ขนาดความจุ 100 ลิตร สำหรับเครื่องจักร CNC เครื่องกลึง และเครื่องกัดโลหะ ทำหน้าที่แยกน้ำมันแปลกปลอมบนผิวน้ำ (Tramp Oil) ดักจับเศษโลหะละเอียด กำจัดแบคทีเรียและกลิ่นเหม็นเน่า คืนความสะอาดและสมดุลค่า pH ทำให้น้ำยาหล่อเย็นนำกลับมาหมุนเวียนใช้ซ้ำได้ยาวนาน",
    price: 85000,
    originalPrice: 98000,
    category: "เครื่องกรองน้ำยาหล่อเย็น (Cutting Fluid)",
    imageUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=60",
    stock: 12,
    minimumOrder: 1,
    leadTime: "พร้อมส่ง 2-3 วันทำการ",
    warranty: "รับประกัน 2 ปี พร้อม On-site Service",
    certifications: ["ISO 9001", "CE", "มอก."],
    bulkPricing: [
      { minQty: 1, pricePerUnit: 85000 },
      { minQty: 2, pricePerUnit: 79000 },
      { minQty: 4, pricePerUnit: 73000 },
    ],
    rating: 4.8,
    reviewCount: 19,
    tags: ["ความจุ 100 ลิตร", "แยก Tramp Oil", "ขจัดกลิ่นเหม็นเน่า", "CNC คูลแลนท์"],
    featured: true,
  },
  {
    id: "prod-nxc-zsj-100-500l",
    sku: "NXC-ZSJ-100 (500 L)",
    name: "เครื่องกรองและฟื้นฟูน้ำยาหล่อเย็น 500 L (Cutting Fluid Filtration & Regeneration)",
    description: "ระบบบำบัดและฟื้นฟูสภาพน้ำยาคูลแลนท์ขนาดใหญ่ ความจุ 500 ลิตร ออกแบบสำหรับโรงงานอุตสาหกรรมขนาดใหญ่ที่มีเครื่องจักร CNC จำนวนมาก หรือใช้ระบบถังหล่อเย็นรวม (Centralized Coolant Tank) อัตราการไหลสูง บำบัดและกำจัดสิ่งปนเปื้อนได้อย่างรวดเร็ว ช่วยประหยัดงบประมาณการซื้อน้ำยาใหม่ได้มหาศาล และลดภาระค่าบำบัดของเสียอันตราย",
    price: 165000,
    originalPrice: 189000,
    category: "เครื่องกรองน้ำยาหล่อเย็น (Cutting Fluid)",
    imageUrl: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=800&auto=format&fit=crop&q=60",
    stock: 8,
    minimumOrder: 1,
    leadTime: "พร้อมส่ง 3-5 วันทำการ",
    warranty: "รับประกัน 2 ปี พร้อม On-site Service ดูแลถึงหน้างาน",
    certifications: ["ISO 9001:2015", "CE Standard", "Industrial Green Solution"],
    bulkPricing: [
      { minQty: 1, pricePerUnit: 165000 },
      { minQty: 2, pricePerUnit: 153000 },
      { minQty: 3, pricePerUnit: 142000 },
    ],
    rating: 4.9,
    reviewCount: 22,
    tags: ["ความจุ 500 ลิตร", "ระบบหล่อเย็นรวม Centralized", "คืนทุนไวใน 3-6 เดือน"],
    featured: true,
  },
  {
    id: "prod-nxc-qzj-116a",
    sku: "NXC-QZJ-116A",
    name: "เครื่องกำจัดตะกรันและเศษโลหะ Deslagging Machine รุ่น NXC-QZJ-116A",
    description: "เครื่องดูดและแยกตะกรัน ขี้โลหะ (Slag) เศษผงเจียร และตะกอนก้นถังน้ำมันหรือถังน้ำยาหล่อเย็นเครื่องจักรความเร็วสูง สามารถทำงานดูดทำความสะอาดถังได้ทันทีโดยไม่ต้องถ่ายน้ำยาออกและไม่ต้องหยุดการทำงานของเครื่องจักร (Online Cleaning) แยกเศษโลหะแข็งได้อย่างหมดจด ป้องกันหัวฉีดอุดตัน ยืดอายุการใช้งานเครื่องมือตัด (Cutting Tool)",
    price: 59000,
    originalPrice: 68000,
    category: "เครื่องกำจัดตะกรันและเศษโลหะ (Deslagging)",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60",
    stock: 18,
    minimumOrder: 1,
    leadTime: "พร้อมส่ง 1-2 วันทำการ",
    warranty: "รับประกัน 2 ปี พร้อม On-site Service",
    certifications: ["ISO 9001", "CE Certified"],
    bulkPricing: [
      { minQty: 1, pricePerUnit: 59000 },
      { minQty: 3, pricePerUnit: 54000 },
      { minQty: 5, pricePerUnit: 49500 },
    ],
    rating: 4.8,
    reviewCount: 31,
    tags: ["ดูดตะกอนก้นถัง", "ไม่ต้องหยุดเครื่องจักร", "ป้องกันหัวฉีดตัน", "แยกเศษโลหะ"],
    featured: true,
  },
];

export const CATEGORIES = [
  "ทั้งหมด",
  "เครื่องกรองน้ำมัน (Oil Filter)",
  "เครื่องกรองน้ำยาหล่อเย็น (Cutting Fluid)",
  "เครื่องกำจัดตะกรันและเศษโลหะ (Deslagging)",
];

const COLLECTION_NAME = "products";
const RFQ_COLLECTION = "quotations";

export async function fetchProducts(): Promise<Product[]> {
  if (!isFirebaseConfigured || !db) {
    return SAMPLE_PRODUCTS;
  }

  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return SAMPLE_PRODUCTS;
    }

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        sku: data.sku ?? `SKU-${docSnap.id.slice(0, 6)}`,
        name: data.name ?? "",
        description: data.description ?? "",
        price: Number(data.price) || 0,
        originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
        category: data.category ?? "เครื่องกรองน้ำมัน (Oil Filter)",
        imageUrl: data.imageUrl ?? "",
        stock: Number(data.stock) || 0,
        stock_status: data.stock_status ?? (Number(data.stock) === 0 ? "pre_order" : "in_stock"),
        lead_time: data.lead_time ?? data.leadTime ?? "พร้อมส่ง 1-3 วันทำการ",
        minimumOrder: Number(data.minimumOrder) || 1,
        leadTime: data.lead_time ?? data.leadTime ?? "พร้อมส่ง 1-3 วันทำการ",
        warranty: data.warranty ?? "รับประกัน 2 ปี On-site Service",
        video_url: data.video_url || data.videoUrl || "",
        certifications: Array.isArray(data.certifications) ? data.certifications : [],
        bulkPricing: Array.isArray(data.bulkPricing) ? data.bulkPricing : [],
        rating: data.rating ? Number(data.rating) : 5,
        reviewCount: data.reviewCount ? Number(data.reviewCount) : 0,
        tags: Array.isArray(data.tags) ? data.tags : [],
        featured: Boolean(data.featured),
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : undefined,
      };
    });
  } catch (error) {
    console.warn("Firestore fetch fallback to sample data:", error);
    return SAMPLE_PRODUCTS;
  }
}

export async function addProduct(
  productData: Omit<Product, "id">
): Promise<string> {
  if (!isFirebaseConfigured || !db) {
    throw new Error("ยังไม่ได้ตั้งค่า Firebase ใน .env.local");
  }

  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...productData,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function deleteProduct(productId: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    throw new Error("ยังไม่ได้ตั้งค่า Firebase ใน .env.local");
  }
  await deleteDoc(doc(db, COLLECTION_NAME, productId));
}

export async function submitRFQ(rfqData: {
  company: {
    companyName: string;
    taxId: string;
    address?: string;
    contactName: string;
    email: string;
    phone: string;
    department: string;
    note?: string;
  };
  items: {
    productId: string;
    sku: string;
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
    warranty?: string;
    stock_status?: string;
    lead_time?: string;
  }[];
  totalEstimated: number;
}): Promise<string> {
  if (!isFirebaseConfigured || !db) {
    return `RFQ-CCE-${Date.now().toString().slice(-6)}`;
  }

  const docRef = await addDoc(collection(db, RFQ_COLLECTION), {
    ...rfqData,
    issuer: "บริษัท ฉี ไฉ่ อิเล็คทริค (ประเทศไทย) จำกัด",
    status: "รอจัดทำใบเสนอราคาทางการ",
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function seedSampleProductsToFirebase(): Promise<number> {
  if (!isFirebaseConfigured || !db) {
    throw new Error("ยังไม่ได้ตั้งค่า Firebase ใน .env.local");
  }

  let count = 0;
  for (const item of SAMPLE_PRODUCTS) {
    const { id: _, ...rest } = item;
    await addDoc(collection(db, COLLECTION_NAME), {
      ...rest,
      createdAt: serverTimestamp(),
    });
    count++;
  }
  return count;
}
