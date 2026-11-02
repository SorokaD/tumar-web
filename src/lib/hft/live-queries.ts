import { hftQuery } from "@/lib/db/hft";

export type RunRow = {
  run_id: string;
  run_uuid: string;
  started_at: Date;
  finished_at: Date | null;
  runtime_mode: string | null;
  environment_name: string | null;
  strategy_name: string | null;
  inst_id: string | null;
  status: string | null;
  host_name: string | null;
};

export type TradeAggRow = {
  trades: string;
  wins: string;
  net_pnl: string;
  gross_pnl: string;
  fees_total: string;
  maker_entries: string;
  avg_hold_sec: string | null;
  tp_exits: string;
  sl_exits: string;
  timeout_exits: string;
  avg_slippage: string | null;
};

export type TradePointRow = {
  exit_ts: Date;
  net_pnl: string;
  cumulative_net: string;
};

export type RecentTradeRow = {
  trade_id: string;
  strategy_name: string;
  inst_id: string;
  side: string;
  net_pnl: string;
  exit_reason: string | null;
  exit_ts: Date;
  holding_seconds: string | null;
};

export type RecentOrderRow = {
  order_id_local: string;
  strategy_name: string | null;
  inst_id: string;
  side: string;
  status: string;
  ord_type: string | null;
  price: string | null;
  size: string | null;
  ts_created: Date;
};

export type SignalRow = {
  signal_id: string;
  side: string;
  ts_decision: Date;
  strategy_name: string;
  inst_id: string;
};

export type OpenPositionRow = {
  open_count: string;
};

const STRATEGY = () =>
  process.env.HFT_PUBLIC_STRATEGY?.trim() || "random_baseline_v1";

const INST = () =>
  process.env.HFT_PUBLIC_INST_ID?.trim() || "BTC-USDT-SWAP";

export function publicStrategyName(): string {
  return STRATEGY();
}

export function publicInstrument(): string {
  return INST();
}

export async function fetchLatestRun(): Promise<RunRow | null> {
  const rows = await hftQuery<RunRow>(
    `SELECT run_id::text, run_uuid::text, started_at, finished_at,
            runtime_mode, environment_name, strategy_name, inst_id, status, host_name
     FROM okx_exec.executor_runs
     WHERE ($1::text IS NULL OR strategy_name = $1)
     ORDER BY
       CASE WHEN status = 'running' THEN 0 ELSE 1 END,
       started_at DESC
     LIMIT 1`,
    [STRATEGY()],
  );
  return rows[0] ?? null;
}

export async function fetchOpenPositionCount(): Promise<number> {
  const rows = await hftQuery<OpenPositionRow>(
    `SELECT count(*)::text AS open_count
     FROM okx_exec.positions
     WHERE status = 'open'
       AND ($1::text IS NULL OR strategy_name = $1)
       AND ($2::text IS NULL OR inst_id = $2)`,
    [STRATEGY(), INST()],
  );
  return Number(rows[0]?.open_count ?? 0);
}

export async function fetchTradeAgg24h(): Promise<TradeAggRow | null> {
  const rows = await hftQuery<TradeAggRow>(
    `SELECT
       count(*)::text AS trades,
       count(*) FILTER (WHERE win_flag)::text AS wins,
       coalesce(sum(net_pnl), 0)::text AS net_pnl,
       coalesce(sum(gross_pnl), 0)::text AS gross_pnl,
       coalesce(sum(fees_total), 0)::text AS fees_total,
       count(*) FILTER (WHERE entry_liquidity = 'maker')::text AS maker_entries,
       avg(holding_seconds)::text AS avg_hold_sec,
       count(*) FILTER (WHERE exit_reason = 'tp')::text AS tp_exits,
       count(*) FILTER (WHERE exit_reason = 'sl')::text AS sl_exits,
       count(*) FILTER (WHERE exit_reason = 'timeout')::text AS timeout_exits,
       avg(slippage_total)::text AS avg_slippage
     FROM okx_exec.trade_results
     WHERE exit_ts >= now() - interval '24 hours'
       AND ($1::text IS NULL OR strategy_name = $1)
       AND ($2::text IS NULL OR inst_id = $2)`,
    [STRATEGY(), INST()],
  );
  return rows[0] ?? null;
}

export async function fetchSignals24hCount(): Promise<number> {
  const rows = await hftQuery<{ n: string }>(
    `SELECT count(*)::text AS n
     FROM okx_exec.strategy_signals
     WHERE ts_decision >= now() - interval '24 hours'
       AND ($1::text IS NULL OR strategy_name = $1)
       AND ($2::text IS NULL OR inst_id = $2)`,
    [STRATEGY(), INST()],
  );
  return Number(rows[0]?.n ?? 0);
}

export async function fetchFills24hCount(): Promise<number> {
  const rows = await hftQuery<{ n: string }>(
    `SELECT count(*)::text AS n
     FROM okx_exec.order_fills
     WHERE ts_fill >= now() - interval '24 hours'
       AND ($1::text IS NULL OR strategy_name = $1)
       AND ($2::text IS NULL OR inst_id = $2)`,
    [STRATEGY(), INST()],
  );
  return Number(rows[0]?.n ?? 0);
}

export async function fetchCumulativePnlSeries(
  limit = 48,
): Promise<TradePointRow[]> {
  return hftQuery<TradePointRow>(
    `WITH ordered AS (
       SELECT exit_ts, net_pnl::float8 AS net_pnl
       FROM okx_exec.trade_results
       WHERE exit_ts >= now() - interval '7 days'
         AND ($1::text IS NULL OR strategy_name = $1)
         AND ($2::text IS NULL OR inst_id = $2)
       ORDER BY exit_ts
     ),
     cum AS (
       SELECT exit_ts,
              net_pnl::text,
              sum(net_pnl) OVER (ORDER BY exit_ts)::text AS cumulative_net
       FROM ordered
     )
     SELECT exit_ts, net_pnl, cumulative_net
     FROM cum
     ORDER BY exit_ts DESC
     LIMIT $3`,
    [STRATEGY(), INST(), limit],
  ).then((rows) => rows.reverse());
}

export async function fetchRecentTrades(limit = 12): Promise<RecentTradeRow[]> {
  return hftQuery<RecentTradeRow>(
    `SELECT trade_id, strategy_name, inst_id, side, net_pnl::text,
            exit_reason, exit_ts, holding_seconds::text
     FROM okx_exec.trade_results
     WHERE ($1::text IS NULL OR strategy_name = $1)
       AND ($2::text IS NULL OR inst_id = $2)
     ORDER BY exit_ts DESC
     LIMIT $3`,
    [STRATEGY(), INST(), limit],
  );
}

export async function fetchRecentOrders(limit = 12): Promise<RecentOrderRow[]> {
  return hftQuery<RecentOrderRow>(
    `SELECT order_id_local, strategy_name, inst_id, side, status, ord_type,
            price::text, size::text, ts_created
     FROM okx_exec.orders
     WHERE ($1::text IS NULL OR strategy_name = $1)
       AND ($2::text IS NULL OR inst_id = $2)
     ORDER BY ts_created DESC
     LIMIT $3`,
    [STRATEGY(), INST(), limit],
  );
}

export async function fetchLatestSignal(): Promise<SignalRow | null> {
  const rows = await hftQuery<SignalRow>(
    `SELECT signal_id, side, ts_decision, strategy_name, inst_id
     FROM okx_exec.strategy_signals
     WHERE decision_type = 'entry'
       AND ($1::text IS NULL OR strategy_name = $1)
       AND ($2::text IS NULL OR inst_id = $2)
     ORDER BY ts_decision DESC
     LIMIT 1`,
    [STRATEGY(), INST()],
  );
  return rows[0] ?? null;
}
