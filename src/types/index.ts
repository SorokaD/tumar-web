export type ProjectStatus = "planned" | "active" | "paused" | "archived";

export type ModelStatus = "idle" | "training" | "ready" | "degraded" | "offline";

export interface ModelMetric {
  name: string;
  value: number;
  unit?: string;
  updatedAt: string;
}

export interface TradingSignal {
  id: string;
  symbol: string;
  side: "buy" | "sell" | "flat";
  confidence: number;
  createdAt: string;
  modelId: string;
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  status: ProjectStatus;
  href: string;
}

export interface LiveResearchSnapshot {
  symbol: string;
  streamStatus: ModelStatus;
  streamLabel: string;
  modelsRunning: number;
  primaryHorizon: string;
  bestRollingEdge: ModelMetric;
  predictionsToday: ModelMetric;
  updatedAt: string;
  edgeSeries: readonly number[];
}

export interface ProjectSubsystemStatus {
  label: string;
  status: ProjectStatus;
  display: string;
}

export interface LiveMetric {
  label: string;
  value: number;
  unit?: string;
  display: string;
}

export interface TimeSeriesPoint {
  timestamp: string;
  value: number;
}

export interface LiveChartSeries {
  id: string;
  label?: string;
  points: readonly TimeSeriesPoint[];
}

export interface LiveChartSpec {
  id: string;
  title: string;
  updatedAt: string;
  series: readonly LiveChartSeries[];
}

export interface LiveSystemStatus {
  instrument: string;
  environment: string;
  isLive: boolean;
  lastUpdate: string;
  dataLatencyMs: number;
}

export interface LiveStatusCard {
  title: string;
  primary: LiveMetric;
  secondary?: LiveMetric;
  accent?: boolean;
}

export interface LiveModelRow {
  id: string;
  name: string;
  horizon: string | null;
  signal: TradingSignal | null;
  rollingEdge: ModelMetric | null;
  status: ModelStatus;
}

export interface ResearchMetrics {
  frictionlessEdge: LiveMetric;
  predictionCount: LiveMetric;
  hitRate: LiveMetric;
  meanRealizedMovement: LiveMetric;
  modelConfidence: LiveMetric;
}

export interface ExecutionMetrics {
  netPnl: LiveMetric;
  grossPnl: LiveMetric;
  fees: LiveMetric;
  fills: LiveMetric;
  makerRatio: LiveMetric;
  slippage: LiveMetric;
  adverseSelection: LiveMetric;
}

export interface LiveRecentTrade {
  id: string;
  strategy: string;
  instrument: string;
  side: string;
  netPnl: number;
  exitReason: string | null;
  exitAt: string;
  holdingSeconds: number | null;
}

export interface LiveRecentOrder {
  id: string;
  strategy: string | null;
  instrument: string;
  side: string;
  status: string;
  orderType: string | null;
  price: number | null;
  size: number | null;
  createdAt: string;
}

export interface LiveHftDashboard {
  status: LiveSystemStatus;
  statusCards: readonly LiveStatusCard[];
  models: readonly LiveModelRow[];
  charts: readonly LiveChartSpec[];
  research: ResearchMetrics;
  execution: ExecutionMetrics;
  recentTrades?: readonly LiveRecentTrade[];
  recentOrders?: readonly LiveRecentOrder[];
  /** database = live Timescale feed; mock = local fallback */
  dataSource?: "database" | "mock";
}
