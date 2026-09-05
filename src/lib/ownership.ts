import { landlordPropertyIds } from "@/data/landlord";
import type { AppUser } from "@/context/app-state";

/** آیا این آگهی متعلق به خود کاربر است؟ (شبیه‌سازی با آگهی‌های موجر نمونه) */
export function isOwnProperty(
  user: AppUser | null,
  propertyId: string,
): boolean {
  if (!user || !user.roles.includes("landlord")) return false;
  return landlordPropertyIds.includes(propertyId);
}
