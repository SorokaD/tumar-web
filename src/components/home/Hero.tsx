import { LiveResearchPanel } from "@/components/hft/LiveResearchPanel";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getLiveResearchSnapshot } from "@/lib/api/hft";
import { siteConfig } from "@/lib/config";

export async function Hero() {
  const snapshot = await getLiveResearchSnapshot();

  return (
    <section className="pt-16 pb-8 md:pt-20 md:pb-10">
      <Container>
        <div className="grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] md:gap-12 lg:gap-16">
          <div>
            <p className="mb-8 text-sm font-medium tracking-[0.32em] text-foreground md:mb-10">
              {siteConfig.wordmark}
            </p>
            <h1 className="max-w-xl text-4xl leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Engineering systems.
              <br />
              Exploring data.
              <br />
              Testing ideas.
            </h1>
            <p className="mt-8 max-w-md text-base leading-7 text-muted md:text-lg">
              Independent research in market microstructure, machine learning and
              realtime systems.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/projects">Explore Projects</ButtonLink>
              <ButtonLink href={siteConfig.githubUrl} variant="secondary" external>
                GitHub
              </ButtonLink>
            </div>
          </div>
          <LiveResearchPanel snapshot={snapshot} />
        </div>
      </Container>
    </section>
  );
}
