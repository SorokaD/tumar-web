export const apiEndpoints = {
  health: "/health",
  models: "/models",
  model: (id: string) => `/models/${id}`,
  signals: "/signals",
  hftLive: "/hft/live",
  hftSubsystems: "/hft/subsystems",
  publicHftStatus: "/api/public/hft/status",
  publicHftModels: "/api/public/hft/models",
  publicHftMetrics: "/api/public/hft/metrics",
  publicHftExecution: "/api/public/hft/execution",
  publicHftLive: "/api/public/hft/live",
} as const;
