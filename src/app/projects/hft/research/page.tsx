import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Research notes on order book dynamics, feature engineering and predictive tests for BTC-USDT perpetuals.",
};

export default function HftResearchPage() {
  return (
    <ComingSoon
      title="Research"
      description="Notes on order book dynamics, features and predictive tests will land here."
    />
  );
}
