import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const sql = neon(process.env.DATABASE_URL);

const ALLOWED_GAMES = new Set([
  "quiz",
  "scenario",
  "data-challenge",
  "route-runner",
]);

function normalizePlayerName(name: string) {
  return name.trim().replace(/\s+/g, " ");
}

function makePlayerKey(name: string) {
  return normalizePlayerName(name).toLowerCase();
}

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const scope = req.query?.scope;

      if (scope === "lifetime") {
        const rows = await sql`
          SELECT id, player_name, player_name_key, game, total_score, plays, best_score, updated_at
          FROM leaderboard_lifetime
          ORDER BY total_score DESC, updated_at ASC
        `;

        const formatted = rows.map((row) => ({
          id: String(row.id),
          name: row.player_name,
          nameKey: row.player_name_key,
          game: row.game,
          totalScore: row.total_score,
          plays: row.plays,
          bestScore: row.best_score,
          date: new Date(row.updated_at).toISOString().slice(0, 10),
        }));

        return res.status(200).json(formatted);
      }

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
      const trimmedName = typeof name === "string" ? normalizePlayerName(name) : "";

      if (!trimmedName || typeof score !== "number" || !ALLOWED_GAMES.has(game)) {
        return res.status(400).json({ error: "Invalid payload" });
      }

      const playerKey = makePlayerKey(trimmedName);

      const insertedRows = await sql`
        INSERT INTO leaderboard (player_name, score, game)
        VALUES (${trimmedName}, ${score}, ${game})
        RETURNING id, player_name, score, game, created_at
      `;

      await sql`
        INSERT INTO leaderboard_lifetime (
          player_name,
          player_name_key,
          game,
          total_score,
          plays,
          best_score
        )
        VALUES (
          ${trimmedName},
          ${playerKey},
          ${game},
          ${score},
          1,
          ${score}
        )
        ON CONFLICT (player_name_key, game)
        DO UPDATE SET
          player_name = EXCLUDED.player_name,
          total_score = leaderboard_lifetime.total_score + EXCLUDED.total_score,
          plays = leaderboard_lifetime.plays + 1,
          best_score = GREATEST(leaderboard_lifetime.best_score, EXCLUDED.best_score),
          updated_at = NOW()
      `;

      const row = insertedRows[0];

      return res.status(201).json({
        id: String(row.id),
        name: row.player_name,
        score: row.score,
        game: row.game,
        date: new Date(row.created_at).toISOString().slice(0, 10),
      });
    }

    if (req.method === "DELETE") {
      const { passcode } = req.body || {};
      const expectedToken = process.env.LEADERBOARD_ADMIN_TOKEN;

      if (!expectedToken || passcode !== expectedToken) {
        return res.status(403).json({ error: "Invalid passcode" });
      }

      await sql`DELETE FROM leaderboard`;
      return res.status(200).json({
        success: true,
        message: "Current leaderboard reset. Lifetime totals preserved.",
      });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Leaderboard API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
