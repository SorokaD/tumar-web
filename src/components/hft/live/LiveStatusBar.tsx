import { formatClock } from "@/lib/format";
import type { LiveSystemStatus } from "@/types";

type LiveStatusBarProps = {
  status: LiveSystemStatus;
};

export function LiveStatusBar({ status }: LiveStatusBarProps) {
  return (
    <header>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl tracking-tight text-foreground md:text-4xl">
          Live HFT Research
        </h1>
        {status.isLive ? (
          <span className="inline-flex items-center gap-2 border border-border px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
            Live
          </span>
        ) : null}
      </div>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
        Live demo executor: random baseline control strategy, order lifecycle and
        fee-aware PnL from the research journal.
      </p>
      <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-xs text-muted">Instrument</dt>
          <dd className="mt-1 font-mono text-foreground">{status.instrument}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Environment</dt>
          <dd className="mt-1 font-mono text-foreground">{status.environment}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Last update</dt>
          <dd className="mt-1 font-mono text-foreground">
            {formatClock(status.lastUpdate)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Data latency</dt>
          <dd className="mt-1 font-mono text-foreground">
            {status.dataLatencyMs} ms
          </dd>
        </div>
      </dl>
    </header>
  );
}
