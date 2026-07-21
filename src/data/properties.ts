// داده‌های Mock پایدار برای پروتوتایپ. با Refresh از بین نمی‌رود.
// در فازهای بعدی می‌توان با یک Store ساده در LocalStorage آن‌ها را ویرایش‌پذیر کرد.

export type DealType = "mortgage" | "rent"; // رهن کامل / رهن‌واجاره
export type PropertyStatus =
  | "published"
  | "reserved"
  | "locked"
  | "inactive"
  | "needs-fix";
export type FinancialFit = "match" | "review" | "mismatch" | "unknown";

export interface Property {
  id: string;
  title: string;
  city: "تهران" | "کرج";
  neighborhood: string;
  area: number; // متر
  rooms: number;
  floor: number;
  totalFloors: number;
  elevator: boolean;
  parking: boolean;
  storage: boolean;
  yearBuilt: number;
  deposit: number; // ودیعه (تومان)
  rent: number; // اجاره ماهانه (تومان). برای رهن کامل = 0
  dealType: DealType;
  images: string[];
  description: string;
  ownerVerified: boolean;
  fileVerified: boolean;
  status: PropertyStatus;
  bookingEnabled: boolean;
  onlineTour: boolean;
  featured?: boolean;
  amenities: string[];
  publishedAt: string; // ISO
  approxLocation: string; // موقعیت تقریبی
}

// تصاویر: از Unsplash با URLهای پایدار
const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

export const properties: Property[] = [
  {
    id: "p-1001",
    title: "آپارتمان ۹۵ متری دوخوابه در سعادت‌آباد",
    city: "تهران",
    neighborhood: "سعادت‌آباد",
    area: 95,
    rooms: 2,
    floor: 3,
    totalFloors: 6,
    elevator: true,
    parking: true,
    storage: true,
    yearBuilt: 1400,
    deposit: 1_500_000_000,
    rent: 25_000_000,
    dealType: "rent",
    images: [
      img("photo-1560448204-e02f11c3d0e2"),
      img("photo-1502672260266-1c1ef2d93688"),
      img("photo-1522708323590-d24dbb6b0267"),
      img("photo-1493809842364-78817add7ffb"),
    ],
    description:
      "آپارتمان بازسازی‌شده با نور عالی، آشپزخانه اپن، کف پارکت و کابینت‌های ام‌دی‌اف. نزدیکی به بلوار فرحزادی و مترو.",
    ownerVerified: true,
    fileVerified: true,
    status: "published",
    bookingEnabled: true,
    onlineTour: true,
    featured: true,
    amenities: ["آسانسور", "پارکینگ", "انباری", "کف پارکت", "بازسازی‌شده"],
    publishedAt: "2026-07-15T09:00:00Z",
    approxLocation: "نزدیک بلوار فرحزادی",
  },
  {
    id: "p-1002",
    title: "رهن کامل واحد ۱۲۰ متری در الهیه",
    city: "تهران",
    neighborhood: "الهیه",
    area: 120,
    rooms: 3,
    floor: 5,
    totalFloors: 8,
    elevator: true,
    parking: true,
    storage: true,
    yearBuilt: 1398,
    deposit: 4_500_000_000,
    rent: 0,
    dealType: "mortgage",
    images: [
      img("photo-1580587771525-78b9dba3b914"),
      img("photo-1512917774080-9991f1c4c750"),
      img("photo-1616486338812-3dadae4b4ace"),
    ],
    description:
      "واحد لوکس با ویو باز، سیستم گرمایش از کف و لابی مجلل. ساختمان دارای نگهبانی ۲۴ ساعته.",
    ownerVerified: true,
    fileVerified: true,
    status: "published",
    bookingEnabled: true,
    onlineTour: false,
    amenities: ["نگهبانی", "لابی", "گرمایش از کف", "پارکینگ اختصاصی"],
    publishedAt: "2026-07-12T10:30:00Z",
    approxLocation: "نزدیک خیابان فرشته",
  },
  {
    id: "p-1003",
    title: "واحد ۷۰ متری یک‌خوابه در ولنجک",
    city: "تهران",
    neighborhood: "ولنجک",
    area: 70,
    rooms: 1,
    floor: 2,
    totalFloors: 4,
    elevator: false,
    parking: true,
    storage: false,
    yearBuilt: 1395,
    deposit: 800_000_000,
    rent: 14_000_000,
    dealType: "rent",
    images: [
      img("photo-1600585154340-be6161a56a0c"),
      img("photo-1600607687939-ce8a6c25118c"),
    ],
    description:
      "واحد نقلی، مناسب زوج جوان یا افراد مجرد. آفتاب‌گیر و کم‌هزینه در نگهداری.",
    ownerVerified: true,
    fileVerified: true,
    status: "published",
    bookingEnabled: false,
    onlineTour: false,
    amenities: ["پارکینگ", "آفتاب‌گیر"],
    publishedAt: "2026-07-18T14:00:00Z",
    approxLocation: "نزدیک مترو ولنجک",
  },
  {
    id: "p-1004",
    title: "آپارتمان ۱۱۰ متری دوخوابه در جنت‌آباد شمالی",
    city: "تهران",
    neighborhood: "جنت‌آباد شمالی",
    area: 110,
    rooms: 2,
    floor: 4,
    totalFloors: 7,
    elevator: true,
    parking: true,
    storage: true,
    yearBuilt: 1399,
    deposit: 1_200_000_000,
    rent: 18_000_000,
    dealType: "rent",
    images: [
      img("photo-1494203484021-3c454daf695d"),
      img("photo-1523217582562-09d0def993a6"),
    ],
    description:
      "دارای بالکن رو به حیاط، آشپزخانه بزرگ و انباری وسیع. دسترسی به بزرگراه همت.",
    ownerVerified: true,
    fileVerified: true,
    status: "reserved",
    bookingEnabled: true,
    onlineTour: false,
    amenities: ["آسانسور", "پارکینگ", "انباری", "بالکن"],
    publishedAt: "2026-07-05T08:00:00Z",
    approxLocation: "نزدیک بزرگراه همت",
  },
  {
    id: "p-1005",
    title: "آپارتمان ۸۵ متری در گوهردشت کرج",
    city: "کرج",
    neighborhood: "گوهردشت",
    area: 85,
    rooms: 2,
    floor: 1,
    totalFloors: 5,
    elevator: true,
    parking: true,
    storage: true,
    yearBuilt: 1397,
    deposit: 500_000_000,
    rent: 9_000_000,
    dealType: "rent",
    images: [
      img("photo-1512918728675-ed5a9ecdebfd"),
      img("photo-1493663284031-b7e3aefcae8e"),
    ],
    description:
      "واحد شیک با دسترسی عالی به مراکز خرید گوهردشت. مناسب خانواده کوچک.",
    ownerVerified: true,
    fileVerified: true,
    status: "published",
    bookingEnabled: true,
    onlineTour: false,
    amenities: ["آسانسور", "پارکینگ", "انباری"],
    publishedAt: "2026-07-16T12:00:00Z",
    approxLocation: "بلوار اصلی گوهردشت",
  },
  {
    id: "p-1006",
    title: "واحد ۶۵ متری در مهرشهر کرج",
    city: "کرج",
    neighborhood: "مهرشهر",
    area: 65,
    rooms: 1,
    floor: 3,
    totalFloors: 5,
    elevator: false,
    parking: false,
    storage: false,
    yearBuilt: 1390,
    deposit: 300_000_000,
    rent: 6_500_000,
    dealType: "rent",
    images: [img("photo-1502672023488-70e25813eb80")],
    description:
      "واحد اقتصادی و دنج، مناسب دانشجویان یا افراد مجرد.",
    ownerVerified: false,
    fileVerified: false,
    status: "needs-fix",
    bookingEnabled: false,
    onlineTour: false,
    amenities: [],
    publishedAt: "2026-07-01T09:00:00Z",
    approxLocation: "نزدیک بلوار ارم",
  },
  {
    id: "p-1007",
    title: "رهن کامل ۱۵۰ متری در زعفرانیه",
    city: "تهران",
    neighborhood: "زعفرانیه",
    area: 150,
    rooms: 3,
    floor: 6,
    totalFloors: 10,
    elevator: true,
    parking: true,
    storage: true,
    yearBuilt: 1401,
    deposit: 7_000_000_000,
    rent: 0,
    dealType: "mortgage",
    images: [
      img("photo-1600566753190-17f0baa2a6c3"),
      img("photo-1600585154526-990dced4db0d"),
    ],
    description:
      "برج نوساز با استخر، سونا، جیم و پارکینگ متعدد. ویو شمال تهران.",
    ownerVerified: true,
    fileVerified: true,
    status: "locked",
    bookingEnabled: true,
    onlineTour: true,
    amenities: ["استخر", "سونا", "جیم", "روف‌گاردن"],
    publishedAt: "2026-07-10T11:00:00Z",
    approxLocation: "بلوار مقدس اردبیلی",
  },
  {
    id: "p-1008",
    title: "آپارتمان ۹۰ متری در پونک",
    city: "تهران",
    neighborhood: "پونک",
    area: 90,
    rooms: 2,
    floor: 2,
    totalFloors: 5,
    elevator: true,
    parking: true,
    storage: true,
    yearBuilt: 1396,
    deposit: 900_000_000,
    rent: 15_000_000,
    dealType: "rent",
    images: [
      img("photo-1560185127-6ed189bf02f4"),
      img("photo-1567016432779-094069958ea5"),
    ],
    description:
      "واحد نقلی و تمیز با دسترسی مناسب به مترو و مراکز خرید پونک.",
    ownerVerified: true,
    fileVerified: true,
    status: "inactive",
    bookingEnabled: false,
    onlineTour: false,
    amenities: ["آسانسور", "پارکینگ", "انباری"],
    publishedAt: "2026-06-28T09:00:00Z",
    approxLocation: "نزدیک میدان پونک",
  },
];

export const currentTenantFit: Record<string, FinancialFit> = {
  "p-1001": "match",
  "p-1002": "review",
  "p-1003": "match",
  "p-1004": "match",
  "p-1005": "match",
  "p-1006": "unknown",
  "p-1007": "mismatch",
  "p-1008": "unknown",
};

export const cities = ["تهران", "کرج"] as const;

export const neighborhoodsByCity: Record<string, string[]> = {
  تهران: [
    "سعادت‌آباد",
    "الهیه",
    "ولنجک",
    "جنت‌آباد شمالی",
    "زعفرانیه",
    "پونک",
  ],
  کرج: ["گوهردشت", "مهرشهر"],
};

export function getProperty(id: string): Property | undefined {
  return properties.find((p) => p.id === id);
}

export const statusLabels: Record<PropertyStatus, string> = {
  published: "منتشرشده",
  reserved: "رزروشده",
  locked: "قفل‌شده",
  inactive: "غیرفعال",
  "needs-fix": "نیازمند اصلاح مدارک",
};

export const fitLabels: Record<FinancialFit, string> = {
  match: "متناسب با ملک",
  review: "نیازمند بررسی بیشتر",
  mismatch: "نامتناسب",
  unknown: "هنوز ارزیابی نشده",
};
