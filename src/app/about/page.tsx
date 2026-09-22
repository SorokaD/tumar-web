import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = {
  title: "About",
  description:
    "The person and engineering work behind Tumar — data, machine learning and realtime systems research.",
};

export default function AboutPage() {
  return (
    <ComingSoon
      title="About"
      description="A short note on the person and the work behind Tumar will appear here."
    />
  );
}
