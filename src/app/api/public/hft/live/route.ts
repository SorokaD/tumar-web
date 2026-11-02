import { NextResponse } from "next/server";
import { getLiveHftDashboardDetailed } from "@/lib/api/hft";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const result = await getLiveHftDashboardDetailed();

  return NextResponse.json(
    {
      source: result.source,
      error: result.error ?? null,
      dashboard: result.dashboard,
      generatedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=15, stale-while-revalidate=30",
      },
    },
  );
}
