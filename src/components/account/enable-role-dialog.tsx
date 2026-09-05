import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAppState, type UserRole } from "@/context/app-state";

const copy: Record<UserRole, { title: string; body: string; cta: string }> = {
  tenant: {
    title: "فعال‌سازی حساب مستأجر",
    body: "برای رزرو بازدید یا ثبت پیشنهاد، حساب مستأجر شما فعال می‌شود. حساب موجر شما دست‌نخورده باقی می‌ماند و هر زمان می‌توانید بین دو حالت جابه‌جا شوید.",
    cta: "فعال‌سازی و ادامه",
  },
  landlord: {
    title: "فعال‌سازی حساب موجر",
    body: "برای ثبت ملک، حساب موجر شما فعال می‌شود. حساب مستأجر شما حفظ می‌شود و هر زمان می‌توانید بین دو حالت جابه‌جا شوید.",
    cta: "فعال‌سازی و ادامه",
  },
};

export function EnableRoleDialog({
  role,
  open,
  onOpenChange,
  onEnabled,
}: {
  role: UserRole;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEnabled?: () => void;
}) {
  const { enableRole } = useAppState();
  const t = copy[role];

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t.title}</AlertDialogTitle>
          <AlertDialogDescription className="leading-7">
            {t.body}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>انصراف</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              enableRole(role);
              onOpenChange(false);
              onEnabled?.();
            }}
          >
            {t.cta}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
