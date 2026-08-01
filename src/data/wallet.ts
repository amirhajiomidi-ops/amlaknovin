// داده‌های Mock کیف پول

export type WalletTxType = "topup" | "spend" | "refund";

export interface WalletTransaction {
  id: string;
  type: WalletTxType;
  amount: number; // تومان (مثبت)
  title: string;
  at: string; // ISO
}

export const walletTxLabels: Record<WalletTxType, string> = {
  topup: "شارژ کیف پول",
  spend: "کسر بابت طرح",
  refund: "بازگشت وجه",
};

export const topupPackages = [
  200_000, 500_000, 1_000_000, 2_000_000, 5_000_000,
] as const;

export const initialBalance = 2_450_000;

export const initialTransactions: WalletTransaction[] = [
  {
    id: "t-9001",
    type: "topup",
    amount: 3_000_000,
    title: "شارژ از درگاه بانکی",
    at: "2026-07-12T09:20:00Z",
  },
  {
    id: "t-9002",
    type: "spend",
    amount: 1_400_000,
    title: "آگهی ویژه — الهیه",
    at: "2026-07-14T11:05:00Z",
  },
  {
    id: "t-9003",
    type: "spend",
    amount: 650_000,
    title: "نردبان خودکار ۷ روزه — گوهردشت",
    at: "2026-07-17T08:40:00Z",
  },
  {
    id: "t-9004",
    type: "refund",
    amount: 500_000,
    title: "بازگشت وجه طرح لغو‌شده",
    at: "2026-07-19T15:10:00Z",
  },
  {
    id: "t-9005",
    type: "topup",
    amount: 1_000_000,
    title: "شارژ از درگاه بانکی",
    at: "2026-07-21T07:00:00Z",
  },
];
