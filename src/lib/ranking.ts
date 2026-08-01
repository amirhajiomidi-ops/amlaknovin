import type { Property } from "@/data/properties";
import type { ActivePromotion } from "@/data/promotions";

export type PromoMap = Record<string, ActivePromotion>;

export function isActive(promo?: ActivePromotion): boolean {
  if (!promo) return false;
  return new Date(promo.expiresAt).getTime() > Date.now();
}

export function activePromo(
  promos: PromoMap,
  id: string,
): ActivePromotion | undefined {
  const p = promos[id];
  return isActive(p) ? p : undefined;
}

export function isFeatured(promos: PromoMap, id: string): boolean {
  return activePromo(promos, id)?.planId === "featured";
}

const bumpTime = (promos: PromoMap, id: string) => {
  const p = activePromo(promos, id);
  return p ? new Date(p.bumpedAt).getTime() : 0;
};

/**
 * مرتب‌سازی پیش‌فرض: ویژه‌ها بالا، سپس نردبان‌شده‌ها بر اساس زمان نردبان،
 * سپس بقیه بر اساس مرتب‌سازی پایه.
 */
export function rankWithPromotions(
  list: Property[],
  promos: PromoMap,
): { featured: Property[]; rest: Property[] } {
  const featured = list.filter((p) => isFeatured(promos, p.id));
  const rest = list
    .filter((p) => !isFeatured(promos, p.id))
    .sort((a, b) => bumpTime(promos, b.id) - bumpTime(promos, a.id));
  return { featured, rest };
}

/**
 * در مرتب‌سازی‌های صریح (ارزان‌ترین/گران‌ترین و…) حداکثر ۲ اسلات ویژه بالا می‌ماند.
 */
export function pinLimitedFeatured(
  sortedList: Property[],
  promos: PromoMap,
  maxSlots = 2,
): { pinned: Property[]; rest: Property[] } {
  const pinned = sortedList
    .filter((p) => isFeatured(promos, p.id))
    .slice(0, maxSlots);
  const pinnedIds = new Set(pinned.map((p) => p.id));
  return { pinned, rest: sortedList.filter((p) => !pinnedIds.has(p.id)) };
}

export function daysLeft(expiresAt: string): number {
  const ms = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}
