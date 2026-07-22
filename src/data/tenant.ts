// داده‌های Mock پروفایل مستأجر، رزروها، پیشنهادها و قراردادها

export interface TenantProfile {
  fullName: string;
  nationalId: string;
  phone: string;
  employmentType: "کارمند" | "خویش‌فرما" | "دانشجو" | "بازنشسته";
  monthlyIncome: number; // تومان
  maxDeposit: number; // ودیعه مقدور
  maxRent: number; // اجاره ماهانه مقدور
  guarantorAvailable: boolean;
  idVerified: boolean;
  incomeVerified: boolean;
  creditScore: number; // 0..1000
}

export const tenantProfile: TenantProfile = {
  fullName: "نگین شریفی",
  nationalId: "۰۰۱۲۳۴۵۶۷۸",
  phone: "۰۹۱۲۳۴۵۶۷۸۹",
  employmentType: "کارمند",
  monthlyIncome: 55_000_000,
  maxDeposit: 1_800_000_000,
  maxRent: 28_000_000,
  guarantorAvailable: true,
  idVerified: true,
  incomeVerified: false,
  creditScore: 720,
};

export type BookingStatus =
  | "requested"
  | "confirmed"
  | "completed"
  | "cancelled";

export interface VisitBooking {
  id: string;
  propertyId: string;
  date: string; // ISO
  slot: string; // مثل "۱۶:۰۰ تا ۱۷:۰۰"
  status: BookingStatus;
  channel: "حضوری" | "تور آنلاین";
}

export const visitBookings: VisitBooking[] = [
  {
    id: "b-2001",
    propertyId: "p-1001",
    date: "2026-07-24T13:30:00Z",
    slot: "۱۶:۳۰ تا ۱۷:۳۰",
    status: "confirmed",
    channel: "حضوری",
  },
  {
    id: "b-2002",
    propertyId: "p-1002",
    date: "2026-07-26T15:00:00Z",
    slot: "۱۸:۰۰ تا ۱۹:۰۰",
    status: "requested",
    channel: "تور آنلاین",
  },
  {
    id: "b-2003",
    propertyId: "p-1005",
    date: "2026-07-14T12:00:00Z",
    slot: "۱۵:۰۰ تا ۱۶:۰۰",
    status: "completed",
    channel: "حضوری",
  },
];

export type OfferStatus =
  | "draft"
  | "sent"
  | "counter"
  | "accepted"
  | "rejected";

export interface OfferMessage {
  from: "tenant" | "landlord";
  at: string;
  text: string;
  deposit?: number;
  rent?: number;
}

export interface Offer {
  id: string;
  propertyId: string;
  status: OfferStatus;
  currentDeposit: number;
  currentRent: number;
  messages: OfferMessage[];
  updatedAt: string;
}

export const offers: Offer[] = [
  {
    id: "o-3001",
    propertyId: "p-1001",
    status: "counter",
    currentDeposit: 1_300_000_000,
    currentRent: 22_000_000,
    updatedAt: "2026-07-21T10:00:00Z",
    messages: [
      {
        from: "tenant",
        at: "2026-07-20T09:00:00Z",
        text: "پیشنهاد اولیه من با تخفیف اجاره.",
        deposit: 1_200_000_000,
        rent: 22_000_000,
      },
      {
        from: "landlord",
        at: "2026-07-20T18:00:00Z",
        text: "می‌توانم ودیعه را کاهش دهم اما اجاره ثابت است.",
        deposit: 1_300_000_000,
        rent: 24_000_000,
      },
      {
        from: "tenant",
        at: "2026-07-21T10:00:00Z",
        text: "درخواست نهایی بنده.",
        deposit: 1_300_000_000,
        rent: 22_000_000,
      },
    ],
  },
  {
    id: "o-3002",
    propertyId: "p-1005",
    status: "accepted",
    currentDeposit: 500_000_000,
    currentRent: 9_000_000,
    updatedAt: "2026-07-18T12:00:00Z",
    messages: [
      {
        from: "tenant",
        at: "2026-07-17T09:00:00Z",
        text: "با شرایط آگهی موافقم.",
        deposit: 500_000_000,
        rent: 9_000_000,
      },
      {
        from: "landlord",
        at: "2026-07-18T12:00:00Z",
        text: "پذیرفته شد. رزرو با پرداخت امن انجام گردد.",
        deposit: 500_000_000,
        rent: 9_000_000,
      },
    ],
  },
];

export type ContractStatus =
  | "awaiting-signature"
  | "landlord-signed"
  | "signed"
  | "active"
  | "ended";

export interface Contract {
  id: string;
  propertyId: string;
  status: ContractStatus;
  startDate: string;
  endDate: string;
  deposit: number;
  rent: number;
  escrowAmount: number;
  createdAt: string;
}

export const contracts: Contract[] = [
  {
    id: "c-4001",
    propertyId: "p-1005",
    status: "awaiting-signature",
    startDate: "2026-08-01T00:00:00Z",
    endDate: "2027-07-31T00:00:00Z",
    deposit: 500_000_000,
    rent: 9_000_000,
    escrowAmount: 50_000_000,
    createdAt: "2026-07-19T08:00:00Z",
  },
  {
    id: "c-4000",
    propertyId: "p-1003",
    status: "active",
    startDate: "2026-01-01T00:00:00Z",
    endDate: "2026-12-31T00:00:00Z",
    deposit: 800_000_000,
    rent: 14_000_000,
    escrowAmount: 80_000_000,
    createdAt: "2025-12-20T08:00:00Z",
  },
];

export const savedProperties: string[] = ["p-1001", "p-1002", "p-1007"];

export const bookingStatusLabels: Record<BookingStatus, string> = {
  requested: "در انتظار تأیید",
  confirmed: "تأییدشده",
  completed: "انجام‌شده",
  cancelled: "لغو‌شده",
};

export const offerStatusLabels: Record<OfferStatus, string> = {
  draft: "پیش‌نویس",
  sent: "ارسال‌شده",
  counter: "پیشنهاد متقابل",
  accepted: "پذیرفته‌شده",
  rejected: "ردشده",
};

export const contractStatusLabels: Record<ContractStatus, string> = {
  "awaiting-signature": "در انتظار امضا",
  "landlord-signed": "امضای مالک انجام شد",
  signed: "امضاشده",
  active: "فعال",
  ended: "پایان‌یافته",
};
