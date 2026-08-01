import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  initialBalance,
  initialTransactions,
  type WalletTransaction,
  type WalletTxType,
} from "@/data/wallet";
import {
  getPlan,
  initialPromotions,
  type ActivePromotion,
  type PromotionPlanId,
} from "@/data/promotions";

export type UserRole = "tenant" | "landlord";

export interface AppUser {
  fullName: string;
  phone: string;
  role: UserRole;
}

interface AppStateValue {
  // احراز هویت شبیه‌سازی‌شده
  user: AppUser | null;
  signIn: (user: AppUser) => void;
  signOut: () => void;
  // کیف پول
  balance: number;
  transactions: WalletTransaction[];
  topUp: (amount: number) => void;
  // طرح‌های ارتقا
  promotions: Record<string, ActivePromotion>;
  purchasePromotion: (
    propertyId: string,
    planId: PromotionPlanId,
    propertyTitle: string,
  ) => { ok: boolean; reason?: "insufficient" };
}

const AppStateContext = createContext<AppStateValue | null>(null);

let txCounter = 0;
const nextTxId = () => `t-new-${++txCounter}`;

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [balance, setBalance] = useState<number>(initialBalance);
  const [transactions, setTransactions] =
    useState<WalletTransaction[]>(initialTransactions);
  const [promotions, setPromotions] =
    useState<Record<string, ActivePromotion>>(initialPromotions);

  const addTx = useCallback(
    (type: WalletTxType, amount: number, title: string) => {
      setTransactions((prev) => [
        {
          id: nextTxId(),
          type,
          amount,
          title,
          at: new Date().toISOString(),
        },
        ...prev,
      ]);
    },
    [],
  );

  const signIn = useCallback((u: AppUser) => setUser(u), []);
  const signOut = useCallback(() => setUser(null), []);

  const topUp = useCallback(
    (amount: number) => {
      setBalance((b) => b + amount);
      addTx("topup", amount, "شارژ از درگاه بانکی (شبیه‌سازی)");
    },
    [addTx],
  );

  const purchasePromotion = useCallback<AppStateValue["purchasePromotion"]>(
    (propertyId, planId, propertyTitle) => {
      const plan = getPlan(planId);
      if (balance < plan.price) return { ok: false, reason: "insufficient" };
      setBalance((b) => b - plan.price);
      addTx("spend", plan.price, `${plan.title} — ${propertyTitle}`);
      const now = new Date();
      setPromotions((prev) => ({
        ...prev,
        [propertyId]: {
          planId,
          bumpedAt: now.toISOString(),
          expiresAt: new Date(
            now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      }));
      return { ok: true };
    },
    [addTx, balance],
  );

  const value = useMemo(
    () => ({
      user,
      signIn,
      signOut,
      balance,
      transactions,
      topUp,
      promotions,
      purchasePromotion,
    }),
    [
      user,
      signIn,
      signOut,
      balance,
      transactions,
      topUp,
      promotions,
      purchasePromotion,
    ],
  );

  return (
    <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
  );
}

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error("useAppState باید داخل AppStateProvider استفاده شود.");
  }
  return ctx;
}
