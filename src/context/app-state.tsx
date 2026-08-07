import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
import {
  offers as initialOffers,
  visitBookings as initialBookings,
  type Offer,
  type VisitBooking,
} from "@/data/tenant";

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
  // بازدیدها و پیشنهادهای مستأجر
  bookings: VisitBooking[];
  offers: Offer[];
  addBooking: (input: {
    propertyId: string;
    date: string;
    slot: string;
    channel: VisitBooking["channel"];
  }) => VisitBooking;
  addOffer: (input: {
    propertyId: string;
    deposit: number;
    rent: number;
    message: string;
  }) => Offer;
}

const AppStateContext = createContext<AppStateValue | null>(null);

let txCounter = 0;
const nextTxId = () => `t-new-${++txCounter}`;
let bookingCounter = 0;
let offerCounter = 0;

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);

  // نگه‌داشتن نشست کاربر در همان تب (بدون از بین رفتن با رفرش صفحه)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("amlak-user");
      if (raw) setUser(JSON.parse(raw) as AppUser);
    } catch {
      /* noop */
    }
  }, []);
  const [balance, setBalance] = useState<number>(initialBalance);
  const [transactions, setTransactions] =
    useState<WalletTransaction[]>(initialTransactions);
  const [promotions, setPromotions] =
    useState<Record<string, ActivePromotion>>(initialPromotions);
  const [bookings, setBookings] = useState<VisitBooking[]>(initialBookings);
  const [offers, setOffers] = useState<Offer[]>(initialOffers);

  const addBooking = useCallback<AppStateValue["addBooking"]>((input) => {
    const booking: VisitBooking = {
      id: `b-new-${++bookingCounter}`,
      propertyId: input.propertyId,
      date: input.date,
      slot: input.slot,
      channel: input.channel,
      status: "requested",
    };
    setBookings((prev) => [booking, ...prev]);
    return booking;
  }, []);

  const addOffer = useCallback<AppStateValue["addOffer"]>((input) => {
    const at = new Date().toISOString();
    const offer: Offer = {
      id: `o-new-${++offerCounter}`,
      propertyId: input.propertyId,
      status: "sent",
      currentDeposit: input.deposit,
      currentRent: input.rent,
      updatedAt: at,
      messages: [
        {
          from: "tenant",
          at,
          text: input.message || "پیشنهاد من برای این فایل.",
          deposit: input.deposit,
          rent: input.rent,
        },
      ],
    };
    setOffers((prev) => [offer, ...prev]);
    return offer;
  }, []);

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

  const signIn = useCallback((u: AppUser) => {
    setUser(u);
    try {
      sessionStorage.setItem("amlak-user", JSON.stringify(u));
    } catch {
      /* noop */
    }
  }, []);
  const signOut = useCallback(() => {
    setUser(null);
    try {
      sessionStorage.removeItem("amlak-user");
    } catch {
      /* noop */
    }
  }, []);

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
      bookings,
      offers,
      addBooking,
      addOffer,
    }),
    [
      bookings,
      offers,
      addBooking,
      addOffer,
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
