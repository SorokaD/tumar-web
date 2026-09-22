import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = {
  title: "HFT Research Lab",
  description:
    "BTC-USDT perpetual market microstructure research: order book dynamics, features, models and execution experiments.",
};

export default function HftProjectPage() {
  return (
    <ComingSoon
      title="HFT Research Lab"
      description="BTC-USDT perpetual market microstructure research. Full project notes are being prepared."
    />
  );
}
