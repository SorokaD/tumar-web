import { LiveMetricCard } from "@/components/hft/live/LiveMetricCard";
import type { ResearchMetrics as ResearchMetricsData } from "@/types";

type ResearchMetricsProps = {
  metrics: ResearchMetricsData;
  title?: string;
  description?: string;
};

export function ResearchMetrics({
  metrics,
  title = "Theoretical research",
  description = "Theoretical metrics do not include trading fees or execution friction.",
}: ResearchMetricsProps) {
  const items = [
    metrics.frictionlessEdge,
    metrics.predictionCount,
    metrics.hitRate,
    metrics.meanRealizedMovement,
    metrics.modelConfidence,
  ];

  return (
    <section className="border border-border bg-surface p-5 md:p-6">
      <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-foreground">
        {title}
      </h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-muted">
        {description}
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((metric) => (
          <LiveMetricCard
            key={metric.label}
            metric={metric}
            accent={metric.label === "Frictionless edge"}
          />
        ))}
      </div>
    </section>
  );
}
