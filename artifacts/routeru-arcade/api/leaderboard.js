import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const rows = await sql`
        SELECT id, player_name, score, created_at
        FROM leaderboard
        ORDER BY score DESC, created_at ASC
        LIMIT 50
      `;
      return res.status(200).json(rows);
    }

    if (req.method === "POST") {
      const { player_name, score } = req.body || {};

      if (!player_name || typeof score !== "number") {
        return res.status(400).json({ error: "Invalid payload" });
      }

      const rows = await sql`
        INSERT INTO leaderboard (player_name, score)
        VALUES (${player_name}, ${score})
        RETURNING id, player_name, score, created_at
      `;

      return res.status(201).json(rows[0]);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Leaderboard API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
