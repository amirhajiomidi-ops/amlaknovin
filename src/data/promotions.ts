// طرح‌های ارتقای آگهی (Mock)

export type PromotionPlanId =
  | "bump-once"
  | "bump-auto-7"
  | "featured"
  | "urgent";

export interface PromotionPlan {
  id: PromotionPlanId;
  title: string;
  price: number; // تومان
  durationDays: number;
  description: string;
  badgeLabel: string;
}

export const promotionPlans: PromotionPlan[] = [
  {
    id: "bump-once",
    title: "نردبان (یک‌بار)",
    price: 120_000,
    durationDays: 1,
    description: "آگهی شما یک‌بار به بالای فهرست نتایج منتقل می‌شود.",
    badgeLabel: "نردبان",
  },
  {
    id: "bump-auto-7",
    title: "نردبان خودکار (۷ روزه)",
    price: 650_000,
    durationDays: 7,
    description: "هر روز به‌صورت خودکار آگهی نردبان می‌شود؛ به مدت یک هفته.",
    badgeLabel: "نردبان خودکار",
  },
  {
    id: "featured",
    title: "آگهی ویژه (سنجاق)",
    price: 1_400_000,
    durationDays: 14,
    description:
      "سنجاق در بخش «آگهی‌های ویژه» بالای نتایج به همراه نشان رنگی ویژه.",
    badgeLabel: "ویژه",
  },
  {
    id: "urgent",
    title: "فوری / برجسته",
    price: 400_000,
    durationDays: 5,
    description: "کارت آگهی با قاب برجسته و نشان «فوری» نمایش داده می‌شود.",
    badgeLabel: "فوری",
  },
];

export function getPlan(id: PromotionPlanId): PromotionPlan {
  return promotionPlans.find((p) => p.id === id) ?? promotionPlans[0];
}

export interface ActivePromotion {
  planId: PromotionPlanId;
  expiresAt: string; // ISO
  bumpedAt: string; // ISO — زمان آخرین نردبان
}

const day = 24 * 60 * 60 * 1000;
const now = Date.now();

export const initialPromotions: Record<string, ActivePromotion> = {
  "p-1002": {
    planId: "featured",
    expiresAt: new Date(now + 9 * day).toISOString(),
    bumpedAt: new Date(now - 2 * day).toISOString(),
  },
  "p-1005": {
    planId: "bump-auto-7",
    expiresAt: new Date(now + 4 * day).toISOString(),
    bumpedAt: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
  },
  "p-1003": {
    planId: "urgent",
    expiresAt: new Date(now + 2 * day).toISOString(),
    bumpedAt: new Date(now - 1 * day).toISOString(),
  },
};
