import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const ALLOWED_GAMES = new Set([
  "quiz",
  "scenario",
  "data-challenge",
  "route-runner",
]);

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const rows = await sql`
        SELECT id, player_name, score, game, created_at
        FROM leaderboard
        ORDER BY score DESC, created_at ASC
        LIMIT 50
      `;

      const formatted = rows.map((row) => ({
        id: String(row.id),
        name: row.player_name,
        score: row.score,
        game: row.game,
        date: new Date(row.created_at).toISOString().slice(0, 10),
      }));

      return res.status(200).json(formatted);
    }

    if (req.method === "POST") {
      const { name, score, game } = req.body || {};

      const trimmedName = typeof name === "string" ? name.trim() : "";

      if (!trimmedName || typeof score !== "number" || !ALLOWED_GAMES.has(game)) {
        return res.status(400).json({ error: "Invalid payload" });
      }

      const rows = await sql`
        INSERT INTO leaderboard (player_name, score, game)
        VALUES (${trimmedName}, ${score}, ${game})
        RETURNING id, player_name, score, game, created_at
      `;

      const row = rows[0];

      return res.status(201).json({
        id: String(row.id),
        name: row.player_name,
        score: row.score,
        game: row.game,
        date: new Date(row.created_at).toISOString().slice(0, 10),
      });
    }

    if (req.method === "DELETE") {
      await sql`DELETE FROM leaderboard`;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Leaderboard API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
