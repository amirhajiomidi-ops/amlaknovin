// داده‌های Mock تبلیغات

export type AdPlacement =
  | "home-leaderboard"
  | "search-inline"
  | "search-sidebar"
  | "property-detail"
  | "panel-soft";

export interface AdCreative {
  id: string;
  advertiser: string;
  category: string;
  title: string;
  body: string;
  cta: string;
  placements: AdPlacement[];
  accent: "primary" | "accent" | "success" | "warning";
}

export const adCreatives: AdCreative[] = [
  {
    id: "ad-1",
    advertiser: "بانک مسکن‌یار",
    category: "وام و تسهیلات",
    title: "وام ودیعه مسکن تا ۵۰۰ میلیون تومان",
    body: "بازپرداخت ۳۶ ماهه با نرخ ویژه مستأجران دارای قرارداد رسمی.",
    cta: "بررسی شرایط",
    placements: ["home-leaderboard", "search-sidebar", "property-detail"],
    accent: "primary",
  },
  {
    id: "ad-2",
    advertiser: "دکوراسیون آرام‌خانه",
    category: "دکوراسیون داخلی",
    title: "بازطراحی خانه‌ی اجاره‌ای بدون تخریب",
    body: "مشاوره رایگان انتخاب مبلمان و نورپردازی برای واحدهای کوچک.",
    cta: "مشاوره رایگان",
    placements: ["search-inline", "property-detail", "panel-soft"],
    accent: "accent",
  },
  {
    id: "ad-3",
    advertiser: "اسباب‌کشی سبک‌بار",
    category: "حمل و نقل",
    title: "اسباب‌کشی بیمه‌شده در تهران و کرج",
    body: "بسته‌بندی حرفه‌ای، کارگر آموزش‌دیده و تضمین خسارت.",
    cta: "دریافت قیمت",
    placements: ["search-inline", "panel-soft"],
    accent: "warning",
  },
  {
    id: "ad-4",
    advertiser: "بیمه خانه امن",
    category: "بیمه",
    title: "بیمه آتش‌سوزی و مسئولیت مستأجر",
    body: "پوشش کامل لوازم منزل با حق بیمه ماهانه از ۹۵ هزار تومان.",
    cta: "محاسبه حق بیمه",
    placements: ["home-leaderboard", "search-sidebar", "panel-soft"],
    accent: "success",
  },
  {
    id: "ad-5",
    advertiser: "خدمات ساختمانی پایاسازه",
    category: "خدمات ساختمانی",
    title: "تعمیرات فوری ساختمان، ۲۴ ساعته",
    body: "لوله‌کشی، برق، نقاشی و سرویس پکیج با گارانتی کتبی.",
    cta: "درخواست تعمیرکار",
    placements: ["search-inline", "property-detail"],
    accent: "primary",
  },
];

export function adsFor(placement: AdPlacement): AdCreative[] {
  return adCreatives.filter((a) => a.placements.includes(placement));
}

export type CampaignStatus = "active" | "scheduled" | "paused" | "ended";

export const campaignStatusLabels: Record<CampaignStatus, string> = {
  active: "فعال",
  scheduled: "زمان‌بندی‌شده",
  paused: "متوقف",
  ended: "پایان‌یافته",
};

export interface AdCampaign {
  id: string;
  advertiser: string;
  placement: AdPlacement;
  from: string;
  to: string;
  status: CampaignStatus;
  impressions: number;
  clicks: number;
}

export const placementLabels: Record<AdPlacement, string> = {
  "home-leaderboard": "بنر افقی صفحه اصلی",
  "search-inline": "کارت درون‌لیستی نتایج",
  "search-sidebar": "ستون کناری نتایج",
  "property-detail": "صفحه جزئیات ملک",
  "panel-soft": "بنر ملایم پنل کاربران",
};

export const adCampaigns: AdCampaign[] = [
  {
    id: "c-1",
    advertiser: "بانک مسکن‌یار",
    placement: "home-leaderboard",
    from: "2026-07-01T00:00:00Z",
    to: "2026-08-30T00:00:00Z",
    status: "active",
    impressions: 184_320,
    clicks: 5_120,
  },
  {
    id: "c-2",
    advertiser: "دکوراسیون آرام‌خانه",
    placement: "search-inline",
    from: "2026-07-10T00:00:00Z",
    to: "2026-08-10T00:00:00Z",
    status: "active",
    impressions: 96_540,
    clicks: 2_310,
  },
  {
    id: "c-3",
    advertiser: "بیمه خانه امن",
    placement: "search-sidebar",
    from: "2026-08-05T00:00:00Z",
    to: "2026-09-05T00:00:00Z",
    status: "scheduled",
    impressions: 0,
    clicks: 0,
  },
  {
    id: "c-4",
    advertiser: "اسباب‌کشی سبک‌بار",
    placement: "panel-soft",
    from: "2026-06-01T00:00:00Z",
    to: "2026-07-01T00:00:00Z",
    status: "ended",
    impressions: 42_900,
    clicks: 1_004,
  },
  {
    id: "c-5",
    advertiser: "خدمات ساختمانی پایاسازه",
    placement: "property-detail",
    from: "2026-07-15T00:00:00Z",
    to: "2026-08-15T00:00:00Z",
    status: "paused",
    impressions: 31_200,
    clicks: 780,
  },
];
