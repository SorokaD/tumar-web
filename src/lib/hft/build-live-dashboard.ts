import { liveHftDashboard } from "@/lib/mock/live-hft";
import { isHftDbConfigured } from "@/lib/db/hft";
import {
  fetchCumulativePnlSeries,
  fetchFills24hCount,
  fetchLatestRun,
  fetchLatestSignal,
  fetchOpenPositionCount,
  fetchRecentOrders,
  fetchRecentTrades,
  fetchSignals24hCount,
  fetchTradeAgg24h,
  publicInstrument,
  publicStrategyName,
} from "@/lib/hft/live-queries";
import { formatInteger, formatSignedMetric } from "@/lib/format";
import type {
  ExecutionMetrics,
  LiveChartSpec,
  LiveHftDashboard,
  LiveModelRow,
  LiveRecentOrder,
  LiveRecentTrade,
  LiveResearchSnapshot,
  LiveStatusCard,
  LiveSystemStatus,
  ModelStatus,
  ResearchMetrics,
  TradingSignal,
} from "@/types";

function num(value: string | null | undefined): number {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function mapSide(side: string): TradingSignal["side"] {
  const s = side.toLowerCase();
  if (s === "long" || s === "buy") return "buy";
  if (s === "short" || s === "sell") return "sell";
  return "flat";
}

function runModelStatus(status: string | null | undefined): ModelStatus {
  if (status === "running") return "ready";
  if (status === "draining") return "degraded";
  if (status === "error") return "offline";
  return "idle";
}

function metric(
  label: string,
  value: number,
  display: string,
  unit?: string,
): { label: string; value: number; display: string; unit?: string } {
  return unit ? { label, value, unit, display } : { label, value, display };
}

function pctDisplay(ratio: number): string {
  return `${Math.round(ratio * 100)}%`;
}

export type LiveDashboardSource = "database" | "mock";

export type LiveDashboardResult = {
  dashboard: LiveHftDashboard;
  source: LiveDashboardSource;
  error?: string;
};

export async function buildLiveHftDashboard(): Promise<LiveDashboardResult> {
  if (!isHftDbConfigured()) {
    return { dashboard: liveHftDashboard, source: "mock" };
  }

  try {
    const [
      run,
      openPositions,
      agg,
      signals24h,
      fills24h,
      pnlSeries,
      recentTrades,
      recentOrders,
      latestSignal,
    ] = await Promise.all([
      fetchLatestRun(),
      fetchOpenPositionCount(),
      fetchTradeAgg24h(),
      fetchSignals24hCount(),
      fetchFills24hCount(),
      fetchCumulativePnlSeries(48),
      fetchRecentTrades(15),
      fetchRecentOrders(15),
      fetchLatestSignal(),
    ]);

    const now = new Date();
    const lastUpdate = (
      latestSignal?.ts_decision ??
      recentOrders[0]?.ts_created ??
      run?.started_at ??
      now
    ).toISOString();

    const latencyMs = Math.max(
      0,
      now.getTime() - Date.parse(lastUpdate),
    );

    const instrument = run?.inst_id || publicInstrument();
    const strategy = run?.strategy_name || publicStrategyName();
    const runtime = run?.runtime_mode || "demo";
    const envLabel = [
      runtime,
      run?.environment_name,
      run?.status === "running" ? "running" : run?.status || "unknown",
    ]
      .filter(Boolean)
      .join(" / ");

    const trades = num(agg?.trades);
    const wins = num(agg?.wins);
    const netPnl = num(agg?.net_pnl);
    const grossPnl = num(agg?.gross_pnl);
    const fees = num(agg?.fees_total);
    const makerEntries = num(agg?.maker_entries);
    const winRate = trades > 0 ? wins / trades : 0;
    const makerRatio = trades > 0 ? makerEntries / trades : 0;
    const avgHold = num(agg?.avg_hold_sec);
    const timeoutExits = num(agg?.timeout_exits);
    const timeoutRatio = trades > 0 ? timeoutExits / trades : 0;
    const avgSlippage = num(agg?.avg_slippage);

    const status: LiveSystemStatus = {
      instrument,
      environment: envLabel,
      isLive: run?.status === "running",
      lastUpdate,
      dataLatencyMs: latencyMs,
    };

    const statusCards: LiveStatusCard[] = [
      {
        title: "Executor",
        accent: run?.status === "running",
        primary: metric(
          "Status",
          run?.status === "running" ? 1 : 0,
          run?.status === "running" ? "Running" : run?.status || "Unknown",
        ),
        secondary: metric(
          "Open positions",
          openPositions,
          String(openPositions),
        ),
      },
      {
        title: "Strategy",
        primary: metric("Active", 1, strategy),
        secondary: metric("Runtime", 0, runtime),
      },
      {
        title: "Signals 24h",
        primary: metric("Count", signals24h, formatInteger(signals24h)),
      },
      {
        title: "Trades 24h",
        primary: metric("Closed", trades, formatInteger(trades)),
        secondary: metric("Win rate", winRate, pctDisplay(winRate)),
      },
      {
        title: "Net PnL 24h",
        accent: true,
        primary: metric(
          "USDT",
          netPnl,
          formatSignedMetric(netPnl, "USDT"),
          "USDT",
        ),
      },
    ];

    const signal: TradingSignal | null = latestSignal
      ? {
          id: latestSignal.signal_id,
          symbol: latestSignal.inst_id,
          side: mapSide(latestSignal.side),
          confidence: 0.5,
          createdAt: latestSignal.ts_decision.toISOString(),
          modelId: strategy,
        }
      : null;

    const models: LiveModelRow[] = [
      {
        id: strategy,
        name: "Random Baseline",
        horizon: "control",
        signal,
        rollingEdge: {
          name: "Net PnL 24h",
          value: netPnl,
          unit: "USDT",
          updatedAt: lastUpdate,
        },
        status: runModelStatus(run?.status),
      },
    ];

    const pnlPoints = pnlSeries.map((row) => ({
      timestamp: row.exit_ts.toISOString(),
      value: num(row.cumulative_net),
    }));

    const charts: LiveChartSpec[] = [
      {
        id: "execution-pnl",
        title: "Cumulative net PnL (7d)",
        updatedAt: lastUpdate,
        series: [
          {
            id: "pnl",
            label: "Net PnL",
            points:
              pnlPoints.length > 0
                ? pnlPoints
                : [{ timestamp: lastUpdate, value: 0 }],
          },
        ],
      },
    ];

    const research: ResearchMetrics = {
      frictionlessEdge: metric(
        "Signals 24h",
        signals24h,
        formatInteger(signals24h),
      ),
      predictionCount: metric(
        "Closed trades 24h",
        trades,
        formatInteger(trades),
      ),
      hitRate: metric("Win rate (net)", winRate, pctDisplay(winRate)),
      meanRealizedMovement: metric(
        "Avg hold",
        avgHold,
        `${Math.round(avgHold)} s`,
        "s",
      ),
      modelConfidence: metric(
        "Timeout exits",
        timeoutRatio,
        pctDisplay(timeoutRatio),
      ),
    };

    const execution: ExecutionMetrics = {
      netPnl: metric("Net PnL", netPnl, formatSignedMetric(netPnl, "USDT"), "USDT"),
      grossPnl: metric(
        "Gross PnL",
        grossPnl,
        formatSignedMetric(grossPnl, "USDT"),
        "USDT",
      ),
      fees: metric("Fees", fees, `${fees.toFixed(4)} USDT`, "USDT"),
      fills: metric("Fills 24h", fills24h, formatInteger(fills24h)),
      makerRatio: metric("Maker entry ratio", makerRatio, pctDisplay(makerRatio)),
      slippage: metric(
        "Avg slippage",
        avgSlippage,
        avgSlippage.toFixed(4),
      ),
      adverseSelection: metric(
        "Open positions",
        openPositions,
        String(openPositions),
      ),
    };

    const tradesOut: LiveRecentTrade[] = recentTrades.map((t) => ({
      id: t.trade_id,
      strategy: t.strategy_name,
      instrument: t.inst_id,
      side: t.side,
      netPnl: num(t.net_pnl),
      exitReason: t.exit_reason,
      exitAt: t.exit_ts.toISOString(),
      holdingSeconds: t.holding_seconds ? num(t.holding_seconds) : null,
    }));

    const ordersOut: LiveRecentOrder[] = recentOrders.map((o) => ({
      id: o.order_id_local,
      strategy: o.strategy_name,
      instrument: o.inst_id,
      side: o.side,
      status: o.status,
      orderType: o.ord_type,
      price: o.price ? num(o.price) : null,
      size: o.size ? num(o.size) : null,
      createdAt: o.ts_created.toISOString(),
    }));

    return {
      source: "database",
      dashboard: {
        status,
        statusCards,
        models,
        charts,
        research,
        execution,
        recentTrades: tradesOut,
        recentOrders: ordersOut,
        dataSource: "database",
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    return {
      dashboard: {
        ...liveHftDashboard,
        dataSource: "mock",
      },
      source: "mock",
      error: message,
    };
  }
}

export async function buildLiveResearchSnapshot(): Promise<LiveResearchSnapshot> {
  const { dashboard, source } = await buildLiveHftDashboard();

  if (source !== "database") {
    const { hftLiveSnapshot } = await import("@/lib/mock/hft-live");
    return hftLiveSnapshot;
  }

  const pnlCard = dashboard.statusCards.find((c) => c.title === "Net PnL 24h");
  const signalsCard = dashboard.statusCards.find((c) => c.title === "Signals 24h");

  return {
    symbol: dashboard.status.instrument,
    streamStatus: dashboard.status.isLive ? "ready" : "degraded",
    streamLabel: dashboard.status.isLive ? "Demo executor live" : "Executor idle",
    modelsRunning: dashboard.status.isLive ? 1 : 0,
    primaryHorizon: "baseline control",
    bestRollingEdge: {
      name: "Net PnL 24h",
      value: pnlCard?.primary.value ?? 0,
      unit: "USDT",
      updatedAt: dashboard.status.lastUpdate,
    },
    predictionsToday: {
      name: "Signals 24h",
      value: signalsCard?.primary.value ?? 0,
      updatedAt: dashboard.status.lastUpdate,
    },
    updatedAt: dashboard.status.lastUpdate,
    edgeSeries:
      dashboard.charts[0]?.series[0]?.points.map((p) => p.value) ?? [0],
  };
}
