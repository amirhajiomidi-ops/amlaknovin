import { useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Handshake } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppState } from "@/context/app-state";
import type { Property } from "@/data/properties";
import { formatCompactTomans, toFaDigits } from "@/lib/format";

const MILLION = 1_000_000;

export function OfferDialog({
  property,
  trigger,
}: {
  property: Property;
  trigger: ReactNode;
}) {
  const { user, addOffer } = useAppState();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [deposit, setDeposit] = useState(String(property.deposit / MILLION));
  const [rent, setRent] = useState(String(property.rent / MILLION));
  const [message, setMessage] = useState("");

  const depositValue = Number(deposit) * MILLION;
  const rentValue = Number(rent) * MILLION;
  const valid =
    Number.isFinite(depositValue) &&
    depositValue > 0 &&
    Number.isFinite(rentValue) &&
    rentValue >= 0;

  const handleOpenChange = (next: boolean) => {
    if (next && !user) {
      toast.info("برای ثبت پیشنهاد ابتدا وارد حساب کاربری شوید.");
      void navigate({ to: "/auth", search: { mode: "login" } });
      return;
    }
    if (next && user?.role === "tenant" && !user.identityVerified) {
      toast.warning("برای ثبت پیشنهاد ابتدا احراز هویت را در پروفایل مالی کامل کنید.");
      void navigate({ to: "/tenant/profile" });
      return;
    }
    setOpen(next);

    if (!next)
      setTimeout(() => {
        setDone(false);
        setDeposit(String(property.deposit / MILLION));
        setRent(String(property.rent / MILLION));
        setMessage("");
      }, 200);
  };

  const submit = () => {
    if (!valid) return;
    addOffer({
      propertyId: property.id,
      deposit: depositValue,
      rent: rentValue,
      message,
    });
    setDone(true);
    toast.success("پیشنهاد شما برای مالک ارسال شد.");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        {done ? (
          <div className="space-y-4 py-4 text-center">
            <CheckCircle2 className="mx-auto size-12 text-success" aria-hidden />
            <DialogTitle className="text-lg">پیشنهاد ثبت شد</DialogTitle>
            <DialogDescription>
              ودیعه {formatCompactTomans(depositValue)} و اجاره{" "}
              {formatCompactTomans(rentValue)} برای مالک ارسال شد. پاسخ در
              «پیشنهادهای من» نمایش داده می‌شود.
            </DialogDescription>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => {
                  setOpen(false);
                  void navigate({ to: "/tenant/offers" });
                }}
              >
                مشاهده پیشنهادها
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleOpenChange(false)}
              >
                بستن
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>ثبت پیشنهاد</DialogTitle>
              <DialogDescription>
                مبالغ پیشنهادی خود را وارد کنید. مالک می‌تواند بپذیرد یا پیشنهاد
                متقابل بدهد.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="rounded-xl bg-muted p-3 text-xs text-muted-foreground">
                قیمت آگهی: ودیعه {formatCompactTomans(property.deposit)}
                {property.dealType === "rent"
                  ? ` — اجاره ${formatCompactTomans(property.rent)}`
                  : " — رهن کامل"}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="offer-deposit">ودیعه (میلیون تومان)</Label>
                  <Input
                    id="offer-deposit"
                    inputMode="numeric"
                    value={deposit}
                    onChange={(e) =>
                      setDeposit(e.target.value.replace(/[^\d.]/g, ""))
                    }
                  />
                  <p className="text-[11px] text-muted-foreground">
                    {toFaDigits(
                      new Intl.NumberFormat("en-US").format(
                        Number.isFinite(depositValue) ? depositValue : 0,
                      ),
                    )}{" "}
                    تومان
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="offer-rent">اجاره ماهانه (میلیون تومان)</Label>
                  <Input
                    id="offer-rent"
                    inputMode="numeric"
                    value={rent}
                    onChange={(e) =>
                      setRent(e.target.value.replace(/[^\d.]/g, ""))
                    }
                  />
                  <p className="text-[11px] text-muted-foreground">
                    {toFaDigits(
                      new Intl.NumberFormat("en-US").format(
                        Number.isFinite(rentValue) ? rentValue : 0,
                      ),
                    )}{" "}
                    تومان
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="offer-message">پیام به مالک (اختیاری)</Label>
                <Textarea
                  id="offer-message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="مثلاً: امکان تحویل از ابتدای ماه آینده را دارم."
                />
              </div>
            </div>

            <DialogFooter>
              <Button className="w-full" disabled={!valid} onClick={submit}>
                <Handshake className="size-4" aria-hidden />
                ارسال پیشنهاد به مالک
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
