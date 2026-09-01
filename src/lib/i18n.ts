export type Language = "th" | "zh" | "en";

export interface Translations {
  // Navigation & Company
  companyName: string;
  companySubName: string;
  b2bBadge: string;
  systemOnline: string;
  searchPlaceholder: string;
  rfqButton: string;
  rfqShort: string;
  adminNavBtn: string;
  masterCatalogBtn: string;
  masterCatalogTitle: string;
  masterCatalogSubtitle: string;
  comparisonMatrixTitle: string;
  printFullCatalog: string;

  // Hero Section
  heroTagline: string;
  heroTitle1: string;
  heroTitle2: string;
  heroDesc: string;
  requestQuoteBtn: string;
  adminLink: string;

  // Categories & Filters
  allCategories: string;
  oilFilterCategory: string;
  cuttingFluidCategory: string;
  deslaggingCategory: string;
  foundProducts: (count: number) => string;
  noProductsTitle: string;
  noProductsDesc: string;
  openAdminBtn: string;

  // Product Card & Actions
  viewSpecsBtn: string;
  addToRfqBtn: string;
  inRfqBtn: string;
  salesPriceLabel: string;
  exclVat: string;
  addedToast: (name: string) => string;

  // Specs Modal
  specsModalTitle: string;
  specsFlyerBtn: string;
  addToRfqModalBtn: string;
  addedToRfqModalText: string;

  // 10 Technical Specification Labels
  specType: string;
  specFlowRate: string;
  specOzoneLevel: string;
  specPrecision: string;
  specInternalCapacity: string;
  specPower: string;
  specViscosity: string;
  specAirPressure: string;
  specDimensions: string;
  specWeight: string;

  // Flyer / Datasheet Page
  backToCatalog: string;
  saveLineImageBtn: string;
  savingImageText: string;
  printPdfBtn: string;
  officialCatalogBadge: string;
  inStockBadge: string;
  h1Title: string;
  h1Desc: string;
  h2Title: string;
  h2Desc: string;
  h3Title: string;
  h3Desc: string;
  h4Title: string;
  h4Desc: string;
  flyerSpecsTitle: string;
  ctaInterested: string;
  ctaContactTitle: string;
  ctaContactDesc: string;
  ctaLineText: string;
  ctaEngineerText: string;

  // RFQ Modal
  rfqModalTitle: string;
  rfqModalSubtitle: string;
  rfqItemTitle: string;
  rfqSku: string;
  rfqUnitPrice: string;
  rfqQty: string;
  rfqSubtotal: string;
  rfqVat: string;
  rfqTotal: string;
  rfqEmptyTitle: string;
  rfqEmptyDesc: string;
  rfqOrgInfo: string;
  rfqCompanyName: string;
  rfqTaxId: string;
  rfqContactName: string;
  rfqDepartment: string;
  rfqEmail: string;
  rfqPhone: string;
  rfqNote: string;
  rfqSubmitBtn: string;
  rfqSubmitting: string;
  rfqSuccessTitle: string;
  rfqRefNo: string;
  rfqCloseBtn: string;

  // Footer
  footerTagline: string;
  copyright: string;
}

export const translations: Record<Language, Translations> = {
  th: {
    // Navigation
    companyName: "บริษัท ฉี ไฉ่ อิเล็คทริค (ประเทศไทย) จำกัด",
    companySubName: "CHICAI ELECTRIC (THAILAND) CO., LTD.",
    b2bBadge: "B2B Official",
    systemOnline: "ระบบออนไลน์",
    searchPlaceholder: "ค้นหาอุปกรณ์, รหัสรุ่น, SKU...",
    rfqButton: "รายการขอใบเสนอราคา",
    rfqShort: "RFQ",
    adminNavBtn: "Admin",
    masterCatalogBtn: "📖 แคตตาล็อกรวมทุกสินค้า",
    masterCatalogTitle: "แคตตาล็อกรวมเครื่องจักรและระบบบำบัดของเหลวอุตสาหกรรม",
    masterCatalogSubtitle: "บริษัท ฉี ไฉ่ อิเล็คทริค (ประเทศไทย) จำกัด • ฉบับรวมทุกรุ่นสำหรับโรงงาน",
    comparisonMatrixTitle: "ตารางเปรียบเทียบสเปกเครื่องจักรทุกรุ่น (Specifications Comparison Matrix)",
    printFullCatalog: "พิมพ์ / บันทึก PDF แคตตาล็อกรวม",

    // Hero
    heroTagline: "บริษัท ฉี ไฉ่ อิเล็คทริค (ประเทศไทย) จำกัด • โซลูชันเครื่องจักรบำบัดของเหลวอุตสาหกรรม",
    heroTitle1: "เครื่องกรองน้ำมัน • ฟื้นฟูน้ำยาหล่อเย็น",
    heroTitle2: "และเครื่องกำจัดตะกรันโลหะสำหรับโรงงาน",
    heroDesc: "โซลูชันลดต้นทุนน้ำมันไฮดรอลิกและน้ำยาคูลแลนท์ CNC มากกว่า 70% ยืดอายุการใช้งานเครื่องจักรและเครื่องมือตัด",
    requestQuoteBtn: "ขอใบเสนอราคา (RFQ)",
    adminLink: "ระบบจัดการสินค้าหลังบ้าน (Admin)",

    // Categories & Filters
    allCategories: "ทั้งหมด",
    oilFilterCategory: "เครื่องกรองน้ำมัน",
    cuttingFluidCategory: "เครื่องกรองน้ำยาหล่อเย็น",
    deslaggingCategory: "เครื่องกำจัดตะกรันและเศษโลหะ",
    foundProducts: (count: number) => `พบสินค้าทั้งหมด ${count} รายการ`,
    noProductsTitle: "ยังไม่มีสินค้าในฐานข้อมูล Firestore",
    noProductsDesc: "เข้าไปที่หน้าแอดมินเพื่อกดบันทึกสินค้าทั้ง 5 รายการเข้าสู่ระบบ",
    openAdminBtn: "เปิดหน้ากรอกข้อมูลสินค้า (Admin)",

    // Product Card
    viewSpecsBtn: "ดูสเปกเต็ม",
    addToRfqBtn: "+ ขอราคา",
    inRfqBtn: "ในรายการ",
    salesPriceLabel: "ราคาขาย (บาท)",
    exclVat: "(ไม่รวม VAT 7%)",
    addedToast: (name: string) => `เพิ่ม "${name}" ลงในรายการขอใบเสนอราคาแล้ว`,

    // Specs Modal
    specsModalTitle: "สเปกทางวิศวกรรม (Technical Specifications)",
    specsFlyerBtn: "โบรชัวร์ส่ง LINE / PDF",
    addToRfqModalBtn: "ใส่ในรายการขอใบเสนอราคา (RFQ)",
    addedToRfqModalText: "เพิ่มลงในรายการขอราคาแล้ว!",

    // 10 Technical Specification Labels
    specType: "ระบบการทำงาน",
    specFlowRate: "อัตราการไหล (Flow Rate)",
    specOzoneLevel: "ปริมาณโอโซนฆ่าเชื้อ",
    specPrecision: "ความละเอียดการกรอง",
    specInternalCapacity: "ความจุถังภายใน",
    specPower: "กำลังไฟฟ้า / ระบบขับเคลื่อน",
    specViscosity: "ความหนืดน้ำมันที่รองรับ",
    specAirPressure: "แรงดันลมที่ใช้",
    specDimensions: "ขนาดตัวเครื่อง (มม.)",
    specWeight: "น้ำหนักเครื่อง",

    // Flyer / Datasheet Page
    backToCatalog: "กลับหน้าร้าน",
    saveLineImageBtn: "📸 บันทึกรูปส่ง LINE",
    savingImageText: "กำลังบันทึกภาพ...",
    printPdfBtn: "พิมพ์ / PDF",
    officialCatalogBadge: "OFFICIAL CATALOG",
    inStockBadge: "พร้อมส่ง / In Stock",
    h1Title: "ลดต้นทุน 70%",
    h1Desc: "นำน้ำมัน/คูลแลนท์หมุนเวียนใช้ใหม่",
    h2Title: "กรองละเอียดสูง",
    h2Desc: "ดักจับอนุภาคระดับไมครอน",
    h3Title: "รับประกัน 2 ปี",
    h3Desc: "พร้อมบริการ On-site Service",
    h4Title: "สาธิตเครื่องฟรี",
    h4Desc: "ทดสอบประสิทธิภาพจริงหน้างาน",
    flyerSpecsTitle: "ข้อมูลจำเพาะทางเทคนิค (Technical Specifications)",
    ctaInterested: "สนใจสั่งซื้อ / ขอทดสอบเครื่องหน้างาน",
    ctaContactTitle: "ติดต่อฝ่ายขาย บริษัท ฉี ไฉ่ อิเล็คทริค (ประเทศไทย) จำกัด",
    ctaContactDesc: "ยินดีให้คำปรึกษาประเมินความคุ้มค่า และนัดหมายนำเครื่องสาธิตเข้าทดสอบที่โรงงานของท่าน",
    ctaLineText: "LINE: คุณเอกชัย (Max)",
    ctaEngineerText: "สอบถามฝ่ายวิศวกรรม",

    // RFQ Modal
    rfqModalTitle: "คำขอใบเสนอราคา (RFQ)",
    rfqModalSubtitle: "เอกสารทางการสำหรับฝ่ายจัดซื้อและผู้มีอำนาจตัดสินใจ",
    rfqItemTitle: "1. รายการสินค้าที่เลือก",
    rfqSku: "รหัส / สินค้า",
    rfqUnitPrice: "ราคาต่อหน่วย",
    rfqQty: "จำนวน",
    rfqSubtotal: "ยอดรวมสินค้า (ก่อน VAT):",
    rfqVat: "ภาษีมูลค่าเพิ่ม VAT (7%):",
    rfqTotal: "ยอดรวมประมาณการสุทธิ:",
    rfqEmptyTitle: "ยังไม่มีสินค้าในรายการขอราคา",
    rfqEmptyDesc: "คลิกเลือกสินค้าเพื่อสร้างใบขอราคา",
    rfqOrgInfo: "2. ข้อมูลองค์กรและผู้ขอใบเสนอราคา",
    rfqCompanyName: "ชื่อบริษัท / นิติบุคคล",
    rfqTaxId: "เลขประจำตัวผู้เสียภาษี 13 หลัก",
    rfqContactName: "ชื่อผู้ติดต่อ / ตำแหน่ง",
    rfqDepartment: "แผนก",
    rfqEmail: "อีเมลทางการ (Corporate Email)",
    rfqPhone: "เบอร์โทรศัพท์ติดต่อ",
    rfqNote: "ข้อกำหนดเพิ่มเติม / บันทึกถึงฝ่ายขาย",
    rfqSubmitBtn: "ส่งคำขอใบเสนอราคาอย่างเป็นทางการ",
    rfqSubmitting: "กำลังส่งคำขอ...",
    rfqSuccessTitle: "ส่งคำขอใบเสนอราคาเรียบร้อยแล้ว!",
    rfqRefNo: "หมายเลขอ้างอิง RFQ:",
    rfqCloseBtn: "ปิดหน้าต่าง",

    // Footer
    footerTagline: "ผู้นำเข้าและจัดจำหน่ายเครื่องกรองน้ำมัน เครื่องฟื้นฟูน้ำยาหล่อเย็น และเครื่องจักรบำบัดของเหลวอุตสาหกรรม",
    copyright: "สงวนลิขสิทธิ์",
  },

  zh: {
    // Navigation
    companyName: "奇彩电气（泰国）有限公司",
    companySubName: "CHICAI ELECTRIC (THAILAND) CO., LTD.",
    b2bBadge: "企业官方",
    systemOnline: "系统在线",
    searchPlaceholder: "搜索设备、规格型号、SKU...",
    rfqButton: "报价单清单",
    rfqShort: "询价",
    adminNavBtn: "后台管理",
    masterCatalogBtn: "📖 全系产品画册 (Catalog)",
    masterCatalogTitle: "奇彩电气工业流体净化与再生系统完整产品手册",
    masterCatalogSubtitle: "奇彩电气（泰国）有限公司 • 官方全系列选型采购指南",
    comparisonMatrixTitle: "全系列设备技术规格横向对比表 (Comparison Matrix)",
    printFullCatalog: "🖨️ 打印 / 导出完整PDF画册",

    // Hero
    heroTagline: "奇彩电气（泰国）有限公司 • 工业液体净化处理解决方案",
    heroTitle1: "工业滤油机 • 切削液净化再生机",
    heroTitle2: "及强力除渣脱水排渣机",
    heroDesc: "有效降低液压油与CNC切削液采购及废液处理成本达70%以上，大幅延长机床与刀具使用寿命",
    requestQuoteBtn: "申请官方报价单 (RFQ)",
    adminLink: "后台产品管理系统 (Admin)",

    // Categories & Filters
    allCategories: "全部设备",
    oilFilterCategory: "工业滤油机",
    cuttingFluidCategory: "切削液净化再生",
    deslaggingCategory: "除渣脱水排渣机",
    foundProducts: (count: number) => `共找到 ${count} 款工业设备`,
    noProductsTitle: "Firestore数据库中暂无产品",
    noProductsDesc: "请前往后台管理界面添加并保存产品至系统",
    openAdminBtn: "进入产品录入界面 (Admin)",

    // Product Card
    viewSpecsBtn: "查看完整参数",
    addToRfqBtn: "+ 询价",
    inRfqBtn: "已加入",
    salesPriceLabel: "官方售价 (泰铢)",
    exclVat: "(不含增值税 7%)",
    addedToast: (name: string) => `已将 "${name}" 加入询价清单`,

    // Specs Modal
    specsModalTitle: "工程技术规格参数 (Specifications)",
    specsFlyerBtn: "宣传图册 (LINE / PDF)",
    addToRfqModalBtn: "加入询价清单 (RFQ)",
    addedToRfqModalText: "已成功加入询价单！",

    // 10 Technical Specification Labels
    specType: "工作原理 / 过滤类型",
    specFlowRate: "额定流量 (Flow Rate)",
    specOzoneLevel: "臭氧发生量 (除臭杀菌)",
    specPrecision: "过滤精度 (Precision)",
    specInternalCapacity: "水箱/内部容积",
    specPower: "额定功率 / 驱动方式",
    specViscosity: "适用油品粘度范围",
    specAirPressure: "气源工作压力",
    specDimensions: "整机尺寸 (长×宽×高 mm)",
    specWeight: "整机重量",

    // Flyer / Datasheet Page
    backToCatalog: "返回产品目录",
    saveLineImageBtn: "📸 保存微信/LINE宣传图",
    savingImageText: "正在生成高清海报...",
    printPdfBtn: "打印 / 保存PDF",
    officialCatalogBadge: "OFFICIAL CATALOG",
    inStockBadge: "现货供应 / In Stock",
    h1Title: "降低成本 70%",
    h1Desc: "油液循环净化持续复用",
    h2Title: "高精度微米过滤",
    h2Desc: "彻底拦截微米级杂质颗粒",
    h3Title: "整机质保 2 年",
    h3Desc: "专业工程师上门现场服务",
    h4Title: "免费样机实测",
    h4Desc: "工厂实地验证设备性能",
    flyerSpecsTitle: "工程技术参数表 (Specifications)",
    ctaInterested: "设备订购咨询 / 预约入厂实测",
    ctaContactTitle: "联系奇彩电气（泰国）有限公司销售部",
    ctaContactDesc: "竭诚为工业制造企业提供高性价比废液减排与净化解决方案，欢迎预约试机",
    ctaLineText: "微信/LINE: Max (คุณเอกชัย)",
    ctaEngineerText: "工程技术热线",

    // RFQ Modal
    rfqModalTitle: "报价申请单 (RFQ)",
    rfqModalSubtitle: "面向企业采购部及决策管理层的正式询价系统",
    rfqItemTitle: "1. 已选设备清单",
    rfqSku: "型号 / 产品",
    rfqUnitPrice: "单价",
    rfqQty: "数量",
    rfqSubtotal: "商品总额 (不含增值税):",
    rfqVat: "增值税 VAT (7%):",
    rfqTotal: "预估总计金额:",
    rfqEmptyTitle: "询价清单暂无商品",
    rfqEmptyDesc: "请选择所需设备以生成报价申请",
    rfqOrgInfo: "2. 企业信息与联系人",
    rfqCompanyName: "公司 / 法人全称",
    rfqTaxId: "企业税号 (Tax ID)",
    rfqContactName: "联系人姓名 / 职务",
    rfqDepartment: "部门",
    rfqEmail: "企业邮箱 (Corporate Email)",
    rfqPhone: "联系电话",
    rfqNote: "特殊需求 / 商务备注",
    rfqSubmitBtn: "提交正式询价申请",
    rfqSubmitting: "正在提交...",
    rfqSuccessTitle: "报价申请提交成功！",
    rfqRefNo: "询价单参考编号:",
    rfqCloseBtn: "关闭窗口",

    // Footer
    footerTagline: "专业进口与供应工业滤油机、切削液净化再生设备及工业废液处理机械",
    copyright: "版权所有",
  },

  en: {
    // Navigation
    companyName: "Chicai Electric (Thailand) Co., Ltd.",
    companySubName: "CHICAI ELECTRIC (THAILAND) CO., LTD.",
    b2bBadge: "B2B Official",
    systemOnline: "System Online",
    searchPlaceholder: "Search equipment, model, SKU...",
    rfqButton: "Request Quotation",
    rfqShort: "RFQ",
    adminNavBtn: "Admin",
    masterCatalogBtn: "📖 Full Catalog",
    masterCatalogTitle: "Industrial Fluid Filtration & Coolant Recovery Master Catalog",
    masterCatalogSubtitle: "Chicai Electric (Thailand) Co., Ltd. • Complete Industrial Machinery Guide",
    comparisonMatrixTitle: "Comprehensive Machine Specifications Comparison Matrix",
    printFullCatalog: "🖨️ Print / Save Full PDF Catalog",

    // Hero
    heroTagline: "Chicai Electric (Thailand) Co., Ltd. • Industrial Fluid Filtration Solutions",
    heroTitle1: "Industrial Oil Filtration • Coolant Regeneration",
    heroTitle2: "& High-Efficiency Deslagging Systems",
    heroDesc: "Reduce hydraulic oil and CNC cutting fluid costs by over 70% while extending machinery and tool service life.",
    requestQuoteBtn: "Request for Quotation (RFQ)",
    adminLink: "Product Management (Admin)",

    // Categories & Filters
    allCategories: "All Equipment",
    oilFilterCategory: "Oil Filter",
    cuttingFluidCategory: "Coolant Regeneration",
    deslaggingCategory: "Deslagging Machine",
    foundProducts: (count: number) => `${count} machines available`,
    noProductsTitle: "No products found in Firestore",
    noProductsDesc: "Visit the Admin page to add and save products to the system",
    openAdminBtn: "Open Product Entry (Admin)",

    // Product Card
    viewSpecsBtn: "View Specs",
    addToRfqBtn: "+ RFQ",
    inRfqBtn: "In RFQ",
    salesPriceLabel: "Sales Price (THB)",
    exclVat: "(Excl. 7% VAT)",
    addedToast: (name: string) => `Added "${name}" to RFQ list`,

    // Specs Modal
    specsModalTitle: "Technical Specifications",
    specsFlyerBtn: "Catalog Flyer (LINE/PDF)",
    addToRfqModalBtn: "Add to RFQ Basket",
    addedToRfqModalText: "Added to RFQ Basket!",

    // 10 Technical Specification Labels
    specType: "Filtration System",
    specFlowRate: "Flow Rate",
    specOzoneLevel: "Ozone Disinfection",
    specPrecision: "Filtration Precision",
    specInternalCapacity: "Internal Capacity",
    specPower: "Power / Drive System",
    specViscosity: "Applicable Viscosity",
    specAirPressure: "Air Pressure",
    specDimensions: "Dimensions (W×D×H mm)",
    specWeight: "Machine Weight",

    // Flyer / Datasheet Page
    backToCatalog: "Back to Catalog",
    saveLineImageBtn: "📸 Save Image for LINE",
    savingImageText: "Generating HD Poster...",
    printPdfBtn: "Print / PDF",
    officialCatalogBadge: "OFFICIAL CATALOG",
    inStockBadge: "In Stock",
    h1Title: "Reduce Costs 70%",
    h1Desc: "Recycle & reuse industrial fluids",
    h2Title: "High Precision",
    h2Desc: "Sub-micron particle trapping",
    h3Title: "2-Year Warranty",
    h3Desc: "On-site engineer service support",
    h4Title: "Free On-Site Demo",
    h4Desc: "Test actual performance at factory",
    flyerSpecsTitle: "Technical Specifications",
    ctaInterested: "Inquiry / Request On-Site Demo",
    ctaContactTitle: "Contact Chicai Electric (Thailand) Sales Team",
    ctaContactDesc: "Professional fluid recovery consultation and on-site machine demonstration at your factory.",
    ctaLineText: "LINE: Max (Ekachai)",
    ctaEngineerText: "Engineering Support",

    // RFQ Modal
    rfqModalTitle: "Request for Quotation (RFQ)",
    rfqModalSubtitle: "Official procurement system for purchasing officers & executives",
    rfqItemTitle: "1. Selected Products",
    rfqSku: "Model / Item",
    rfqUnitPrice: "Unit Price",
    rfqQty: "Qty",
    rfqSubtotal: "Subtotal (excl. VAT):",
    rfqVat: "Value Added Tax VAT (7%):",
    rfqTotal: "Estimated Grand Total:",
    rfqEmptyTitle: "No items in quotation basket",
    rfqEmptyDesc: "Select products to generate an official RFQ",
    rfqOrgInfo: "2. Corporate & Contact Information",
    rfqCompanyName: "Company / Corporate Legal Name",
    rfqTaxId: "Tax Identification Number (Tax ID)",
    rfqContactName: "Contact Person / Title",
    rfqDepartment: "Department",
    rfqEmail: "Corporate Email Address",
    rfqPhone: "Phone Number",
    rfqNote: "Additional Specifications / Commercial Terms",
    rfqSubmitBtn: "Submit Official RFQ Request",
    rfqSubmitting: "Submitting RFQ...",
    rfqSuccessTitle: "Quotation Request Submitted Successfully!",
    rfqRefNo: "RFQ Reference Number:",
    rfqCloseBtn: "Close",

    // Footer
    footerTagline: "Importer and distributor of industrial oil filtration, coolant regeneration, and fluid treatment machinery.",
    copyright: "All rights reserved",
  },
};

/**
 * Smart translator for engineering specification values
 * Automatically translates common Thai technical phrases into Chinese or English
 */
export function translateSpecValue(
  value: string | undefined | null,
  lang: Language
): string {
  if (!value || value === "-") return "-";
  if (lang === "th") return value;

  const exactDict: Record<string, Record<"zh" | "en", string>> = {
    "กรองเชิงกายภาพ Pure Physical (ไม่ใช้สารเคมี)": {
      zh: "纯物理精密过滤 (无化学添加)",
      en: "Pure Physical Precision Filtration (Chemical-Free)",
    },
    "แยกน้ำมันลอย + กรองเศษ + ฆ่าเชื้อด้วยโอโซน": {
      zh: "油水分离 + 杂质过滤 + 臭氧深度杀菌除臭",
      en: "Tramp Oil Separation + Chip Filtration + Ozone Sterilization",
    },
    "แยกเศษเหล็กและสิ่งปนเปื้อนออกจากของเหลว": {
      zh: "气动固液分离 / 快速清理水箱废渣金属屑",
      en: "Pneumatic Solid-Liquid Separation / Metal Chip Slag Extraction",
    },
    "Pneumatic (ใช้ระบบลม)": {
      zh: "气动动力驱动 (无需接电)",
      en: "Pneumatic (Air-Driven)",
    },
    "0.4–0.6 bar (สูบก๊าซ 670 L/min)": {
      zh: "0.4–0.6 bar (额定气耗 670 L/min)",
      en: "0.4–0.6 bar (Air Consumption 670 L/min)",
    },
    "220V 50Hz, 370W": {
      zh: "220V 50Hz，额定功率 370W",
      en: "220V 50Hz, 370W",
    },
    "220V 50Hz, <= 200W": {
      zh: "220V 50Hz，超低功耗 <= 200W",
      en: "220V 50Hz, Low Power <= 200W",
    },
  };

  if (exactDict[value]?.[lang]) {
    return exactDict[value][lang];
  }

  let res = value;
  if (lang === "zh") {
    res = res
      .replace("กรองเชิงกายภาพ Pure Physical (ไม่ใช้สารเคมี)", "纯物理精密过滤 (无化学添加)")
      .replace("แยกน้ำมันลอย + กรองเศษ + ฆ่าเชื้อด้วยโอโซน", "油水分离 + 杂质过滤 + 臭氧除臭杀菌")
      .replace("แยกเศษเหล็กและสิ่งปนเปื้อนออกจากของเหลว", "气动固液分离 / 快速清理金属废渣")
      .replace("(ใช้ระบบลม)", "(气动动力驱动)")
      .replace("(สูบก๊าซ", "(气耗量")
      .replace("พร้อมส่ง / In Stock", "现货供应");
  } else if (lang === "en") {
    res = res
      .replace("กรองเชิงกายภาพ Pure Physical (ไม่ใช้สารเคมี)", "Pure Physical Filtration (Chemical-Free)")
      .replace("แยกน้ำมันลอย + กรองเศษ + ฆ่าเชื้อด้วยโอโซน", "Tramp Oil Separation + Filtration + Ozone Disinfection")
      .replace("แยกเศษเหล็กและสิ่งปนเปื้อนออกจากของเหลว", "Solid-Liquid & Metal Slag Separation")
      .replace("(ใช้ระบบลม)", "(Air-Driven)")
      .replace("(สูบก๊าซ", "(Air Consumption");
  }

  return res;
}
