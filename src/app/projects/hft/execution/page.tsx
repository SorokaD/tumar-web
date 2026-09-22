import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = {
  title: "Execution",
  description:
    "Execution experiments and market friction analysis for BTC-USDT perpetual microstructure research.",
};

export default function HftExecutionPage() {
  return (
    <ComingSoon
      title="Execution"
      description="Execution experiments and friction analysis are not published yet."
    />
  );
}
