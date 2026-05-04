import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req: any, res: any) {
  try {
    // 🔥 Weekly reset (clears current leaderboard ONLY)
    await sql`DELETE FROM leaderboard`;

    return res.status(200).json({
      success: true,
      message: "Leaderboard reset successfully",
    });
  } catch (error: any) {
    console.error("Cron reset failed:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to reset leaderboard",
      details: error?.message || String(error),
    });
  }
}
