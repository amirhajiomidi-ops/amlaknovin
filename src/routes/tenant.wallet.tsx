import { createFileRoute } from "@tanstack/react-router";

import { WalletPanel } from "@/components/wallet/wallet-panel";

export const Route = createFileRoute("/tenant/wallet")({
  component: () => <WalletPanel audience="tenant" />,
});
