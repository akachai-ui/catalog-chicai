import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import * as fs from "fs";
import * as path from "path";

// Read .env.local manually
const envPath = path.resolve(process.cwd(), ".env.local");
let env = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...val] = trimmed.split("=");
      env[key.trim()] = val.join("=").trim();
    }
  });
}

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log("Connecting to Firebase project:", firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const PRODUCTS = [
  {
    id: "lyj-001-single",
    model: "LYJ-001",
    variant: "Single cylinder",
    sku: "LYJ-001-S",
    category: "oil-filter",
    sales_price: 65000,
    names: {
      th: "เครื่องกรองน้ำมัน (กระบอกเดี่ยว)",
      en: "Oil filter (single cylinder)",
      zh: "工业滤油机 (单筒型)",
    },
    key_features: {
      th: "รองรับน้ำมันไฮดรอลิก, ตัดเฉือน, EDM, เกียร์ นำกลับมาหมุนเวียนใช้ใหม่เพื่อลดต้นทุน",
      en: "Supports hydraulic, cutting, EDM, and gear oil. Recycle and reuse to reduce operational costs.",
      zh: "支持液压油、切削油、火花机油(EDM)、齿轮油循环过滤再生，大幅降低换油成本。",
    },
    specs: {
      type: "กรองเชิงกายภาพ Pure Physical (ไม่ใช้สารเคมี)",
      flowRate: "15–20 L/H",
      ozoneLevel: "-",
      precision: "1 μm",
      internalCapacity: "-",
      power: "220V 50Hz, 370W",
      viscosity: "3–52 cSt",
      airPressure: "-",
      dimensions: "550 × 410 × 1150 mm",
      weight: "-",
    },
    images: ["https://lh3.googleusercontent.com/d/1wOIuB5eI7kbsZfi_b2s75V2jBgKCp8_4"],
    featured: true,
    isActive: true,
  },
  {
    id: "lyj-001-double",
    model: "LYJ-001",
    variant: "Double cylinder",
    sku: "LYJ-001-D",
    category: "oil-filter",
    sales_price: 82000,
    names: {
      th: "เครื่องกรองน้ำมัน (กระบอกคู่)",
      en: "Oil filter (double cylinder)",
      zh: "工业滤油机 (双筒连续型)",
    },
    key_features: {
      th: "รองรับน้ำมันไฮดรอลิก, ตัดเฉือน, EDM, เกียร์ นำกลับมาหมุนเวียนใช้ใหม่เพื่อลดต้นทุน กรองต่อเนื่อง 24 ชม.",
      en: "Supports hydraulic, cutting, EDM, and gear oil. Non-stop continuous 24h filtration.",
      zh: "双筒连续工作，无需停机即可换芯，大幅降低液压油更换成本。",
    },
    specs: {
      type: "กรองเชิงกายภาพ Pure Physical (ไม่ใช้สารเคมี)",
      flowRate: "15–20 L/H",
      ozoneLevel: "-",
      precision: "1 μm",
      internalCapacity: "-",
      power: "220V 50Hz, 370W",
      viscosity: "3–52 cSt",
      airPressure: "-",
      dimensions: "550 × 410 × 1150 mm",
      weight: "-",
    },
    images: ["https://lh3.googleusercontent.com/d/1wOIuB5eI7kbsZfi_b2s75V2jBgKCp8_4"],
    featured: true,
    isActive: true,
  },
  {
    id: "nxc-zsj-100-100l",
    model: "NXC-ZSJ-100",
    variant: "100 L",
    sku: "NXC-ZSJ-100-100L",
    category: "cutting-fluid",
    sales_price: 175000,
    names: {
      th: "เครื่องกรองและฟื้นฟูน้ำยาหล่อเย็น 100 L",
      en: "Cutting Fluid Filtration & Regeneration (100 L)",
      zh: "切削液净化再生机 100 L",
    },
    key_features: {
      th: "แก้ปัญหาน้ำยาเสื่อมสภาพ/กลิ่นเหม็น ผลิตโอโซน 10,000 mg/H แยกน้ำมันลอยและฆ่าเชื้อแบคทีเรีย",
      en: "Eliminates deterioration & odor with 10,000 mg/H ozone. Separates tramp oil & bacteria.",
      zh: "内置臭氧10000mg/H高效除臭杀菌，油水分离，解决切削液发黑发臭问题。",
    },
    specs: {
      type: "แยกน้ำมันลอย + กรองเศษ + ฆ่าเชื้อด้วยโอโซน",
      flowRate: "100 L/H",
      ozoneLevel: "10000mg/H",
      precision: "10–150 μm (Optional)",
      internalCapacity: "100 L",
      power: "220V 50Hz, <= 200W",
      viscosity: "-",
      airPressure: "0.4–0.5 MPa",
      dimensions: "850 × 420 × 950 mm",
      weight: "-",
    },
    images: ["https://lh3.googleusercontent.com/d/1vv5T0LdGzbvhtc2hfiEIHOxQeLgGV4io"],
    featured: true,
    isActive: true,
  },
  {
    id: "nxc-zsj-100-500l",
    model: "NXC-ZSJ-100",
    variant: "500 L",
    sku: "NXC-ZSJ-100-500L",
    category: "cutting-fluid",
    sales_price: 220000,
    names: {
      th: "เครื่องกรองและฟื้นฟูน้ำยาหล่อเย็น 500 L",
      en: "Cutting Fluid Filtration & Regeneration (500 L)",
      zh: "切削液净化再生机 500 L",
    },
    key_features: {
      th: "ความจุใหญ่ 500 L สำหรับระบบหล่อเย็นรวมและโรงงานขนาดใหญ่ ผลิตโอโซน 10,000 mg/H",
      en: "Large 500 L capacity for centralized coolant systems. 10,000 mg/H ozone disinfection.",
      zh: "500L大容量处理系统，适用于大型集中供液车间，快速再生循环使用。",
    },
    specs: {
      type: "แยกน้ำมันลอย + กรองเศษ + ฆ่าเชื้อด้วยโอโซน",
      flowRate: "100 L/H",
      ozoneLevel: "10000mg/H",
      precision: "10–150 μm (Optional)",
      internalCapacity: "500 L",
      power: "220V 50Hz, <= 200W",
      viscosity: "-",
      airPressure: "0.4–0.5 MPa",
      dimensions: "850 × 420 × 950 mm",
      weight: "-",
    },
    images: ["https://lh3.googleusercontent.com/d/1vv5T0LdGzbvhtc2hfiEIHOxQeLgGV4io"],
    featured: true,
    isActive: true,
  },
  {
    id: "nxc-qzj-116a",
    model: "NXC-QZJ-116A",
    variant: "Standard",
    sku: "NXC-QZJ-116A",
    category: "deslagging",
    sales_price: 82000,
    names: {
      th: "เครื่องกำจัดตะกรันและเศษโลหะ",
      en: "Deslagging Machine",
      zh: "强力除渣脱水排渣机",
    },
    key_features: {
      th: "ความจุ 11.5L สั่งงานง่าย One-Click Start ถ่ายของเหลวรวดเร็ว แยกเศษเหล็กและสิ่งปนเปื้อน",
      en: "11.5L capacity, easy One-Click Start, fast liquid separation for metal sludge & chips.",
      zh: "容积11.5L，气动一键启动，抽吸彻底，迅速清除切削液箱底部沉淀金属废渣。",
    },
    specs: {
      type: "แยกเศษเหล็กและสิ่งปนเปื้อนออกจากของเหลว",
      flowRate: "116 L/min",
      ozoneLevel: "-",
      precision: "270 μm",
      internalCapacity: "11.5L",
      power: "Pneumatic (ใช้ระบบลม)",
      viscosity: "-",
      airPressure: "0.4–0.6 bar (สูบก๊าซ 670 L/min)",
      dimensions: "1000 × 500 × 1000 mm",
      weight: "70 kg",
    },
    images: ["https://lh3.googleusercontent.com/d/13rvqbgvcu68ksdGQN3WHA2SmaKGG0tUf"],
    featured: true,
    isActive: true,
  },
];

async function seed() {
  console.log(`Starting to seed ${PRODUCTS.length} products to collection "products"...`);
  for (const item of PRODUCTS) {
    const docRef = doc(db, "products", item.id);
    await setDoc(docRef, {
      ...item,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
    console.log(`✓ Uploaded product: [${item.sku}] ${item.names.th}`);
  }
  console.log("\n🎉 All 5 products have been successfully imported into Firebase Firestore!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
