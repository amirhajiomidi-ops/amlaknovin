// داده‌های Mock پنل موجر

export interface LandlordProfile {
  fullName: string;
  phone: string;
  verified: boolean;
  memberSince: string;
  responseRate: number; // درصد
}

export const landlordProfile: LandlordProfile = {
  fullName: "کامران راد",
  phone: "۰۹۱۲۹۸۷۶۵۴۳",
  verified: true,
  memberSince: "2025-03-11T00:00:00Z",
  responseRate: 92,
};

// آگهی‌های متعلق به این موجر (ارجاع به src/data/properties.ts)
export const landlordPropertyIds = [
  "p-1002",
  "p-1003",
  "p-1005",
  "p-1006",
  "p-1008",
];

export interface ListingStats {
  views: number;
  saves: number;
  visitRequests: number;
}

export const listingStats: Record<string, ListingStats> = {
  "p-1002": { views: 4_210, saves: 132, visitRequests: 18 },
  "p-1003": { views: 1_860, saves: 54, visitRequests: 7 },
  "p-1005": { views: 2_940, saves: 88, visitRequests: 12 },
  "p-1006": { views: 410, saves: 6, visitRequests: 1 },
  "p-1008": { views: 980, saves: 21, visitRequests: 3 },
};

export type VisitRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "rescheduled";

export const visitRequestStatusLabels: Record<VisitRequestStatus, string> = {
  pending: "در انتظار پاسخ شما",
  approved: "تأییدشده",
  rejected: "ردشده",
  rescheduled: "زمان جایگزین پیشنهاد شد",
};

export interface LandlordVisitRequest {
  id: string;
  propertyId: string;
  tenantName: string;
  tenantVerified: boolean;
  creditScore: number;
  date: string;
  slot: string;
  channel: "حضوری" | "تور آنلاین";
  status: VisitRequestStatus;
}

export const landlordVisitRequests: LandlordVisitRequest[] = [
  {
    id: "lv-1",
    propertyId: "p-1002",
    tenantName: "نگین شریفی",
    tenantVerified: true,
    creditScore: 720,
    date: "2026-08-03T15:00:00Z",
    slot: "۱۸:۰۰ تا ۱۹:۰۰",
    channel: "تور آنلاین",
    status: "pending",
  },
  {
    id: "lv-2",
    propertyId: "p-1005",
    tenantName: "سعید موحد",
    tenantVerified: true,
    creditScore: 810,
    date: "2026-08-02T12:30:00Z",
    slot: "۱۶:۰۰ تا ۱۷:۰۰",
    channel: "حضوری",
    status: "approved",
  },
  {
    id: "lv-3",
    propertyId: "p-1003",
    tenantName: "هستی کریمی",
    tenantVerified: false,
    creditScore: 540,
    date: "2026-08-04T09:00:00Z",
    slot: "۱۲:۳۰ تا ۱۳:۳۰",
    channel: "حضوری",
    status: "pending",
  },
  {
    id: "lv-4",
    propertyId: "p-1008",
    tenantName: "رضا نیک‌پور",
    tenantVerified: true,
    creditScore: 690,
    date: "2026-07-28T13:00:00Z",
    slot: "۱۶:۳۰ تا ۱۷:۳۰",
    channel: "حضوری",
    status: "rescheduled",
  },
];

export interface LandlordOffer {
  id: string;
  propertyId: string;
  tenantName: string;
  tenantVerified: boolean;
  creditScore: number;
  status: "open" | "accepted" | "rejected" | "countered";
  deposit: number;
  rent: number;
  updatedAt: string;
  messages: Array<{
    from: "tenant" | "landlord";
    at: string;
    text: string;
    deposit?: number;
    rent?: number;
  }>;
}

export const landlordOfferStatusLabels: Record<
  LandlordOffer["status"],
  string
> = {
  open: "در انتظار پاسخ شما",
  accepted: "پذیرفته‌شده",
  rejected: "ردشده",
  countered: "پیشنهاد متقابل ارسال شد",
};

export const landlordOffers: LandlordOffer[] = [
  {
    id: "lo-1",
    propertyId: "p-1002",
    tenantName: "نگین شریفی",
    tenantVerified: true,
    creditScore: 720,
    status: "open",
    deposit: 4_100_000_000,
    rent: 0,
    updatedAt: "2026-07-30T09:30:00Z",
    messages: [
      {
        from: "tenant",
        at: "2026-07-30T09:30:00Z",
        text: "امکان کاهش ودیعه تا ۴.۱ میلیارد وجود دارد؟",
        deposit: 4_100_000_000,
        rent: 0,
      },
    ],
  },
  {
    id: "lo-2",
    propertyId: "p-1005",
    tenantName: "سعید موحد",
    tenantVerified: true,
    creditScore: 810,
    status: "accepted",
    deposit: 500_000_000,
    rent: 9_000_000,
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
        text: "پذیرفته شد؛ لطفاً رزرو را با پرداخت امن نهایی کنید.",
      },
    ],
  },
  {
    id: "lo-3",
    propertyId: "p-1003",
    tenantName: "هستی کریمی",
    tenantVerified: false,
    creditScore: 540,
    status: "countered",
    deposit: 850_000_000,
    rent: 13_000_000,
    updatedAt: "2026-07-29T18:20:00Z",
    messages: [
      {
        from: "tenant",
        at: "2026-07-29T10:00:00Z",
        text: "ودیعه بیشتر می‌دهم، اجاره کمتر شود.",
        deposit: 900_000_000,
        rent: 12_000_000,
      },
      {
        from: "landlord",
        at: "2026-07-29T18:20:00Z",
        text: "پیشنهاد متقابل با اجاره ۱۳ میلیون.",
        deposit: 850_000_000,
        rent: 13_000_000,
      },
    ],
  },
];

export interface LandlordContract {
  id: string;
  propertyId: string;
  tenantName: string;
  status: "awaiting-landlord" | "awaiting-tenant" | "active" | "ended";
  startDate: string;
  endDate: string;
  deposit: number;
  rent: number;
  escrowAmount: number;
  settled: boolean;
}

export const landlordContractStatusLabels: Record<
  LandlordContract["status"],
  string
> = {
  "awaiting-landlord": "در انتظار امضای شما",
  "awaiting-tenant": "در انتظار امضای مستأجر",
  active: "فعال",
  ended: "پایان‌یافته",
};

export const landlordContracts: LandlordContract[] = [
  {
    id: "lc-1",
    propertyId: "p-1005",
    tenantName: "سعید موحد",
    status: "awaiting-landlord",
    startDate: "2026-08-01T00:00:00Z",
    endDate: "2027-07-31T00:00:00Z",
    deposit: 500_000_000,
    rent: 9_000_000,
    escrowAmount: 50_000_000,
    settled: false,
  },
  {
    id: "lc-2",
    propertyId: "p-1003",
    tenantName: "نگین شریفی",
    status: "active",
    startDate: "2026-01-01T00:00:00Z",
    endDate: "2026-12-31T00:00:00Z",
    deposit: 800_000_000,
    rent: 14_000_000,
    escrowAmount: 80_000_000,
    settled: true,
  },
];
