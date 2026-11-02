import { Pool, type QueryResultRow } from "pg";

let pool: Pool | null = null;

export function isHftDbConfigured(): boolean {
  return Boolean(process.env.HFT_DATABASE_URL?.trim());
}

export function getHftPool(): Pool | null {
  const connectionString = process.env.HFT_DATABASE_URL?.trim();
  if (!connectionString) {
    return null;
  }

  if (!pool) {
    pool = new Pool({
      connectionString,
      // Public dashboard only needs a tiny pool.
      max: 3,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
      ssl: process.env.HFT_DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
    });
  }

  return pool;
}

export async function hftQuery<T extends QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const db = getHftPool();
  if (!db) {
    throw new Error("HFT_DATABASE_URL is not configured");
  }

  const result = await db.query<T>(text, params);
  return result.rows;
}
