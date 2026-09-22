import type { Metadata } from "next";
import { AboutIntro } from "@/components/about/AboutIntro";
import { FocusAreas } from "@/components/about/FocusAreas";
import { ProfileLinks } from "@/components/about/ProfileLinks";
import { ResearchQuestion } from "@/components/about/ResearchQuestion";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: { absolute: "About — TUMAR" },
  description:
    "About Dmitrii Soroka and TUMAR, an independent research and engineering project focused on data, machine learning, quantitative research and realtime systems.",
};

export default function AboutPage() {
  return (
    <article className="pb-20 md:pb-28">
      <section className="pt-16 pb-12 md:pt-20 md:pb-16">
        <Container>
          <AboutIntro />
        </Container>
      </section>

      <section className="border-t border-border py-12 md:py-16">
        <Container>
          <ResearchQuestion />
        </Container>
      </section>

      <section className="border-t border-border py-12 md:py-16">
        <Container>
          <FocusAreas />
        </Container>
      </section>

      <section className="border-t border-border py-12 md:py-16">
        <Container>
          <ProfileLinks />
        </Container>
      </section>
    </article>
  );
}
