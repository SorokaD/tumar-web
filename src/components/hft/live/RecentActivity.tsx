import { formatClock, formatSignedMetric } from "@/lib/format";
import type { LiveRecentOrder, LiveRecentTrade } from "@/types";

type RecentActivityProps = {
  trades: readonly LiveRecentTrade[];
  orders: readonly LiveRecentOrder[];
};

export function RecentActivity({ trades, orders }: RecentActivityProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="border border-border bg-surface">
        <header className="border-b border-border px-4 py-3">
          <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-foreground">
            Recent trades
          </h2>
          <p className="mt-1 text-xs text-muted">
            Closed positions from the demo executor journal.
          </p>
        </header>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-[0.12em] text-muted">
              <tr>
                <th className="px-4 py-2 font-medium">Time</th>
                <th className="px-4 py-2 font-medium">Side</th>
                <th className="px-4 py-2 font-medium">Net PnL</th>
                <th className="px-4 py-2 font-medium">Exit</th>
              </tr>
            </thead>
            <tbody>
              {trades.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-4 text-muted">
                    No closed trades yet.
                  </td>
                </tr>
              ) : (
                trades.map((trade) => (
                  <tr
                    key={trade.id}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="px-4 py-2 font-mono text-foreground">
                      {formatClock(trade.exitAt)}
                    </td>
                    <td className="px-4 py-2 font-mono uppercase text-foreground">
                      {trade.side}
                    </td>
                    <td
                      className={`px-4 py-2 font-mono ${
                        trade.netPnl > 0 ? "text-accent" : "text-foreground"
                      }`}
                    >
                      {formatSignedMetric(trade.netPnl, "USDT")}
                    </td>
                    <td className="px-4 py-2 font-mono text-foreground">
                      {trade.exitReason ?? "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="border border-border bg-surface">
        <header className="border-b border-border px-4 py-3">
          <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-foreground">
            Recent orders
          </h2>
          <p className="mt-1 text-xs text-muted">
            Latest order lifecycle events written by the executor.
          </p>
        </header>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-[0.12em] text-muted">
              <tr>
                <th className="px-4 py-2 font-medium">Time</th>
                <th className="px-4 py-2 font-medium">Side</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Price</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-4 text-muted">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={`${order.id}-${order.createdAt}`}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="px-4 py-2 font-mono text-foreground">
                      {formatClock(order.createdAt)}
                    </td>
                    <td className="px-4 py-2 font-mono uppercase text-foreground">
                      {order.side}
                    </td>
                    <td className="px-4 py-2 font-mono text-foreground">
                      {order.status}
                    </td>
                    <td className="px-4 py-2 font-mono text-foreground">
                      {order.price != null ? order.price.toFixed(1) : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
