import {
  buildLiveHftDashboard,
  buildLiveResearchSnapshot,
} from "@/lib/hft/build-live-dashboard";
import { hftSubsystemStatuses } from "@/lib/mock/hft-live";
import type {
  LiveHftDashboard,
  LiveResearchSnapshot,
  ProjectSubsystemStatus,
} from "@/types";

export async function getLiveResearchSnapshot(): Promise<LiveResearchSnapshot> {
  return buildLiveResearchSnapshot();
}

export function getHftSubsystemStatuses(): readonly ProjectSubsystemStatus[] {
  return hftSubsystemStatuses;
}

export async function getLiveHftDashboard(): Promise<LiveHftDashboard> {
  const { dashboard } = await buildLiveHftDashboard();
  return dashboard;
}

export async function getLiveHftDashboardDetailed() {
  return buildLiveHftDashboard();
}
