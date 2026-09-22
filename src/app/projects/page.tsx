import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Data, machine learning and engineering research projects published on Tumar.",
};

export default function ProjectsPage() {
  return (
    <ComingSoon
      title="Projects"
      description="A catalog of data, machine learning and engineering projects will appear here."
    />
  );
}
