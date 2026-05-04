import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({
        success: false,
        error: "Method not allowed",
      });
    }

    await sql`DELETE FROM leaderboard`;

    return res.status(200).json({
      success: true,
      message: "Weekly leaderboard reset successfully. Lifetime totals preserved.",
    });
  } catch (error) {
    console.error("Cron reset failed:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to reset leaderboard",
      details: error && error.message ? error.message : String(error),
    });
  }
}
