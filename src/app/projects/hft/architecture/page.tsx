import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = {
  title: "Architecture",
  description:
    "System design for market data, features, models and execution in the Tumar HFT research stack.",
};

export default function HftArchitecturePage() {
  return (
    <ComingSoon
      title="Architecture"
      description="System design for market data, features, models and execution will be documented here."
    />
  );
}
