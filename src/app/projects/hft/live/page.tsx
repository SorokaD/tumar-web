import type { Metadata } from "next";
import { ExecutionMetrics } from "@/components/hft/live/ExecutionMetrics";
import { LiveChart } from "@/components/hft/live/LiveChart";
import { LiveModelTable } from "@/components/hft/live/LiveModelTable";
import { LiveStatusBar } from "@/components/hft/live/LiveStatusBar";
import { RecentActivity } from "@/components/hft/live/RecentActivity";
import { ResearchMetrics } from "@/components/hft/live/ResearchMetrics";
import { SystemStatusCard } from "@/components/hft/live/SystemStatusCard";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getLiveHftDashboardDetailed } from "@/lib/api/hft";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Live HFT Research",
  description:
    "Live demo of the OKX HFT executor: random baseline control strategy, orders, fills and PnL.",
};

export const dynamic = "force-dynamic";
export const revalidate = 30;

export default async function HftLivePage() {
  const { dashboard, source, error } = await getLiveHftDashboardDetailed();
  const supersetUrl = siteConfig.supersetPublicUrl;
  const isLiveFeed = source === "database";

  return (
    <div className="pb-16">
      <section className="pt-10 pb-8 md:pt-12">
        <Container wide>
          <LiveStatusBar status={dashboard.status} />
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
            {isLiveFeed
              ? "Fed from the demo executor journal in TimescaleDB (read-only). Random baseline is the control group for future model strategies."
              : "Showing local sample data. Set HFT_DATABASE_URL on the web runtime to stream the live demo journal."}
            {error ? ` Feed error: ${error}` : null}
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {dashboard.statusCards.map((card) => (
              <SystemStatusCard key={card.title} card={card} />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border py-10 md:py-12">
        <Container wide>
          <h2 className="mb-6 text-xl tracking-tight text-foreground">
            Active strategies
          </h2>
          <LiveModelTable rows={dashboard.models} />
          <p className="mt-3 text-xs text-muted">
            Random baseline chooses direction at random under the same risk and
            execution rules used by future models. Not investment advice.
          </p>
        </Container>
      </section>

      {(dashboard.recentTrades?.length || dashboard.recentOrders?.length) ? (
        <section className="border-t border-border py-10 md:py-12">
          <Container wide>
            <h2 className="mb-6 text-xl tracking-tight text-foreground">
              Live activity
            </h2>
            <RecentActivity
              trades={dashboard.recentTrades ?? []}
              orders={dashboard.recentOrders ?? []}
            />
          </Container>
        </section>
      ) : null}

      <section className="border-t border-border py-10 md:py-12">
        <Container wide>
          <h2 className="mb-6 text-xl tracking-tight text-foreground">
            Execution telemetry
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {dashboard.charts.map((chart) => (
              <LiveChart key={chart.id} chart={chart} />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border py-10 md:py-12">
        <Container wide>
          <div className="grid gap-4 lg:grid-cols-2">
            <ResearchMetrics
              metrics={dashboard.research}
              title={isLiveFeed ? "Baseline calibration" : "Theoretical research"}
              description={
                isLiveFeed
                  ? "Control-strategy stats from the last 24 hours of demo trading."
                  : "Theoretical metrics do not include trading fees or execution friction."
              }
            />
            <ExecutionMetrics metrics={dashboard.execution} />
          </div>
        </Container>
      </section>

      <section className="border-t border-border py-10 md:py-12">
        <Container wide>
          <h2 className="text-xl tracking-tight text-foreground">
            Deep Research Dashboard
          </h2>
          <p className="mt-3 max-w-xl text-base leading-7 text-muted">
            Explore detailed analytics and historical experiments.
          </p>
          {supersetUrl ? (
            <div className="mt-6">
              <ButtonLink href={supersetUrl} external>
                Open Full Dashboard
              </ButtonLink>
            </div>
          ) : null}
        </Container>
      </section>
    </div>
  );
}
